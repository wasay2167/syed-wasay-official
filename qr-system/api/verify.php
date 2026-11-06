<?php
require __DIR__ . '/../lib.php';
json_guard('scanner', 'admin');
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !csrf_ok()) {
    http_response_code(403); echo json_encode(['ok' => false, 'message' => 'Bad request']); exit;
}
$in  = json_decode(file_get_contents('php://input'), true);
$tok = is_array($in) ? ($in['token'] ?? '') : '';
$pdo = db();

function log_scan($number, $result) {
    db()->prepare('INSERT INTO scans(number,result,ip,ua) VALUES(?,?,?,?)')
        ->execute([$number, $result, $_SERVER['REMOTE_ADDR'] ?? '', substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200)]);
}
function fail($msg, $number = '') { log_scan($number, $msg); echo json_encode(['ok' => false, 'message' => $msg]); exit; }

$p = read_token($tok);
if (!$p) fail('Invalid QR');
$age = time() - (int)$p['t'];
if ($age < -5 || $age > cfg()['token_ttl'] + 3) fail('QR expired, ask for a fresh one', $p['n']);

$q = $pdo->prepare('SELECT * FROM codes WHERE number = ?'); $q->execute([$p['n']]);
$code = $q->fetch(PDO::FETCH_ASSOC);
if (!$code) fail('Code no longer exists', $p['n']);
if ($code['single_use'] && $code['redeemed_at']) fail('Already redeemed', $p['n']);

// Each token works exactly once (blocks replaying a photo/screenshot of the same frame).
$pdo->beginTransaction();
try {
    $pdo->prepare('INSERT INTO used_tokens(nonce, used_at) VALUES(?,?)')->execute([$p['r'], time()]);
} catch (PDOException $e) { $pdo->rollBack(); fail('QR already used', $p['n']); }
if ($code['single_use']) $pdo->prepare("UPDATE codes SET redeemed_at = datetime('now') WHERE number = ?")->execute([$code['number']]);
$pdo->exec('DELETE FROM used_tokens WHERE used_at < ' . (time() - 600)); // housekeeping
$pdo->commit();

log_scan($code['number'], 'OK');
echo json_encode(['ok' => true, 'number' => $code['number'], 'label' => $code['label'], 'message' => 'Verified']);

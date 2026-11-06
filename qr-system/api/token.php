<?php
require __DIR__ . '/../lib.php';
json_guard('admin');
$number = $_GET['number'] ?? '';
$q = db()->prepare('SELECT single_use, redeemed_at FROM codes WHERE number = ?'); $q->execute([$number]);
$c = $q->fetch(PDO::FETCH_ASSOC);
if (!$c) { http_response_code(404); echo json_encode(['ok' => false, 'message' => 'Unknown code']); exit; }
if ($c['single_use'] && $c['redeemed_at']) { echo json_encode(['ok' => false, 'message' => 'Already redeemed']); exit; }
echo json_encode(['ok' => true, 'token' => make_token($number), 'ttl' => cfg()['token_ttl']]);

<?php
require __DIR__ . '/db.php';

session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Strict',
    'secure'   => !empty($_SERVER['HTTPS']),
]);
session_start();
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));

function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function is_role(...$roles) { return in_array($_SESSION['role'] ?? null, $roles, true); }

function b64u($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }
function b64d($s) { return base64_decode(strtr($s, '-_', '+/')); }

// Signed, short-lived, random-nonce token. Not a URL, so phone cameras show meaningless text.
function make_token($number) {
    $payload = b64u(json_encode(['n' => $number, 't' => time(), 'r' => bin2hex(random_bytes(8))]));
    $sig = b64u(hash_hmac('sha256', $payload, cfg()['secret'], true));
    return 'QRS1.' . $payload . '.' . $sig;
}

function read_token($tok) {
    $parts = explode('.', (string)$tok);
    if (count($parts) !== 3 || $parts[0] !== 'QRS1') return null;
    $expected = b64u(hash_hmac('sha256', $parts[1], cfg()['secret'], true));
    if (!hash_equals($expected, $parts[2])) return null;
    $p = json_decode(b64d($parts[1]), true);
    return is_array($p) ? $p : null;
}

function json_guard(...$roles) {
    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    if (!is_role(...$roles)) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'message' => 'Not authorised']);
        exit;
    }
}

function csrf_ok() {
    $t = $_SERVER['HTTP_X_CSRF'] ?? ($_POST['csrf'] ?? '');
    return hash_equals($_SESSION['csrf'], (string)$t);
}

// Handles a login POST. Returns an error string or null.
function handle_login($role, $secret) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['login'])) return null;
    if (!csrf_ok()) return 'Session expired, reload the page.';
    $_SESSION['fails'] = $_SESSION['fails'] ?? 0;
    if ($_SESSION['fails'] >= 5) sleep(3);
    if (hash_equals((string)$secret, (string)($_POST['secret'] ?? ''))) {
        session_regenerate_id(true);
        $_SESSION['role'] = $role;
        $_SESSION['fails'] = 0;
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }
    $_SESSION['fails']++;
    return 'Wrong credentials.';
}

function new_number() {
    $q = db()->prepare('SELECT 1 FROM codes WHERE number = ?');
    do {
        $n = (string)random_int(1000000000, 9999999999);
        $q->execute([$n]);
    } while ($q->fetch());
    return $n;
}

function login_page($title, $label, $err) { ?>
<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= h($title) ?></title><link rel="stylesheet" href="assets/style.css"></head>
<body><main class="card narrow">
<h1><?= h($title) ?></h1>
<?php if ($err): ?><p class="err"><?= h($err) ?></p><?php endif; ?>
<form method="post">
  <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
  <label><?= h($label) ?></label>
  <input type="password" name="secret" autocomplete="current-password" required autofocus>
  <button name="login" value="1">Sign in</button>
</form></main></body></html>
<?php }

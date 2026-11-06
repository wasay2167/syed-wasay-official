<?php
require __DIR__ . '/lib.php';
$err = handle_login('admin', cfg()['admin_password']);
if (!is_role('admin')) { login_page('QR Admin', 'Admin password', $err); exit; }

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_ok()) {
    if (isset($_POST['create'])) {
        $n = new_number();
        db()->prepare('INSERT INTO codes(number,label,single_use) VALUES(?,?,?)')
            ->execute([$n, trim($_POST['label'] ?? ''), isset($_POST['single_use']) ? 1 : 0]);
        $msg = "Created code $n";
    } elseif (isset($_POST['delete'])) {
        db()->prepare('DELETE FROM codes WHERE number = ?')->execute([$_POST['delete']]);
    } elseif (isset($_POST['logout'])) {
        session_destroy(); header('Location: index.php'); exit;
    }
}
$codes = db()->query('SELECT * FROM codes ORDER BY id DESC')->fetchAll(PDO::FETCH_ASSOC);
$scans = db()->query('SELECT * FROM scans ORDER BY id DESC LIMIT 15')->fetchAll(PDO::FETCH_ASSOC);
?>
<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>QR Admin</title><link rel="stylesheet" href="assets/style.css"></head>
<body><main class="card">
<div class="row"><h1 style="flex:1">QR Admin</h1>
<a class="btn" href="scanner.php">Open scanner</a>
<form method="post"><input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>"><button name="logout" value="1" class="danger">Log out</button></form></div>
<?php if ($msg): ?><p class="ok"><?= h($msg) ?></p><?php endif; ?>
<form method="post">
  <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
  <label>Label (optional)</label><input type="text" name="label" maxlength="80">
  <label><input type="checkbox" name="single_use"> Single-use (can be redeemed only once)</label>
  <button name="create" value="1">Generate new unique code</button>
</form>
<table><tr><th>Number</th><th>Label</th><th>Mode</th><th>Status</th><th></th></tr>
<?php foreach ($codes as $c): ?>
<tr><td><?= h($c['number']) ?></td><td><?= h($c['label']) ?></td>
<td><?= $c['single_use'] ? 'Single-use' : 'Multi' ?></td>
<td><?= $c['redeemed_at'] ? 'Redeemed ' . h($c['redeemed_at']) : 'Active' ?></td>
<td class="row"><a class="btn" style="margin:0" href="display.php?number=<?= h($c['number']) ?>">Show QR</a>
<form method="post" onsubmit="return confirm('Delete?')"><input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>"><button class="danger" style="margin:0" name="delete" value="<?= h($c['number']) ?>">Del</button></form></td></tr>
<?php endforeach; ?></table>
<h1 style="margin-top:26px">Recent scans</h1>
<table><tr><th>Time (UTC)</th><th>Number</th><th>Result</th></tr>
<?php foreach ($scans as $s): ?><tr><td><?= h($s['at']) ?></td><td><?= h($s['number']) ?></td><td><?= h($s['result']) ?></td></tr><?php endforeach; ?></table>
</main></body></html>

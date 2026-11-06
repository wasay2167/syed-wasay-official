<?php
require __DIR__ . '/lib.php';
if (!is_role('admin')) { header('Location: index.php'); exit; }
$number = $_GET['number'] ?? '';
$q = db()->prepare('SELECT * FROM codes WHERE number = ?'); $q->execute([$number]);
$code = $q->fetch(PDO::FETCH_ASSOC);
if (!$code) { http_response_code(404); exit('Code not found'); }
header('Cache-Control: no-store');
?>
<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>QR <?= h($number) ?></title><link rel="stylesheet" href="assets/style.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
</head>
<body oncontextmenu="return false"><main class="card center narrow" style="max-width:420px">
<h1>Code <?= h($number) ?></h1>
<?php if ($code['label']): ?><p><?= h($code['label']) ?></p><?php endif; ?>
<div class="qrwrap"><canvas id="qr" width="320" height="320"></canvas></div>
<div class="bar"><i id="bar"></i></div>
<p id="status" style="color:#9aa6bd;font-size:.85rem">Rotates every <?= (int)cfg()['token_ttl'] ?>s. Only the in-app scanner can read it.</p>
<a class="btn" href="index.php">Back</a>
</main>
<script>
const NUMBER = <?= json_encode($number) ?>, CSRF = <?= json_encode($_SESSION['csrf']) ?>;
const TTL = <?= (int)cfg()['token_ttl'] ?>, REFRESH = Math.max(5, TTL - 5) * 1000;
const cv = document.getElementById('qr'), ctx = cv.getContext('2d'), bar = document.getElementById('bar');
let started = Date.now(), hidden = false;

function draw(text) {
  const qr = qrcode(0, 'M'); qr.addData(text); qr.make();
  const n = qr.getModuleCount(), cell = Math.floor(cv.width / n);
  const off = Math.floor((cv.width - cell * n) / 2);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#000';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
    if (qr.isDark(r, c)) ctx.fillRect(off + c * cell, off + r * cell, cell, cell);
}
async function refresh() {
  if (hidden) return;
  try {
    const r = await fetch('api/token.php?number=' + encodeURIComponent(NUMBER), {headers: {'X-CSRF': CSRF}, cache: 'no-store'});
    const d = await r.json();
    if (!d.ok) throw new Error(d.message);
    draw(d.token); started = Date.now();
  } catch (e) { document.getElementById('status').textContent = 'Error: ' + e.message; }
}
setInterval(refresh, REFRESH);
setInterval(() => { bar.style.width = Math.max(0, 100 - (Date.now() - started) / REFRESH * 100) + '%'; }, 200);
// Blank the QR when the tab is hidden (deters screen-record/switcher tricks; a deterrent only).
document.addEventListener('visibilitychange', () => {
  hidden = document.hidden;
  if (hidden) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); } else refresh();
});
refresh();
</script></body></html>

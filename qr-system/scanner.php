<?php
require __DIR__ . '/lib.php';
$err = handle_login('scanner', cfg()['scanner_pin']);
if (!is_role('scanner', 'admin')) { login_page('Scanner sign-in', 'Scanner PIN', $err); exit; }
header('Cache-Control: no-store');
?>
<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Scanner</title><link rel="stylesheet" href="assets/style.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js"></script>
</head><body><main class="card narrow" style="max-width:480px;margin-top:2vh">
<h1>Scan QR</h1>
<div class="scanbox"><video id="v" playsinline muted></video><div class="frame"></div></div>
<canvas id="c" hidden></canvas>
<div id="out" class="result" hidden></div>
<p id="hint" style="color:#9aa6bd;font-size:.85rem">Point the camera at a live QR shown on the admin screen.</p>
</main>
<script>
const CSRF = <?= json_encode($_SESSION['csrf']) ?>;
const v = document.getElementById('v'), c = document.getElementById('c'), ctx = c.getContext('2d', {willReadFrequently: true});
const out = document.getElementById('out');
let busy = false;

async function start() {
  try {
    const s = await navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: 'environment'}}, audio: false});
    v.srcObject = s; await v.play(); requestAnimationFrame(tick);
  } catch (e) {
    document.getElementById('hint').textContent = 'Camera unavailable. Use HTTPS and allow camera access.';
  }
}
function tick() {
  if (!busy && v.readyState === v.HAVE_ENOUGH_DATA) {
    c.width = v.videoWidth; c.height = v.videoHeight;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const r = jsQR(img.data, img.width, img.height, {inversionAttempts: 'dontInvert'});
    if (r && r.data.startsWith('QRS1.')) verify(r.data);
  }
  requestAnimationFrame(tick);
}
async function verify(token) {
  busy = true;
  try {
    const res = await fetch('api/verify.php', {
      method: 'POST', cache: 'no-store',
      headers: {'Content-Type': 'application/json', 'X-CSRF': CSRF},
      body: JSON.stringify({token})
    });
    const d = await res.json();
    show(d.ok, d.ok ? `✔ Verified: ${d.number}${d.label ? ' (' + d.label + ')' : ''}` : '✖ ' + d.message);
    if (navigator.vibrate) navigator.vibrate(d.ok ? 80 : [60, 40, 60]);
  } catch (e) { show(false, '✖ Network error'); }
  setTimeout(() => { busy = false; }, 2500);
}
function show(ok, text) {
  out.hidden = false; out.className = 'result ' + (ok ? 'good' : 'bad'); out.textContent = text;
}
start();
</script></body></html>

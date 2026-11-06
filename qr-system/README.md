# QR System (PHP + SQLite + vanilla JS)

Generates QR codes bound to a unique number. The QR shows a **rotating, signed, single-use token**
(not a URL), and it only means something to the in-app scanner (`scanner.php`), which verifies it on the server.

## Setup
1. Upload to any PHP 8+ host with HTTPS (camera access requires HTTPS).
2. Copy `config.local.example.php` to `config.local.php` and set a long random `secret`, admin password and scanner PIN.
3. Make `data/` writable by PHP. Open `index.php` (admin) and `scanner.php` (phones).

## GitHub
GitHub Pages cannot run PHP. Use GitHub for the repo and deploy to your PHP host (cPanel Git deploy or a GitHub Action over FTP/SSH).
`config.local.php` and the SQLite file are git-ignored.

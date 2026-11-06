<?php
function cfg() {
    static $c;
    if (!$c) {
        $c = require __DIR__ . '/config.php';
        if (file_exists(__DIR__ . '/config.local.php')) {
            $c = array_merge($c, require __DIR__ . '/config.local.php');
        }
    }
    return $c;
}

function db() {
    static $pdo;
    if ($pdo) return $pdo;
    $path = cfg()['db'];
    @mkdir(dirname($path), 0775, true);
    $pdo = new PDO('sqlite:' . $path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS codes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number TEXT UNIQUE NOT NULL,
            label TEXT,
            single_use INTEGER DEFAULT 0,
            redeemed_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS used_tokens(nonce TEXT PRIMARY KEY, used_at INTEGER);
        CREATE TABLE IF NOT EXISTS scans(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number TEXT, result TEXT, ip TEXT, ua TEXT,
            at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    ");
    return $pdo;
}

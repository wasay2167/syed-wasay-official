<?php
// Defaults only. Put real secrets in config.local.php (git-ignored) so they never reach GitHub.
return [
    'secret'         => 'CHANGE_ME_TO_A_LONG_RANDOM_STRING',
    'admin_password' => 'change-admin-password',
    'scanner_pin'    => '123456',
    'token_ttl'      => 30,                      // seconds a QR token stays valid
    'db'             => __DIR__ . '/data/app.sqlite',
];

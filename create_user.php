<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

App\Models\User::firstOrCreate(
    ['email' => 'admin@eladoraprint.com'],
    ['name' => 'Administrador', 'password' => bcrypt('password')]
);
echo "Done";

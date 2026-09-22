<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

$manager = new ImageManager(new Driver());

$source = public_path('images/logo.png');

if (file_exists($source)) {
    $image = $manager->read($source);
    
    // Favicon.ico (typically 32x32 or 16x16, let's do 32x32)
    $image->scale(32, 32);
    // Note: Intervention v3 doesn't natively encode to .ico, we can just save it as PNG but named .ico, browsers support this usually.
    // Or we can save as PNG and just change the extension.
    $image->toPng()->save(public_path('favicon.ico'));

    // Re-read original for higher quality
    $image = $manager->read($source);
    $image->scale(180, 180);
    $image->toPng()->save(public_path('apple-touch-icon.png'));

    // Re-read for favicon.svg ? Intervention doesn't do SVG. We can just leave favicon.svg as is, or we'll replace the app.blade.php to just use PNGs.
    echo "Favicons generated successfully.\n";
} else {
    echo "Logo not found at $source\n";
}

<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$page = \App\Models\Page::firstOrNew(['slug' => 'home']);
$page->title = 'Inicio';
$page->seo_description = 'Imprenta Boutique y Diseño Gráfico Premium.';
$page->is_published = true;
$page->content = [
    'hero_title_1' => 'Diseño, papel y experiencias',
    'hero_title_2' => 'creadas',
    'hero_title_3' => 'para hacer especiales',
    'hero_title_4' => 'tus ideas.',
    'hero_subtitle_1' => 'Imprenta Boutique y Diseño Gráfico Premium.',
    'hero_subtitle_2' => 'Transformamos tus ideas en piezas tangibles y memorables que exigen destacar.',
    'about_title_1' => 'Universo',
    'about_title_2' => 'Eladora',
    'about_text' => 'Nos especializamos en brindar soluciones creativas y de alta calidad para cada proyecto. Desde el diseño hasta la impresión final. Creamos piezas tangibles y memorables que exigen destacar.',
    'founder_name_1' => 'Daniela',
    'founder_name_2' => 'Eloísa',
    'founder_role' => 'Diseñadora gráfica y mente creativa',
    'founder_text_1' => 'Hola! Soy la creadora y fundadora del universo Eladora, soy una apasionada por el diseño y la textura de lo tangible. En un mundo digital, el papel sigue teniendo el poder de crear conexiones genuinas.',
    'founder_text_2' => 'Mi enfoque es artesanal y detallista. Cada proyecto que pasa por mis manos es tratado como una obra única. Desde papelería fina hasta empaques que enamoran desde el primer vistazo.',
];
$page->save();

echo "Page saved successfully.\n";

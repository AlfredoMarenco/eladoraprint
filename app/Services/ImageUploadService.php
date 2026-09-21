<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageUploadService
{
    /**
     * Sube, redimensiona y convierte una imagen a WebP.
     *
     * @param UploadedFile $file
     * @param string $path Carpeta de destino (ej: 'projects', 'posts')
     * @param int $maxWidth Ancho máximo
     * @param int $quality Calidad WebP (0-100)
     * @return string Ruta relativa del archivo guardado en el storage
     */
    public function uploadAndOptimize(UploadedFile $file, string $path, int $maxWidth = 1920, int $quality = 80): string
    {
        // Generar un nombre único
        $filename = uniqid() . '_' . time() . '.webp';
        $fullPath = $path . '/' . $filename;

        // Crear una instancia de Intervention Image Manager usando el driver GD
        $manager = new ImageManager(new Driver());

        // Leer la imagen subida
        $image = $manager->read($file->getRealPath());

        // Redimensionar proporcionalmente solo si excede el ancho máximo
        $image->scaleDown(width: $maxWidth);

        // Convertir a WebP en memoria
        $encoded = $image->toWebp(quality: $quality);

        // Guardar en el storage público
        Storage::disk('public')->put($fullPath, (string) $encoded);

        return $fullPath;
    }
}

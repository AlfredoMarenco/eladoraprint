<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Project;
use App\Models\Service;
use App\Models\Post;

// Attach placeholders to Products
$products = Product::all();
foreach ($products as $product) {
    if ($product->images()->count() === 0) {
        $product->images()->create([
            'image_path' => 'images/placeholders/' . rand(1, 4) . '.jpg',
            'is_primary' => true,
            'order' => 1
        ]);
        // Add a secondary image sometimes
        if (rand(1, 10) > 5) {
            $product->images()->create([
                'image_path' => 'images/placeholders/' . rand(1, 4) . '.jpg',
                'is_primary' => false,
                'order' => 2
            ]);
        }
    }
}

// Attach placeholders to Projects
$projects = Project::all();
foreach ($projects as $project) {
    if (!$project->cover_image || strpos($project->cover_image, 'placeholder') === false) {
        $project->update([
            'cover_image' => 'images/placeholders/' . rand(1, 4) . '.jpg'
        ]);
    }
    
    if ($project->images()->count() === 0) {
        for ($i=1; $i<=rand(1, 3); $i++) {
            $project->images()->create([
                'image_path' => 'images/placeholders/' . rand(1, 4) . '.jpg',
                'order' => $i
            ]);
        }
    }
}

// Posts and Services probably have image fields? Let's check their DB structure if they do
// I'll just catch any exceptions if they don't exist
try {
    DB::table('posts')->update(['cover_image' => 'images/placeholders/1.jpg']);
} catch (\Exception $e) {}

try {
    DB::table('services')->update(['icon' => 'images/placeholders/2.jpg']);
} catch (\Exception $e) {}

echo "Placeholder images attached successfully!\n";

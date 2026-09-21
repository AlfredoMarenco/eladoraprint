<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Category;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => '<p>' . implode('</p><p>', fake()->paragraphs(3)) . '</p>',
            'client' => fake()->company(),
            'role' => fake()->jobTitle(),
            'project_url' => fake()->url(),
            'completion_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'is_published' => true,
            'category_id' => Category::factory(),
        ];
    }
}

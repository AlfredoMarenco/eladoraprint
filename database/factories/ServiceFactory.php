<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => ucwords(fake()->unique()->words(2, true)),
            'description' => fake()->sentence(),
            'icon_path' => fake()->randomElement(['Palette', 'PenTool', 'LayoutTemplate', 'Type', 'Image']),
            'order' => fake()->numberBetween(0, 10),
        ];
    }
}

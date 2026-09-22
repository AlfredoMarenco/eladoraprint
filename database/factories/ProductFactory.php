<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        return [
            'name' => ucwords($name),
            'slug' => \Illuminate\Support\Str::slug($name),
            'description' => $this->faker->paragraph(),
            'base_price' => $this->faker->randomFloat(2, 10, 500),
            'type' => $this->faker->randomElement(['physical', 'digital', 'service']),
            'is_active' => $this->faker->boolean(80),
            'stock' => $this->faker->numberBetween(0, 100),
        ];
    }
}

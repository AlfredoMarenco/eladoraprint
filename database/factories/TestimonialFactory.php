<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TestimonialFactory extends Factory
{
    public function definition(): array
    {
        return [
            'client_name' => fake()->name(),
            'company' => fake()->company(),
            'content' => fake()->paragraph(),
            'is_active' => true,
        ];
    }
}

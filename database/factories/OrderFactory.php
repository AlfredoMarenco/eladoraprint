<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'guest_email' => null,
            'guest_name' => null,
            'guest_phone' => null,
            'total_amount' => $this->faker->randomFloat(2, 50, 1500),
            'shipping_cost' => $this->faker->randomFloat(2, 5, 50),
            'status' => $this->faker->randomElement(['pending', 'paid', 'production', 'shipped', 'completed', 'cancelled']),
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'transfer']),
            'payment_id' => $this->faker->uuid(),
            'shipping_address' => $this->faker->address(),
            'tracking_code' => $this->faker->bothify('TRK-####-????'),
            'notes' => $this->faker->sentence(),
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Post;
use App\Models\Product;
use App\Models\Project;
use App\Models\Service;
use App\Models\Tag;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolesAndPermissionsSeeder::class);

        $admin = User::firstOrCreate(
            ['email' => 'admin@eladoraprint.com'],
            ['name' => 'Administrador', 'password' => bcrypt('password')]
        );
        $admin->assignRole('Admin');

        // Create Customers
        User::factory(10)->create()->each(function ($user) {
            $user->assignRole('Customer');
        });

        // Create Categories and Projects
        Category::factory(5)->create()->each(function ($category) {
            Project::factory(3)->create(['category_id' => $category->id]);
        });

        // Create Tags and attach them to projects
        $tags = Tag::factory(10)->create();
        Project::all()->each(function ($project) use ($tags) {
            $project->tags()->attach(
                $tags->random(rand(2, 4))->pluck('id')->toArray()
            );
        });

        // Create Posts
        Post::factory(10)->create();

        // Create Services
        Service::factory(3)->create();

        // Create Testimonials
        Testimonial::factory(5)->create();

        // Create Products
        $products = Product::factory(15)->create();

        // Create Orders
        Order::factory(10)->create()->each(function ($order) use ($products) {
            // Attach 1 to 3 items per order
            $orderProducts = $products->random(rand(1, 3));
            foreach ($orderProducts as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => rand(1, 5),
                    'unit_price' => $product->base_price,
                ]);
            }
        });
    }
}

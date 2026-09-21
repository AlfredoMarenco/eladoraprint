<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Project;
use App\Models\Post;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // $this->call(UserSeeder::class); // We skip users as requested

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
    }
}

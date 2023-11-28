<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('jobs')->insert([
            [
                'name' => 'Tableu Developers',
                'description' => 'Description 1',
                'whyJoin' => 'Why join 1',
                'requirements' => 'Requirements 1',
                'offer' => 'Offer 1',
                'thumbnail' => 'Thumbnail 1',
                'kontrakStart' => '2023-10-01',
                'kontrakEnd' => '2023-10-31',
                'gajiLowe' => 1000,
                'gajiUpper' => 2000,
                'client_id' => 1, // Replace with appropriate client_id
            ],
            [
                'name' => 'Manajer Keuangan',
                'description' => 'Description 2',
                'whyJoin' => 'Why join 2',
                'requirements' => 'Requirements 2',
                'offer' => 'Offer 2',
                'thumbnail' => 'Thumbnail 2',
                'kontrakStart' => '2023-11-01',
                'kontrakEnd' => '2023-11-30',
                'gajiLowe' => 1500,
                'gajiUpper' => 2500,
                'client_id' => 2, // Replace with appropriate client_id
            ],
        ]);
    }
}

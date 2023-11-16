<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        DB::table('clients')->insert([
            [
                'name' => 'PT Mencari Cinta Sejati',
                'email' => 'cinta@gmail.com',
                'address' => 'Gentan, Sidorejo, lendah, KP',
                'noTelp' => '0857671234',
            ],
            [
                'name' => 'PT Tigan Jaya Sentosa',
                'email' => 'tigan@gmail.com',
                'address' => 'Gerjen, Sidorejo, Lendah, Kulon Progo',
                'noTelp' => '085741019279',
            ],
        ]);
    }
}

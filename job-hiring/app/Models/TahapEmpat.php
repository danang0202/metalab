<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TahapEmpat extends Model
{
    protected $fillable = ['score','status'];
    use HasFactory;
}

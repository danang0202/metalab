<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TahapTengah extends Model
{
    protected $fillable = ['stage','dateAdminFirst','dateAdminSecond','dateAdminThird','dateUser','link','score','status'];
    use HasFactory;
}

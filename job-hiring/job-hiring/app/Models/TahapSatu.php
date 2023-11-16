<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TahapSatu extends Model
{

    protected $fillable = ['nik','dateOfBirth','placeOfBirth','address','fileKTP','fileKK','fileCV','fileIjazah','fileSertifikat','Keputusan'];
    use HasFactory;
}

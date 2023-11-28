<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
        'name',
        'type',
        'description',
        'whyJoin',
        'requirements',
        'offer',
        'thumbnail',
        'kontrakStart',
        'kontrakEnd',
        'gajiLower',
        'gajiUpper',
        'clientId',
        'kuota',
        'latestApplyDate',
        'status',
        'willDo','hired'
    ];
    
    public function client(){
        return $this->belongsTo(Client::class,'clientId');
    }
    use HasFactory;
}

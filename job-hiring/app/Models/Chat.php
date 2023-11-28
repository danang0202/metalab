<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    protected $fillable = [
        'id','talentId','flag','flagSender','lastMessage','adminId'
    ];

    public function talent(){
        return $this->belongsTo(User::class,'talentId');
    }
    public function admin(){
        return $this->belongsTo(User::class,'adminId');
    }
    use HasFactory;
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatData extends Model
{
    protected $fillable=[
        'chatId','senderId','message','status','type'
    ];
    use HasFactory;
    public function chat(){
        return $this->belongsTo(Chat::class,'chatId');
    }

    public function sender(){
        return $this->belongsTo(User::class, 'senderId');
    }

}

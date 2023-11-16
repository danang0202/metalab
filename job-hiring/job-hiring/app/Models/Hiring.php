<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 

class Hiring extends Model
{
    protected $fillable = ['jobId', 'talentId', 'firstStageId', 'secondStageId', 'thirdtageId', 'fourthStageId'];
    public function job()
    {
        return $this->belongsTo(Job::class,'jobId');
    }
    public function firstStage()
    {
        return $this->belongsTo(TahapSatu::class, 'firstStageId');
    }
    public function secondStage()
    {
        return $this->belongsTo(TahapTengah::class, 'secondStageId');
    }
    public function thirdStage()
    {
        return $this->belongsTo(TahapTengah::class, 'thirdtageId');
    }
    public function fourthStage()
    {
        return $this->belongsTo(TahapEmpat::class, 'fourthStageId');
    }
    public function talent()
    {
        return $this->belongsTo(User::class, 'talentId');
    }

    use HasFactory;
}

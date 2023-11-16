<?php

namespace App\Console\Commands;

use App\Models\Job;
use Illuminate\Console\Command;

class UpdateJobStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'job:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

    public function __construct()
    {
        parent::__construct();
    }
    public function handle()
    {
        $jobs = Job::where('status', 'Vacant')
            ->whereDate('latest_apply_date', '<', now())
            ->get();

        // Ubah status pekerjaan yang memenuhi syarat menjadi 'Closed'
        foreach ($jobs as $job) {
            $job->status = 'Closed';
            $job->save();
        }
    }
}

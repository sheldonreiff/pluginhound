<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\User;

class RotateServiceAccountPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'service_account:rotate { username : Service account username }';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Rotate the password for a service account';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $account = User::where('email', $this->argument('username'))
        ->where('type', 'service')
        ->firstOrFail();

        $password = $account->rotateServiceAccountPassword();

        if($password){
            $this->info("User {$this->argument('username')} updated successfully.");
            $this->info("New password is: $password");
        }
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\User;

class CreateServiceAccount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'service_account:create { username : A username }';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a service account (machine user for accessing specific backend services)';

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
        $password = User::registerServiceAccount($this->argument('username'));
        
        if($password){
            $this->info("User {$this->argument('username')} created successfully.");
            $this->info("Password is: $password");
        }
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\User;

class DeleteServiceAccount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'service_account:delete { username : Username of service account to delete }';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete a service account';

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
        $username = $this->argument('username');

        $account = User::where('email', $username)
        ->where('type', 'service')
        ->firstOrFail();

        $confirm = $this->ask("Delete service account with username \"$username\"? [y/n]");

        $message = $confirm === 'y'
        ? ($account->delete() ? "$username deleted" : "Error deleting")
        : "Cancelled, nothing deleted";

        $this->info($message);
    }
}

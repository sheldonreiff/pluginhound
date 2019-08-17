<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\User;

class ListServiceAccounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'service_accounts:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List service accounts';

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
        $accounts = User::where('type', 'service')
        ->select(['id', 'email'])
        ->get();

        $this->table(['ID', 'Username'], $accounts->toArray());
    }
}

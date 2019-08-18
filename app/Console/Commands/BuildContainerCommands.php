<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BuildContainerCommands extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'build:container_commands { app_image : full image name for app container }';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Build the .ebextensions/deploy.conifg file, filling with dynamic properties';

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
        $rendered = view('root::deploy-config', [
            'app_image' => $this->argument('app_image'),
        ])->render();

        file_put_contents('.ebextensions/deploy.config', $rendered);
    }
}

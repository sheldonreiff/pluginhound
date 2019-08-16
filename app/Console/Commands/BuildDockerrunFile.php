<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BuildDockerrunFile extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'build:dockerrun { tag : docker tag to use }';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Build the Dockerrun.aws.json file, filling with duynamic properties';

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
        $rendered = view('root::Dockerrun-aws', [
            'tag' => $this->argument('tag'),
        ])->render();

        file_put_contents('Dockerrun.aws.json', $rendered);
    }
}

<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use Notification;
use Mail;

class AlertTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_create_alert()
    {
        $this->importProducts(['a']);

        $this->user
        ->alerts()
        ->create($this->testAlerts['a']);

        $exected_alert = collect([
            'user_id' => $this->user->id
        ])
        ->merge($this->testAlerts['a'])
        ->toArray();

        $this->assertDatabaseHas('alerts', $exected_alert);
    }

    /** @test */
    public function notification_is_sent_when_theshold_passed()
    {
        Notification::fake();

        $this->importProducts(['a']);

        $this->user
        ->alerts()
        ->create($this->testAlerts['a']);

        Notification::assertNothingSent();

        $this->importProducts(['a_decreased']);

        Notification::assertSentTo($this->user, \App\Notifications\Alert::class);
    }

    /** @test */
    public function notification_is_not_sent_when_threshold_is_not_passed()
    {
        Notification::fake();

        $this->importProducts(['b']);

        $this->user
        ->alerts()
        ->create($this->testAlerts['b']);

        Notification::assertNothingSent();

        $this->importProducts(['b_decreased']);

        Notification::assertNothingSent();
    }

    /** @test */
    public function email_is_sent_when_theshold_passed()
    {
        Notification::fake();

        $this->importProducts(['a']);

        $this->user
        ->alerts()
        ->create($this->testAlerts['a']);

        Notification::assertNothingSent();

        $this->importProducts(['a_decreased']);

        $user = $this->user;
        $testProduct = $this->testProducts['a'];

        Notification::assertSentTo($this->user,
        \App\Notifications\Alert::class,
        function ($notification) use ($user, $testProduct){
            $mailData = $notification->toMail($user)->build();

            $this->assertStringContainsString("Price Changed", $mailData->subject);
            $this->assertStringContainsString($testProduct->name, $mailData->subject);

            return true;
        });
    }

    /** @test */
    public function alert_email_is_not_sent_when_email_is_not_verified()
    {
        Notification::fake();

        $this->importProducts(['a']);

        $this->user->email_verified_at = null;
        $this->user->save();

        $this->user
        ->alerts()
        ->create($this->testAlerts['a']);

        $this->importProducts(['a_decreased']);

        $user = $this->user;
        $testProduct = $this->testProducts['a'];

        Notification::assertNothingSent();
    }

    
}

<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\User;
use Mail;
use Notification;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_register_user()
    {
        $userData = collect([
            'email' => 'test10@example.com',
            'password' => 'slkdfjsFdf23489!!',
            'password_confirmation' => 'slkdfjsFdf23489!!',
            'first_name' => 'John',
            'last_name' => 'Smith',
            'type' => 'user',
        ]);

        $this->json('post', '/api/auth/register', $userData->toArray())
        ->assertOk();

        $user = User::where('email', $userData['email'])->first();

        $this->assertArraySubset(
            $userData->only(['email', 'first_name', 'last_name'])->toArray(),
            $user->toArray()
        );
    }

    /** @test */
    public function user_can_login()
    {
        $this->json('post', '/api/auth/login', [
            'email' => $this->userData->email,
            'password' => $this->userData->password_raw,
        ])
        ->assertOk();
    }

    /** @test */
    public function can_get_myself()
    {
        $this->json('get', '/api/me')
        ->assertOk()
        ->assertJsonFragment(
            collect($this->userData
            ->toArray())
            ->except(['password', 'password_raw'])
            ->toArray()
        );
    }

    /** @test */
    public function can_refresh_token()
    {
        $this->json('post', '/api/auth/refresh')
        ->assertOk();
    }

    /** @test */
    public function user_can_logout()
    {
        $this->json('get', '/api/auth/validate')
        ->assertStatus(200);

        $this->post('/api/auth/logout')
        ->assertOk();

        $this->json('get', '/api/auth/validate')
        ->assertStatus(401);
    }

    /** @test */
    public function can_update_password()
    {
        $new_password = $this->faker->password().'sdlfj2389';

        $this->json('patch', '/api/me', [
            'current_password' => $this->userData->password_raw,
            'new_password' => $new_password,
            'new_password_confirmation' => $new_password,
        ])
        ->assertOk();

        $this->json('post', '/api/auth/login', [
            'email' => $this->userData->email,
            'password' => $new_password,
        ])
        ->assertOk();
    }

    /** @test */
    public function can_update_myself()
    {
        $new_first_name = 'John';
        $new_last_name = 'Smith';
        $new_email = 'test@example.com';

        $this->json('patch', '/api/me', [
            'first_name' => $new_first_name,
            'last_name' => $new_last_name,
            'email' => $new_email,
        ])
        ->assertOk();

        $this->json('get', '/api/me')
        ->assertOk()
        ->assertJson([
            'data' => [
                'first_name' => $new_first_name,
                'last_name' => $new_last_name,
                'email' => $new_email,
                'type' => 'user',
            ],
        ]);
    }

    /** @test */
    public function can_reset_password_from_emailed_link()
    {
        Notification::fake();

        $this->post('/api/auth/logout')
        ->assertOk();

        Notification::assertNothingSent();

        $this->json('post', '/api/password/send', [
            'email' => $this->userData->email,
        ])
        ->assertOk();

        Notification::assertSentTo($this->user, \Illuminate\Auth\Notifications\ResetPassword::class);
    }
}

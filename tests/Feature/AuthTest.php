<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\User;

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
        $this->json('get', '/api/auth/me')
        ->assertOk()
        ->assertJson(
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
}

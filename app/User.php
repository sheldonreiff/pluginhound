<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Hash;
use App\Notifications\VerifyEmail;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'type',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }


    public static function register($newUser)
    {
        return static::create([
            'email' => $newUser['email'],
            'first_name' => $newUser['first_name'],
            'last_name' => $newUser['last_name'],
            'password' => Hash::make($newUser['password'])
        ]);
    }

    private static function makeServiceAccountPassword()
    {
        return bin2hex(openssl_random_pseudo_bytes(32));
    }

    public static function registerServiceAccount($username)
    {
        $password = self::makeServiceAccountPassword();

        static::create([
            'email' => $username,
            'password' => Hash::make($password),
            'type' => 'service',
        ]);

        return $password;
    }

    public function rotateServiceAccountPassword()
    {
        $password = self::makeServiceAccountPassword();

        $this->password = Hash::make($password);

        $this->save();

        return $password;
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail);
    }

    public function alerts()
    {
        return $this->hasMany('App\Alert');
    }
}

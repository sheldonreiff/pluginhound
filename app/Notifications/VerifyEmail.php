<?php

namespace App\Notifications;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;

class VerifyEmail extends VerifyEmailBase
{
    protected function verificationUrl($notifiable)
    {
        $signedRoute = urlencode(URL::temporarySignedRoute(
            'verification.verify', Carbon::now()->addMinutes(60), ['id' => $notifiable->getKey()]
        ));

        $appUrl = config('app.url');

        return "$appUrl/verify?signedRoute=$signedRoute";
    }
}

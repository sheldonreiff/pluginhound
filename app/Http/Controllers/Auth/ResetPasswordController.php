<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ResetsPasswords;

use App\Rules\Password;
use App\User;
use Mail;
use Illuminate\Http\Request;

class ResetPasswordController 
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    use ResetsPasswords;

    protected function sendResetResponse(Request $request, $response)
    {
        return response()->json($response, 200);
    }

    protected function sendResetFailedResponse(Request $request, $response)
    {
        return response()->json($response, 400);
    }

    protected function rules()
    {
        return [
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', new Password],
        ];
    }

    public function sendPasswordReset()
    {
        $credentials = ['email' => request()->input('email')];
        $response = \Password::sendResetLink($credentials, function (Message $message) {
            $message->subject($this->getEmailSubject());
        });

        switch ($response) {
            case \Password::RESET_LINK_SENT:
                return response(null, 200);
            case \Password::INVALID_USER:
                return response(null, 404);
        }
    }

}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
// use Illuminate\Foundation\Auth\VerifiesEmails;
use \Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;

class VerificationController extends Controller
{
    /**
     * Show the email verification notice.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // public function show(Request $request)
    // {
    //     return $request->user()->hasVerifiedEmail()
    //                     ? redirect($this->redirectPath())
    //                     : view('auth.verify');
    // }

    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function verify(Request $request)
    {
        if ($request->route('id') != optional($request->user())->getKey()) {
            return response()->json(['errors' => ["Please login to the account you're trying to activate before verifying"]], 401);
        }

        if ($request->user()->hasVerifiedEmail()) {
            return response()->json('Already verified', 200);
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return response()->json('Verified', 200);
    }

    /**
     * Resend the email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json('Already verified', 200);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json('Veification email sent', 200);
    }


    // /**
    //  * Create a new controller instance.
    //  *
    //  * @return void
    //  */
    public function __construct()
    {
        // $this->middleware('auth');
        $this->middleware('signed')->only('verify');
        $this->middleware('throttle:6,1')->only('verify', 'resend');
    }
}

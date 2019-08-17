<?php

namespace App\Http\Middleware;

use Closure;

use Auth;

class AuthenticateWebhook
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, $next)
    {           
        return Auth::onceBasic() ?: $next($request);
    }
}

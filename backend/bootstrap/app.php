<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // The SPA authenticates with Sanctum bearer tokens, so the cookie/CSRF
        // "stateful" middleware is intentionally not registered for the API.
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web:      __DIR__ . '/../routes/web.php',
        api:      __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health:   '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Register custom middleware aliases
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        // Throttle auth endpoints
        $middleware->throttleApi();

        // Unauthenticated API requests are handled in withExceptions below — no redirect needed
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // Always return JSON for API routes
        $exceptions->render(function (\Throwable $e, Request $request) {

            if (! $request->expectsJson() && ! str_starts_with($request->path(), 'api/')) {
                return null; // let default handler take it
            }

            if ($e instanceof ValidationException) {
                return response()->json([
                    'message' => 'Validation failed.',
                    'errors'  => $e->errors(),
                ], 422);
            }

            if ($e instanceof AuthenticationException) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            if ($e instanceof NotFoundHttpException) {
                return response()->json(['message' => 'Resource not found.'], 404);
            }

            if ($e instanceof MethodNotAllowedHttpException) {
                return response()->json(['message' => 'Method not allowed.'], 405);
            }

            $status  = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
            $message = $status < 500 ? $e->getMessage() : 'Server error. Please try again later.';

            return response()->json(['message' => $message], $status);
        });

    })->create();

<?php

use App\Http\Controllers\Admin\QaFeedbackBotController;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware(['web', 'auth', 'role:Admin|Administradora|Colaborador|Consulta'])
                ->prefix('admin')
                ->name('admin.')
                ->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state', 'qa_admin_active']);
        $middleware->validateCsrfTokens(except: ['webhooks/mercadopago']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            $qaContext = QaFeedbackBotController::resolveReviewerFromRequest($request);

            if ($qaContext === null || $request->expectsJson()) {
                return $response;
            }

            $content = $response->getContent();
            if (! is_string($content)) {
                return $response;
            }

            $bodyClosePos = strripos($content, '</body>');
            if ($bodyClosePos === false) {
                return $response;
            }

            $payload = [
                'status' => $response->getStatusCode(),
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'file' => basename($e->getFile()).':'.$e->getLine(),
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'timestamp' => now()->toIso8601String(),
            ];

            $jsonFlags = JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
            $csrfToken = null;
            try {
                if ($request->hasSession()) {
                    $csrfToken = $request->session()->token();
                }
            } catch (Throwable) {
                $csrfToken = null;
            }

            $injection = "\n<script>window.__SAPIUS_QA_ADMIN__ = true; window.__SAPIUS_QA_CONTEXT__ = ".json_encode($qaContext, $jsonFlags).'; window.__SAPIUS_QA_EXCEPTION__ = '.json_encode($payload, $jsonFlags).';';
            if (is_string($csrfToken) && $csrfToken !== '') {
                $injection .= ' window.__SAPIUS_QA_CSRF__ = '.json_encode($csrfToken, $jsonFlags).';';
            }
            $injection .= '</script>';

            if (! str_contains($content, '/js/qa-bot.js')) {
                $version = @filemtime(public_path('js/qa-bot.js')) ?: 1;
                $injection .= "\n<script src=\"/js/qa-bot.js?v={$version}\" defer></script>";
            }

            $updatedContent = substr($content, 0, $bodyClosePos).$injection."\n".substr($content, $bodyClosePos);
            $response->setContent($updatedContent);
            $response->headers->remove('Content-Length');

            return $response;
        });
    })->create();

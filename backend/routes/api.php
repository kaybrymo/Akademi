<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TutorController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AdminController;

// Public auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public tutor & subject routes
Route::get('/tutors', [TutorController::class, 'index']);
Route::get('/tutors/{id}', [TutorController::class, 'show']);
Route::get('/tutors/{id}/availability', [TutorController::class, 'availability']);
Route::get('/subjects/groups', [SubjectController::class, 'groups']);
Route::get('/reviews/tutor/{id}', [ReviewController::class, 'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    // Subjects (tutor)
    Route::apiResource('subjects', SubjectController::class)->except(['index']);
    Route::get('/my-subjects', [SubjectController::class, 'index']);

    // Sessions
    Route::apiResource('sessions', SessionController::class);
    Route::post('/sessions/{id}/cancel', [SessionController::class, 'cancel']);

    // Bookings
    Route::apiResource('bookings', BookingController::class)->only(['index', 'store']);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::post('/bookings/{id}/reschedule', [BookingController::class, 'reschedule']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Wallet
    Route::prefix('wallet')->group(function () {
        Route::get('/balance', [WalletController::class, 'balance']);
        Route::get('/transactions', [WalletController::class, 'transactions']);
        Route::post('/deposit', [WalletController::class, 'deposit']);
        Route::post('/verify-deposit', [WalletController::class, 'verifyDeposit']);
        Route::post('/withdraw', [WalletController::class, 'withdraw']);
    });

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Session Recordings & Retention
    Route::prefix('recordings')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\RecordingController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\RecordingController::class, 'store']);
        Route::get('/{id}', [\App\Http\Controllers\Api\RecordingController::class, 'show']);
        Route::post('/{id}/keep', [\App\Http\Controllers\Api\RecordingController::class, 'keep']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\RecordingController::class, 'destroy']);
    });

    // Admin routes
    Route::middleware('can:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users/{id}/suspend', [AdminController::class, 'suspendUser']);
        Route::get('/gateways', [AdminController::class, 'gateways']);
        Route::post('/gateways', [AdminController::class, 'addGateway']);
        Route::put('/gateways/{id}', [AdminController::class, 'updateGateway']);
        Route::post('/gateways/{id}/set-default', [AdminController::class, 'setDefaultGateway']);
        Route::post('/refund', [AdminController::class, 'initiateRefund']);
        Route::get('/commission', [AdminController::class, 'commissionSettings']);
        Route::post('/commission', [AdminController::class, 'updateCommission']);
        Route::get('/recordings', [\App\Http\Controllers\Api\RecordingController::class, 'adminList']);
    });
});

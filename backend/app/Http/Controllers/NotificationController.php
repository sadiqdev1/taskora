<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /** GET /notifications */
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->appNotifications()
            ->latest()
            ->paginate(20);

        // Compute unread count from the already-fetched page rather than
        // issuing a second COUNT query for every page load.
        $unread = $request->user()
            ->appNotifications()
            ->whereNull('read_at')
            ->count();

        return response()->json([
            ...$notifications->toArray(),
            'unread_count' => $unread,
        ]);
    }

    /** GET /notifications/unread-count */
    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'count' => $request->user()->appNotifications()->whereNull('read_at')->count(),
        ]);
    }

    /** PATCH /notifications/{id}/read */
    public function markRead(Request $request, \App\Models\Notification $appNotif): JsonResponse
    {
        if ($appNotif->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }
        $appNotif->update(['read_at' => now()]);
        return response()->json($appNotif);
    }

    /** PATCH /notifications/read-all */
    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->appNotifications()->whereNull('read_at')->update(['read_at' => now()]);
        return response()->json(['message' => 'All marked as read.']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    /**
     * Follow a user
     */
    public function follow(User $user)
    {
        if (Auth::id() === $user->id) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

        if (Auth::user()->follows($user)) {
            return response()->json(['message' => 'You are already following this user'], 400);
        }

        Auth::user()->following()->attach($user->id);

        return response()->json([
            'message' => 'Successfully followed user',
            'is_following' => true
        ]);
    }

    /**
     * Unfollow a user
     */
    public function unfollow(User $user)
    {
        if (!Auth::user()->follows($user)) {
            return response()->json(['message' => 'You are not following this user'], 400);
        }

        Auth::user()->following()->detach($user->id);

        return response()->json([
            'message' => 'Successfully unfollowed user',
            'is_following' => false
        ]);
    }

    /**
     * Toggle follow status
     */
    public function toggle(User $user)
    {
        if (Auth::id() === $user->id) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

        $isFollowing = Auth::user()->follows($user);

        if ($isFollowing) {
            Auth::user()->following()->detach($user->id);
            $message = 'Successfully unfollowed user';
        } else {
            Auth::user()->following()->attach($user->id);
            $message = 'Successfully followed user';
        }

        return response()->json([
            'message' => $message,
            'is_following' => !$isFollowing
        ]);
    }

    /**
     * Get followers of a user
     */
    public function followers(User $user)
    {
        $followers = $user->followers()
            ->withCount(['followers', 'following', 'posts'])
            ->paginate(20);

        return response()->json($followers);
    }

    /**
     * Get users that a user is following
     */
    public function following(User $user)
    {
        $following = $user->following()
            ->withCount(['followers', 'following', 'posts'])
            ->paginate(20);

        return response()->json($following);
    }

    /**
     * Get suggested users to follow
     */
    public function suggestions()
    {
        $currentUser = Auth::user();
        
        // Get users that the current user is not following
        $suggestions = User::where('id', '!=', $currentUser->id)
            ->whereNotIn('id', $currentUser->following()->pluck('users.id'))
            ->withCount(['followers', 'following', 'posts'])
            ->orderBy('followers_count', 'desc')
            ->limit(10)
            ->get();

        return response()->json($suggestions);
    }

    /**
     * Search users
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        if (!$query || strlen($query) < 2) {
            return response()->json(['users' => []]);
        }

        $users = User::where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('username', 'like', "%{$query}%");
        })
        ->where('id', '!=', Auth::id())
        ->withCount(['followers', 'following', 'posts'])
        ->limit(10)
        ->get();

        return response()->json(['users' => $users]);
    }
}

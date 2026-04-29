import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
export const profile = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(args, options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/u/{username}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
profile.url = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { username: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    username: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        username: args.username,
                }

    return profile.definition.url
            .replace('{username}', parsedArgs.username.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
profile.get = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
profile.head = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
    const profileForm = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
        profileForm.get = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
        profileForm.head = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profile.form = profileForm
/**
* @see \App\Http\Controllers\FollowController::follow
 * @see app/Http/Controllers/FollowController.php:12
 * @route '/u/{user}/follow'
 */
export const follow = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: follow.url(args, options),
    method: 'post',
})

follow.definition = {
    methods: ["post"],
    url: '/u/{user}/follow',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FollowController::follow
 * @see app/Http/Controllers/FollowController.php:12
 * @route '/u/{user}/follow'
 */
follow.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return follow.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FollowController::follow
 * @see app/Http/Controllers/FollowController.php:12
 * @route '/u/{user}/follow'
 */
follow.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: follow.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FollowController::follow
 * @see app/Http/Controllers/FollowController.php:12
 * @route '/u/{user}/follow'
 */
    const followForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: follow.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FollowController::follow
 * @see app/Http/Controllers/FollowController.php:12
 * @route '/u/{user}/follow'
 */
        followForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: follow.url(args, options),
            method: 'post',
        })
    
    follow.form = followForm
const user = {
    profile: Object.assign(profile, profile),
follow: Object.assign(follow, follow),
}

export default user
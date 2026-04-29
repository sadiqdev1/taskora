import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:130
 * @route '/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:130
 * @route '/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:130
 * @route '/profile'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:130
 * @route '/profile'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:130
 * @route '/profile'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ProfileController::uploadAvatar
 * @see app/Http/Controllers/ProfileController.php:147
 * @route '/profile/avatar'
 */
export const uploadAvatar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(options),
    method: 'post',
})

uploadAvatar.definition = {
    methods: ["post"],
    url: '/profile/avatar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProfileController::uploadAvatar
 * @see app/Http/Controllers/ProfileController.php:147
 * @route '/profile/avatar'
 */
uploadAvatar.url = (options?: RouteQueryOptions) => {
    return uploadAvatar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::uploadAvatar
 * @see app/Http/Controllers/ProfileController.php:147
 * @route '/profile/avatar'
 */
uploadAvatar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadAvatar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProfileController::uploadAvatar
 * @see app/Http/Controllers/ProfileController.php:147
 * @route '/profile/avatar'
 */
    const uploadAvatarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadAvatar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::uploadAvatar
 * @see app/Http/Controllers/ProfileController.php:147
 * @route '/profile/avatar'
 */
        uploadAvatarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadAvatar.url(options),
            method: 'post',
        })
    
    uploadAvatar.form = uploadAvatarForm
/**
* @see \App\Http\Controllers\ProfileController::uploadCover
 * @see app/Http/Controllers/ProfileController.php:169
 * @route '/profile/cover'
 */
export const uploadCover = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadCover.url(options),
    method: 'post',
})

uploadCover.definition = {
    methods: ["post"],
    url: '/profile/cover',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProfileController::uploadCover
 * @see app/Http/Controllers/ProfileController.php:169
 * @route '/profile/cover'
 */
uploadCover.url = (options?: RouteQueryOptions) => {
    return uploadCover.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::uploadCover
 * @see app/Http/Controllers/ProfileController.php:169
 * @route '/profile/cover'
 */
uploadCover.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadCover.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProfileController::uploadCover
 * @see app/Http/Controllers/ProfileController.php:169
 * @route '/profile/cover'
 */
    const uploadCoverForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadCover.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::uploadCover
 * @see app/Http/Controllers/ProfileController.php:169
 * @route '/profile/cover'
 */
        uploadCoverForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadCover.url(options),
            method: 'post',
        })
    
    uploadCover.form = uploadCoverForm
/**
* @see \App\Http\Controllers\ProfileController::showByUsername
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
export const showByUsername = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showByUsername.url(args, options),
    method: 'get',
})

showByUsername.definition = {
    methods: ["get","head"],
    url: '/u/{username}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfileController::showByUsername
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
showByUsername.url = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showByUsername.definition.url
            .replace('{username}', parsedArgs.username.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::showByUsername
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
showByUsername.get = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showByUsername.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfileController::showByUsername
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
showByUsername.head = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showByUsername.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfileController::showByUsername
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
    const showByUsernameForm = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showByUsername.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfileController::showByUsername
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
        showByUsernameForm.get = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showByUsername.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfileController::showByUsername
 * @see app/Http/Controllers/ProfileController.php:24
 * @route '/u/{username}'
 */
        showByUsernameForm.head = (args: { username: string | number } | [username: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showByUsername.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showByUsername.form = showByUsernameForm
const ProfileController = { show, update, uploadAvatar, uploadCover, showByUsername }

export default ProfileController
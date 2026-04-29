import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MemeController::trending
 * @see app/Http/Controllers/MemeController.php:329
 * @route '/trending'
 */
export const trending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trending.url(options),
    method: 'get',
})

trending.definition = {
    methods: ["get","head"],
    url: '/trending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MemeController::trending
 * @see app/Http/Controllers/MemeController.php:329
 * @route '/trending'
 */
trending.url = (options?: RouteQueryOptions) => {
    return trending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::trending
 * @see app/Http/Controllers/MemeController.php:329
 * @route '/trending'
 */
trending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trending.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MemeController::trending
 * @see app/Http/Controllers/MemeController.php:329
 * @route '/trending'
 */
trending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trending.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MemeController::trending
 * @see app/Http/Controllers/MemeController.php:329
 * @route '/trending'
 */
    const trendingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: trending.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MemeController::trending
 * @see app/Http/Controllers/MemeController.php:329
 * @route '/trending'
 */
        trendingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: trending.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MemeController::trending
 * @see app/Http/Controllers/MemeController.php:329
 * @route '/trending'
 */
        trendingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: trending.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    trending.form = trendingForm
/**
* @see \App\Http\Controllers\MemeController::search
 * @see app/Http/Controllers/MemeController.php:343
 * @route '/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MemeController::search
 * @see app/Http/Controllers/MemeController.php:343
 * @route '/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::search
 * @see app/Http/Controllers/MemeController.php:343
 * @route '/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MemeController::search
 * @see app/Http/Controllers/MemeController.php:343
 * @route '/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MemeController::search
 * @see app/Http/Controllers/MemeController.php:343
 * @route '/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MemeController::search
 * @see app/Http/Controllers/MemeController.php:343
 * @route '/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MemeController::search
 * @see app/Http/Controllers/MemeController.php:343
 * @route '/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
/**
* @see \App\Http\Controllers\MemeController::store
 * @see app/Http/Controllers/MemeController.php:98
 * @route '/memes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/memes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MemeController::store
 * @see app/Http/Controllers/MemeController.php:98
 * @route '/memes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::store
 * @see app/Http/Controllers/MemeController.php:98
 * @route '/memes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MemeController::store
 * @see app/Http/Controllers/MemeController.php:98
 * @route '/memes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MemeController::store
 * @see app/Http/Controllers/MemeController.php:98
 * @route '/memes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\MemeController::show
 * @see app/Http/Controllers/MemeController.php:62
 * @route '/p/{meme}'
 */
export const show = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/p/{meme}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MemeController::show
 * @see app/Http/Controllers/MemeController.php:62
 * @route '/p/{meme}'
 */
show.url = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { meme: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.slug
                : args.meme,
                }

    return show.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::show
 * @see app/Http/Controllers/MemeController.php:62
 * @route '/p/{meme}'
 */
show.get = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MemeController::show
 * @see app/Http/Controllers/MemeController.php:62
 * @route '/p/{meme}'
 */
show.head = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MemeController::show
 * @see app/Http/Controllers/MemeController.php:62
 * @route '/p/{meme}'
 */
    const showForm = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MemeController::show
 * @see app/Http/Controllers/MemeController.php:62
 * @route '/p/{meme}'
 */
        showForm.get = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MemeController::show
 * @see app/Http/Controllers/MemeController.php:62
 * @route '/p/{meme}'
 */
        showForm.head = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\MemeController::edit
 * @see app/Http/Controllers/MemeController.php:458
 * @route '/p/{meme}/edit'
 */
export const edit = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/p/{meme}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MemeController::edit
 * @see app/Http/Controllers/MemeController.php:458
 * @route '/p/{meme}/edit'
 */
edit.url = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { meme: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.slug
                : args.meme,
                }

    return edit.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::edit
 * @see app/Http/Controllers/MemeController.php:458
 * @route '/p/{meme}/edit'
 */
edit.get = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MemeController::edit
 * @see app/Http/Controllers/MemeController.php:458
 * @route '/p/{meme}/edit'
 */
edit.head = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MemeController::edit
 * @see app/Http/Controllers/MemeController.php:458
 * @route '/p/{meme}/edit'
 */
    const editForm = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MemeController::edit
 * @see app/Http/Controllers/MemeController.php:458
 * @route '/p/{meme}/edit'
 */
        editForm.get = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MemeController::edit
 * @see app/Http/Controllers/MemeController.php:458
 * @route '/p/{meme}/edit'
 */
        editForm.head = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\MemeController::update
 * @see app/Http/Controllers/MemeController.php:482
 * @route '/p/{meme}'
 */
export const update = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/p/{meme}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MemeController::update
 * @see app/Http/Controllers/MemeController.php:482
 * @route '/p/{meme}'
 */
update.url = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { meme: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.slug
                : args.meme,
                }

    return update.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::update
 * @see app/Http/Controllers/MemeController.php:482
 * @route '/p/{meme}'
 */
update.patch = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\MemeController::update
 * @see app/Http/Controllers/MemeController.php:482
 * @route '/p/{meme}'
 */
    const updateForm = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MemeController::update
 * @see app/Http/Controllers/MemeController.php:482
 * @route '/p/{meme}'
 */
        updateForm.patch = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\MemeController::destroy
 * @see app/Http/Controllers/MemeController.php:522
 * @route '/p/{meme}'
 */
export const destroy = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/p/{meme}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MemeController::destroy
 * @see app/Http/Controllers/MemeController.php:522
 * @route '/p/{meme}'
 */
destroy.url = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { meme: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.slug
                : args.meme,
                }

    return destroy.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::destroy
 * @see app/Http/Controllers/MemeController.php:522
 * @route '/p/{meme}'
 */
destroy.delete = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\MemeController::destroy
 * @see app/Http/Controllers/MemeController.php:522
 * @route '/p/{meme}'
 */
    const destroyForm = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MemeController::destroy
 * @see app/Http/Controllers/MemeController.php:522
 * @route '/p/{meme}'
 */
        destroyForm.delete = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\MemeController::toggleLike
 * @see app/Http/Controllers/MemeController.php:138
 * @route '/p/{meme}/like'
 */
export const toggleLike = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleLike.url(args, options),
    method: 'post',
})

toggleLike.definition = {
    methods: ["post"],
    url: '/p/{meme}/like',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MemeController::toggleLike
 * @see app/Http/Controllers/MemeController.php:138
 * @route '/p/{meme}/like'
 */
toggleLike.url = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { meme: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.slug
                : args.meme,
                }

    return toggleLike.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::toggleLike
 * @see app/Http/Controllers/MemeController.php:138
 * @route '/p/{meme}/like'
 */
toggleLike.post = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleLike.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MemeController::toggleLike
 * @see app/Http/Controllers/MemeController.php:138
 * @route '/p/{meme}/like'
 */
    const toggleLikeForm = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleLike.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MemeController::toggleLike
 * @see app/Http/Controllers/MemeController.php:138
 * @route '/p/{meme}/like'
 */
        toggleLikeForm.post = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleLike.url(args, options),
            method: 'post',
        })
    
    toggleLike.form = toggleLikeForm
/**
* @see \App\Http\Controllers\MemeController::toggleSave
 * @see app/Http/Controllers/MemeController.php:280
 * @route '/p/{meme}/save'
 */
export const toggleSave = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleSave.url(args, options),
    method: 'post',
})

toggleSave.definition = {
    methods: ["post"],
    url: '/p/{meme}/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MemeController::toggleSave
 * @see app/Http/Controllers/MemeController.php:280
 * @route '/p/{meme}/save'
 */
toggleSave.url = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { meme: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.slug
                : args.meme,
                }

    return toggleSave.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::toggleSave
 * @see app/Http/Controllers/MemeController.php:280
 * @route '/p/{meme}/save'
 */
toggleSave.post = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleSave.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MemeController::toggleSave
 * @see app/Http/Controllers/MemeController.php:280
 * @route '/p/{meme}/save'
 */
    const toggleSaveForm = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleSave.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MemeController::toggleSave
 * @see app/Http/Controllers/MemeController.php:280
 * @route '/p/{meme}/save'
 */
        toggleSaveForm.post = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleSave.url(args, options),
            method: 'post',
        })
    
    toggleSave.form = toggleSaveForm
/**
* @see \App\Http\Controllers\MemeController::report
 * @see app/Http/Controllers/MemeController.php:300
 * @route '/p/{meme}/report'
 */
export const report = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(args, options),
    method: 'post',
})

report.definition = {
    methods: ["post"],
    url: '/p/{meme}/report',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MemeController::report
 * @see app/Http/Controllers/MemeController.php:300
 * @route '/p/{meme}/report'
 */
report.url = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { meme: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.slug
                : args.meme,
                }

    return report.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::report
 * @see app/Http/Controllers/MemeController.php:300
 * @route '/p/{meme}/report'
 */
report.post = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MemeController::report
 * @see app/Http/Controllers/MemeController.php:300
 * @route '/p/{meme}/report'
 */
    const reportForm = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: report.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MemeController::report
 * @see app/Http/Controllers/MemeController.php:300
 * @route '/p/{meme}/report'
 */
        reportForm.post = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: report.url(args, options),
            method: 'post',
        })
    
    report.form = reportForm
/**
* @see \App\Http\Controllers\MemeController::analytics
 * @see app/Http/Controllers/MemeController.php:317
 * @route '/p/{meme}/analytics'
 */
export const analytics = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(args, options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/p/{meme}/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MemeController::analytics
 * @see app/Http/Controllers/MemeController.php:317
 * @route '/p/{meme}/analytics'
 */
analytics.url = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { meme: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.slug
                : args.meme,
                }

    return analytics.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::analytics
 * @see app/Http/Controllers/MemeController.php:317
 * @route '/p/{meme}/analytics'
 */
analytics.get = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MemeController::analytics
 * @see app/Http/Controllers/MemeController.php:317
 * @route '/p/{meme}/analytics'
 */
analytics.head = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MemeController::analytics
 * @see app/Http/Controllers/MemeController.php:317
 * @route '/p/{meme}/analytics'
 */
    const analyticsForm = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analytics.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MemeController::analytics
 * @see app/Http/Controllers/MemeController.php:317
 * @route '/p/{meme}/analytics'
 */
        analyticsForm.get = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MemeController::analytics
 * @see app/Http/Controllers/MemeController.php:317
 * @route '/p/{meme}/analytics'
 */
        analyticsForm.head = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analytics.form = analyticsForm
/**
* @see \App\Http\Controllers\MemeController::whoReacted
 * @see app/Http/Controllers/MemeController.php:244
 * @route '/p/{meme}/reactions'
 */
export const whoReacted = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whoReacted.url(args, options),
    method: 'get',
})

whoReacted.definition = {
    methods: ["get","head"],
    url: '/p/{meme}/reactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MemeController::whoReacted
 * @see app/Http/Controllers/MemeController.php:244
 * @route '/p/{meme}/reactions'
 */
whoReacted.url = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { meme: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.slug
                : args.meme,
                }

    return whoReacted.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MemeController::whoReacted
 * @see app/Http/Controllers/MemeController.php:244
 * @route '/p/{meme}/reactions'
 */
whoReacted.get = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whoReacted.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MemeController::whoReacted
 * @see app/Http/Controllers/MemeController.php:244
 * @route '/p/{meme}/reactions'
 */
whoReacted.head = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: whoReacted.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MemeController::whoReacted
 * @see app/Http/Controllers/MemeController.php:244
 * @route '/p/{meme}/reactions'
 */
    const whoReactedForm = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: whoReacted.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MemeController::whoReacted
 * @see app/Http/Controllers/MemeController.php:244
 * @route '/p/{meme}/reactions'
 */
        whoReactedForm.get = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whoReacted.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MemeController::whoReacted
 * @see app/Http/Controllers/MemeController.php:244
 * @route '/p/{meme}/reactions'
 */
        whoReactedForm.head = (args: { meme: string | { slug: string } } | [meme: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whoReacted.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    whoReacted.form = whoReactedForm
const MemeController = { trending, search, store, show, edit, update, destroy, toggleLike, toggleSave, report, analytics, whoReacted }

export default MemeController
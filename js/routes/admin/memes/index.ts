import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/admin/memes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
create.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: create.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::create
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
        createForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: create.url(options),
            method: 'post',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\AdminController::approve
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
export const approve = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/memes/{meme}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::approve
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
approve.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meme: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.id
                : args.meme,
                }

    return approve.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::approve
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
approve.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::approve
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
    const approveForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::approve
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
        approveForm.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\AdminController::reject
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
export const reject = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/memes/{meme}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::reject
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
reject.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meme: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.id
                : args.meme,
                }

    return reject.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::reject
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
reject.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::reject
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
    const rejectForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::reject
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
        rejectForm.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\AdminController::feature
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
export const feature = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feature.url(args, options),
    method: 'post',
})

feature.definition = {
    methods: ["post"],
    url: '/admin/memes/{meme}/feature',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::feature
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
feature.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meme: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.id
                : args.meme,
                }

    return feature.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::feature
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
feature.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feature.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::feature
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
    const featureForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: feature.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::feature
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
        featureForm.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: feature.url(args, options),
            method: 'post',
        })
    
    feature.form = featureForm
/**
* @see \App\Http\Controllers\AdminController::analytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
export const analytics = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(args, options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/admin/memes/{meme}/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::analytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
analytics.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meme: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.id
                : args.meme,
                }

    return analytics.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::analytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
analytics.get = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::analytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
analytics.head = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::analytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
    const analyticsForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analytics.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::analytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
        analyticsForm.get = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::analytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
        analyticsForm.head = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AdminController::deleteMethod
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
export const deleteMethod = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/admin/memes/{meme}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::deleteMethod
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
deleteMethod.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { meme: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { meme: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    meme: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        meme: typeof args.meme === 'object'
                ? args.meme.id
                : args.meme,
                }

    return deleteMethod.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::deleteMethod
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
deleteMethod.delete = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdminController::deleteMethod
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
    const deleteMethodForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::deleteMethod
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
        deleteMethodForm.delete = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const memes = {
    create: Object.assign(create, create),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
feature: Object.assign(feature, feature),
analytics: Object.assign(analytics, analytics),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default memes
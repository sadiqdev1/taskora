import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:15
 * @route '/settings/verification'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/settings/verification',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:15
 * @route '/settings/verification'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:15
 * @route '/settings/verification'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:15
 * @route '/settings/verification'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:15
 * @route '/settings/verification'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:15
 * @route '/settings/verification'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:15
 * @route '/settings/verification'
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
* @see \App\Http\Controllers\SubscriptionController::initiate
 * @see app/Http/Controllers/SubscriptionController.php:47
 * @route '/subscription/initiate'
 */
export const initiate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

initiate.definition = {
    methods: ["post"],
    url: '/subscription/initiate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::initiate
 * @see app/Http/Controllers/SubscriptionController.php:47
 * @route '/subscription/initiate'
 */
initiate.url = (options?: RouteQueryOptions) => {
    return initiate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::initiate
 * @see app/Http/Controllers/SubscriptionController.php:47
 * @route '/subscription/initiate'
 */
initiate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SubscriptionController::initiate
 * @see app/Http/Controllers/SubscriptionController.php:47
 * @route '/subscription/initiate'
 */
    const initiateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: initiate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SubscriptionController::initiate
 * @see app/Http/Controllers/SubscriptionController.php:47
 * @route '/subscription/initiate'
 */
        initiateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: initiate.url(options),
            method: 'post',
        })
    
    initiate.form = initiateForm
/**
* @see \App\Http\Controllers\SubscriptionController::verify
 * @see app/Http/Controllers/SubscriptionController.php:105
 * @route '/subscription/verify/{reference}'
 */
export const verify = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(args, options),
    method: 'get',
})

verify.definition = {
    methods: ["get","head"],
    url: '/subscription/verify/{reference}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::verify
 * @see app/Http/Controllers/SubscriptionController.php:105
 * @route '/subscription/verify/{reference}'
 */
verify.url = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reference: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    reference: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reference: args.reference,
                }

    return verify.definition.url
            .replace('{reference}', parsedArgs.reference.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::verify
 * @see app/Http/Controllers/SubscriptionController.php:105
 * @route '/subscription/verify/{reference}'
 */
verify.get = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verify.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::verify
 * @see app/Http/Controllers/SubscriptionController.php:105
 * @route '/subscription/verify/{reference}'
 */
verify.head = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verify.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SubscriptionController::verify
 * @see app/Http/Controllers/SubscriptionController.php:105
 * @route '/subscription/verify/{reference}'
 */
    const verifyForm = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verify.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SubscriptionController::verify
 * @see app/Http/Controllers/SubscriptionController.php:105
 * @route '/subscription/verify/{reference}'
 */
        verifyForm.get = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verify.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SubscriptionController::verify
 * @see app/Http/Controllers/SubscriptionController.php:105
 * @route '/subscription/verify/{reference}'
 */
        verifyForm.head = (args: { reference: string | number } | [reference: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verify.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verify.form = verifyForm
/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:201
 * @route '/subscription/cancel'
 */
export const cancel = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:201
 * @route '/subscription/cancel'
 */
cancel.url = (options?: RouteQueryOptions) => {
    return cancel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:201
 * @route '/subscription/cancel'
 */
cancel.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:201
 * @route '/subscription/cancel'
 */
    const cancelForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:201
 * @route '/subscription/cancel'
 */
        cancelForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\SubscriptionController::status
 * @see app/Http/Controllers/SubscriptionController.php:221
 * @route '/api/subscription/status'
 */
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/subscription/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::status
 * @see app/Http/Controllers/SubscriptionController.php:221
 * @route '/api/subscription/status'
 */
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::status
 * @see app/Http/Controllers/SubscriptionController.php:221
 * @route '/api/subscription/status'
 */
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::status
 * @see app/Http/Controllers/SubscriptionController.php:221
 * @route '/api/subscription/status'
 */
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SubscriptionController::status
 * @see app/Http/Controllers/SubscriptionController.php:221
 * @route '/api/subscription/status'
 */
    const statusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SubscriptionController::status
 * @see app/Http/Controllers/SubscriptionController.php:221
 * @route '/api/subscription/status'
 */
        statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SubscriptionController::status
 * @see app/Http/Controllers/SubscriptionController.php:221
 * @route '/api/subscription/status'
 */
        statusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
const SubscriptionController = { show, initiate, verify, cancel, status }

export default SubscriptionController
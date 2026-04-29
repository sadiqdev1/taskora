import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AppealController::show
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/appeal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppealController::show
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppealController::show
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AppealController::show
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AppealController::show
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AppealController::show
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AppealController::show
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
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
* @see \App\Http\Controllers\AppealController::submit
 * @see app/Http/Controllers/AppealController.php:17
 * @route '/appeal'
 */
export const submit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/appeal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AppealController::submit
 * @see app/Http/Controllers/AppealController.php:17
 * @route '/appeal'
 */
submit.url = (options?: RouteQueryOptions) => {
    return submit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppealController::submit
 * @see app/Http/Controllers/AppealController.php:17
 * @route '/appeal'
 */
submit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AppealController::submit
 * @see app/Http/Controllers/AppealController.php:17
 * @route '/appeal'
 */
    const submitForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submit.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AppealController::submit
 * @see app/Http/Controllers/AppealController.php:17
 * @route '/appeal'
 */
        submitForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submit.url(options),
            method: 'post',
        })
    
    submit.form = submitForm
const AppealController = { show, submit }

export default AppealController
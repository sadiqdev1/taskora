import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
const appeal = {
    submit: Object.assign(submit, submit),
}

export default appeal
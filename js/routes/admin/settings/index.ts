import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::save
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
export const save = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

save.definition = {
    methods: ["post"],
    url: '/admin/settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::save
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
save.url = (options?: RouteQueryOptions) => {
    return save.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::save
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
save.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::save
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
    const saveForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: save.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::save
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
        saveForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: save.url(options),
            method: 'post',
        })
    
    save.form = saveForm
const settings = {
    save: Object.assign(save, save),
}

export default settings
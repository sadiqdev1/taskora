import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
const memes = {
    store: Object.assign(store, store),
}

export default memes
import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::tab
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
export const tab = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tab.url(args, options),
    method: 'get',
})

tab.definition = {
    methods: ["get","head"],
    url: '/dashboard/{tab}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::tab
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
tab.url = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tab: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tab: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tab: args.tab,
                }

    return tab.definition.url
            .replace('{tab}', parsedArgs.tab.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::tab
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
tab.get = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tab.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::tab
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
tab.head = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tab.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::tab
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
    const tabForm = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tab.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::tab
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
        tabForm.get = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tab.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::tab
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
        tabForm.head = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tab.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    tab.form = tabForm
const dashboard = {
    tab: Object.assign(tab, tab),
}

export default dashboard
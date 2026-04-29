import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::resolve
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
export const resolve = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

resolve.definition = {
    methods: ["post"],
    url: '/admin/reports/{report}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::resolve
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
resolve.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { report: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { report: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    report: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        report: typeof args.report === 'object'
                ? args.report.id
                : args.report,
                }

    return resolve.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::resolve
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
resolve.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::resolve
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
    const resolveForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resolve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::resolve
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
        resolveForm.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resolve.url(args, options),
            method: 'post',
        })
    
    resolve.form = resolveForm
/**
* @see \App\Http\Controllers\AdminController::dismiss
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
export const dismiss = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dismiss.url(args, options),
    method: 'post',
})

dismiss.definition = {
    methods: ["post"],
    url: '/admin/reports/{report}/dismiss',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::dismiss
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
dismiss.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { report: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { report: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    report: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        report: typeof args.report === 'object'
                ? args.report.id
                : args.report,
                }

    return dismiss.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::dismiss
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
dismiss.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dismiss.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::dismiss
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
    const dismissForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: dismiss.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::dismiss
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
        dismissForm.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: dismiss.url(args, options),
            method: 'post',
        })
    
    dismiss.form = dismissForm
const reports = {
    resolve: Object.assign(resolve, resolve),
dismiss: Object.assign(dismiss, dismiss),
}

export default reports
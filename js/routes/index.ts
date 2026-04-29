import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
 * @see routes/web.php:15
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:15
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:15
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:15
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:15
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:15
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:15
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
 * @see routes/web.php:25
 * @route '/sitemap.xml'
 */
export const sitemap = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sitemap.url(options),
    method: 'get',
})

sitemap.definition = {
    methods: ["get","head"],
    url: '/sitemap.xml',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:25
 * @route '/sitemap.xml'
 */
sitemap.url = (options?: RouteQueryOptions) => {
    return sitemap.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:25
 * @route '/sitemap.xml'
 */
sitemap.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sitemap.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:25
 * @route '/sitemap.xml'
 */
sitemap.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sitemap.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:25
 * @route '/sitemap.xml'
 */
    const sitemapForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: sitemap.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:25
 * @route '/sitemap.xml'
 */
        sitemapForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sitemap.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:25
 * @route '/sitemap.xml'
 */
        sitemapForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: sitemap.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    sitemap.form = sitemapForm
/**
* @see \App\Http\Controllers\AppealController::appeal
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
export const appeal = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appeal.url(options),
    method: 'get',
})

appeal.definition = {
    methods: ["get","head"],
    url: '/appeal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppealController::appeal
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
appeal.url = (options?: RouteQueryOptions) => {
    return appeal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppealController::appeal
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
appeal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appeal.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AppealController::appeal
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
appeal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: appeal.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AppealController::appeal
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
    const appealForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: appeal.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AppealController::appeal
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
        appealForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: appeal.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AppealController::appeal
 * @see app/Http/Controllers/AppealController.php:12
 * @route '/appeal'
 */
        appealForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: appeal.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    appeal.form = appealForm
/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::dashboard
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
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
 * @see routes/web.php:146
 * @route '/help'
 */
export const help = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: help.url(options),
    method: 'get',
})

help.definition = {
    methods: ["get","head"],
    url: '/help',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:146
 * @route '/help'
 */
help.url = (options?: RouteQueryOptions) => {
    return help.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:146
 * @route '/help'
 */
help.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: help.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:146
 * @route '/help'
 */
help.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: help.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:146
 * @route '/help'
 */
    const helpForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: help.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:146
 * @route '/help'
 */
        helpForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: help.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:146
 * @route '/help'
 */
        helpForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: help.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    help.form = helpForm
/**
 * @see routes/web.php:150
 * @route '/upload'
 */
export const upload = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upload.url(options),
    method: 'get',
})

upload.definition = {
    methods: ["get","head"],
    url: '/upload',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:150
 * @route '/upload'
 */
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:150
 * @route '/upload'
 */
upload.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upload.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:150
 * @route '/upload'
 */
upload.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: upload.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:150
 * @route '/upload'
 */
    const uploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: upload.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:150
 * @route '/upload'
 */
        uploadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: upload.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:150
 * @route '/upload'
 */
        uploadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: upload.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
    const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
        profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfileController::profile
 * @see app/Http/Controllers/ProfileController.php:16
 * @route '/profile'
 */
        profileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profile.form = profileForm
/**
* @see \App\Http\Controllers\NotificationController::notifications
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
export const notifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})

notifications.definition = {
    methods: ["get","head"],
    url: '/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificationController::notifications
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
notifications.url = (options?: RouteQueryOptions) => {
    return notifications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::notifications
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
notifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificationController::notifications
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
notifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notifications.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\NotificationController::notifications
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
    const notificationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notifications.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\NotificationController::notifications
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
        notificationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\NotificationController::notifications
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
        notificationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    notifications.form = notificationsForm
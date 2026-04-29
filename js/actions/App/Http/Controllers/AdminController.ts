import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
const index42a740574ecbfbac32f8cc353fc32db9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

index42a740574ecbfbac32f8cc353fc32db9.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
index42a740574ecbfbac32f8cc353fc32db9.url = (options?: RouteQueryOptions) => {
    return index42a740574ecbfbac32f8cc353fc32db9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
index42a740574ecbfbac32f8cc353fc32db9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
index42a740574ecbfbac32f8cc353fc32db9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
    const index42a740574ecbfbac32f8cc353fc32db9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index42a740574ecbfbac32f8cc353fc32db9.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
        index42a740574ecbfbac32f8cc353fc32db9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index42a740574ecbfbac32f8cc353fc32db9.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard'
 */
        index42a740574ecbfbac32f8cc353fc32db9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index42a740574ecbfbac32f8cc353fc32db9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index42a740574ecbfbac32f8cc353fc32db9.form = index42a740574ecbfbac32f8cc353fc32db9Form
    /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
const index402fbd24ba2af96e3a462a9b4a5f632e = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index402fbd24ba2af96e3a462a9b4a5f632e.url(args, options),
    method: 'get',
})

index402fbd24ba2af96e3a462a9b4a5f632e.definition = {
    methods: ["get","head"],
    url: '/dashboard/{tab}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
index402fbd24ba2af96e3a462a9b4a5f632e.url = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return index402fbd24ba2af96e3a462a9b4a5f632e.definition.url
            .replace('{tab}', parsedArgs.tab.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
index402fbd24ba2af96e3a462a9b4a5f632e.get = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index402fbd24ba2af96e3a462a9b4a5f632e.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
index402fbd24ba2af96e3a462a9b4a5f632e.head = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index402fbd24ba2af96e3a462a9b4a5f632e.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
    const index402fbd24ba2af96e3a462a9b4a5f632eForm = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index402fbd24ba2af96e3a462a9b4a5f632e.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
        index402fbd24ba2af96e3a462a9b4a5f632eForm.get = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index402fbd24ba2af96e3a462a9b4a5f632e.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:22
 * @route '/dashboard/{tab}'
 */
        index402fbd24ba2af96e3a462a9b4a5f632eForm.head = (args: { tab: string | number } | [tab: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index402fbd24ba2af96e3a462a9b4a5f632e.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index402fbd24ba2af96e3a462a9b4a5f632e.form = index402fbd24ba2af96e3a462a9b4a5f632eForm

export const index = {
    '/dashboard': index42a740574ecbfbac32f8cc353fc32db9,
    '/dashboard/{tab}': index402fbd24ba2af96e3a462a9b4a5f632e,
}

/**
* @see \App\Http\Controllers\AdminController::stats
 * @see app/Http/Controllers/AdminController.php:33
 * @route '/admin/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/admin/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::stats
 * @see app/Http/Controllers/AdminController.php:33
 * @route '/admin/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::stats
 * @see app/Http/Controllers/AdminController.php:33
 * @route '/admin/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::stats
 * @see app/Http/Controllers/AdminController.php:33
 * @route '/admin/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::stats
 * @see app/Http/Controllers/AdminController.php:33
 * @route '/admin/stats'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::stats
 * @see app/Http/Controllers/AdminController.php:33
 * @route '/admin/stats'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::stats
 * @see app/Http/Controllers/AdminController.php:33
 * @route '/admin/stats'
 */
        statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stats.form = statsForm
/**
* @see \App\Http\Controllers\AdminController::chartData
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
export const chartData = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chartData.url(options),
    method: 'get',
})

chartData.definition = {
    methods: ["get","head"],
    url: '/admin/chart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::chartData
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
chartData.url = (options?: RouteQueryOptions) => {
    return chartData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::chartData
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
chartData.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chartData.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::chartData
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
chartData.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: chartData.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::chartData
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
    const chartDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: chartData.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::chartData
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
        chartDataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: chartData.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::chartData
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
        chartDataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: chartData.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    chartData.form = chartDataForm
/**
* @see \App\Http\Controllers\AdminController::memes
 * @see app/Http/Controllers/AdminController.php:110
 * @route '/admin/memes'
 */
export const memes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: memes.url(options),
    method: 'get',
})

memes.definition = {
    methods: ["get","head"],
    url: '/admin/memes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::memes
 * @see app/Http/Controllers/AdminController.php:110
 * @route '/admin/memes'
 */
memes.url = (options?: RouteQueryOptions) => {
    return memes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::memes
 * @see app/Http/Controllers/AdminController.php:110
 * @route '/admin/memes'
 */
memes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: memes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::memes
 * @see app/Http/Controllers/AdminController.php:110
 * @route '/admin/memes'
 */
memes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: memes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::memes
 * @see app/Http/Controllers/AdminController.php:110
 * @route '/admin/memes'
 */
    const memesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: memes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::memes
 * @see app/Http/Controllers/AdminController.php:110
 * @route '/admin/memes'
 */
        memesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: memes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::memes
 * @see app/Http/Controllers/AdminController.php:110
 * @route '/admin/memes'
 */
        memesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: memes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    memes.form = memesForm
/**
* @see \App\Http\Controllers\AdminController::createMeme
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
export const createMeme = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMeme.url(options),
    method: 'post',
})

createMeme.definition = {
    methods: ["post"],
    url: '/admin/memes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::createMeme
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
createMeme.url = (options?: RouteQueryOptions) => {
    return createMeme.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::createMeme
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
createMeme.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createMeme.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::createMeme
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
    const createMemeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createMeme.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::createMeme
 * @see app/Http/Controllers/AdminController.php:366
 * @route '/admin/memes'
 */
        createMemeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createMeme.url(options),
            method: 'post',
        })
    
    createMeme.form = createMemeForm
/**
* @see \App\Http\Controllers\AdminController::approveMeme
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
export const approveMeme = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveMeme.url(args, options),
    method: 'post',
})

approveMeme.definition = {
    methods: ["post"],
    url: '/admin/memes/{meme}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::approveMeme
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
approveMeme.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return approveMeme.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::approveMeme
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
approveMeme.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveMeme.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::approveMeme
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
    const approveMemeForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approveMeme.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::approveMeme
 * @see app/Http/Controllers/AdminController.php:170
 * @route '/admin/memes/{meme}/approve'
 */
        approveMemeForm.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approveMeme.url(args, options),
            method: 'post',
        })
    
    approveMeme.form = approveMemeForm
/**
* @see \App\Http\Controllers\AdminController::rejectMeme
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
export const rejectMeme = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectMeme.url(args, options),
    method: 'post',
})

rejectMeme.definition = {
    methods: ["post"],
    url: '/admin/memes/{meme}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::rejectMeme
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
rejectMeme.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return rejectMeme.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::rejectMeme
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
rejectMeme.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectMeme.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::rejectMeme
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
    const rejectMemeForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rejectMeme.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::rejectMeme
 * @see app/Http/Controllers/AdminController.php:178
 * @route '/admin/memes/{meme}/reject'
 */
        rejectMemeForm.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rejectMeme.url(args, options),
            method: 'post',
        })
    
    rejectMeme.form = rejectMemeForm
/**
* @see \App\Http\Controllers\AdminController::featureMeme
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
export const featureMeme = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: featureMeme.url(args, options),
    method: 'post',
})

featureMeme.definition = {
    methods: ["post"],
    url: '/admin/memes/{meme}/feature',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::featureMeme
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
featureMeme.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return featureMeme.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::featureMeme
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
featureMeme.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: featureMeme.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::featureMeme
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
    const featureMemeForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: featureMeme.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::featureMeme
 * @see app/Http/Controllers/AdminController.php:186
 * @route '/admin/memes/{meme}/feature'
 */
        featureMemeForm.post = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: featureMeme.url(args, options),
            method: 'post',
        })
    
    featureMeme.form = featureMemeForm
/**
* @see \App\Http\Controllers\AdminController::memeAnalytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
export const memeAnalytics = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: memeAnalytics.url(args, options),
    method: 'get',
})

memeAnalytics.definition = {
    methods: ["get","head"],
    url: '/admin/memes/{meme}/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::memeAnalytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
memeAnalytics.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return memeAnalytics.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::memeAnalytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
memeAnalytics.get = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: memeAnalytics.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::memeAnalytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
memeAnalytics.head = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: memeAnalytics.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::memeAnalytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
    const memeAnalyticsForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: memeAnalytics.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::memeAnalytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
        memeAnalyticsForm.get = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: memeAnalytics.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::memeAnalytics
 * @see app/Http/Controllers/AdminController.php:204
 * @route '/admin/memes/{meme}/analytics'
 */
        memeAnalyticsForm.head = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: memeAnalytics.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    memeAnalytics.form = memeAnalyticsForm
/**
* @see \App\Http\Controllers\AdminController::deleteMeme
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
export const deleteMeme = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMeme.url(args, options),
    method: 'delete',
})

deleteMeme.definition = {
    methods: ["delete"],
    url: '/admin/memes/{meme}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::deleteMeme
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
deleteMeme.url = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return deleteMeme.definition.url
            .replace('{meme}', parsedArgs.meme.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::deleteMeme
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
deleteMeme.delete = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMeme.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdminController::deleteMeme
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
    const deleteMemeForm = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMeme.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::deleteMeme
 * @see app/Http/Controllers/AdminController.php:194
 * @route '/admin/memes/{meme}'
 */
        deleteMemeForm.delete = (args: { meme: number | { id: number } } | [meme: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMeme.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMeme.form = deleteMemeForm
/**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:275
 * @route '/admin/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:275
 * @route '/admin/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:275
 * @route '/admin/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:275
 * @route '/admin/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:275
 * @route '/admin/users'
 */
    const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: users.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:275
 * @route '/admin/users'
 */
        usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::users
 * @see app/Http/Controllers/AdminController.php:275
 * @route '/admin/users'
 */
        usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    users.form = usersForm
/**
* @see \App\Http\Controllers\AdminController::createUser
 * @see app/Http/Controllers/AdminController.php:324
 * @route '/admin/users'
 */
export const createUser = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createUser.url(options),
    method: 'post',
})

createUser.definition = {
    methods: ["post"],
    url: '/admin/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::createUser
 * @see app/Http/Controllers/AdminController.php:324
 * @route '/admin/users'
 */
createUser.url = (options?: RouteQueryOptions) => {
    return createUser.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::createUser
 * @see app/Http/Controllers/AdminController.php:324
 * @route '/admin/users'
 */
createUser.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createUser.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::createUser
 * @see app/Http/Controllers/AdminController.php:324
 * @route '/admin/users'
 */
    const createUserForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createUser.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::createUser
 * @see app/Http/Controllers/AdminController.php:324
 * @route '/admin/users'
 */
        createUserForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createUser.url(options),
            method: 'post',
        })
    
    createUser.form = createUserForm
/**
* @see \App\Http\Controllers\AdminController::updateUser
 * @see app/Http/Controllers/AdminController.php:308
 * @route '/admin/users/{user}'
 */
export const updateUser = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateUser.url(args, options),
    method: 'patch',
})

updateUser.definition = {
    methods: ["patch"],
    url: '/admin/users/{user}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminController::updateUser
 * @see app/Http/Controllers/AdminController.php:308
 * @route '/admin/users/{user}'
 */
updateUser.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return updateUser.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateUser
 * @see app/Http/Controllers/AdminController.php:308
 * @route '/admin/users/{user}'
 */
updateUser.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateUser.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminController::updateUser
 * @see app/Http/Controllers/AdminController.php:308
 * @route '/admin/users/{user}'
 */
    const updateUserForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateUser.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateUser
 * @see app/Http/Controllers/AdminController.php:308
 * @route '/admin/users/{user}'
 */
        updateUserForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateUser.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateUser.form = updateUserForm
/**
* @see \App\Http\Controllers\AdminController::deleteUser
 * @see app/Http/Controllers/AdminController.php:402
 * @route '/admin/users/{user}'
 */
export const deleteUser = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteUser.url(args, options),
    method: 'delete',
})

deleteUser.definition = {
    methods: ["delete"],
    url: '/admin/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::deleteUser
 * @see app/Http/Controllers/AdminController.php:402
 * @route '/admin/users/{user}'
 */
deleteUser.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return deleteUser.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::deleteUser
 * @see app/Http/Controllers/AdminController.php:402
 * @route '/admin/users/{user}'
 */
deleteUser.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteUser.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdminController::deleteUser
 * @see app/Http/Controllers/AdminController.php:402
 * @route '/admin/users/{user}'
 */
    const deleteUserForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteUser.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::deleteUser
 * @see app/Http/Controllers/AdminController.php:402
 * @route '/admin/users/{user}'
 */
        deleteUserForm.delete = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteUser.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteUser.form = deleteUserForm
/**
* @see \App\Http\Controllers\AdminController::reports
 * @see app/Http/Controllers/AdminController.php:415
 * @route '/admin/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/admin/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::reports
 * @see app/Http/Controllers/AdminController.php:415
 * @route '/admin/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::reports
 * @see app/Http/Controllers/AdminController.php:415
 * @route '/admin/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::reports
 * @see app/Http/Controllers/AdminController.php:415
 * @route '/admin/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::reports
 * @see app/Http/Controllers/AdminController.php:415
 * @route '/admin/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::reports
 * @see app/Http/Controllers/AdminController.php:415
 * @route '/admin/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::reports
 * @see app/Http/Controllers/AdminController.php:415
 * @route '/admin/reports'
 */
        reportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reports.form = reportsForm
/**
* @see \App\Http\Controllers\AdminController::resolveReport
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
export const resolveReport = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveReport.url(args, options),
    method: 'post',
})

resolveReport.definition = {
    methods: ["post"],
    url: '/admin/reports/{report}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::resolveReport
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
resolveReport.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return resolveReport.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::resolveReport
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
resolveReport.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolveReport.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::resolveReport
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
    const resolveReportForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resolveReport.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::resolveReport
 * @see app/Http/Controllers/AdminController.php:443
 * @route '/admin/reports/{report}/resolve'
 */
        resolveReportForm.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resolveReport.url(args, options),
            method: 'post',
        })
    
    resolveReport.form = resolveReportForm
/**
* @see \App\Http\Controllers\AdminController::dismissReport
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
export const dismissReport = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dismissReport.url(args, options),
    method: 'post',
})

dismissReport.definition = {
    methods: ["post"],
    url: '/admin/reports/{report}/dismiss',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::dismissReport
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
dismissReport.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return dismissReport.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::dismissReport
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
dismissReport.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: dismissReport.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::dismissReport
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
    const dismissReportForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: dismissReport.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::dismissReport
 * @see app/Http/Controllers/AdminController.php:451
 * @route '/admin/reports/{report}/dismiss'
 */
        dismissReportForm.post = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: dismissReport.url(args, options),
            method: 'post',
        })
    
    dismissReport.form = dismissReportForm
/**
* @see \App\Http\Controllers\AdminController::feedback
 * @see app/Http/Controllers/AdminController.php:461
 * @route '/admin/feedback'
 */
export const feedback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feedback.url(options),
    method: 'get',
})

feedback.definition = {
    methods: ["get","head"],
    url: '/admin/feedback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::feedback
 * @see app/Http/Controllers/AdminController.php:461
 * @route '/admin/feedback'
 */
feedback.url = (options?: RouteQueryOptions) => {
    return feedback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::feedback
 * @see app/Http/Controllers/AdminController.php:461
 * @route '/admin/feedback'
 */
feedback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feedback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::feedback
 * @see app/Http/Controllers/AdminController.php:461
 * @route '/admin/feedback'
 */
feedback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feedback.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::feedback
 * @see app/Http/Controllers/AdminController.php:461
 * @route '/admin/feedback'
 */
    const feedbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: feedback.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::feedback
 * @see app/Http/Controllers/AdminController.php:461
 * @route '/admin/feedback'
 */
        feedbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feedback.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::feedback
 * @see app/Http/Controllers/AdminController.php:461
 * @route '/admin/feedback'
 */
        feedbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feedback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    feedback.form = feedbackForm
/**
* @see \App\Http\Controllers\AdminController::updateFeedback
 * @see app/Http/Controllers/AdminController.php:490
 * @route '/admin/feedback/{feedback}'
 */
export const updateFeedback = (args: { feedback: number | { id: number } } | [feedback: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateFeedback.url(args, options),
    method: 'patch',
})

updateFeedback.definition = {
    methods: ["patch"],
    url: '/admin/feedback/{feedback}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminController::updateFeedback
 * @see app/Http/Controllers/AdminController.php:490
 * @route '/admin/feedback/{feedback}'
 */
updateFeedback.url = (args: { feedback: number | { id: number } } | [feedback: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feedback: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { feedback: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    feedback: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        feedback: typeof args.feedback === 'object'
                ? args.feedback.id
                : args.feedback,
                }

    return updateFeedback.definition.url
            .replace('{feedback}', parsedArgs.feedback.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateFeedback
 * @see app/Http/Controllers/AdminController.php:490
 * @route '/admin/feedback/{feedback}'
 */
updateFeedback.patch = (args: { feedback: number | { id: number } } | [feedback: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateFeedback.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminController::updateFeedback
 * @see app/Http/Controllers/AdminController.php:490
 * @route '/admin/feedback/{feedback}'
 */
    const updateFeedbackForm = (args: { feedback: number | { id: number } } | [feedback: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFeedback.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateFeedback
 * @see app/Http/Controllers/AdminController.php:490
 * @route '/admin/feedback/{feedback}'
 */
        updateFeedbackForm.patch = (args: { feedback: number | { id: number } } | [feedback: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFeedback.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateFeedback.form = updateFeedbackForm
/**
* @see \App\Http\Controllers\AdminController::adminNotifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
export const adminNotifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminNotifications.url(options),
    method: 'get',
})

adminNotifications.definition = {
    methods: ["get","head"],
    url: '/admin/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::adminNotifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
adminNotifications.url = (options?: RouteQueryOptions) => {
    return adminNotifications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::adminNotifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
adminNotifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: adminNotifications.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::adminNotifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
adminNotifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: adminNotifications.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::adminNotifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
    const adminNotificationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: adminNotifications.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::adminNotifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
        adminNotificationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: adminNotifications.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::adminNotifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
        adminNotificationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: adminNotifications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    adminNotifications.form = adminNotificationsForm
/**
* @see \App\Http\Controllers\AdminController::markNotificationRead
 * @see app/Http/Controllers/AdminController.php:598
 * @route '/admin/notifications/{notification}/read'
 */
export const markNotificationRead = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markNotificationRead.url(args, options),
    method: 'post',
})

markNotificationRead.definition = {
    methods: ["post"],
    url: '/admin/notifications/{notification}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::markNotificationRead
 * @see app/Http/Controllers/AdminController.php:598
 * @route '/admin/notifications/{notification}/read'
 */
markNotificationRead.url = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return markNotificationRead.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::markNotificationRead
 * @see app/Http/Controllers/AdminController.php:598
 * @route '/admin/notifications/{notification}/read'
 */
markNotificationRead.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markNotificationRead.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::markNotificationRead
 * @see app/Http/Controllers/AdminController.php:598
 * @route '/admin/notifications/{notification}/read'
 */
    const markNotificationReadForm = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markNotificationRead.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::markNotificationRead
 * @see app/Http/Controllers/AdminController.php:598
 * @route '/admin/notifications/{notification}/read'
 */
        markNotificationReadForm.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markNotificationRead.url(args, options),
            method: 'post',
        })
    
    markNotificationRead.form = markNotificationReadForm
/**
* @see \App\Http\Controllers\AdminController::markAllNotificationsRead
 * @see app/Http/Controllers/AdminController.php:605
 * @route '/admin/notifications/read-all'
 */
export const markAllNotificationsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllNotificationsRead.url(options),
    method: 'post',
})

markAllNotificationsRead.definition = {
    methods: ["post"],
    url: '/admin/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::markAllNotificationsRead
 * @see app/Http/Controllers/AdminController.php:605
 * @route '/admin/notifications/read-all'
 */
markAllNotificationsRead.url = (options?: RouteQueryOptions) => {
    return markAllNotificationsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::markAllNotificationsRead
 * @see app/Http/Controllers/AdminController.php:605
 * @route '/admin/notifications/read-all'
 */
markAllNotificationsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllNotificationsRead.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::markAllNotificationsRead
 * @see app/Http/Controllers/AdminController.php:605
 * @route '/admin/notifications/read-all'
 */
    const markAllNotificationsReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllNotificationsRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::markAllNotificationsRead
 * @see app/Http/Controllers/AdminController.php:605
 * @route '/admin/notifications/read-all'
 */
        markAllNotificationsReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllNotificationsRead.url(options),
            method: 'post',
        })
    
    markAllNotificationsRead.form = markAllNotificationsReadForm
/**
* @see \App\Http\Controllers\AdminController::getSettings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
export const getSettings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSettings.url(options),
    method: 'get',
})

getSettings.definition = {
    methods: ["get","head"],
    url: '/admin/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::getSettings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
getSettings.url = (options?: RouteQueryOptions) => {
    return getSettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::getSettings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
getSettings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSettings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::getSettings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
getSettings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSettings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::getSettings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
    const getSettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getSettings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::getSettings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
        getSettingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSettings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::getSettings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
        getSettingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getSettings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getSettings.form = getSettingsForm
/**
* @see \App\Http\Controllers\AdminController::saveSettings
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
export const saveSettings = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSettings.url(options),
    method: 'post',
})

saveSettings.definition = {
    methods: ["post"],
    url: '/admin/settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::saveSettings
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
saveSettings.url = (options?: RouteQueryOptions) => {
    return saveSettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::saveSettings
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
saveSettings.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSettings.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::saveSettings
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
    const saveSettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveSettings.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::saveSettings
 * @see app/Http/Controllers/AdminController.php:619
 * @route '/admin/settings'
 */
        saveSettingsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveSettings.url(options),
            method: 'post',
        })
    
    saveSettings.form = saveSettingsForm
/**
* @see \App\Http\Controllers\AdminController::trendingAdmin
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
export const trendingAdmin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trendingAdmin.url(options),
    method: 'get',
})

trendingAdmin.definition = {
    methods: ["get","head"],
    url: '/admin/trending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::trendingAdmin
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
trendingAdmin.url = (options?: RouteQueryOptions) => {
    return trendingAdmin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::trendingAdmin
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
trendingAdmin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trendingAdmin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::trendingAdmin
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
trendingAdmin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trendingAdmin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::trendingAdmin
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
    const trendingAdminForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: trendingAdmin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::trendingAdmin
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
        trendingAdminForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: trendingAdmin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::trendingAdmin
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
        trendingAdminForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: trendingAdmin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    trendingAdmin.form = trendingAdminForm
/**
* @see \App\Http\Controllers\AdminController::recentActivity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
export const recentActivity = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recentActivity.url(options),
    method: 'get',
})

recentActivity.definition = {
    methods: ["get","head"],
    url: '/admin/activity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::recentActivity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
recentActivity.url = (options?: RouteQueryOptions) => {
    return recentActivity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::recentActivity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
recentActivity.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recentActivity.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::recentActivity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
recentActivity.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recentActivity.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::recentActivity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
    const recentActivityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: recentActivity.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::recentActivity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
        recentActivityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recentActivity.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::recentActivity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
        recentActivityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: recentActivity.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    recentActivity.form = recentActivityForm
const AdminController = { index, stats, chartData, memes, createMeme, approveMeme, rejectMeme, featureMeme, memeAnalytics, deleteMeme, users, createUser, updateUser, deleteUser, reports, resolveReport, dismissReport, feedback, updateFeedback, adminNotifications, markNotificationRead, markAllNotificationsRead, getSettings, saveSettings, trendingAdmin, recentActivity }

export default AdminController
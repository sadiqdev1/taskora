import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import memesE24b75 from './memes'
import users48860f from './users'
import reports3613d0 from './reports'
import feedback621f6b from './feedback'
import notifications1ce82a from './notifications'
import settings69f00b from './settings'
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
* @see \App\Http\Controllers\AdminController::chart
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
export const chart = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chart.url(options),
    method: 'get',
})

chart.definition = {
    methods: ["get","head"],
    url: '/admin/chart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::chart
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
chart.url = (options?: RouteQueryOptions) => {
    return chart.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::chart
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
chart.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chart.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::chart
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
chart.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: chart.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::chart
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
    const chartForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: chart.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::chart
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
        chartForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: chart.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::chart
 * @see app/Http/Controllers/AdminController.php:39
 * @route '/admin/chart'
 */
        chartForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: chart.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    chart.form = chartForm
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
* @see \App\Http\Controllers\AdminController::notifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
export const notifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})

notifications.definition = {
    methods: ["get","head"],
    url: '/admin/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::notifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
notifications.url = (options?: RouteQueryOptions) => {
    return notifications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::notifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
notifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::notifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
notifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notifications.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::notifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
    const notificationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notifications.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::notifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
 */
        notificationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::notifications
 * @see app/Http/Controllers/AdminController.php:500
 * @route '/admin/notifications'
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
/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
export const settings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

settings.definition = {
    methods: ["get","head"],
    url: '/admin/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
    const settingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: settings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
        settingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::settings
 * @see app/Http/Controllers/AdminController.php:613
 * @route '/admin/settings'
 */
        settingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    settings.form = settingsForm
/**
* @see \App\Http\Controllers\AdminController::trending
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
export const trending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trending.url(options),
    method: 'get',
})

trending.definition = {
    methods: ["get","head"],
    url: '/admin/trending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::trending
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
trending.url = (options?: RouteQueryOptions) => {
    return trending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::trending
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
trending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: trending.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::trending
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
trending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: trending.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::trending
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
    const trendingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: trending.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::trending
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
 */
        trendingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: trending.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::trending
 * @see app/Http/Controllers/AdminController.php:640
 * @route '/admin/trending'
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
* @see \App\Http\Controllers\AdminController::activity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
export const activity = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activity.url(options),
    method: 'get',
})

activity.definition = {
    methods: ["get","head"],
    url: '/admin/activity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::activity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
activity.url = (options?: RouteQueryOptions) => {
    return activity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::activity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
activity.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activity.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::activity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
activity.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: activity.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::activity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
    const activityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: activity.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::activity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
        activityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activity.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::activity
 * @see app/Http/Controllers/AdminController.php:669
 * @route '/admin/activity'
 */
        activityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activity.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    activity.form = activityForm
const admin = {
    stats: Object.assign(stats, stats),
chart: Object.assign(chart, chart),
memes: Object.assign(memes, memesE24b75),
users: Object.assign(users, users48860f),
reports: Object.assign(reports, reports3613d0),
feedback: Object.assign(feedback, feedback621f6b),
notifications: Object.assign(notifications, notifications1ce82a),
settings: Object.assign(settings, settings69f00b),
trending: Object.assign(trending, trending),
activity: Object.assign(activity, activity),
}

export default admin
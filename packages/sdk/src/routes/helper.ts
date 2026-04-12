import {
    IInRoute,
    IRoute,
    IRouteItem,
    IRouteParam,
    IRoutil,
} from '@/utils/interfaces';
import routes from '../routes/routes';

const DASHBOARD_ROUTE = '/dashboard';

const WORKSPACE_ROUTE = '/workspace';
const CLEAN_PATH_PREFIXES = [
    WORKSPACE_ROUTE,
    '/hackathon',
    '/challenge',
    '/apprenticeship',
    '/my-inbox',
    '/domains',
    '/members',
    '/settings',
    '/upgrade-plan',
    '/search',
    '/workshops',
    '/challenges',
    '/mentors',
    '/product',
    '/help',
    '/security',
    '/notifications',
    '/team-settings',
    '/team-members',
    '/templates',
    '/whats-new',
    '/roadmap',
    '/feature-requests',
    '/get-started',
    '/how-to-guides',
    '/help-center',
    '/trash',
    '/b',
    '/t',
];

const getHackathonPath = (slug: string, tab?: string): string => {
    if (tab) return `/hackathon/${slug}/${tab}`;
    return `/hackathon/${slug}`;
};

const getProjectPath = (slug: string, segment?: 'edit'): string => {
    if (segment === 'edit') return `/apprenticeship/${slug}/edit`;
    return `/apprenticeship/${slug}`;
};

const getChallengePath = (slug: string, segment?: 'edit'): string => {
    if (segment === 'edit') return `/challenge/${slug}/edit`;
    return `/challenge/${slug}`;
};

const computeAppRoute = (route: IRoute): string => {
    let result: string = '';

    if (route.params && route.params.length > 0) {
        const resolved = resolveRouteParams(route.params, 'app');
        result = `${route.url}${resolved}`;
    } else {
        result = route.url;
    }

    return result;
};

const computePath = (route: string): string => {
    if (route === '/dashboard') {
        return route;
    }
    if (
        CLEAN_PATH_PREFIXES.some(
            (prefix) => route === prefix || route.startsWith(prefix + '/'),
        )
    ) {
        return route;
    }
    return DASHBOARD_ROUTE + route;
};

const computeSubPath = (route: IRoute, subroute: IRouteItem): string => {
    const resolved = resolveRouteParams(
        subroute.params ? subroute.params : [],
        'app',
    );

    if (route.name === 'workspace') {
        if (subroute.name === 'my-hackathons') return '/hackathon' + resolved;
        if (subroute.name === 'my-challenges') return '/challenge' + resolved;
        if (subroute.name === 'my-projects')
            return '/apprenticeship' + resolved;
        return route.url + subroute.url + resolved;
    }

    if (route.name === 'business' || route.name === 'talent') {
        return subroute.url + resolved;
    }
    if (route.name === 'product') {
        return '/product' + subroute.url + resolved;
    }
    if (route.name === 'help') {
        return '/help' + subroute.url + resolved;
    }
    if (route.name === 'settings' && route.url === '/settings') {
        return '/settings' + subroute.url + resolved;
    }

    let result = DASHBOARD_ROUTE;
    if (result === route.url) {
        result = result + subroute.url + resolved;
    } else {
        result = result + route.url + subroute.url + resolved;
    }
    return result;
};

const computeInPath = (inroute: IInRoute): string => {
    const resolved = resolveRouteParams(
        inroute.params ? inroute.params : [],
        'app',
    );
    const route = routes.find((x) => x.name === inroute.route);

    if (route?.name === 'workspace' && inroute.parent) {
        if (inroute.parent === 'my-hackathons')
            return '/hackathon' + inroute.url + resolved;
        if (inroute.parent === 'my-challenges')
            return '/challenge' + inroute.url + resolved;
        if (inroute.parent === 'my-projects')
            return '/apprenticeship' + inroute.url + resolved;
        return (
            route.url +
            (route.subroutes?.find((m) => m.name === inroute.parent)?.url ??
                '') +
            inroute.url +
            resolved
        );
    }

    let result: string = DASHBOARD_ROUTE;
    if (route && route.subroutes && route.subroutes.length > 0) {
        const subroute = route.subroutes.find(
            (m: IRouteItem) => m.name === inroute.parent,
        );

        if (subroute) {
            const merged =
                subroute.url === inroute.url
                    ? subroute.url
                    : subroute.url + inroute.url;
            result = result + route.url + merged + resolved;
        } else {
            result = result + route.url + inroute.url + resolved;
        }
    } else if (
        route &&
        (!route.subroutes || route.subroutes.length === 0) &&
        route.inroutes &&
        route.inroutes.length > 0
    ) {
        result = result + route.url + inroute.url + resolved;
    }

    return result;
};

const resolveRouteParams = (
    params: Array<IRouteParam>,
    stickTo: 'app' | 'page',
): string => {
    // PRODUCE =>  '/topics/path/path1/:url/:url2?type=success'
    let path: string = '',
        urlParam: string = '',
        queryParam: string = '?';
    let result: string = '';

    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        if (!param) continue;

        if (param.type === 'path') {
            path = path + `/${param.value ? param.value : param.name}`;
        }

        if (param.type === 'url' && stickTo === 'app') {
            urlParam = urlParam + `/:${param.name}`;
        }

        if (param.type === 'url' && stickTo === 'page') {
            urlParam = urlParam + `/${param.value}`;
        }

        if (param.type === 'query' && param.value && stickTo === 'page') {
            queryParam = queryParam + `${param.name}=${param.value}`;
        }
    }

    if (queryParam === '?') {
        result = path + urlParam;
    } else {
        result = path + urlParam + queryParam;
    }

    return result;
};

const inRoute = (payload: {
    route: string;
    name: string;
    params?: Array<IRouteParam>;
}): string => {
    const { route, name, params } = payload;
    const slugParam = params?.find(
        (p) =>
            p.type === 'url' &&
            (p.name === 'id' || p.name === 'slug' || p.name === 'details') &&
            p.value,
    ) as IRouteParam | undefined;
    const slug = slugParam?.value;

    if (route === 'workspace' && slug) {
        if (name === 'hackathon-details') return getHackathonPath(slug);
        if (name === 'edit-hackathon') return getHackathonPath(slug, 'edit');
        if (name === 'project-details') return getProjectPath(slug);
        if (name === 'project-editor') return getProjectPath(slug, 'edit');
        if (name === 'challenge-details') return getChallengePath(slug);
        if (name === 'edit-challenge') return getChallengePath(slug, 'edit');
    }

    let result = DASHBOARD_ROUTE;
    const resolved = resolveRouteParams(params ? params : [], 'page');
    const _route = routes.find((x) => x.name === route);

    if (_route?.name === 'workspace' && _route.subroutes && _route.inroutes) {
        const inroute = _route.inroutes.find((m: IInRoute) => m.name === name);
        if (inroute?.parent === 'my-hackathons')
            return '/hackathon' + inroute.url + resolved;
        if (inroute?.parent === 'my-challenges')
            return '/challenge' + inroute.url + resolved;
        if (inroute?.parent === 'my-projects')
            return '/apprenticeship' + inroute.url + resolved;
    }

    if (_route && _route.inroutes && _route.inroutes.length > 0) {
        const inroute = _route.inroutes.find((m: IInRoute) => m.name === name);

        if (inroute && _route.subroutes && _route.subroutes.length > 0) {
            const subroute = _route.subroutes.find(
                (z: IRouteItem) => z.name === inroute.parent,
            );

            if (subroute) {
                const merged =
                    subroute.url === inroute.url
                        ? subroute.url
                        : subroute.url + inroute.url;
                result = result + _route.url + merged + resolved;
            } else {
                result = result + _route.url + inroute.url + resolved;
            }
        } else if (inroute) {
            result = result + _route.url + inroute.url + resolved;
        }
    } else if (_route && _route.subroutes && _route.subroutes.length > 0) {
        const subroute = _route.subroutes.find(
            (z: IRouteItem) => z.name === name,
        );

        if (subroute) {
            const merged = subroute.url;
            result = result + merged + resolved;
        }
    }

    return result;
};

const routil: IRoutil = {
    computePath: computePath,
    computeSubPath: computeSubPath,
    computeInPath: computeInPath,
    computeAppRoute: computeAppRoute,
    inRoute: inRoute,
    resolveRouteParams: resolveRouteParams,
    getHackathonPath,
    getProjectPath,
    getChallengePath,
};

export default routil;
export { getHackathonPath, getProjectPath, getChallengePath };

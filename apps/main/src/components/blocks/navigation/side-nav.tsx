import React, { useMemo, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarMenuAction,
    SidebarRail,
    useSidebar,
} from '@pacepard/ui/components/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@pacepard/ui/components/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@pacepard/ui/components/dropdown-menu';
import {
    ChevronRight,
    ChevronDown,
    Plus,
    TrendingUp,
    Trophy,
    Zap,
    Folder,
    List,
    HelpCircle,
    Circle,
    Box,
    FileText,
    Sparkles,
    Map,
    Lightbulb,
    Play,
    Book,
    LifeBuoy,
    Trash2,
    MoreHorizontal,
    Share2,
    Home,
    Mail,
    Users,
    User,
    Briefcase,
    Building2,
    Settings,
    CreditCard,
    ShoppingBag,
    Gift,
    Star,
    Shield,
    Bell,
    Search,
    Contact,
    Code,
    Pencil,
    Globe,
    type LucideIcon,
} from 'lucide-react';
import {
    routes,
    routil,
    type IRoute,
    type IRouteItem,
    type IInRoute,
    UserType,
    UserContext,
    AppContext,
} from '@pacepard/sdk';
import { NavUser } from '@/components/blocks/navigation/nav-user';
import { cn } from '@pacepard/ui/lib/utils';

// Icon mapping helper
const getIcon = (iconName?: string): LucideIcon | null => {
    if (!iconName) return null;

    const iconMap: Record<string, LucideIcon> = {
        chart: TrendingUp,
        trophy: Trophy,
        zap: Zap,
        lightning: Zap,
        folder: Folder,
        nav: List,
        list: List,
        question: HelpCircle,
        help: HelpCircle,
        circle: Circle,
        'layout-right': Box,
        product: Box,
        // Product route icons
        templates: FileText,
        filetext: FileText,
        'whats-new': Sparkles,
        sparkle: Sparkles,
        roadmap: Map,
        maptrifold: Map,
        map: Map,
        'feature-requests': Lightbulb,
        lightbulb: Lightbulb,
        // Help route icons
        'get-started': Play,
        play: Play,
        'how-to-guides': Book,
        book: Book,
        'help-center': LifeBuoy,
        lifebuoy: LifeBuoy,
        trash: Trash2,
        // Common navigation icons
        home: Home,
        house: Home,
        inbox: Mail,
        envelope: Mail,
        message: Mail,
        messages: Mail,
        users: Users,
        user: User,
        briefcase: Briefcase,
        buildings: Building2,
        building: Building2,
        settings: Settings,
        gear: Settings,
        'credit-card': CreditCard,
        creditcard: CreditCard,
        'shopping-bag': ShoppingBag,
        shoppingbag: ShoppingBag,
        gift: Gift,
        star: Star,
        shield: Shield,
        bell: Bell,
        search: Search,
        magnifyingglass: Search,
        workshops: Code,
        workshop: Code,
        challenges: Zap,
        mentors: Users,
        'upgrade-plan': Trophy,
        domains: Globe,
        members: Contact,
        edit: Pencil,
        pencil: Pencil,
        create: Plus,
    };

    const IconComponent = iconMap[iconName.toLowerCase()];
    return IconComponent || null;
};

interface ISideBar {
    props?: React.ComponentProps<typeof Sidebar>;
}

const AppSidebar = (data: ISideBar) => {
    const { ...props } = data;
    const navigate = useNavigate();
    const location = useLocation();
    const { isMobile } = useSidebar();
    const userContext = useContext(UserContext) as any;
    const appContext = useContext(AppContext) as any;
    const { user, userType, sidebar } = userContext || {};
    const { hackathons, projects } = appContext || {};

    // Convert string userType to UserType enum
    const currentUserType = useMemo(() => {
        const type = (userType || (user as any)?.userType || '').toLowerCase();
        if (type === 'talent') return UserType.TALENT;
        if (type === 'admin' || type === 'super') return UserType.ADMIN;
        if (type === 'business') return UserType.BUSINESS;
        return UserType.BUSINESS; // Default fallback
    }, [userType, user]);

    // Admin route names for filtering (all routes that should be visible to admin users)
    const adminRouteNames = new Set([
        'admin',
        'users',
        'hackathons',
        'admin-settings',
        'resources',
        'referrals',
        'payments',
        'account',
        'support',
    ]);

    // Filter routes based on user type - get routes that match current user type
    const filteredRoutes = useMemo(() => {
        return routes.filter((route: IRoute) => {
            if (!route.isAuth) return false;

            // Filter by route name matching user type
            const routeName = route.name.toLowerCase();
            const userTypeString = String(currentUserType).toLowerCase();

            // Match talent routes for talent users
            if (routeName === 'talent' && userTypeString === 'talent')
                return true;

            // Match admin routes for admin users (include all admin routes)
            if (
                currentUserType === UserType.ADMIN &&
                adminRouteNames.has(routeName)
            )
                return true;

            // Match business routes for business users
            if (routeName === 'business' && userTypeString === 'business')
                return true;

            return false;
        });
    }, [currentUserType]);

    // Filter workspace routes (available for all authenticated users)
    const workspaceRoutes = useMemo(() => {
        return routes.filter((route: IRoute) => {
            return route.isAuth && route.name.toLowerCase() === 'workspace';
        });
    }, []);

    // Filter product routes (available for all authenticated users)
    const productRoutes = useMemo(() => {
        return routes.filter((route: IRoute) => {
            return route.isAuth && route.name.toLowerCase() === 'product';
        });
    }, []);

    // Filter help routes (available for all authenticated users)
    const helpRoutes = useMemo(() => {
        return routes.filter((route: IRoute) => {
            return route.isAuth && route.name.toLowerCase() === 'help';
        });
    }, []);

    // Get user data for NavUser
    const userData = useMemo(() => {
        const userObj = user as any;
        // Split name if only full name is available
        const fullName = userObj?.name || userObj?.email || 'Damola Oladipo';
        const nameParts = fullName.split(' ');

        return {
            firstName: userObj?.firstName || nameParts[0] || 'Damola Oladipo',
            lastName: userObj?.lastName || nameParts.slice(1).join(' ') || '',
            email: userObj?.email || '',
            avatar:
                userObj?.avatar ||
                userObj?.profilePicture ||
                '/blocks/pacepard-icon.svg',
        };
    }, [user]);

    // Handle route navigation
    const handleRouteClick = (route: IRoute, subroute?: IRouteItem) => {
        if (subroute) {
            const path = routil.computeSubPath(route, subroute);
            navigate(path);
        } else if (route.action === 'navigate') {
            const path = routil.computePath(route.url);
            navigate(path);
        } else if (route.action === 'open-secondary') {
            const path = routil.computePath(route.url);
            navigate(path);
        }
    };

    // Check if route is active
    const isRouteActive = (route: IRoute, subroute?: IRouteItem) => {
        const currentPath = location.pathname;
        if (subroute) {
            const subPath = routil.computeSubPath(route, subroute);
            return (
                currentPath === subPath || currentPath.startsWith(subPath + '/')
            );
        }
        const routePath = routil.computePath(route.url);
        return (
            currentPath === routePath || currentPath.startsWith(routePath + '/')
        );
    };

    return (
        <Sidebar collapsible="icon" className="overflow-hidden" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <NavUser user={userData} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {filteredRoutes.map((route: IRoute) => (
                    <SidebarGroup key={route.name}>
                        {route.subroutes && route.subroutes.length > 0 ? (
                            <Collapsible
                                defaultOpen={route.content.collapsed === false}
                                className="group/collapsible"
                            >
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        {/* <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                onClick={() => handleRouteClick(route)}
                                                isActive={isRouteActive(route)}
                                            >
                                                <span>{route.title || route.name}</span>
                                                <CaretRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger> */}
                                        <CollapsibleContent>
                                            <SidebarMenuSub className="border-l-0 mx-0 px-0 ml-0 pl-0 translate-x-0">
                                                {route.subroutes
                                                    ?.filter(
                                                        (sr) =>
                                                            sr.name !==
                                                            'divider',
                                                    )
                                                    .map((subroute) => (
                                                        <SidebarMenuSubItem
                                                            key={subroute.name}
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                onClick={() =>
                                                                    handleRouteClick(
                                                                        route,
                                                                        subroute,
                                                                    )
                                                                }
                                                                isActive={isRouteActive(
                                                                    route,
                                                                    subroute,
                                                                )}
                                                                className={
                                                                    isRouteActive(
                                                                        route,
                                                                        subroute,
                                                                    )
                                                                        ? 'data-[active=true]:text-green-700 [&>span]:data-[active=true]:text-green-700'
                                                                        : ''
                                                                }
                                                            >
                                                                <a
                                                                    href={routil.computeSubPath(
                                                                        route,
                                                                        subroute,
                                                                    )}
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        handleRouteClick(
                                                                            route,
                                                                            subroute,
                                                                        );
                                                                    }}
                                                                >
                                                                    {(() => {
                                                                        const IconComponent =
                                                                            getIcon(
                                                                                subroute.iconName,
                                                                            );
                                                                        return IconComponent ? (
                                                                            <IconComponent className="h-4 w-4" />
                                                                        ) : null;
                                                                    })()}
                                                                    <span>
                                                                        {subroute.title ||
                                                                            subroute.name}
                                                                    </span>
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </Collapsible>
                        ) : (
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        onClick={() => handleRouteClick(route)}
                                        isActive={isRouteActive(route)}
                                        className={
                                            isRouteActive(route)
                                                ? 'data-[active=true]:text-green-700 [&>span]:data-[active=true]:text-green-700'
                                                : ''
                                        }
                                    >
                                        <a
                                            href={routil.computePath(route.url)}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRouteClick(route);
                                            }}
                                        >
                                            <span>
                                                {route.title || route.name}
                                            </span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        )}
                    </SidebarGroup>
                ))}

                {/* Workspace Routes - Available for all authenticated users - Not Collapsible */}
                {workspaceRoutes.map((route: IRoute) => {
                    // Get inroutes for this workspace route
                    const routeInroutes = route.inroutes || [];

                    // Create dynamic inroutes from state collections
                    const dynamicInroutes: IInRoute[] = useMemo(() => {
                        const dynamic: IInRoute[] = [];

                        // Add hackathons
                        if (
                            hackathons?.data &&
                            Array.isArray(hackathons.data)
                        ) {
                            hackathons.data.forEach((hackathon: any) => {
                                dynamic.push({
                                    route: 'workspace',
                                    parent: 'my-hackathons',
                                    name: `hackathon-${hackathon.slug || hackathon._id}`,
                                    title:
                                        hackathon.name || 'Untitled Hackathon',
                                    url: `/${hackathon.slug || hackathon._id}`,
                                    action: 'navigate',
                                    isAuth: true,
                                    params: [
                                        {
                                            type: 'url',
                                            name: 'slug',
                                            value:
                                                hackathon.slug || hackathon._id,
                                        },
                                    ],
                                    content: { collapsed: false },
                                    iconName: 'trophy',
                                });
                            });
                        }

                        // Add projects/apprenticeships (non-challenge projects)
                        if (projects?.data && Array.isArray(projects.data)) {
                            projects.data
                                .filter((project: any) => !project.isChallenge)
                                .forEach((project: any) => {
                                    dynamic.push({
                                        route: 'workspace',
                                        parent: 'my-projects',
                                        name: `project-${project.slug || project._id}`,
                                        title:
                                            project.title ||
                                            project.name ||
                                            'Untitled Project',
                                        url: `/${project.slug || project._id}`,
                                        action: 'navigate',
                                        isAuth: true,
                                        params: [
                                            {
                                                type: 'url',
                                                name: 'slug',
                                                value:
                                                    project.slug || project._id,
                                            },
                                        ],
                                        content: { collapsed: false },
                                        iconName: 'folder',
                                    });
                                });
                        }

                        // Add challenges (projects with isChallenge flag)
                        if (projects?.data && Array.isArray(projects.data)) {
                            projects.data
                                .filter(
                                    (project: any) =>
                                        project.isChallenge === true,
                                )
                                .forEach((challenge: any) => {
                                    dynamic.push({
                                        route: 'workspace',
                                        parent: 'my-challenges',
                                        name: `challenge-${challenge.slug || challenge._id}`,
                                        title:
                                            challenge.title ||
                                            challenge.name ||
                                            'Untitled Challenge',
                                        url: `/${challenge.slug || challenge._id}`,
                                        action: 'navigate',
                                        isAuth: true,
                                        params: [
                                            {
                                                type: 'url',
                                                name: 'slug',
                                                value:
                                                    challenge.slug ||
                                                    challenge._id,
                                            },
                                        ],
                                        content: { collapsed: false },
                                        iconName: 'zap',
                                    });
                                });
                        }

                        return dynamic;
                    }, [hackathons, projects]);

                    return (
                        <SidebarGroup key={route.name}>
                            {route.subroutes && route.subroutes.length > 0 ? (
                                <SidebarMenu>
                                    <SidebarMenuItem className="group/workspace-item">
                                        <div className="flex items-center w-full group/workspace-button">
                                            <SidebarMenuButton
                                                onClick={() =>
                                                    handleRouteClick(route)
                                                }
                                                isActive={isRouteActive(route)}
                                                className={cn(
                                                    'flex-1',
                                                    isRouteActive(route) &&
                                                        'data-[active=true]:text-green-700 [&>span]:data-[active=true]:text-green-700',
                                                )}
                                            >
                                                <span>
                                                    {route.title || route.name}
                                                </span>
                                            </SidebarMenuButton>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <SidebarMenuAction className="opacity-0 group-hover/workspace-button:opacity-100 transition-opacity duration-200">
                                                        <Plus className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Workspace options
                                                        </span>
                                                    </SidebarMenuAction>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    className="w-48"
                                                    side={
                                                        isMobile
                                                            ? 'bottom'
                                                            : 'right'
                                                    }
                                                    align={
                                                        isMobile
                                                            ? 'end'
                                                            : 'start'
                                                    }
                                                >
                                                    <DropdownMenuItem>
                                                        <Pencil className="text-muted-foreground h-4 w-4" />
                                                        <span>Rename</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Contact className="text-muted-foreground h-4 w-4" />
                                                        <span>Members</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <SidebarMenuSub className="border-l-0 mx-0 px-0 ml-0 pl-0 translate-x-0">
                                            {route.subroutes
                                                ?.filter(
                                                    (sr) =>
                                                        sr.name !== 'divider',
                                                )
                                                .map((subroute) => {
                                                    // Get only dynamic inroutes (actual created items), exclude static route templates
                                                    const dynamicItemsForSubroute =
                                                        dynamicInroutes.filter(
                                                            (inr: IInRoute) =>
                                                                inr.parent ===
                                                                subroute.name,
                                                        );

                                                    // Always show the section, but only show collapsible dropdown if there are items
                                                    if (
                                                        dynamicItemsForSubroute.length >
                                                        0
                                                    ) {
                                                        return (
                                                            <Collapsible
                                                                key={
                                                                    subroute.name
                                                                }
                                                                defaultOpen={
                                                                    false
                                                                }
                                                                className="group/sub-collapsible"
                                                                asChild
                                                            >
                                                                <SidebarMenuSubItem className="group/subroute-item">
                                                                    <div className="group/subroute-button flex items-center w-full">
                                                                        <CollapsibleTrigger
                                                                            asChild
                                                                        >
                                                                            <SidebarMenuSubButton
                                                                                isActive={isRouteActive(
                                                                                    route,
                                                                                    subroute,
                                                                                )}
                                                                                className={cn(
                                                                                    'flex-1',
                                                                                    isRouteActive(
                                                                                        route,
                                                                                        subroute,
                                                                                    ) &&
                                                                                        'data-[active=true]:text-green-700 [&>span]:data-[active=true]:text-green-700',
                                                                                )}
                                                                            >
                                                                                <ChevronDown className="h-4 w-4 transition-transform duration-200 -rotate-90 group-data-[state=open]/sub-collapsible:rotate-0 flex-shrink-0" />
                                                                                <span className="flex-1">
                                                                                    {subroute.title ||
                                                                                        subroute.name}
                                                                                </span>
                                                                            </SidebarMenuSubButton>
                                                                        </CollapsibleTrigger>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger
                                                                                asChild
                                                                            >
                                                                                <SidebarMenuAction className="peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/subroute-button:opacity-100 group-hover/subroute-button:opacity-100 data-[state=open]:opacity-100 md:opacity-0">
                                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                                    <span className="sr-only">
                                                                                        More
                                                                                    </span>
                                                                                </SidebarMenuAction>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent
                                                                                className="w-48"
                                                                                side={
                                                                                    isMobile
                                                                                        ? 'bottom'
                                                                                        : 'right'
                                                                                }
                                                                                align={
                                                                                    isMobile
                                                                                        ? 'end'
                                                                                        : 'start'
                                                                                }
                                                                            >
                                                                                <DropdownMenuItem>
                                                                                    <Folder className="text-muted-foreground h-4 w-4" />
                                                                                    <span>
                                                                                        View
                                                                                    </span>
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem>
                                                                                    <Share2 className="text-muted-foreground h-4 w-4" />
                                                                                    <span>
                                                                                        Share
                                                                                    </span>
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuSeparator />
                                                                                <DropdownMenuItem>
                                                                                    <Trash2 className="text-muted-foreground h-4 w-4" />
                                                                                    <span>
                                                                                        Delete
                                                                                    </span>
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                    <CollapsibleContent>
                                                                        <SidebarMenuSub className="border-l-0 mx-0 px-0 ml-4 pl-4 translate-x-0">
                                                                            {dynamicItemsForSubroute.map(
                                                                                (
                                                                                    inroute: IInRoute,
                                                                                ) => (
                                                                                    <SidebarMenuSubItem
                                                                                        key={
                                                                                            inroute.name
                                                                                        }
                                                                                        className="group/item"
                                                                                    >
                                                                                        <SidebarMenuSubButton
                                                                                            asChild
                                                                                            onClick={() => {
                                                                                                const path =
                                                                                                    routil.computeInPath(
                                                                                                        inroute,
                                                                                                    );
                                                                                                navigate(
                                                                                                    path,
                                                                                                );
                                                                                            }}
                                                                                            isActive={
                                                                                                location.pathname ===
                                                                                                    routil.computeInPath(
                                                                                                        inroute,
                                                                                                    ) ||
                                                                                                location.pathname.startsWith(
                                                                                                    routil.computeInPath(
                                                                                                        inroute,
                                                                                                    ) +
                                                                                                        '/',
                                                                                                )
                                                                                            }
                                                                                            className={cn(
                                                                                                'peer/item-button',
                                                                                                (location.pathname ===
                                                                                                    routil.computeInPath(
                                                                                                        inroute,
                                                                                                    ) ||
                                                                                                    location.pathname.startsWith(
                                                                                                        routil.computeInPath(
                                                                                                            inroute,
                                                                                                        ) +
                                                                                                            '/',
                                                                                                    )) &&
                                                                                                    'data-[active=true]:text-green-700 [&>span]:data-[active=true]:text-green-700',
                                                                                            )}
                                                                                        >
                                                                                            <a
                                                                                                href={routil.computeInPath(
                                                                                                    inroute,
                                                                                                )}
                                                                                                onClick={(
                                                                                                    e,
                                                                                                ) => {
                                                                                                    e.preventDefault();
                                                                                                    const path =
                                                                                                        routil.computeInPath(
                                                                                                            inroute,
                                                                                                        );
                                                                                                    navigate(
                                                                                                        path,
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                {(() => {
                                                                                                    const IconComponent =
                                                                                                        getIcon(
                                                                                                            inroute.iconName,
                                                                                                        );
                                                                                                    return IconComponent ? (
                                                                                                        <IconComponent className="h-4 w-4" />
                                                                                                    ) : null;
                                                                                                })()}
                                                                                                <span>
                                                                                                    {inroute.title ||
                                                                                                        inroute.name}
                                                                                                </span>
                                                                                            </a>
                                                                                        </SidebarMenuSubButton>
                                                                                        <DropdownMenu>
                                                                                            <DropdownMenuTrigger
                                                                                                asChild
                                                                                            >
                                                                                                <SidebarMenuAction className="peer-data-[active=true]/item-button:text-sidebar-accent-foreground group-focus-within/item:opacity-100 group-hover/item:opacity-100 data-[state=open]:opacity-100 md:opacity-0">
                                                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                                                    <span className="sr-only">
                                                                                                        More
                                                                                                    </span>
                                                                                                </SidebarMenuAction>
                                                                                            </DropdownMenuTrigger>
                                                                                            <DropdownMenuContent
                                                                                                className="w-48"
                                                                                                side={
                                                                                                    isMobile
                                                                                                        ? 'bottom'
                                                                                                        : 'right'
                                                                                                }
                                                                                                align={
                                                                                                    isMobile
                                                                                                        ? 'end'
                                                                                                        : 'start'
                                                                                                }
                                                                                            >
                                                                                                <DropdownMenuItem>
                                                                                                    <Folder className="text-muted-foreground h-4 w-4" />
                                                                                                    <span>
                                                                                                        View
                                                                                                    </span>
                                                                                                </DropdownMenuItem>
                                                                                                <DropdownMenuItem>
                                                                                                    <Share2 className="text-muted-foreground h-4 w-4" />
                                                                                                    <span>
                                                                                                        Share
                                                                                                    </span>
                                                                                                </DropdownMenuItem>
                                                                                                <DropdownMenuSeparator />
                                                                                                <DropdownMenuItem>
                                                                                                    <Trash2 className="text-muted-foreground h-4 w-4" />
                                                                                                    <span>
                                                                                                        Delete
                                                                                                    </span>
                                                                                                </DropdownMenuItem>
                                                                                            </DropdownMenuContent>
                                                                                        </DropdownMenu>
                                                                                    </SidebarMenuSubItem>
                                                                                ),
                                                                            )}
                                                                        </SidebarMenuSub>
                                                                    </CollapsibleContent>
                                                                </SidebarMenuSubItem>
                                                            </Collapsible>
                                                        );
                                                    } else {
                                                        // Show section without dropdown when no items exist
                                                        return (
                                                            <SidebarMenuSubItem
                                                                key={
                                                                    subroute.name
                                                                }
                                                            >
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    onClick={() =>
                                                                        handleRouteClick(
                                                                            route,
                                                                            subroute,
                                                                        )
                                                                    }
                                                                    isActive={isRouteActive(
                                                                        route,
                                                                        subroute,
                                                                    )}
                                                                    className={
                                                                        isRouteActive(
                                                                            route,
                                                                            subroute,
                                                                        )
                                                                            ? 'data-[active=true]:text-green-700 [&>span]:data-[active=true]:text-green-700'
                                                                            : ''
                                                                    }
                                                                >
                                                                    <a
                                                                        href={routil.computeSubPath(
                                                                            route,
                                                                            subroute,
                                                                        )}
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            handleRouteClick(
                                                                                route,
                                                                                subroute,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            {subroute.title ||
                                                                                subroute.name}
                                                                        </span>
                                                                    </a>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    }
                                                })}
                                        </SidebarMenuSub>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            ) : (
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            onClick={() =>
                                                handleRouteClick(route)
                                            }
                                            isActive={isRouteActive(route)}
                                            className={
                                                isRouteActive(route)
                                                    ? 'data-[active=true]:text-green-700 [&>span]:data-[active=true]:text-green-700'
                                                    : ''
                                            }
                                        >
                                            <a
                                                href={routil.computePath(
                                                    route.url,
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRouteClick(route);
                                                }}
                                            >
                                                <span>
                                                    {route.title || route.name}
                                                </span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            )}
                        </SidebarGroup>
                    );
                })}

                {/* Product Routes - Available for all authenticated users - Not Collapsible */}
                {productRoutes.map((route: IRoute) => (
                    <SidebarGroup key={route.name}>
                        {route.subroutes && route.subroutes.length > 0 ? (
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        disabled
                                        className="cursor-default"
                                    >
                                        <span>{route.title || route.name}</span>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub className="border-l-0 mx-0 px-0 ml-0 pl-0 translate-x-0">
                                        {route.subroutes
                                            ?.filter(
                                                (sr) => sr.name !== 'divider',
                                            )
                                            .map((subroute) => (
                                                <SidebarMenuSubItem
                                                    key={subroute.name}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        onClick={() =>
                                                            handleRouteClick(
                                                                route,
                                                                subroute,
                                                            )
                                                        }
                                                        isActive={isRouteActive(
                                                            route,
                                                            subroute,
                                                        )}
                                                        className={
                                                            isRouteActive(
                                                                route,
                                                                subroute,
                                                            )
                                                                ? 'data-[active=true]:text-green-700 [&>span]:data-[active=true]:text-green-700'
                                                                : ''
                                                        }
                                                    >
                                                        <a
                                                            href={routil.computeSubPath(
                                                                route,
                                                                subroute,
                                                            )}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleRouteClick(
                                                                    route,
                                                                    subroute,
                                                                );
                                                            }}
                                                        >
                                                            {(() => {
                                                                const IconComponent =
                                                                    getIcon(
                                                                        subroute.iconName,
                                                                    );
                                                                return IconComponent ? (
                                                                    <IconComponent className="h-4 w-4" />
                                                                ) : null;
                                                            })()}
                                                            <span>
                                                                {subroute.title ||
                                                                    subroute.name}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        ) : (
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        disabled
                                        className="cursor-default"
                                    >
                                        <span>{route.title || route.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        )}
                    </SidebarGroup>
                ))}

                {/* Help Routes - Available for all authenticated users - Not Collapsible */}
                {helpRoutes.map((route: IRoute) => (
                    <SidebarGroup key={route.name}>
                        {route.subroutes && route.subroutes.length > 0 ? (
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        disabled
                                        className="cursor-default"
                                    >
                                        <span className="">
                                            {route.title || route.name}
                                        </span>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub className="border-l-0 mx-0 px-0 ml-0 pl-0 translate-x-0">
                                        {route.subroutes
                                            ?.filter(
                                                (sr) => sr.name !== 'divider',
                                            )
                                            .map((subroute) => (
                                                <SidebarMenuSubItem
                                                    key={subroute.name}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        onClick={() =>
                                                            handleRouteClick(
                                                                route,
                                                                subroute,
                                                            )
                                                        }
                                                        isActive={isRouteActive(
                                                            route,
                                                            subroute,
                                                        )}
                                                        className={
                                                            isRouteActive(
                                                                route,
                                                                subroute,
                                                            )
                                                                ? 'data-[active=true]:text-green-700 [&>span]:data-[active=true]:text-green-700'
                                                                : ''
                                                        }
                                                    >
                                                        <a
                                                            href={routil.computeSubPath(
                                                                route,
                                                                subroute,
                                                            )}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleRouteClick(
                                                                    route,
                                                                    subroute,
                                                                );
                                                            }}
                                                        >
                                                            {(() => {
                                                                const IconComponent =
                                                                    getIcon(
                                                                        subroute.iconName,
                                                                    );
                                                                return IconComponent ? (
                                                                    <IconComponent className="h-4 w-4" />
                                                                ) : null;
                                                            })()}
                                                            <span>
                                                                {subroute.title ||
                                                                    subroute.name}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        ) : (
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        disabled
                                        className="cursor-default"
                                    >
                                        <span>{route.title || route.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        )}
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter></SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};

export default AppSidebar;

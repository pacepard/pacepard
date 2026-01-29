import { Fragment, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { routes, routil, type IRouteItem, type IInRoute } from '@pacepard/sdk';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { OnboardingLayout } from '@/components/layouts/onboarding-layout';

// Lazy load components
const Login = lazy(() => import('@/app/auth/Login'));
const Register = lazy(() => import('@/app/auth/Register'));
const ActivateAccount = lazy(() => import('@/app/auth/Verification'));
const ForgotPassword = lazy(() => import('@/app/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/app/auth/ResetPassword'));
const Preview = lazy(() => import('@/app/generics/preview'));
const NoNetwork = lazy(() => import('@/app/generics/no-network'));

const Onboard = lazy(() => import('@/components/blocks/onboarding/onboard'));
const BasicInfo = lazy(() => import('@/components/blocks/onboarding/basic-info'));
const UserInfo = lazy(() => import('@/components/blocks/onboarding/user-info'));
const BusinessInfo = lazy(() => import('@/components/blocks/onboarding/business-info'));
const CreateWorkspace = lazy(() => import('@/components/blocks/onboarding/create-workspace'));
const InviteTeammates = lazy(() => import('@/components/blocks/onboarding/invite-teammates'));

import MyInbox from '@/app/dashboard/partials/inbox/my-inbox';
import TalentDashboard from '@/app/dashboard/partials/home/talent-home';
import Search from '@/app/dashboard/partials/search/search';
import Domains from '@/app/dashboard/partials/domain/domains';
import Members from '@/app/dashboard/partials/members/members';
import Settings from '@/app/dashboard/partials/settings/settings';
import Security from '@/app/dashboard/partials/settings/security';
import Notifications from '@/app/dashboard/partials/settings/notifications';
import UpgradePlan from '@/app/dashboard/partials/upgrade/upgrade-plan';

import Workshops from '@/app/dashboard/talent/workshops';
import Challenges from '@/app/dashboard/talent/challenges';
import Mentors from '@/app/dashboard/talent/mentors';

import Workspace from '@/app/dashboard/workspaces/workspace';
import MyHackathons from '@/app/dashboard/workspaces/my-hackathons';
import MyChallenges from '@/app/dashboard/workspaces/my-challenges';
import MyProjects from '@/app/dashboard/workspaces/my-projects';
import CreateHackathon from '@/app/dashboard/workspaces/create-hackathon';
import HackathonDetails from '@/app/dashboard/workspaces/hackathon-details';
import EditHackathon from '@/app/dashboard/workspaces/edit-hackathon';
import CreateProject from '@/app/dashboard/workspaces/create-project';
import ProjectDetails from '@/app/dashboard/workspaces/project-details';
import ProjectEditor from '@/app/dashboard/workspaces/project-editor';
import CreateChallenge from '@/app/dashboard/workspaces/create-challenge';
import ChallengeDetails from '@/app/dashboard/workspaces/challenge-details';
import EditChallenge from '@/app/dashboard/workspaces/edit-challenge';

import Admin from '@/app/admin/admin';
import Users from '@/app/admin/users';
import AllUsers from '@/app/admin/all-users';
import Talents from '@/app/admin/talents';
import Businesses from '@/app/admin/businesses';
import Admins from '@/app/admin/admins';
import AdminHackathons from '@/app/admin/hackathons';
import AdminHackathonsList from '@/app/admin/admin-hackathons-list';
import AdminHackathonsModerate from '@/app/admin/admin-hackathons-moderate';
import AdminSettings from '@/app/admin/admin-settings';
import AdminSettingsGeneral from '@/app/admin/admin-settings-general';
import AdminSettingsSecurity from '@/app/admin/admin-settings-security';
import AdminSettingsInvitations from '@/app/admin/admin-settings-invitations';
import Resources from '@/app/admin/resources';
import Referrals from '@/app/admin/referrals';
import Payments from '@/app/admin/payments';
import Transactions from '@/app/admin/transactions';
import Subscriptions from '@/app/admin/subscriptions';
import Account from '@/app/admin/account';
import Profile from '@/app/admin/profile';
import Preferences from '@/app/admin/preferences';
import Billing from '@/app/admin/billing';
import Support from '@/app/admin/support/support';
import Feedback from '@/app/admin/support/feedback';
import Updates from '@/app/admin/support/updates';
import Help from '@/app/admin/support/help';

import GetStarted from '@/app/dashboard/help/get-started';
import HowToGuides from '@/app/dashboard/help/how-to-guides';
import HelpCenter from '@/app/dashboard/help/help-center';
import Trash from '@/app/dashboard/help/trash';

import Product from '@/app/dashboard/product/product';
import Templates from '@/app/dashboard/product/templates';
import WhatsNew from '@/app/dashboard/product/whats-new';
import Roadmap from '@/app/dashboard/product/roadmap';
import FeatureRequests from '@/app/dashboard/product/feature-requests';

import Dashboard from '@/app/dashboard/dashboard';

import EditorPage from '@/app/editor/editor-page';

import Tabs from '@/components/blocks/activity/test-tab';
import { ReusableTabs } from '@/components/blocks/activity';
import ErrorUI from '@/app/generics/error-ui';
import { NotFound } from '@pacepard/ui/components/not-found';

const HomeComponent = () => (
    <ReusableTabs tabs={Tabs} defaultValue="overview" />
);

const AppRoutes = () => {
    /**
     * Check if a route is an onboarding route
     */
    const isOnboardingRoute = (name: string): boolean => {
        return name.startsWith('onboard') || name === 'onboarding';
    };

    /**
     * Maps route names to React components
     */
    const getAppPages = (name: string) => {
        switch (name) {
            // Utility routes
            case 'preview':
                return <Preview />;
               
            case 'no-network':
                return <NoNetwork />;
         
            case 'not-found':
                return <NotFound />;


            // authentication routes
            case 'login':
                return <Login />;
            case 'register':
                return <Register />;
            case 'activate-account':
            case 'verify-otp':
                return <ActivateAccount />;
            case 'forgot-password':
                return <ForgotPassword />;
            case 'reset-password':
                return <ResetPassword />;

            //onboarding routes
            case 'onboarding':
                return <Onboard />;
            case 'onboard-basic-user':
                return <BasicInfo />
            case 'onboard-user-info':
                return <UserInfo />;
            case 'onboard-business-info':
                return <BusinessInfo />
            case 'onboard-create-workspace':
                return <CreateWorkspace />;
            case 'onboard-invite-teammates':
                return <InviteTeammates />;

            // dasboard
            case 'dashboard':
                return <Dashboard />;

            // Business routes
            case 'search':
                return <Search />;
            case 'domains':
                return <Domains />;
            case 'members':
                return <Members />;
            case 'settings':
                return <Settings />;
            case 'upgrade-plan':
                return <UpgradePlan />;

            // Talent routes
            case 'talent':
            case 'talent-dashboard':
                return <TalentDashboard />;
            case 'workshops':
                return <Workshops />;
            case 'challenges':
                return <Challenges />;
            case 'mentors':
                return <Mentors />;

            // Workspace routes
            case 'workspace':
                return <Workspace />;
            case 'my-hackathons':
                return <MyHackathons />;
            case 'my-challenges':
                return <MyChallenges />;
            case 'my-projects':
                return <MyProjects />;
            case 'create-hackathon':
                return <CreateHackathon />;
            case 'hackathon-details':
                return <HackathonDetails />;
            case 'edit-hackathon':
                return <EditHackathon />;
            case 'create-project':
                return <CreateProject />;
            case 'project-details':
                return <ProjectDetails />;
            case 'project-editor':
                return <ProjectEditor />;
            case 'create-challenge':
                return <CreateChallenge />;
            case 'challenge-details':
                return <ChallengeDetails />;
            case 'edit-challenge':
                return <EditChallenge />;

            // Admin routes
            case 'admin':
                return <Admin />;
            case 'users':
                return <Users />;
            case 'all-users':
                return <AllUsers />;
            case 'talents':
                return <Talents />;
            case 'businesses':
                return <Businesses />;
            case 'admins':
                return <Admins />;
            case 'hackathons':
                return <AdminHackathons />;
            case 'admin-hackathons-list':
                return <AdminHackathonsList />;
            case 'admin-hackathons-moderate':
                return <AdminHackathonsModerate />;
            case 'admin-settings':
                return <AdminSettings />;
            case 'admin-settings-general':
                return <AdminSettingsGeneral />;
            case 'admin-settings-security':
                return <AdminSettingsSecurity />;
            case 'admin-settings-invitations':
                return <AdminSettingsInvitations />;
            case 'resources':
                return <Resources />;
            case 'referrals':
                return <Referrals />;
            case 'payments':
                return <Payments />;
            case 'transactions':
                return <Transactions />;
            case 'subscriptions':
                return <Subscriptions />;
            case 'account':
                return <Account />;
            case 'profile':
                return <Profile />;
            case 'preferences':
                return <Preferences />;
            case 'billing':
                return <Billing />;
            case 'support':
                return <Support />;
            case 'feedback':
                return <Feedback />;
            case 'updates':
                return <Updates />;
            case 'help':
                return <Help />;

            // Help routes
            case 'get-started':
                return <GetStarted />;
            case 'how-to-guides':
                return <HowToGuides />;
            case 'Help Center':
            case 'help-center':
                return <HelpCenter />;
            case 'trash':
                return <Trash />;

            // Product routes
            case 'product':
                return <Product />;
            case 'templates':
                return <Templates />;
            case 'whats-new':
                return <WhatsNew />;
            case 'roadmap':
                return <Roadmap />;
            case 'feature-requests':
                return <FeatureRequests />;

            // Sidebar routes
            case 'security':
                return <Security />;
            case 'notifications':
                return <Notifications />;

            // Editor (core/editor)
            case 'editor':
            case 'editor-room':
                return <EditorPage />;

            // Common routes
            case 'home':
                return <HomeComponent />;
            case 'my-inbox':
                return <MyInbox />;
            case 'route-fallback':
                return <ErrorUI />;

            default:
                return <NotFound />;
        }
    };
    return (
        <Routes>
            {routes.map((route, index) => (
                <Fragment key={`route-${index + 1}`}>
                    {/* Public routes */}
                    {!route.isAuth && (
                        <>
                            <Route
                                path={routil.computeAppRoute(route)}
                                element={
                                    route.redirect ? (
                                        <Navigate to={route.redirect} replace />
                                    ) : isOnboardingRoute(route.name) ? (
                                        <OnboardingLayout
                                            title={route.title || route.name}
                                            logo=""
                                            description={(route.content as any)?.description}
                                            maxWidth={(route.content as any)?.maxWidth || '4xl'}
                                            onboardingType={(route.content as any)?.onboardingType || 'talent'}
                                        >
                                            {getAppPages(route.name)}
                                        </OnboardingLayout>
                                    ) : (
                                        route.subroutes && route.subroutes.length > 0 ? (
                                            <DashboardLayout
                                                component={getAppPages(route.name)}
                                                title={
                                                    route.title
                                                        ? route.title
                                                        : route.name
                                                }
                                                back={
                                                    route.content.backButton
                                                        ? route.content.backButton
                                                        : false
                                                }
                                                sidebar={{
                                                    collapsed: route.content
                                                        .collapsed
                                                        ? route.content.collapsed
                                                        : false,
                                                }}
                                            />
                                        ) : (
                                            getAppPages(route.name)
                                        )
                                    )
                                }
                            />
                            {/* Subroutes for public routes */}
                            {route.subroutes &&
                                route.subroutes.length > 0 &&
                                route.subroutes.map(
                                    (
                                        subroute: IRouteItem,
                                        subIndex: number,
                                    ) => (
                                        <Fragment
                                            key={`${subroute.name}-route-${subIndex + 1}`}
                                        >
                                            {subroute.name !== 'divider' && (
                                                <Route
                                                    path={
                                                        route.url === '/dashboard'
                                                            ? routil.computeSubPath(
                                                                route,
                                                                subroute,
                                                            )
                                                            : route.url + subroute.url
                                                    }
                                                    element={
                                                        isOnboardingRoute(subroute.name) ? (
                                                            <OnboardingLayout
                                                                title={subroute.title || subroute.name}
                                                                logo=""
                                                                description={(subroute.content as any)?.description}
                                                                maxWidth={(subroute.content as any)?.maxWidth || '4xl'}
                                                                onboardingType={(subroute.content as any)?.onboardingType || 'talent'}
                                                            >
                                                                {getAppPages(subroute.name)}
                                                            </OnboardingLayout>
                                                        ) : (
                                                            <DashboardLayout
                                                                component={getAppPages(
                                                                    subroute.name,
                                                                )}
                                                                title={
                                                                    subroute.title
                                                                        ? subroute.title
                                                                        : subroute.name
                                                                }
                                                                back={true}
                                                                sidebar={{
                                                                    collapsed:
                                                                        subroute
                                                                            .content
                                                                            .collapsed
                                                                            ? subroute
                                                                                .content
                                                                                .collapsed
                                                                            : false,
                                                                }}
                                                            />
                                                        )
                                                    }
                                                />
                                            )}
                                        </Fragment>
                                    ),
                                )}
                        </>
                    )}

                    {/* Private routes */}
                    {route.isAuth && route.name !== 'divider' && (
                        <>
                            {/* Main route */}
                            <Route
                                path={routil.computePath(route.url)}
                                element={
                                    route.action === 'open-secondary' &&
                                        route.subroutes &&
                                        route.subroutes.length > 0 ? (
                                        <Navigate
                                            to={routil.computeSubPath(
                                                route,
                                                route.subroutes[0],
                                            )}
                                            replace
                                        />
                                    ) : isOnboardingRoute(route.name) ? (
                                        <OnboardingLayout
                                            title={route.title || route.name}
                                            logo=""
                                            description={route.content.description}
                                            maxWidth={route.content.maxWidth || '4xl'}
                                            onboardingType={route.content.onboardingType || 'talent'}
                                        >
                                            {getAppPages(route.name)}
                                        </OnboardingLayout>
                                    ) : (
                                        <DashboardLayout
                                            component={getAppPages(route.name)}
                                            title={
                                                route.title
                                                    ? route.title
                                                    : route.name
                                            }
                                            back={
                                                route.content.backButton
                                                    ? route.content.backButton
                                                    : false
                                            }
                                            sidebar={{
                                                collapsed: route.content
                                                    .collapsed
                                                    ? route.content.collapsed
                                                    : false,
                                            }}
                                        />
                                    )
                                }
                            />

                            {/* Subroutes */}
                            {route.subroutes &&
                                route.subroutes.length > 0 &&
                                route.subroutes.map(
                                    (
                                        subroute: IRouteItem,
                                        subIndex: number,
                                    ) => (
                                        <Fragment
                                            key={`${subroute.name}-route-${subIndex + 1}`}
                                        >
                                            {subroute.name !== 'divider' && (
                                                <Route
                                                    path={routil.computeSubPath(
                                                        route,
                                                        subroute,
                                                    )}
                                                    element={
                                                        isOnboardingRoute(subroute.name) ? (
                                                            <OnboardingLayout
                                                                title={subroute.title || subroute.name}
                                                                logo=""
                                                                description={(subroute.content as any)?.description}
                                                                maxWidth={(subroute.content as any)?.maxWidth || '6xl'}
                                                                onboardingType={(subroute.content as any)?.onboardingType || 'talent'}
                                                            >
                                                                {getAppPages(subroute.name)}
                                                            </OnboardingLayout>
                                                        ) : (
                                                            <DashboardLayout
                                                                component={getAppPages(
                                                                    subroute.name,
                                                                )}
                                                                title={
                                                                    subroute.title
                                                                        ? subroute.title
                                                                        : subroute.name
                                                                }
                                                                back={true}
                                                                sidebar={{
                                                                    collapsed:
                                                                        subroute
                                                                            .content
                                                                            .collapsed
                                                                            ? subroute
                                                                                .content
                                                                                .collapsed
                                                                            : false,
                                                                }}
                                                            />
                                                        )
                                                    }
                                                />
                                            )}
                                        </Fragment>
                                    ),
                                )}

                            {/* Inroutes */}
                            {route.inroutes &&
                                route.inroutes.length > 0 &&
                                route.inroutes.map(
                                    (inroute: IInRoute, inIndex: number) => (
                                        <Fragment
                                            key={`${inroute.name}-route-${inIndex + 1}`}
                                        >
                                            <Route
                                                path={routil.computeInPath(
                                                    inroute,
                                                )}
                                                element={
                                                    isOnboardingRoute(inroute.name) ? (
                                                        <OnboardingLayout
                                                            title={inroute.title || inroute.name}
                                                            logo=""
                                                            description={(inroute.content as any)?.description}
                                                            maxWidth={(inroute.content as any)?.maxWidth || '4xl'}
                                                            onboardingType={(inroute.content as any)?.onboardingType || 'talent'}
                                                        >
                                                            {getAppPages(inroute.name)}
                                                        </OnboardingLayout>
                                                    ) : (
                                                        <DashboardLayout
                                                            component={getAppPages(
                                                                inroute.name,
                                                            )}
                                                            title={
                                                                inroute.title
                                                                    ? inroute.title
                                                                    : inroute.name
                                                            }
                                                            back={true}
                                                            sidebar={{
                                                                collapsed: inroute
                                                                    .content
                                                                    .collapsed
                                                                    ? inroute
                                                                        .content
                                                                        .collapsed
                                                                    : false,
                                                            }}
                                                        />
                                                    )
                                                }
                                            />
                                        </Fragment>
                                    ),
                                )}
                        </>
                    )}
                </Fragment>
            ))}

            {/* Fallback routes */}
            <Route
                path="/talent"
                element={''}
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/route-fallback" element={<ErrorUI />} />
        </Routes>
    );
};

export default AppRoutes;

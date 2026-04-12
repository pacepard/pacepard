import React, { useContext } from 'react';
import { storage, UserContext } from '@pacepard/sdk';
import Admin from '@/app/admin/admin';
import TalentDashboard from '@/app/dashboard/partials/home/talent-home';
import BusinessDashboard from '@/components/blocks/dashboard/business';
import GuestDashboard from '@/components/blocks/dashboard/guest';
import UserDashboard from '@/app/dashboard/user-dashboard';

const Dashboard = () => {
    const userContext = useContext(UserContext);
    const userType = (
        storage.getUserType() ??
        userContext?.userType ??
        ''
    ).toLowerCase();

    switch (userType) {
        case 'super-admin':
        case 'admin':
            return <Admin />;
        case 'business':
            return <BusinessDashboard />;
        case 'guest':
            return <GuestDashboard />;
        case 'talent':
            return <TalentDashboard />;
        case 'user':
        default:
            return <UserDashboard />;
    }
};

export default Dashboard;

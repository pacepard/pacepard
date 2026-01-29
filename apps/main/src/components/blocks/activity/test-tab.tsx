import { ReusableTabs, type TabItem } from '@/components/blocks/activity';
import { Home, Folder, Package, Users, TrendingUp, Settings } from 'lucide-react';

const Tabs: TabItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    icon: Home,
    content: <div>Overview content</div>
  },
  {
    value: 'projects',
    label: 'Projects',
    icon: Folder,
    badge: 3,
    badgeVariant: 'secondary',
    content: <div>Projects content</div>
  },
  {
    value: 'packages',
    label: 'Packages',
    icon: Package,
    badge: 'New',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Packages</h3>
        <p className="text-muted-foreground">Check out our new packages!</p>
      </div>
    ),
  },
  {
    value: 'team',
    label: 'Team',
    icon: Users,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Team</h3>
        <p className="text-muted-foreground">Manage your team members here.</p>
      </div>
    ),
  },
  {
    value: 'insights',
    label: 'Insights',
    icon: TrendingUp,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Insights</h3>
        <p className="text-muted-foreground">View analytics and insights.</p>
      </div>
    ),
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: Settings,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Settings</h3>
        <p className="text-muted-foreground">Configure your settings.</p>
      </div>
    ),
  },
];

<ReusableTabs tabs={Tabs} defaultValue="overview" />

export default  Tabs
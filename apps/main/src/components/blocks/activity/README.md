# Activity Blocks

Block components for activity tracking and display, including share link functionality, link previews, and reusable tab components.

## Components

### 1. ShareLink

A component for displaying and sharing a URL with copy functionality and custom domain option.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | `'https://tally.so/r/QGseWN'` | The URL to be shared |
| `onCopy` | `(url: string) => void` | `undefined` | Callback function called when the URL is copied |
| `onCustomDomainClick` | `() => void` | `undefined` | Callback function called when "Use custom domain" is clicked |
| `className` | `string` | `undefined` | Additional CSS classes to apply to the container |

#### Usage

```tsx
import { ShareLink } from '@/components/blocks/activity';

function MyComponent() {
  const handleCopy = (url: string) => {
    console.log('Copied:', url);
  };

  const handleCustomDomain = () => {
    console.log('Custom domain clicked');
  };

  return (
    <ShareLink
      url="https://example.com/share/abc123"
      onCopy={handleCopy}
      onCustomDomainClick={handleCustomDomain}
    />
  );
}
```

#### Features

- ✅ One-click copy to clipboard
- ✅ Visual feedback when copied ("Copied!" message)
- ✅ Read-only URL input field
- ✅ Custom domain option link
- ✅ Fully accessible with ARIA labels

---

### 2. LinkPreview

A component that displays how a shared link will appear when embedded on social media, messaging apps, or search engines.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Tally Forms'` | The title displayed in the preview card |
| `subtitle` | `string` | `'Lens by Pacepard'` | The subtitle displayed below the title |
| `description` | `string` | `'Made with Tally, the simplest way to create forms for free.'` | The description text in the preview |
| `onCustomizeClick` | `() => void` | `undefined` | Callback function called when "Customize" is clicked |
| `className` | `string` | `undefined` | Additional CSS classes to apply to the container |

#### Usage

```tsx
import { LinkPreview } from '@/components/blocks/activity';

function MyComponent() {
  const handleCustomize = () => {
    console.log('Customize clicked');
  };

  return (
    <LinkPreview
      title="My Awesome Form"
      subtitle="Created with Pacepard"
      description="Fill out this form to get started with our amazing service."
      onCustomizeClick={handleCustomize}
    />
  );
}
```

#### Features

- ✅ Preview card with logo/icons
- ✅ Customizable title, subtitle, and description
- ✅ Customize link for editing preview settings
- ✅ Visual placeholder indicators
- ✅ Responsive design

---

### 3. ShareTabs

A tabbed interface component that combines `ShareLink` and `LinkPreview` components into a single tabbed view.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTab` | `'share' \| 'preview'` | `'share'` | The default active tab |
| `shareLinkUrl` | `string` | `undefined` | URL passed to ShareLink component |
| `onShareLinkCopy` | `(url: string) => void` | `undefined` | Callback for when share link is copied |
| `onCustomDomainClick` | `() => void` | `undefined` | Callback for custom domain click |
| `linkPreviewTitle` | `string` | `undefined` | Title for LinkPreview component |
| `linkPreviewSubtitle` | `string` | `undefined` | Subtitle for LinkPreview component |
| `linkPreviewDescription` | `string` | `undefined` | Description for LinkPreview component |
| `onCustomizeClick` | `() => void` | `undefined` | Callback for customize click in LinkPreview |
| `className` | `string` | `undefined` | Additional CSS classes to apply |

#### Usage

```tsx
import { ShareTabs } from '@/components/blocks/activity';

function MyComponent() {
  return (
    <ShareTabs
      defaultTab="share"
      shareLinkUrl="https://example.com/share/abc123"
      onShareLinkCopy={(url) => console.log('Copied:', url)}
      linkPreviewTitle="My Form"
      linkPreviewSubtitle="Created with Pacepard"
      linkPreviewDescription="A beautiful form for collecting user data."
    />
  );
}
```

#### Features

- ✅ Two tabs: "Share Link" and "Link Preview"
- ✅ Horizontal scrolling support
- ✅ Icons for each tab
- ✅ All props passed through to child components

---

### 4. ReusableTabs

A highly flexible and reusable tab component that can be configured with any number of tabs, icons, badges, and custom content.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | **Required** | Array of tab items to display |
| `defaultValue` | `string` | First tab's value | The default active tab value |
| `className` | `string` | `undefined` | Additional CSS classes for the Tabs container |
| `tabsListClassName` | `string` | `undefined` | Additional CSS classes for the TabsList |
| `tabsTriggerClassName` | `string` | `undefined` | Additional CSS classes for each TabsTrigger |
| `tabsContentClassName` | `string` | `undefined` | Additional CSS classes for TabsContent |
| `onValueChange` | `(value: string) => void` | `undefined` | Callback when tab value changes |

#### TabItem Interface

```typescript
interface TabItem {
  value: string;                    // Unique identifier for the tab
  label: string;                     // Display text for the tab
  icon?: LucideIcon;                 // Optional icon from lucide-react
  badge?: string | number;           // Optional badge (string or number)
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  content: React.ReactNode;          // Content to display when tab is active
}
```

#### Usage

```tsx
import { ReusableTabs, type TabItem } from '@/components/blocks/activity';
import { Home, Folder, Package, Users, TrendingUp, Settings } from 'lucide-react';

function MyComponent() {
  const tabs: TabItem[] = [
    {
      value: 'overview',
      label: 'Overview',
      icon: House,
      content: (
        <div>
          <h3>Overview Content</h3>
          <p>This is the overview tab content.</p>
        </div>
      ),
    },
    {
      value: 'projects',
      label: 'Projects',
      icon: Folder,
      badge: 3,
      badgeVariant: 'secondary',
      content: (
        <div>
          <h3>Projects Content</h3>
          <p>You have 3 active projects.</p>
        </div>
      ),
    },
    {
      value: 'packages',
      label: 'Packages',
      icon: Package,
      badge: 'New',
      content: (
        <div>
          <h3>Packages Content</h3>
          <p>Check out our new packages!</p>
        </div>
      ),
    },
    {
      value: 'team',
      label: 'Team',
      icon: Users,
      content: (
        <div>
          <h3>Team Content</h3>
          <p>Manage your team members here.</p>
        </div>
      ),
    },
    {
      value: 'insights',
      label: 'Insights',
      icon: ChartLine,
      content: (
        <div>
          <h3>Insights Content</h3>
          <p>View analytics and insights.</p>
        </div>
      ),
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: Gear,
      content: (
        <div>
          <h3>Settings Content</h3>
          <p>Configure your settings.</p>
        </div>
      ),
    },
  ];

  return (
    <ReusableTabs
      tabs={tabs}
      defaultValue="overview"
      onValueChange={(value) => console.log('Tab changed to:', value)}
    />
  );
}
```

#### Advanced Usage with Custom Styling

```tsx
<ReusableTabs
  tabs={tabs}
  className="w-full"
  tabsListClassName="border-t"
  tabsTriggerClassName="px-6"
  tabsContentClassName="p-6"
/>
```

#### Features

- ✅ **Flexible Configuration**: Define any number of tabs with custom content
- ✅ **Icon Support**: Optional icons from `lucide-react`
- ✅ **Badge Support**: Display badges with numbers or text
- ✅ **Badge Variants**: Support for different badge styles (default, secondary, destructive, outline)
- ✅ **Active Tab Indicator**: Underline effect on active tab
- ✅ **Horizontal Scrolling**: Automatic scrolling for many tabs
- ✅ **Customizable Styling**: Override styles at multiple levels
- ✅ **Type-Safe**: Full TypeScript support with exported `TabItem` interface
- ✅ **Accessible**: Built with accessibility in mind

#### Badge Behavior

- **Number badges**: Automatically get `min-w-5 bg-primary/15 px-1` classes and `secondary` variant
- **String badges**: Use `default` variant by default, or specify `badgeVariant` prop
- **Custom variants**: Override with `badgeVariant` prop

---

## Installation & Import

All components can be imported from the activity blocks index:

```tsx
import {
  ShareLink,
  LinkPreview,
  ShareTabs,
  ReusableTabs,
  type TabItem,
} from '@/components/blocks/activity';
```

## Dependencies

These components rely on:

- `@pacepard/ui` - UI component library
- `lucide-react` - Icon library
- `react` - React framework

## Styling

All components use Tailwind CSS classes and support dark mode. They follow the design system defined in `@pacepard/ui` and respect theme variables.

## Examples

### Complete Share Flow

```tsx
import { ShareTabs } from '@/components/blocks/activity';

function SharePage() {
  return (
    <div className="container mx-auto p-6">
      <ShareTabs
        shareLinkUrl="https://myapp.com/form/abc123"
        onShareLinkCopy={(url) => {
          // Show toast notification
          toast.success('Link copied to clipboard!');
        }}
        linkPreviewTitle="My Awesome Form"
        linkPreviewSubtitle="Created with Pacepard"
        linkPreviewDescription="Fill out this form to get started."
      />
    </div>
  );
}
```

### Custom Tab Layout

```tsx
import { ReusableTabs, type TabItem } from '@/components/blocks/activity';
import { ShareLink, LinkPreview } from '@/components/blocks/activity';
import { Link, Eye } from 'lucide-react';

function CustomSharePage() {
  const tabs: TabItem[] = [
    {
      value: 'share',
      label: 'Share Link',
      icon: LinkSimple,
      content: <ShareLink url="https://example.com/share" />,
    },
    {
      value: 'preview',
      label: 'Link Preview',
      icon: Eye,
      content: <LinkPreview title="My Form" />,
    },
  ];

  return <ReusableTabs tabs={tabs} />;
}
```

## Notes

- All components are fully typed with TypeScript
- Components follow accessibility best practices
- All interactive elements have proper ARIA labels
- Components are responsive and work on mobile devices
- Dark mode is supported out of the box




import React from 'react';
import { ReusableTabs, type TabItem } from '@/components/blocks/activity';
import { Home, Folder, Package, Users, TrendingUp, Settings } from 'lucide-react';

export const tabs: TabItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    icon: House,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Overview</h3>
        <p className="text-muted-foreground">This is the overview tab content.</p>
      </div>
    ),
  },
  {
    value: 'projects',
    label: 'Projects',
    icon: Folder,
    badge: 3,
    badgeVariant: 'secondary',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Projects</h3>
        <p className="text-muted-foreground">You have 3 active projects.</p>
      </div>
    ),
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
    icon: ChartLine,
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
    icon: Gear,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Settings</h3>
        <p className="text-muted-foreground">Configure your settings.</p>
      </div>
    ),
  },
];

<ReusableTabs tabs={Tabs} defaultValue="overview" />

export default TestTabs;
# My Hackathons — Implementation Plan

**Figma node:** [`14064-5507`](https://www.figma.com/design/ETloO1g7QGB7LzYiAQtUCn/Pacepard-V1?node-id=14064-5507)  
**File:** `apps/main/src/app/dashboard/workspaces/my-hackathons.tsx`

---

## Figma Node Breakdown

The node is `Frame 1618868642` (1152×920). It contains two sections:

### 1. Hackathon List Card
- White card, `border-radius: 16`, border with 30% opacity
- Header row with the Pacepard workspace logo
- 5 list rows, each containing:
  - Small thumbnail chip (45×25, `border-radius: 5`, muted `#bdbdbd/40` background) with workspace icon
  - Two stacked text lines — primary (name) + secondary (description/date)
  - Two status indicator chips on the right

### 2. Empty State Section
- Heading: **"Your hackathon journey starts here"** (DM Sans Bold 16px, `#2b2a2c`)
- Body: *"Create your first hackathon to start accepting projects, managing teams, and tracking progress in one place."* (DM Sans Regular 16px, `#545454`, center-aligned)
- CTA Button: **"New hackathon"** with `+` icon (background `#333234`, `151×40`, `border-radius: 6`, text `#eaeaea`)

---

## Implementation Plan

### Files to update

| File | Status | Action |
|---|---|---|
| `apps/main/src/app/dashboard/workspaces/my-hackathons.tsx` | Stub (1 line) | Full implementation |
| `packages/sdk/src/api/clients/pacepard.ts` | Missing hackathon module | Add `HackathonAPI` client |
| `packages/sdk/src/api/clients/hackathon.ts` | Does not exist | Create new file |
| `packages/sdk/src/utils/path.ts` | Missing hackathon URLs | Add `URL_HACKATHON`, `URL_HACKATHONS` |
| `packages/sdk/src/dtos/hackathon.dto.ts` | Nearly empty (timestamps only) | Add full DTO + enums |
| `packages/sdk/src/index.ts` | May not export new types | Verify exports |

No route changes needed — `my-hackathons` is already registered in `AppRoutes.tsx` (line 192).

---

### Render States

#### A. Loading State
- Show 3–5 `Skeleton` rows inside a `Card` while the API call is in-flight.

#### B. Empty State _(no hackathons returned)_
- Render the empty state from the Figma design:
  - Heading + description text (centered, max-width ~435px)
  - `Button` with `Plus` icon labeled **"New hackathon"** → `navigate('/create-hackathon')`

#### C. Populated State _(hackathons exist)_
- `Card` with a header area containing:
  - Title: "My Hackathons"
  - **"New hackathon"** button (top-right, with `Plus` icon)
- List of hackathon rows, each showing:
  - `Avatar` thumbnail (workspace logo or initials fallback)
  - Hackathon name (bold) + date range or subtitle (muted text)
  - `Badge` for status: `active` (green) / `draft` (muted) / `closed` (red)
  - `MoreHorizontal` actions menu (dots icon)
- Row click → `navigate('/hackathon-details')` with hackathon ID

---

### Data Fetching
- `useEffect` on mount:
  1. First call `PacepardAPI.workspace.getWorkspaces({ limit: 1, page: 1, order: 'desc' })` to get `workspaceId`
  2. Then call `PacepardAPI.hackathon.getHackathons({ workspaceId, limit: 25, page: 1 })` _(needs to be built — see SDK gaps below)_
- Store results in `useState<IHackathon[]>`
- On error → `toast.error('Failed to load hackathons')`

### Navigation
| Action | Route |
|---|---|
| "New hackathon" button | `/create-hackathon` |
| Row click | `/hackathon-details` (pass hackathon `id`) |

---

### UI Components

| Component | Source |
|---|---|
| `Card`, `CardHeader`, `CardContent`, `CardTitle` | `@pacepard/ui/components/card` |
| `Button` | `@pacepard/ui/components/button` |
| `Badge` | `@pacepard/ui/components/badge` |
| `Avatar`, `AvatarFallback` | `@pacepard/ui/components/avatar` |
| `Skeleton` | `@pacepard/ui/components/skeleton` |
| `Plus`, `MoreHorizontal` | `lucide-react` |
| `toast` | `@pacepard/ui` |
| `UserContext` | `@pacepard/sdk` |
| `PacepardAPI` | `@/config/pacepard` |

---

---

## SDK Gaps — Must Be Built First

### 1. Add hackathon URL constants to `packages/sdk/src/utils/path.ts`
```ts
export const URL_HACKATHONS = '/hackathons'
export const URL_HACKATHON  = '/hackathon'
```

### 2. Expand `packages/sdk/src/dtos/hackathon.dto.ts`
The current DTO only has timestamps. Add:
```ts
export enum HackStatusType {
    DRAFT     = 'draft',
    PUBLISHED = 'published',
    CLOSED    = 'closed',
    ARCHIVED  = 'archived',
}

export enum HackathonType {
    ONLINE        = 'online',
    OFFLINE       = 'offline',
    IN_PERSON     = 'in-person',
    HYBRID        = 'hybrid',
    GLOBAL        = 'global',
    NATIONAL      = 'national',
    INTERNATIONAL = 'international',
    REGIONAL      = 'regional',
    LOCAL         = 'local',
}

export interface IHackathon {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    status: HackStatusType;
    type: HackathonType;
    workspaceId: string;
    settings: {
        startDate: string;
        closeDate: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface GetHackathonsDTO {
    workspaceId: string;
    limit?: number;
    page?: number;
    order?: 'asc' | 'desc';
}
```

### 3. Create `packages/sdk/src/api/clients/hackathon.ts`
Backend endpoints (from `hackathon.router.ts`):
- `GET /hackathon/list` — list hackathons (needs workspace filter via query param)
- `GET /hackathon/:id` — get single hackathon
- `POST /hackathon/` — create hackathon
- `PUT /hackathon/:id` — update hackathon
- `DELETE /hackathon/:id` — delete hackathon

```ts
class HackathonAPI {
    getHackathons(payload: GetHackathonsDTO): Promise<IAPIResponse> { ... }
    getHackathon(id: string): Promise<IAPIResponse> { ... }
    createHackathon(payload: CreateHackathonDTO): Promise<IAPIResponse> { ... }
    updateHackathon(payload: UpdateHackathonDTO): Promise<IAPIResponse> { ... }
    deleteHackathon(id: string): Promise<IAPIResponse> { ... }
}
```

### 4. Register in `packages/sdk/src/api/clients/pacepard.ts`
```ts
import HackathonAPI from './hackathon'

class PacepardAPIClient {
    public hackathon: HackathonAPI   // ← add this
    ...
}
```

### 5. Verify `Badge` component exists in `@pacepard/ui`
The plan uses `Badge` for hackathon status. Confirm it's exported from `@pacepard/ui/components/badge` — if not, use a styled `span` instead.

---

## Figma Design Clarification

The Figma frame shows **both** the list section and the empty state in the same wireframe. These are two separate states:
- **List section** → shown when `hackathons.length > 0`
- **Empty state section** → shown when `hackathons.length === 0`

The list rows in the Figma are placeholder wireframe bars (no real text). The actual fields to display per row are:
- `hackathon.image` → thumbnail avatar (fallback: initials from `hackathon.name`)
- `hackathon.name` → primary text (bold)
- `hackathon.settings.startDate` – `hackathon.settings.closeDate` → secondary text (muted)
- `hackathon.status` → `Badge` (colour-coded)

---

### Styling Notes (from Figma)

| Element | Class / Value |
|---|---|
| Page background | `bg-muted/30` or `bg-[#f8f7f7]` |
| Card border | `rounded-2xl border border-border/30` |
| Thumbnail chip | `rounded-md bg-muted/40 border border-border/20` |
| Status — active | green `Badge` variant |
| Status — draft | muted `Badge` variant |
| Status — closed | destructive `Badge` variant |
| CTA button background | `bg-[#333234] text-[#eaeaea]` |
| Heading font | DM Sans Bold (loaded via CSS variables) |

# Dashboard Components

This directory contains modular components for the dashboard interface.

## Structure

### Dashboard Components (`/components/dashboard/`)

- **`dashboard-header.tsx`** - Header section with welcome message and new project button
- **`stats-cards.tsx`** - Grid of statistical cards showing project metrics
- **`project-boards.tsx`** - Grid of project board cards with progress and details
- **`upcoming-tasks.tsx`** - List of upcoming tasks with deadlines and priorities
- **`recent-activity.tsx`** - Feed of recent project activities
- **`index.ts`** - Barrel export for clean imports

### Sidebar Components (`/components/sidebar/`)

- **`sidebar-brand.tsx`** - Logo and brand section
- **`sidebar-actions.tsx`** - Quick action buttons (e.g., New Project)
- **`sidebar-navigation.tsx`** - Main navigation menu with active state handling
- **`sidebar-user-profile.tsx`** - User profile section at bottom
- **`index.ts`** - Barrel export for clean imports

### Data Layer (`/lib/dashboard-data.ts`)

Contains all dummy data and type definitions:
- Project boards data
- Upcoming tasks data
- Recent activity data
- Current user information

## Usage

### Import Components

```tsx
import {
  DashboardHeader,
  StatsCards,
  ProjectBoards,
  UpcomingTasks,
  RecentActivity
} from "@/components/dashboard";

import { userBoards, upcomingTasks, recentActivity, currentUser } from "@/lib/dashboard-data";
```

### Event Handlers

All components accept optional callback props for handling user interactions:

```tsx
<DashboardHeader 
  userName={currentUser.name} 
  onNewProject={handleNewProject}
/>

<ProjectBoards
  boards={userBoards}
  onViewAll={handleViewAllBoards}
  onBoardClick={handleBoardClick}
/>
```

## Benefits of This Structure

1. **Modularity** - Each component has a single responsibility
2. **Reusability** - Components can be easily reused across different pages
3. **Maintainability** - Changes to one component don't affect others
4. **Type Safety** - Strong TypeScript types throughout
5. **Testing** - Individual components can be tested in isolation
6. **Performance** - Components can be optimized individually

## Future Enhancements

- Add loading states for each component
- Implement error boundaries
- Add skeleton loaders
- Create storybook stories for each component
- Add unit tests for each component

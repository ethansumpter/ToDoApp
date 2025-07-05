# First-Time User Registration Setup

This document explains the implementation of the first-time user registration flow that collects additional user information after email verification.

## Implementation Overview

The system now checks if a user exists in the `users` table when they log in. If they don't exist, a modal popup will appear asking for additional information.

## Database Setup

### 1. Run the Users Table Migration

Execute the SQL migration file `supabase-migration-users.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the content from `supabase-migration-users.sql`
4. Click "RUN" to execute the migration

### 2. Users Table Structure

The `users` table has the following structure:

```sql
users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    university TEXT NOT NULL,
    course_subject TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## Features

### First-Time User Modal

When a user logs in for the first time, they will see a modal with the following fields:

- **First Name**: Required, minimum 2 characters
- **Last Name**: Required, minimum 2 characters  
- **University**: Searchable dropdown with universities from the [university-domains-list](https://github.com/Hipo/university-domains-list) repository
- **Course Subject**: Dropdown with common course subjects

### University Search

The university field includes:
- Real-time search functionality
- Data from the public GitHub repository of world universities
- Displays university name, state/province (if available), and country
- Limits results to 50 for performance
- Caches university data to avoid repeated API calls

### Form Validation

- Uses React Hook Form with Zod validation
- All fields are required
- Minimum length validation for names and course subject
- Real-time validation feedback

## Components

### Main Components

1. **`FirstTimeUserModal`** - The main modal component
2. **`useUserProfile`** - Hook for managing user profile state
3. **University utilities** - Functions for fetching and searching universities

### File Structure

```
components/
  auth/
    first-time-user-modal.tsx
    index.ts
hooks/
  use-user-profile.ts
lib/
  university-utils.ts
types/
  user.ts
supabase-migration-users.sql
```

## User Flow

1. User creates account and verifies email
2. User logs in and is redirected to dashboard
3. System checks if user exists in `users` table
4. If user doesn't exist, modal appears
5. User fills out form and submits
6. Profile is created in database
7. Modal closes and user can access dashboard

## Security

- Row Level Security (RLS) is enabled on the `users` table
- Users can only view/modify their own profile
- User ID is automatically populated from authenticated session
- Email is automatically populated from auth user data

## Error Handling

- Network errors when fetching universities
- Database errors when creating profile
- Form validation errors
- Loading states for better UX

## Usage

The modal is automatically integrated into the dashboard layout and will appear when needed. No additional configuration is required once the database migration is run.

## Customization

### Adding More Course Subjects

Edit the `commonCourseSubjects` array in `first-time-user-modal.tsx`:

```typescript
const commonCourseSubjects = [
  // Add your custom subjects here
  "Your Custom Subject",
  // ... existing subjects
];
```

### Styling

The modal uses shadcn/ui components and can be customized by modifying the component classes or updating your theme configuration.

## Testing

1. Create a new account and verify email
2. Log in - the modal should appear
3. Fill out the form and submit
4. Verify the data is saved in the `users` table
5. Log out and log back in - the modal should not appear again

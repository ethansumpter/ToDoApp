# Boards Database Setup

This document explains how to set up the boards table in Supabase for storing project boards.

## Database Setup

### 1. Create the Boards Table

Run the SQL migration file `supabase-migration-boards.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the content from `supabase-migration-boards.sql`
4. Click "RUN" to execute the migration

### 2. Table Structure

The `boards` table has the following structure:

```sql
boards (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    deadline DATE NOT NULL,
    icon VARCHAR(50) NOT NULL,
    task_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
    task_statuses JSONB NOT NULL DEFAULT '[]'::jsonb,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### 3. JSON Column Examples

- `task_categories`: `["Research", "Development", "Testing", "Documentation", "Presentation"]`
- `task_statuses`: `["To Do", "In Progress", "Review", "Done"]`

### 4. Row Level Security (RLS)

The table has RLS enabled with the following policies:
- Users can only view their own boards
- Users can only insert boards for themselves
- Users can only update their own boards
- Users can only delete their own boards

## Usage

### Creating a Board

The form data is automatically saved to Supabase when a user submits the create board form. The categories and statuses are stored as JSON arrays in the database.

### Board Data Flow

1. User fills out the create board form
2. Form data is validated using Zod schema
3. Data is sent to `createBoard()` function
4. Function authenticates user and saves to Supabase
5. Board is created with user association
6. Success/error feedback is shown to user

### Available Functions

- `createBoard(formData)` - Create a new board
- `getUserBoards(userId?)` - Get all boards for a user
- `getBoardById(boardId)` - Get a specific board
- `updateBoard(boardId, updates)` - Update a board
- `deleteBoard(boardId)` - Delete a board

All functions include proper error handling and user authentication checks.

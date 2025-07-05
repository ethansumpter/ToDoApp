// Dummy data for demonstration - in a real app, this would come from an API/database

import { ProjectBoard } from "@/types/boards";
import { UpcomingTask } from "@/components/dashboard/upcoming-tasks";
import { ActivityItem } from "@/components/dashboard/recent-activity";

export const userBoards: ProjectBoard[] = [
  {
    id: 1,
    name: "CS 301 Final Project",
    description: "Building a full-stack web application with modern technologies",
    incompleteTasksCount: 12,
    totalTasks: 20,
    role: "Project Leader",
    progress: 40,
    dueDate: "2025-07-15",
    members: 4,
    subject: "Computer Science",
    status: "active",
    createdAt: "2025-06-01T00:00:00Z",
    updatedAt: "2025-06-30T00:00:00Z"
  },
  {
    id: 2,
    name: "Psychology Research Paper",
    description: "Analyzing cognitive behavioral patterns in social environments",
    incompleteTasksCount: 6,
    totalTasks: 10,
    role: "Research Coordinator",
    progress: 40,
    dueDate: "2025-07-08",
    members: 3,
    subject: "Psychology",
    status: "active",
    createdAt: "2025-06-05T00:00:00Z",
    updatedAt: "2025-06-29T00:00:00Z"
  },
  {
    id: 3,
    name: "Marketing Campaign Analysis",
    description: "Comprehensive analysis of Q2 marketing campaign effectiveness",
    incompleteTasksCount: 8,
    totalTasks: 15,
    role: "Data Analyst",
    progress: 53,
    dueDate: "2025-07-20",
    members: 5,
    subject: "Business",
    status: "active",
    createdAt: "2025-06-10T00:00:00Z",
    updatedAt: "2025-06-28T00:00:00Z"
  },
  {
    id: 4,
    name: "Chemistry Lab Report",
    description: "Organic synthesis experiment documentation and analysis",
    incompleteTasksCount: 3,
    totalTasks: 8,
    role: "Lab Partner",
    progress: 62,
    dueDate: "2025-07-05",
    members: 2,
    subject: "Chemistry",
    status: "active",
    createdAt: "2025-06-15T00:00:00Z",
    updatedAt: "2025-06-27T00:00:00Z"
  }
];

export const upcomingTasks: UpcomingTask[] = [
  {
    id: 1,
    title: "Complete literature review",
    boardName: "Psychology Research Paper",
    dueDate: "2025-07-02",
    priority: "high",
    assignee: "You"
  },
  {
    id: 2,
    title: "Implement user authentication",
    boardName: "CS 301 Final Project",
    dueDate: "2025-07-03",
    priority: "high",
    assignee: "You"
  },
  {
    id: 3,
    title: "Design survey questions",
    boardName: "Marketing Campaign Analysis",
    dueDate: "2025-07-04",
    priority: "medium",
    assignee: "Sarah M."
  },
  {
    id: 4,
    title: "Write conclusion section",
    boardName: "Chemistry Lab Report",
    dueDate: "2025-07-05",
    priority: "medium",
    assignee: "You"
  },
  {
    id: 5,
    title: "Create presentation slides",
    boardName: "CS 301 Final Project",
    dueDate: "2025-07-06",
    priority: "low",
    assignee: "Mike R."
  }
];

export const recentActivity: ActivityItem[] = [
  {
    id: 1,
    action: "completed",
    task: "Database schema design",
    board: "CS 301 Final Project",
    user: "Alex Chen",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    action: "created",
    task: "User testing plan",
    board: "Psychology Research Paper",
    user: "You",
    timestamp: "4 hours ago"
  },
  {
    id: 3,
    action: "commented",
    task: "Market analysis report",
    board: "Marketing Campaign Analysis",
    user: "Sarah M.",
    timestamp: "6 hours ago"
  }
];

export const currentUser = {
  name: "Alex",
  fullName: "Alex Chen",
  email: "alex.chen@university.edu",
  initials: "AC"
};

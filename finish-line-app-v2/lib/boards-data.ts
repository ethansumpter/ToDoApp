import { ProjectBoard } from "@/types/boards";

// Dummy data for demonstration - in a real app, this would come from an API/database
export const activeBoards: ProjectBoard[] = [
  {
    id: 1,
    name: "CS 301 Final Project",
    description: "Full-stack web application development with React and Node.js",
    incompleteTasksCount: 12,
    totalTasks: 20,
    role: "Project Leader",
    progress: 40,
    dueDate: "2025-07-15",
    members: 4,
    subject: "Computer Science",
    status: "active",
    createdAt: "2025-05-01",
    updatedAt: "2025-06-25"
  },
  {
    id: 2,
    name: "Psychology Research Paper",
    description: "Investigating the effects of social media on mental health",
    incompleteTasksCount: 6,
    totalTasks: 10,
    role: "Research Coordinator",
    progress: 40,
    dueDate: "2025-07-08",
    members: 3,
    subject: "Psychology",
    status: "active",
    createdAt: "2025-05-10",
    updatedAt: "2025-06-20"
  },
  {
    id: 3,
    name: "Marketing Campaign Analysis",
    description: "Data analysis and insights for Q2 marketing campaigns",
    incompleteTasksCount: 8,
    totalTasks: 15,
    role: "Data Analyst",
    progress: 53,
    dueDate: "2025-07-20",
    members: 5,
    subject: "Business",
    status: "active",
    createdAt: "2025-05-15",
    updatedAt: "2025-06-28"
  },
  {
    id: 4,
    name: "Chemistry Lab Report",
    description: "Organic chemistry synthesis lab report and analysis",
    incompleteTasksCount: 3,
    totalTasks: 8,
    role: "Lab Partner",
    progress: 62,
    dueDate: "2025-07-05",
    members: 2,
    subject: "Chemistry",
    status: "active",
    createdAt: "2025-06-01",
    updatedAt: "2025-06-29"
  },
  {
    id: 5,
    name: "Mobile App Development",
    description: "Cross-platform mobile application using React Native",
    incompleteTasksCount: 15,
    totalTasks: 25,
    role: "Lead Developer",
    progress: 30,
    dueDate: "2025-08-01",
    members: 6,
    subject: "Software Engineering",
    status: "active",
    createdAt: "2025-04-20",
    updatedAt: "2025-06-30"
  },
  {
    id: 6,
    name: "History Research Project",
    description: "World War II impact analysis on European economies",
    incompleteTasksCount: 4,
    totalTasks: 12,
    role: "Researcher",
    progress: 75,
    dueDate: "2025-07-12",
    members: 3,
    subject: "History",
    status: "active",
    createdAt: "2025-05-05",
    updatedAt: "2025-06-27"
  }
];

export const archivedBoards: ProjectBoard[] = [
  {
    id: 101,
    name: "Literature Review Project",
    description: "Comprehensive review of modern American literature",
    incompleteTasksCount: 0,
    totalTasks: 15,
    role: "Lead Researcher",
    progress: 100,
    dueDate: "2025-04-30",
    members: 4,
    subject: "English Literature",
    status: "archived",
    createdAt: "2025-02-01",
    updatedAt: "2025-04-30"
  },
  {
    id: 102,
    name: "Physics Lab Experiment",
    description: "Quantum mechanics experiment and documentation",
    incompleteTasksCount: 0,
    totalTasks: 8,
    role: "Lab Assistant",
    progress: 100,
    dueDate: "2025-03-15",
    members: 2,
    subject: "Physics",
    status: "archived",
    createdAt: "2025-01-15",
    updatedAt: "2025-03-15"
  },
  {
    id: 103,
    name: "Business Plan Development",
    description: "Startup business plan for tech company",
    incompleteTasksCount: 2,
    totalTasks: 20,
    role: "Business Analyst",
    progress: 90,
    dueDate: "2025-05-20",
    members: 5,
    subject: "Business",
    status: "archived",
    createdAt: "2025-03-01",
    updatedAt: "2025-05-20"
  }
];

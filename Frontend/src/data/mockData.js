
export const userData = [
  {
    id: "user_1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=admin",
  },
  {
    id: "user_2",
    name: "Trainer User",
    email: "trainer@example.com",
    role: "trainer",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=trainer",
  },
  {
    id: "user_3",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=john",
  },
  {
    id: "user_4",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=jane",
  },
  {
    id: "user_5",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=robert",
  },
  {
    id: "user_6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=emily",
  },
  {
    id: "user_7",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=michael",
  },
  {
    id: "user_8",
    name: "Sarah Taylor",
    email: "sarah.taylor@example.com",
    role: "trainer",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=sarah",
  },
  {
    id: "user_9",
    name: "David Brown",
    email: "david.brown@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=david",
  },
  {
    id: "user_10",
    name: "Lisa Martinez",
    email: "lisa.martinez@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=lisa",
  },
  {
    id: "user_11",
    name: "James Thompson",
    email: "james.thompson@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=james",
  },
  {
    id: "user_12",
    name: "Jennifer Garcia",
    email: "jennifer.garcia@example.com",
    role: "participant",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=jennifer",
  }
];

export const trainingData = [
  {
    id: "training_1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.",
    status: "active",
    startDate: "2025-04-15",
    endDate: "2025-05-15",
    participants: [
      {
        userId: "user_3",
        name: "John Doe",
        status: "active",
        enrolledDate: "2025-04-15",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=john"
      },
      {
        userId: "user_4",
        name: "Jane Smith",
        status: "active",
        enrolledDate: "2025-04-15",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=jane"
      },
      {
        userId: "user_5",
        name: "Robert Johnson",
        status: "active",
        enrolledDate: "2025-04-16",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=robert"
      }
    ]
  },
  {
    id: "training_2",
    title: "Advanced React Development",
    description: "Master React.js with Hooks, Context API, and Redux for building complex web applications.",
    status: "upcoming",
    startDate: "2025-05-20",
    endDate: "2025-06-20",
    participants: [
      {
        userId: "user_6",
        name: "Emily Davis",
        status: "active",
        enrolledDate: "2025-04-10",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=emily"
      },
      {
        userId: "user_7",
        name: "Michael Wilson",
        status: "active",
        enrolledDate: "2025-04-12",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=michael"
      }
    ]
  },
  {
    id: "training_3",
    title: "Python for Data Analysis",
    description: "Learn Python, Pandas, and NumPy for data analysis and visualization.",
    status: "completed",
    startDate: "2025-03-01",
    endDate: "2025-04-01",
    participants: [
      {
        userId: "user_9",
        name: "David Brown",
        status: "completed",
        enrolledDate: "2025-03-01",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=david"
      },
      {
        userId: "user_10",
        name: "Lisa Martinez",
        status: "completed",
        enrolledDate: "2025-03-01",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=lisa"
      },
      {
        userId: "user_11",
        name: "James Thompson",
        status: "completed",
        enrolledDate: "2025-03-02",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=james"
      },
      {
        userId: "user_12",
        name: "Jennifer Garcia",
        status: "dropped",
        enrolledDate: "2025-03-01",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=jennifer"
      }
    ]
  },
  {
    id: "training_4",
    title: "UI/UX Design Principles",
    description: "Learn the principles of user experience and interface design for creating usable digital products.",
    status: "active",
    startDate: "2025-04-10",
    endDate: "2025-05-10",
    participants: [
      {
        userId: "user_3",
        name: "John Doe",
        status: "active",
        enrolledDate: "2025-04-10",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=john"
      },
      {
        userId: "user_6",
        name: "Emily Davis",
        status: "active",
        enrolledDate: "2025-04-10",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=emily"
      }
    ]
  },
  {
    id: "training_5",
    title: "DevOps Fundamentals",
    description: "Introduction to DevOps practices, CI/CD, Docker, and Kubernetes.",
    status: "upcoming",
    startDate: "2025-06-01",
    endDate: "2025-07-01",
    participants: [
      {
        userId: "user_5",
        name: "Robert Johnson",
        status: "active",
        enrolledDate: "2025-04-20",
        avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=robert"
      }
    ]
  }
];

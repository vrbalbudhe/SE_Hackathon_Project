const asyncHandler = require("express-async-handler");
const prisma = require("../../lib/prisma");

const getAnalyticsSummary = asyncHandler(async (req, res) => {
  try {
    console.log("Analytics endpoint called at:", new Date().toISOString());

    // Ensure we're getting fresh data by adding a slight delay and logging
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get total users count
    console.log("Fetching total users...");
    const totalUsers = await prisma.user.count();
    console.log("Total users:", totalUsers);

    // Get total proposals count
    console.log("Fetching total proposals...");
    const totalProposals = await prisma.projects.count();
    console.log("Total proposals:", totalProposals);

    // Get most active users (simplified query first)
    console.log("Fetching most active users...");
    let formattedActiveUsers = [];
    
    try {
      // First, let's try a simpler approach
      const usersWithProjects = await prisma.user.findMany({
        include: {
          projects: {
            select: {
              id: true,
              createdAt: true
            }
          }
        },
        take: 10
      });

      // Calculate manually for now
      const userStats = usersWithProjects
        .map(user => ({
          name: user.name,
          email: user.email,
          proposalCount: user.projects.length,
          lastProposal: user.projects.length > 0 ? 
            Math.max(...user.projects.map(p => new Date(p.createdAt).getTime())) : null
        }))
        .filter(user => user.proposalCount > 0)
        .sort((a, b) => b.proposalCount - a.proposalCount)
        .slice(0, 5);

      formattedActiveUsers = userStats;
      console.log("Most active users:", formattedActiveUsers);
    } catch (userError) {
      console.error("Error fetching active users:", userError);
      formattedActiveUsers = [];
    }

    // Get recent user registrations (last 30 days)
    console.log("Fetching recent users...");
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    console.log("Recent users:", recentUsers);

    // Get user role distribution (simplified)
    console.log("Fetching user roles...");
    let roleDistribution = {};
    try {
      const allUsers = await prisma.user.findMany({
        select: {
          role: true
        }
      });
      
      roleDistribution = allUsers.reduce((acc, user) => {
        const role = user.role || 'User';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});
      console.log("Role distribution:", roleDistribution);
    } catch (roleError) {
      console.error("Error fetching roles:", roleError);
      roleDistribution = { User: totalUsers };
    }

    // Get daily proposal counts (simplified) - Last 10 days for better visibility
    console.log("Fetching daily proposals...");
    let dailyProposalCounts = {};
    try {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const recentProjects = await prisma.projects.findMany({
        where: {
          createdAt: {
            gte: tenDaysAgo
          }
        },
        select: {
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      dailyProposalCounts = recentProjects.reduce((acc, project) => {
        const date = new Date(project.createdAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      console.log("Daily proposals:", dailyProposalCounts);
    } catch (dailyError) {
      console.error("Error fetching daily proposals:", dailyError);
      dailyProposalCounts = {};
    }

    // Get today's activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    const todayProposals = await prisma.projects.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    // Get average proposals per user
    const avgProposalsPerUser = totalUsers > 0 ? (totalProposals / totalUsers).toFixed(2) : 0;

    const responseData = {
      totalUsers,
      totalProposals,
      recentUsers,
      todayUsers,
      todayProposals,
      avgProposalsPerUser: parseFloat(avgProposalsPerUser),
      mostActiveUsers: formattedActiveUsers,
      dailyProposalCounts,
      roleDistribution,
      generatedAt: new Date().toISOString(),
      dataFreshness: {
        timestamp: Date.now(),
        requestId: Math.random().toString(36).substr(2, 9)
      }
    };

    console.log("Sending fresh response at:", new Date().toISOString());

    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return res.status(200).json({
      success: true,
      message: "Analytics data fetched successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get user growth data for charts
const getUserGrowthData = asyncHandler(async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      where: {
        createdAt: {
          gte: daysAgo
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Format growth data by day
    const growthData = {};
    userGrowth.forEach(item => {
      const date = new Date(item.createdAt).toISOString().split('T')[0];
      if (growthData[date]) {
        growthData[date] += item._count.id;
      } else {
        growthData[date] = item._count.id;
      }
    });

    return res.status(200).json({
      success: true,
      message: "User growth data fetched successfully",
      data: {
        growthData,
        totalDays: parseInt(days),
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error fetching user growth data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user growth data",
      error: error.message
    });
  }
});

// Debug endpoint to check what's in the database
const debugDatabaseState = asyncHandler(async (req, res) => {
  try {
    console.log("=== DATABASE DEBUG ===");
    
    // Get all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log("All Users:", allUsers);

    // Get all projects
    const allProjects = await prisma.projects.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        userId: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log("All Projects:", allProjects);

    // Get users with their project counts
    const usersWithProjectCounts = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            projects: true
          }
        },
        projects: {
          select: {
            id: true,
            name: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    console.log("Users with Projects:", JSON.stringify(usersWithProjectCounts, null, 2));

    return res.status(200).json({
      success: true,
      message: "Database state fetched successfully",
      data: {
        totalUsers: allUsers.length,
        totalProjects: allProjects.length,
        users: allUsers,
        projects: allProjects,
        usersWithProjects: usersWithProjectCounts,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch debug data",
      error: error.message
    });
  }
});

// Test endpoint to create a sample project
const createTestProject = asyncHandler(async (req, res) => {
  try {
    console.log("Creating test project...");
    
    // Get a random user to assign the project to
    const users = await prisma.user.findMany({
      take: 1,
      select: { id: true, name: true, email: true }
    });
    
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No users found to assign project to"
      });
    }
    
    const randomUser = users[0];
    
    // Create a test project
    const newProject = await prisma.projects.create({
      data: {
        name: `Test Project ${Date.now()}`,
        clientName: "Test Client",
        clientIndustry: "Technology",
        timelineStart: new Date(),
        timelineEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        techStack: ["React", "Node.js"],
        modules: ["Frontend", "Backend"],
        goals: "Test project for analytics",
        tone: "Professional",
        latexContent: "Test content",
        userId: randomUser.id
      }
    });
    
    console.log("Test project created:", newProject);
    
    return res.status(200).json({
      success: true,
      message: "Test project created successfully",
      data: {
        project: newProject,
        assignedTo: randomUser
      }
    });
    
  } catch (error) {
    console.error("Error creating test project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create test project",
      error: error.message
    });
  }
});

module.exports = {
  getAnalyticsSummary,
  getUserGrowthData,
  debugDatabaseState,
  createTestProject
};
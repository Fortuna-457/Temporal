import { Role } from '../models/role.model.js'
import { User } from '../models/user.model.js'
import { Post } from '../models/post.model.js'
import { Category } from '../models/category.model.js'
import { Tag } from '../models/tag.model.js'
import { Comment } from '../models/comment.model.js'

// Configure environment variables
import dotenv from 'dotenv'
dotenv.config()

/**
 * Create the initial setup for the application
 * This function creates the necessary roles, the admin user, categories, tags, comments and posts
 * - If there is no data in the database, create it
 * - If there is data in the database, does nothing
 * @returns {Promise<void>}
 */
export const initialSetup = async () => {
  await createRoles()
  await createAdminUser()
  await createCategories()
  await createTags()
  await createComments()
  await createPosts()
}

/**
 * Create then necessary roles in the database
 */
export const createRoles = async () => {
  // Check if there are roles in the database
  const currentRoles = await Role.findAll()

  // If there are roles, do nothing
  if (currentRoles.length > 0) return

  // If there are no roles, create them
  const roles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'EDITOR' },
    { id: 3, name: 'AUTHOR' },
    { id: 4, name: 'CONTRIBUTOR' },
    { id: 5, name: 'SUBSCRIBER' }
  ]

  // Create roles
  await Role.bulkCreate(roles)

  console.log('Roles created')
}

export const createAdminUser = async () => {
  // Check if there are users in the database
  const currentUsers = await User.findAll()

  // If there are users, do nothing
  if (currentUsers.length > 0) return

  // If there are no users, create the admin user
  const adminUser = {
    display_name: 'Admin',
    username: process.env.WT_ADMIN_PASSWORD,
    password: User.encryptPassword(process.env.WT_ADMIN_PASSWORD),
    email: 'admin@wordtriss.com',
    role_id: 1
  }

  // Create the admin user
  await User.create(adminUser)

  console.log('Admin user created')
}

/**
 * Create test categories in the database
 */
export const createCategories = async () => {
  // Check if there are posts in the database
  const currentCategories = await Post.findAll()

  // If there are posts, do nothing
  if (currentCategories.length > 0) return

  // If there are no posts, create them
  const categories = [
    { name: 'Tips' },
    { name: 'Quizzes' },
    { name: 'Updates' },
    { name: 'Future' }
  ]

  // Create categories
  await Category.bulkCreate(categories)

  console.log('Categories created')
}

/**
 * Create test tags in the database
 */
export const createTags = async () => {
  // Check if there are posts in the database
  const currentTags = await Post.findAll()

  // If there are posts, do nothing
  if (currentTags.length > 0) return

  // If there are no posts, create them
  const tags = [
    { name: 'Educational' },
    { name: 'Learning' },
    { name: 'Updates' },
    { name: 'Announcements' }
  ]

  // Create categories
  await Tag.bulkCreate(tags)

  console.log('Tags created')
}

/**
 * Create test comments in the database
 */
export const createComments = async () => {
  // Check if there are comments in the database
  const currentComments = await Comment.findAll()

  // If there are comments, do nothing
  if (currentComments.length > 0) return

  // If there are no comments, create them
  const comments = [
    {
      content:
        'This update is fantastic! The new user profile customization options are exactly what I needed. Keep up the great work, Project Temporal team!',
      status: 'approved',
      user_name: 'JohnDoe123',
      post_id: null,
      parent_id: null
    },
    {
      content:
        'Love the addition of video and audio embeds. It really helps to make the educational articles more engaging. Great job on the update!',
      status: 'approved',
      user_name: 'TechGuru',
      post_id: null,
      parent_id: null
    },
    {
      content:
        'The performance improvements are noticeable. The site loads much faster now. Looking forward to the upcoming features mentioned!',
      status: 'approved',
      user_name: 'QuizMaster',
      post_id: null,
      parent_id: null
    },
    {
      content:
        'Thank you all for the support, we will tell you more news soon!',
      status: 'approved',
      user_id: 1,
      post_id: null,
      parent_id: null
    }
  ]

  // Create categories
  await Comment.bulkCreate(comments)

  console.log('Comments created')
}

/**
 * Create test posts in the database
 */
export const createPosts = async () => {
  // Check if there are posts in the database
  const currentPosts = await Post.findAll()

  // If there are posts, do nothing
  if (currentPosts.length > 0) return

  // If there are no posts, create them
  const posts = await Post.bulkCreate([
    {
      id: '1',
      title: 'Exciting Enhancements to Project Temporal CMS!',
      content:
        '<p>Dear Project Temporal Community,</p>\n<p>We are thrilled to announce a new update to the Project Temporal CMS! Our team has been working diligently to bring you exciting new features and improvements that enhance both the gaming experience and the functionality of the CMS. Here&rsquo;s a rundown of what&rsquo;s new in this update:</p>\n<h4>New Features</h4>\n<ol>\n<li>\n<p><strong>Enhanced User Profiles</strong></p>\n<ul>\n<li><strong>Customization Options</strong>: Users can now personalize their profiles with custom avatars, bios, and display settings.</li>\n<li><strong>Activity Tracking</strong>: Track your progress and activity across both the game and blog components, with detailed statistics and achievements.</li>\n</ul>\n</li>\n<li>\n<p><strong>Advanced Commenting System</strong></p>\n<ul>\n<li><strong>Threaded Comments</strong>: Improved comment system with threading for better conversation flow and readability.</li>\n<li><strong>Moderation Tools</strong>: Enhanced tools for admins to manage and moderate comments, ensuring a positive community environment.</li>\n</ul>\n</li>\n<li>\n<p><strong>Rich Media Support</strong></p>\n<ul>\n<li><strong>Video and Audio Embeds</strong>: Easily embed videos and audio clips in your posts to create more engaging and interactive content.</li>\n<li><strong>Image Galleries</strong>: Create beautiful image galleries to showcase your visuals effectively.</li>\n</ul>\n</li>\n<li>\n<p><strong>Content Scheduling</strong></p>\n<ul>\n<li><strong>Automated Publishing</strong>: Plan and schedule your posts in advance with our new content scheduling feature. Set the date and time for automatic publication.</li>\n<li><strong>Editorial Calendar</strong>: Visualize your content strategy with an editorial calendar, helping you manage and organize upcoming posts.</li>\n</ul>\n</li>\n<li>\n<p><strong>SEO Enhancements</strong></p>\n<ul>\n<li><strong>Meta Tags and Descriptions</strong>: Improved SEO tools to add meta tags, descriptions, and keywords to your posts, ensuring better visibility and search engine ranking.</li>\n<li><strong>SEO Analytics</strong>: Get insights into how your content is performing with SEO analytics, helping you optimize your posts for better reach.</li>\n</ul>\n</li>\n<li>\n<p><strong>Improved Performance</strong></p>\n<ul>\n<li><strong>Faster Load Times</strong>: We have optimized the backend and frontend performance, ensuring faster load times and a smoother user experience.</li>\n<li><strong>Scalability Improvements</strong>: Our infrastructure has been upgraded to handle more users and content, ensuring stability as our community grows.</li>\n</ul>\n</li>\n</ol>\n<h4>Bug Fixes</h4>\n<ul>\n<li><strong>Fixed</strong>: An issue where users could not update their profiles in certain conditions.</li>\n<li><strong>Resolved</strong>: Bugs related to comment notifications not being sent properly.</li>\n<li><strong>Corrected</strong>: Display issues with certain themes on mobile devices.</li>\n<li><strong>Eliminated</strong>: Various minor bugs and glitches reported by our users.</li>\n</ul>\n<h4>Upcoming Features</h4>\n<p>Stay tuned for more updates as we continue to work on exciting new features, including:</p>\n<ul>\n<li><strong>User-Generated Content</strong>: Allowing users to submit their own posts and content for the blog.</li>\n<li><strong>Enhanced Gamification</strong>: More ways to earn rewards and recognition through participation and engagement.</li>\n</ul>',
      thumbnail:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      status: 'published',
      user_id: 1,
      created_at: '2024-04-23 10:00:00',
      updated_at: '2024-04-23 10:00:00'
    },
    {
      id: '2',
      title: 'Introducing Interactive Learning Quizzes',
      content: `<p>Dear Project Temporal Enthusiasts,</p>\n<p>We are excited to announce a brand new feature in the Project Temporal CMS: Interactive Learning Quizzes! This latest addition aims to enhance the educational experience by providing engaging and interactive ways to test your knowledge and learn new concepts. Here&rsquo;s what you can expect from this exciting update:</p>\n<h4>New Features</h4>\n<ol>\n<li>\n<p><strong>Interactive Learning Quizzes</strong></p>\n<ul>\n<li><strong>Variety of Topics</strong>: Quizzes covering a wide range of topics related to geography, history, science, and more.</li>\n<li><strong>Multiple Question Types</strong>: Includes multiple-choice, true/false, matching, and fill-in-the-blank questions to keep the learning experience diverse and engaging.</li>\n<li><strong>Immediate Feedback</strong>: Get instant feedback on your answers, helping you learn and understand the material better.</li>\n</ul>\n</li>\n<li>\n<p><strong>Leaderboard Integration</strong></p>\n<ul>\n<li><strong>Competitive Edge</strong>: Earn points for correct answers and climb the leaderboard to compete with friends and other users.</li>\n<li><strong>Achievements and Badges</strong>: Unlock achievements and badges for completing quizzes and reaching milestones, adding a gamified element to your learning journey.</li>\n</ul>\n</li>\n<li>\n<p><strong>Custom Quiz Creation</strong></p>\n<ul>\n<li><strong>User-Generated Quizzes</strong>: Create and share your own quizzes with the community. Perfect for teachers, educators, and enthusiasts looking to contribute their knowledge.</li>\n<li><strong>Customizable Settings</strong>: Choose the difficulty level, number of questions, and types of questions to create tailored learning experiences.</li>\n</ul>\n</li>\n<li>\n<p><strong>Enhanced User Profiles</strong></p>\n<ul>\n<li><strong>Quiz History</strong>: Track your quiz performance and review past quizzes to monitor your progress and areas of improvement.</li>\n<li><strong>Personalized Recommendations</strong>: Based on your quiz results, receive personalized content and quiz recommendations to further your learning.</li>\n</ul>\n</li>\n</ol>\n<h4>How to Access the New Features</h4>\n<ul>\n<li><strong>Navigate to the Quizzes Section</strong>: You can find the new quizzes section in the main navigation menu.</li>\n<li><strong>Start Quizzing</strong>: Browse available quizzes by topic, difficulty, or popularity and start testing your knowledge right away.</li>\n<li><strong>Create Your Own Quiz</strong>: Head to the "Create Quiz" section under your profile to start building and sharing your quizzes.</li>\n</ul>\n<h4>Bug Fixes and Improvements</h4>\n<ul>\n<li><strong>Resolved</strong>: Issues with user profiles not displaying quiz history correctly.</li>\n<li><strong>Fixed</strong>: Performance glitches when loading quizzes on mobile devices.</li>\n<li><strong>Improved</strong>: Overall user interface for a smoother and more intuitive experience.</li>\n</ul>\n<h4>What's Next?</h4>\n<p>We are continually working to improve and expand Project Temporal. Here&rsquo;s a sneak peek at what&rsquo;s coming soon:</p>\n<ul>\n<li><strong>Live Quiz Competitions</strong>: Participate in live quiz events and compete against others in real-time.</li>\n<li><strong>Expanded Topics</strong>: More quizzes covering new and diverse subjects.</li>\n<li><strong>Integration with Educational Resources</strong>: Linking quizzes to detailed articles and resources for in-depth learning.</li>\n</ul>`,
      thumbnail:
        'https://images.unsplash.com/photo-1525302220185-c387a117886e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      status: 'published',
      user_id: 1,
      created_at: '2024-04-22 14:30:00',
      updated_at: '2024-04-22 14:30:00'
    },
    {
      id: '3',
      title: 'Explore Ancient Civilizations: A Journey Through History',
      content: `<p>Dear Adventurers,</p>\n<p>Embark on a captivating journey through time as we delve into the rich history of ancient civilizations. From the majestic pyramids of Egypt to the awe-inspiring temples of Greece, join us as we explore the wonders of the past and uncover the secrets of ancient cultures.</p>\n<h4>Unraveling Mysteries</h4>\n<p>Step back in time and witness the rise and fall of mighty empires. Discover the achievements of ancient civilizations in art, architecture, science, and philosophy. Gain insights into their customs, beliefs, and daily life as we unravel the mysteries of the past.</p>\n<h4>Immersive Learning Experience</h4>\n<p>Immerse yourself in interactive learning experiences that bring history to life. Engage in quizzes, challenges, and interactive maps that deepen your understanding of ancient civilizations. From virtual tours to multimedia presentations, our platform offers a dynamic and engaging way to learn about history.</p>\n<h4>Inspiring Exploration</h4>\n<p>Ignite your curiosity and embark on a journey of discovery. Our platform provides a wealth of resources, including articles, videos, and curated collections, to inspire your exploration. Whether you're a history enthusiast or a novice adventurer, there's something for everyone to discover and enjoy.</p>\n<h4>Join the Adventure</h4>\n<p>Are you ready to embark on a journey through history? Join us on Project Temporal and explore the wonders of ancient civilizations. Let's uncover the secrets of the past and unlock the mysteries of history together.</p>\n<p>Happy exploring!</p>\n<p>The Project Temporal Team</p>`,
      thumbnail:
        'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.wallpapers13.com%2Fwp-content%2Fuploads%2F2015%2F12%2FNature-Lake-Bled.-Desktop-background-image.jpg&f=1&nofb=1&ipt=2823ecaa364086a327e5aef7cd5a2e752875850cb3c493680cf59ea679ea340a&ipo=images',
      status: 'published',
      user_id: 1,
      created_at: '2024-04-21 08:45:00',
      updated_at: '2024-04-21 08:45:00'
    }
  ])

  // Get all categories and tags from the database
  const allCategories = await Category.findAll()
  const allTags = await Tag.findAll()
  const allComments = await Comment.findAll()

  // Create posts with associated categories and tags
  await Promise.all(
    posts.map(async (post, index) => {
      await post.addCategories(allCategories.slice(index % 3, (index % 3) + 2)) // Associate 2 categories each post
      await post.addTags(allTags.slice(index % 3, (index % 3) + 2)) // Associate 2 tags each post
      await post.addComments(allComments.slice(index % 3, (index % 3) + 2)) // Associate 2 comments each post
    })
  )

  console.log('Posts created')
}

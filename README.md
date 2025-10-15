# Instagram Clone - Frontend Project

Modern React application built with Vite, recreating core Instagram functionality with a complete frontend infrastructure.

## 📱 Project Overview

This project recreates Instagram's core features including posts, user profiles, comments, likes, and social interactions. Built as a full-stack learning project with modern React patterns and Redux state management.

## 🔍 Instagram Research & Analysis

### Core Instagram Flows & Features Implemented:

#### **1. Post System** 📝
- **Post Structure**: Image, caption, author, location, tags, comments, likes
- **CRUD Operations**: Create, read, update, delete posts
- **Post Feed**: Infinite scroll with filtering and sorting
- **Post Details**: Full post view with comments

#### **2. User Management** 👤
- **Authentication**: Login/signup system
- **User Profiles**: Profile information and post history
- **Social Features**: Follow/unfollow (planned)

#### **3. Interactions** ❤️
- **Like System**: Like/unlike posts
- **Comments**: Add and view comments on posts
- **Tagging**: Hashtag and mention support

#### **4. Navigation & UI** 🧭
- **Instagram-style Header**: Clean navigation with logo
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, Instagram-inspired interface

### Data Structures:

#### Post:
```javascript
const post = {
  _id: "post_id",
  txt: "caption text",
  imgUrl: "image_url", 
  by: {
    _id: "user_id",
    username: "username",
    imgUrl: "profile_pic_url"
  },
  loc: {
    name: "location_name",
    lat: 0,
    lng: 0
  },
  comments: [],
  likedBy: [],
  tags: ["hashtag1", "hashtag2"],
  createdAt: timestamp
}
```

#### User:
```javascript
const user = {
  _id: "user_id",
  username: "username",
  password: "password", // not in session storage
  fullname: "Full Name",
  imgUrl: "profile_pic_url",
  isAdmin: false,
  followers: ["user_id1", "user_id2"], // Array of user IDs
  following: ["user_id3", "user_id4"], // Array of user IDs
  savedPosts: ["post_id1", "post_id2"] // Array of post IDs
}
```

## 🐛 Troubleshooting

### localStorage Corruption Error

If you see errors like `users.map is not a function` or `entities.push is not a function`:

**Solution 1: Use the Clear Storage Button**
- Click the red "🗑️ Clear Storage" button in the top-right of the homepage
- Page will reload automatically with fresh storage

**Solution 2: Use Browser Console**
```javascript
// Open browser console (F12) and run:
clearInstagramStorage()
// Then reload the page
```

**Solution 3: Manual Clear**
```javascript
// In browser console:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

After clearing, the app will automatically:
1. Initialize empty storage arrays
2. Create a default admin user (username: `admin`, password: `admin`)
3. Auto-login with the test user

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser to `http://localhost:5173/`

4. **That's it!** The app will automatically:
   - Load demo data (6 users and 6 posts)
   - Log you in as `amir.avni`
   - Display a fully populated feed

## 📊 Demo Data

The app comes with **built-in demo data** that automatically loads on first start. No setup required!

### What's Included

**6 Demo Users:**
1. **amir.avni** (Admin) - Your main account
2. **sarah_photography** - Photography enthusiast
3. **mike_travels** - Travel blogger
4. **emma_foodie** - Food lover
5. **alex_fitness** - Fitness trainer
6. **luna_art** - Artist

**6 Demo Posts:**
- Beach sunset by Sarah (with likes and comments)
- Coffee & coding by Amir
- Mountain hiking by Mike (with likes and comments)
- Homemade pasta by Emma
- Morning workout by Alex (with likes and comments)
- Art painting by Luna

### How It Works

- **Automatic Loading**: Demo data initializes automatically when you first open the app
- **Static Data**: All users and posts are predefined in `src/data/`
- **Stable IDs**: User and post IDs are hardcoded for consistency
- **Auto-Login**: Automatically logs you in as `amir.avni`

### Development Commands

Open browser console (F12) and run:

```javascript
// Check current data
window.checkData()

// Refresh posts display
window.refreshPosts()

// Reset to demo data (clears everything and reloads)
localStorage.clear()
sessionStorage.clear()
window.location.reload()
```

### Modifying Demo Data

1. Edit user data: `src/data/demo-users.js`
2. Edit post data: `src/data/demo-posts.js`
3. Clear localStorage in browser console
4. Reload the page to see changes

### Future Database Migration

This demo data system is temporary. When ready to connect to a real backend:
1. Remove demo data initialization from `src/services/async-storage.service.js`
2. Replace storage service calls with API calls
3. Data structure remains compatible for easy migration

## 🏗️ Project Structure

```
src/
├── assets/
│   ├── icons/         # SVG icons
│   └── styles/        # SCSS modules
│       ├── basics/    # Core styles (layout, forms, helpers)
│       ├── cmps/      # Component styles
│       └── setup/     # SCSS variables & mixins
├── cmps/              # Reusable components
│   ├── PostList.jsx   # Post grid display
│   ├── PostPreview.jsx # Individual post preview
│   ├── InstagramSidebar.jsx # Navigation sidebar
│   ├── MobileHeader.jsx # Mobile header
│   ├── MobileFooter.jsx # Mobile footer
│   └── UserMsg.jsx    # Toast notifications
├── data/              # Demo data (temporary)
│   ├── demo-users.js  # Predefined users
│   └── demo-posts.js  # Predefined posts
├── pages/             # Route components
│   ├── HomePage.jsx   # Main feed page
│   ├── PostDetails.jsx # Individual post view
│   ├── UserDetails.jsx # User profiles
│   └── LoginSignup.jsx # Authentication
├── services/          # API and utility services
│   ├── post/          # Post CRUD operations
│   ├── user/          # User management
│   ├── async-storage.service.js # LocalStorage wrapper
│   ├── demo-data.service.js # Demo data management
│   └── event-bus.service.js # Toast notifications
└── store/            # Redux state management
    ├── actions/      # Action creators
    └── reducers/     # State reducers
```

## 🎯 Current Features

### ✅ Implemented:
- **Instagram UI**: Pixel-perfect recreation of Instagram's interface
- **Post Feed**: Display posts with images, captions, likes, and comments
- **Like System**: Like/unlike posts with animated heart button
- **Comments System**: View and add comments to posts
- **Save Posts**: Bookmark posts for later viewing
- **User Profiles**: View user information and stats
- **Navigation Sidebar**: Home, Search, Create, Profile buttons
- **Responsive Design**: Full mobile support with header/footer
- **Demo Data**: 6 users and 6 posts pre-loaded
- **Auto-Login**: Automatic login for development
- **Redux State**: Centralized state management
- **LocalStorage**: Client-side data persistence

### 🚧 Planned Features:
- **Search**: Find users and posts
- **Create Post**: Upload images and create posts
- **Follow System**: Follow/unfollow users
- **Feed Filtering**: Show only posts from followed users
- **Real-time Updates**: Live notifications
- **Stories**: 24-hour ephemeral content
- **Direct Messages**: Chat system
- **Image Upload**: Drag-and-drop file upload
- **Explore Page**: Discover new content

## 🔄 State Management

Using Redux with the following modules:
- `postModule` - Post CRUD operations and state
- `userModule` - Authentication and user data  
- `reviewModule` - Review system (legacy)
- `systemModule` - App-wide settings and loading states

### Example Usage:
```jsx
// In component:
const posts = useSelector(state => state.postModule.posts)
const user = useSelector(state => state.userModule.user)

// Action dispatch:
dispatch(loadPosts())
dispatch(addPost(newPost))
```

## 🎨 Styling Architecture

Using SCSS modules with Instagram-inspired design:
- **CSS Grid**: For post layouts and responsive design
- **Flexbox**: For component alignment
- **CSS Variables**: For consistent theming
- **Mobile-first**: Responsive breakpoints
- **Clean UI**: Instagram-style interface

### Component Styling:
```scss
.post-preview {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
}
```

## 🛠️ Development Guidelines

### Component Structure:
```jsx
export function PostPreview({ post }) {
    return (
        <article className="post-preview">
            <header>
                <Link to={`/post/${post._id}`}>{post.txt}</Link>
            </header>
            {post.imgUrl && <img src={post.imgUrl} alt="Post" />}
            {post.by && <p>Author: <span>{post.by.username}</span></p>}
        </article>
    )
}
```

### State Updates:
```jsx
// Correct Redux pattern:
dispatch({ type: ADD_POST, post: newPost })

// Correct local state:
setPosts(prevPosts => [...prevPosts, newPost])
```

## 📝 Available Scripts

- `npm run dev:local` - Start development server with local services
- `npm run dev:remote` - Start with remote backend
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Next Steps

1. **Enhanced Post Rendering**: Improve post display and layout
2. **Like System**: Implement heart button functionality  
3. **User Profiles**: Enhanced profile pages with post grids
4. **Real-time Features**: Live updates for comments and likes
5. **Image Upload**: File upload and processing
6. **Mobile Optimization**: Touch interactions and gestures

## 📄 License
MIT

---
**Instagram Clone** - Built with ❤️ for learning modern fullstack development

*Coding Academy Sprint 4 Final Project*
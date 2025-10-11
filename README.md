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

### Data Structure:
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

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev:local
```

3. Open browser to `http://localhost:5173/`

## 🏗️ Project Structure

```
src/
├── assets/
│   └── styles/        # SCSS modules
│       ├── basics/    # Core styles (layout, forms, helpers)
│       ├── cmps/      # Component styles
│       ├── pages/     # Page styles  
│       └── setup/     # SCSS variables & mixins
├── cmps/              # Reusable components
│   ├── PostList.jsx   # Post grid display
│   ├── PostPreview.jsx # Individual post preview
│   ├── PostFilter.jsx # Search and filter posts
│   ├── AppHeader.jsx  # Navigation header
│   ├── AppFooter.jsx  # Footer
│   └── UserMsg.jsx    # Toast notifications
├── pages/             # Route components
│   ├── PostIndex.jsx  # Main posts page
│   ├── PostDetails.jsx # Individual post view
│   ├── HomePage.jsx   # Landing page
│   ├── UserDetails.jsx # User profiles
│   └── LoginSignup.jsx # Authentication
├── services/          # API and utility services
│   ├── post/          # Post CRUD operations
│   ├── user/          # User management
│   └── http.service.js # HTTP client
└── store/            # Redux state management
    ├── actions/      # Action creators
    └── reducers/     # State reducers
```

## 🎯 Current Features

### ✅ Implemented:
- **Post CRUD System**: Create, read, update, delete posts
- **Instagram-like Post Structure**: Images, captions, tags, author info
- **Post Filtering**: Search by text and tags
- **Post Sorting**: By text, date, etc.
- **Comments System**: Add comments to posts
- **User Authentication**: Login/signup functionality
- **Responsive Design**: Mobile-first approach
- **Clean Navigation**: Instagram-style header

### 🚧 Planned Features:
- **Like/Unlike System**: Heart button interactions
- **User Profiles**: Enhanced profile pages
- **Follow System**: Follow/unfollow users
- **Real-time Updates**: Live comments and likes
- **Image Upload**: File upload functionality
- **Stories**: 24-hour ephemeral content
- **Direct Messages**: Chat system

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
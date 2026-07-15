# 🎓 Campus Space - Full-Stack MERN Blogging Platform

Campus Space is a modern, feature-rich, and fully responsive full-stack blogging platform built on the MERN stack. It features a custom block editor, nested comments, a secure admin dashboard, publication approval flows, automated email notifications, and robust analytics.

### 🌐 Live Demo: [https://campus-space-26.vercel.app/](https://campus-space-26.vercel.app/)

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-brightgreen.svg)](https://vitejs.dev)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://nodejs.org)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-green.svg?logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-blue.svg?logo=cloudinary)](https://cloudinary.com)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-orange.svg?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue.svg?logo=tailwindcss)](https://tailwindcss.com)

---

## 🚀 Newly Added Premium Features (Recruiter-Ready)

We have recently upgraded the platform with enterprise-grade features that demonstrate advanced full-stack capabilities:

### 🛡️ Admin Dashboard & Access Control (RBAC)
- **Role-Based Security**: Users are segmented into `user` and `admin` roles, embedded directly within JWT payloads.
- **Admin Panel UI**: A dedicated, secure dashboard to manage the entire platform.
- **Manage Users**: Admins can search users by username/email, promote/demote accounts (to/from Admin), and permanently delete users (with recursive clean-ups of their data).
- **Manage Blogs**: Admins can view, search, delete, and approve posts. Shows detailed **Status** (Live/Pending) and **Visibility** (Public/Private).

### 📧 Automated Email & Approval Workflow
- **Nodemailer SMTP Integration**: When a user publishes a post, an automated HTML email is instantly sent to the administrator.
- **One-Click Email Approval**: The admin email contains a secure, direct link. Clicking it from their email inbox instantly approves the post, making it live for everyone without logging into the portal.
- **Publication Gatekeeping**: All published posts remain private (visible only to the author and admins) until explicitly approved.

### 📈 Enhanced Content Analytics & Sorting
- **Number of Reads Counter**: Added a read tracker that increments automatically when visitors fetch a post.
- **Reads Indicators**: Displays the read count next to likes and comments across user dashboards, blog cards, and interaction bars.
- **Smart Trending Algorithm**: The "Trending" feed is sorted by total reads. Ties are resolved by showing the most recent post first.

### 🎨 Premium UI/UX & Aesthetics
- **Card-Grid Layout**: Transformed the blog feed into a responsive, premium 3-column card grid (on Home, Search, and Profiles) featuring hover transformations and category badges.
- **Horizontal Related Carousel**: Restructured the similar blogs section into a responsive, horizontal scrolling carousel of small cards.
- **Interactive Welcome Popup**: A spring-animated (`animate-scale-up`) landing modal that greets new visitors with the brand logo and slogan: *"Gain the knowledge and share the experience among each other."*
- **Sponsorship & Ads Slots**: Built a responsive `AdBanner` component that integrates Google AdSense and displays a premium fallback sponsor banner that redirects inquiries directly to Gmail.

---

## 📝 Key Features

### ✍️ Rich Content Creation
- **EditorJS Integration**: A block-style editor for writing blog posts with support for headers, paragraphs, lists, quotes, and custom image uploads.
- **Cloudinary CDN Uploads**: Multipart uploads routed to Cloudinary using custom Multer memory streams on the backend.
- **Notion-Style Slashes**: Smart block handling inside EditorJS where **Enter** creates a soft line break, and **Shift + Enter** creates a new block.
- **Drafts & Publishing**: Save blogs as drafts or publish them instantly.

### 💬 Interactive Comment & Notification System
- **Nested Comments & Replies**: A tree-structured commenting system allowing replies to comments and sub-replies.
- **Likes**: Like/unlike blogs with instant count updates in the UI.
- **Activity Notifications**: Receives real-time notifications for comments, replies, and likes.
- **Read/Unread Highlights**: Highlights recent notifications separating them from old ones.

### 👤 User Profiles & Customization
- **Dashboard**: Track user posts, views, and draft status.
- **Profile Customization**: Edit display name, bio, social links, and profile image.
- **Cloudinary Storage Cleanup**: Automatically deletes old avatar assets from the Cloudinary CDN when a new one is uploaded to conserve storage.
- **Security**: Secure password changes, bcrypt hashing, and JWT token rotation.
- **Google Authentication**: Built-in support for Google sign-in using Firebase Admin SDK.

---

## 🛠️ Tech Stack & Dependencies

### Frontend (`/frontend`)
- **Framework**: React.js (built with Vite)
- **Styling**: Tailwind CSS & Custom CSS (mobile-first, responsive layouts)
- **Router**: React Router DOM (Single Page Application routing)
- **Rich Text Editor**: `@editorjs/editorjs`
- **HTTP Client**: Axios
- **State Management**: React Context API

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (using Mongoose ODM)
- **File Uploads**: Cloudinary SDK & Multer (memory buffers stream)
- **Mail Transporter**: Nodemailer (SMTP configs)
- **Authentication**: JSON Web Token (JWT) & BcryptJS (password hashing)
- **Auth Provider**: Firebase Admin SDK (Google OAuth verification)

---

## ⚙️ Installation & Configuration

### Prerequisites
- Node.js (v16.x or higher)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account credentials
- Firebase project credentials

### 1. Clone the Repository
```bash
git clone https://github.com/Irfan-RS/Campus-Space.git
cd Campus-Space
```

### 2. Configure the Backend
Navigate to the `/server` folder:
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory and configure the variables:
```env
PORT=3000
DB_LOCATION=your_mongodb_connection_uri
SECRET_ACCESS_KEY=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=your_receive_email@example.com
SMTP_USER=your_sender_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
```

### 3. Configure the Frontend
Navigate to the `/frontend` folder:
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `/frontend` directory:
```env
VITE_SERVER_DOMAIN=http://localhost:3000
VITE_ENABLE_ADS=false
```

---

## 🏃 Running the Application

### Start Backend Server
```bash
cd server
npm start
```
*The server will run on `http://localhost:3000`*

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
*The React app will be served on `http://localhost:5173`*

---

## 🔌 API Reference

### Admin Endpoints (`/admin`)
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/admin/blogs` | `POST` | Fetch all blogs (paginated) | Yes (Admin) |
| `/admin/approve-blog` | `POST` | Approve blog | Yes (Admin) |
| `/admin/approve-blog-link/:blog_id` | `GET` | Direct email approval link | No |
| `/admin/delete-blog` | `POST` | Delete any blog | Yes (Admin) |
| `/admin/users` | `POST` | Fetch all users (paginated) | Yes (Admin) |
| `/admin/change-role` | `POST` | Promote/Demote user role | Yes (Admin) |
| `/admin/delete-user` | `POST` | Delete user and their posts | Yes (Admin) |

### Public & User Endpoints
| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/signup` | `POST` | User registration | No |
| `/signin` | `POST` | User sign-in | No |
| `/google-auth` | `POST` | Firebase Google Auth token verify | No |
| `/upload` | `POST` | Upload media to Cloudinary | Yes |
| `/create-blogs` | `POST` | Create or update blogs (draft/publish) | Yes |
| `/get-blog` | `POST` | Fetch blog details (increments reads) | No |
| `/add-comment` | `POST` | Add comments or replies | Yes |
| `/delete-comment`| `POST` | Delete comments recursively | Yes |
| `/update-profile` | `POST` | Update user details & social handles | Yes |
| `/update-profile-img`| `POST` | Update avatar & clean old CDN images | Yes |

---


## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

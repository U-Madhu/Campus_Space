# 🎓 Campus Space - Full-Stack MERN Blogging Platform

Campus Space is a modern, feature-rich, and fully responsive full-stack blogging platform built on the MERN stack. It features a rich block editor, nested comments, activity notifications, user analytics, and robust profile management.

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-brightgreen.svg)](https://vitejs.dev)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://nodejs.org)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-green.svg?logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-orange.svg?logo=firebase)](https://firebase.google.com/)
[![AWS S3](https://img.shields.io/badge/Storage-AWS%20S3-orange.svg?logo=amazon-s3)](https://aws.amazon.com/s3)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue.svg?logo=tailwindcss)](https://tailwindcss.com)

---

## 🚀 Key Features

### 📝 Rich Content Creation
- **EditorJS Integration**: A block-style editor for writing blog posts with support for headers, paragraphs, lists, quotes, and custom image uploads.
- **Banner Images**: Upload custom high-resolution blog banners directly to AWS S3.
- **Drafts & Publishing**: Save blogs as drafts or publish them instantly.

### 💬 Interactive Comment & Notification System
- **Nested Comments & Replies**: A tree-structured commenting system allowing replies to comments and sub-replies.
- **Likes**: Like/unlike blogs with instant count updates in the UI.
- **Activity Notifications**: Receives real-time-like notifications for comments, replies, and likes.
- **Read/Unread Highlights**: Highlights recent notifications separating them from old ones.

### 👤 User Profiles & Customization
- **Dashboard**: Track user posts, views, and draft status.
- **Profile Customization**: Edit display name, bio, social links, and profile image.
- **AWS S3 Cleanup**: Automatically deletes old profile images from the S3 bucket when a new one is uploaded to conserve storage.
- **Security**: Secure password changes and bcrypt hashing.
- **Google Authentication**: Built-in support for Google sign-in using Firebase Admin SDK.

---

## 🛠️ Tech Stack & Dependencies

### Frontend (`/frontend`)
- **Framework**: React.js (built with Vite)
- **Styling**: Tailwind CSS & Vanilla CSS (mobile-first, responsive layouts)
- **Router**: React Router DOM (Single Page Application routing)
- **Rich Text Editor**: `@editorjs/editorjs` (with custom image, header, list, and quote tools)
- **HTTP Client**: Axios
- **State Management**: React Context API

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (using Mongoose ODM)
- **Authentication**: JSON Web Token (JWT) & BcryptJS (password hashing)
- **Cloud Integration**: AWS SDK (S3 presigned URLs for direct client upload)
- **Auth Provider**: Firebase Admin SDK (Google OAuth verification)

---

## 📁 Folder Structure

```text
Campus-Space/
├── frontend/                 # React frontend application
│   ├── public/               # Static public assets
│   ├── src/
│   │   ├── common/           # Common utilities (AWS upload, date formattings)
│   │   ├── components/       # Reusable components (Navbar, Sidenav, CommentCard)
│   │   ├── pages/            # Page layouts (Home, Blog details, Auth form)
│   │   ├── App.jsx           # Main routing and contexts
│   │   ├── index.css         # Global tailwind directive styles
│   │   └── main.jsx          # Entry point
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                   # Express backend application
    ├── Schema/               # Mongoose Schemas (User, Blog, Comment, Notification)
    ├── server.js             # Main server logic and API routes
    ├── package.json
    └── .env.example          # Template for server environment variables
```

---

## ⚙️ Installation & Configuration

### Prerequisites
- Node.js (v16.x or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB database instance)
- AWS IAM account with S3 Full Access
- Firebase project service account credentials

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
AWS_ACCESS_KEY=your_aws_access_key_id
AWS_SCRET_ACCESS_KEY=your_aws_secret_access_key
```
*Note: Ensure AWS S3 bucket configuration matches `campus-space-image-bucket` (region `ap-south-1`).*

### 3. Configure the Frontend
Navigate to the `/frontend` folder:
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `/frontend` directory:
```env
VITE_SERVER_DOMAIN=http://localhost:3000
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

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/signup` | `POST` | User registration | No |
| `/signin` | `POST` | User sign-in | No |
| `/google-auth` | `POST` | Firebase Google Auth token verify | No |
| `/get-upload-url` | `GET` | Get S3 presigned PUT URL | Yes |
| `/create-blogs` | `POST` | Create or update blogs (draft/publish) | Yes |
| `/get-blog` | `POST` | Fetch blog details | No |
| `/add-comment` | `POST` | Add comments or replies | Yes |
| `/delete-comment`| `POST` | Delete comments recursively | Yes |
| `/update-profile` | `POST` | Update user details & social handles | Yes |
| `/update-profile-img`| `POST` | Update avatar & clean old S3 images | Yes |

---

## 🛠️ Main Bug Fixes Completed
- **AWS S3 Image Cleanup**: The backend now automatically deletes a user's previous custom profile picture from the AWS S3 bucket upon a new upload, keeping the storage optimized.
- **Nested Comments Deletion**: Recursive comment deletion now correctly aggregates the total comments deleted (including sub-replies) and decrements the blog activity count accordingly.
- **Side Nav Layout Fixed**: Added the missing `sidebar-link` classes to React Router `NavLinks` to correct the dashboard formatting.
- **Password Shadowing & Model Crashes**: Cleaned up Express response parameter shadowing and Mongoose syntax errors causing crashes on credentials changes.

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

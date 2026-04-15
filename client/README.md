# StoryHub Frontend 📝

A modern, responsive React frontend for the StoryHub blog platform. Built with React 18+, TailwindCSS, and Vite for optimal performance and developer experience.

## ✨ Features

### Authentication

-   ✅ User registration and login with JWT
-   ✅ Persistent authentication with token storage
-   ✅ Protected routes for authenticated users
-   ✅ Auto-redirect on authentication state changes

### Blog Management

-   ✅ View all blogs with beautiful card layout
-   ✅ Create new blogs with rich content
-   ✅ Edit and delete your own blogs
-   ✅ Upload cover images (base64 or Cloudinary)
-   ✅ Add tags for better organization
-   ✅ Search blogs by title, content, or author
-   ✅ Filter blogs by tags

### Comments System

-   ✅ Add comments to blog posts
-   ✅ Edit and delete your own comments
-   ✅ Real-time comment updates
-   ✅ Beautiful comment UI with user avatars

### User Profile

-   ✅ View and edit profile information
-   ✅ Upload profile picture
-   ✅ Add bio and personal details
-   ✅ User dashboard with statistics
-   ✅ View all your blogs in one place

### UI/UX

-   ✅ Responsive design (mobile, tablet, desktop)
-   ✅ Dark/Light mode toggle
-   ✅ Toast notifications for user feedback
-   ✅ Loading states and error handling
-   ✅ Beautiful animations and transitions
-   ✅ Custom scrollbar styling
-   ✅ 404 page for invalid routes

## 🚀 Tech Stack

-   **React 18+** - Modern React with hooks
-   **React Router DOM v6** - Client-side routing
-   **TailwindCSS 4** - Utility-first CSS framework
-   **Axios** - HTTP client for API requests
-   **React Hot Toast** - Beautiful toast notifications
-   **React Icons** - Icon library (Feather Icons)
-   **Vite** - Next-generation frontend tooling

## 📦 Installation

1. **Clone the repository**

    ```bash
    cd client
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Create environment file**

    ```bash
    cp .env.example .env
    ```

4. **Configure environment variables**

    ```env
    VITE_API_URL=http://localhost:5050/api
    ```

5. **Start development server**
    ```bash
    npm run dev
    ```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
client/
├── context/                 # React Context providers
│   ├── AuthContext.jsx     # Authentication state & logic
│   ├── BlogContext.jsx     # Blog CRUD operations
│   └── CommentContext.jsx  # Comment operations
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── BlogCard.jsx
│   │   ├── CommentItem.jsx
│   │   ├── Loader.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── BlogDetail.jsx
│   │   ├── CreateBlog.jsx
│   │   ├── EditBlog.jsx
│   │   ├── Dashboard.jsx
│   │   └── Profile.jsx
│   ├── lib/               # Utilities
│   │   └── api.js         # Axios instance & interceptors
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── package.json
└── vite.config.js
```

## 🔌 API Integration

The frontend connects to the backend API with the following endpoints:

### Authentication

-   `POST /api/auth/signup` - Register new user
-   `POST /api/auth/login` - Login user
-   `POST /api/auth/logout` - Logout user
-   `GET /api/auth/check` - Check authentication status
-   `PUT /api/auth/update-profile` - Update user profile

### Blogs

-   `GET /api/blog` - Get all blogs
-   `GET /api/blog/:id` - Get single blog
-   `POST /api/blog/create` - Create new blog
-   `PUT /api/blog/:id` - Update blog
-   `DELETE /api/blog/:id` - Delete blog

### Comments

-   `GET /api/comment/:blogId` - Get comments for blog
-   `POST /api/comment/:blogId` - Add comment
-   `PUT /api/comment/:id` - Update comment
-   `DELETE /api/comment/:id` - Delete comment

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize colors:

```js
theme: {
  extend: {
    colors: {
      primary: '#2563eb',
      secondary: '#9333ea',
    }
  }
}
```

### Dark Mode

The app supports dark mode out of the box. Toggle is in the Navbar.

## 🛠️ Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔐 Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5050/api
```

## 📱 Responsive Breakpoints

-   **Mobile**: < 768px
-   **Tablet**: 768px - 1024px
-   **Desktop**: > 1024px

## 🎯 Key Features Implementation

### Context API State Management

All global state is managed using React Context API:

-   `AuthContext` - User authentication & profile
-   `BlogContext` - Blog CRUD operations & filtering
-   `CommentContext` - Comment management

### Protected Routes

Routes requiring authentication are wrapped with `ProtectedRoute` component.

### Form Validation

All forms include client-side validation with error messages.

### Toast Notifications

Success/error feedback using react-hot-toast.

### Image Handling

Images are converted to base64 for storage or can be uploaded to Cloudinary.

## 🐛 Common Issues

### CORS Errors

Make sure your backend allows requests from `http://localhost:5173`

### API Connection Failed

Check that backend is running on port 5050 and `VITE_API_URL` is correct

### Dark Mode Not Working

Clear browser cache and ensure dark mode toggle is functioning

## 📄 License

MIT License - feel free to use this project for learning or production!

## 👨‍💻 Author

Built with ❤️ by the StoryHub Team

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Happy Coding! 🚀

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

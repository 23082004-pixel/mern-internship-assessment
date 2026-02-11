# MERN Stack Internship Assessment

A complete MERN stack application built for Bits and Volts Pvt. Ltd. internship assessment. This application demonstrates CRUD operations with pagination, search functionality, and CSV export capabilities.

## 🚀 Features

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB database integration
- ✅ CRUD operations for User management
- ✅ Pagination support
- ✅ Search functionality (case-insensitive)
- ✅ CSV export functionality
- ✅ File upload support for profile images
- ✅ Proper error handling
- ✅ Data validation

### Frontend Features
- ✅ React.js with modern hooks
- ✅ Ant Design UI library
- ✅ Responsive design (Mobile & Desktop)
- ✅ Component-based architecture
- ✅ React Router for navigation
- ✅ Three main screens:
  - User Listing Page with table, search, pagination
  - Add/Edit User Form
  - User View Details Page
- ✅ Form validation
- ✅ Success/error notifications
- ✅ Clean file structure

## 📁 Project Structure

```
BNV TASK/
├── backend/
│   ├── config/
│   │   └── multer.js              # File upload configuration
│   ├── controllers/
│   │   └── userController.js      # User CRUD logic
│   ├── models/
│   │   └── User.js               # User schema/model
│   ├── routes/
│   │   └── userRoutes.js         # API routes
│   ├── uploads/                  # Profile image storage
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express server
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js            # API service layer
│   │   ├── components/
│   │   │   ├── UserForm.js       # Add/Edit user form
│   │   │   ├── UserList.js       # User listing with table
│   │   │   └── UserView.js       # User details view
│   │   ├── App.js                # Main app component
│   │   ├── index.css             # Global styles
│   │   └── index.js              # App entry point
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_internship
NODE_ENV=development
```

4. Start the backend server:
```bash
# For development
npm run dev

# For production
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### User Management
- `POST /api/users` - Create new user
- `GET /api/users` - Get all users with pagination
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Search & Export
- `GET /api/users/search?keyword=<search_term>` - Search users
- `GET /api/users/export` - Export all users to CSV

### Pagination Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## 🎯 Application Screens

### 1. User Listing Page (`/`)
- Table with columns: ID, Full Name, Email, Gender, Status, Profile, Action
- Search functionality with keyword input
- Add User button
- Export to CSV button
- Pagination controls
- Action dropdown (View, Edit, Delete)

### 2. Add/Edit User Form (`/add-user` or `/edit-user/:id`)
- Form fields: First Name, Last Name, Email, Mobile, Gender, Status, Profile Upload, Location
- Form validation
- File upload for profile image
- Submit/Update button

### 3. User View Details (`/view-user/:id`)
- Complete user information display
- Profile image
- Status tags
- Additional information cards
- Clean, non-editable layout

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment Instructions

### Backend Deployment (Heroku)

1. Install Heroku CLI and login:
```bash
heroku login
```

2. Create a new Heroku app:
```bash
heroku create your-app-name
```

3. Add MongoDB Atlas addon:
```bash
heroku addons:create mongolab:sandbox
```

4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
```

5. Deploy to Heroku:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Frontend Deployment (Netlify)

1. Build the React app:
```bash
cd frontend
npm run build
```

2. Create `netlify.toml` file in frontend directory:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. Deploy to Netlify:
   - Drag and drop the `build` folder to Netlify
   - OR use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

4. Set environment variables in Netlify dashboard:
   - `REACT_APP_API_URL` = `https://your-backend-url.herokuapp.com/api`

## 📦 Project Submission

To submit your project:

1. Zip the entire project folder:
```bash
# Navigate to project root directory
cd "BNV TASK"

# Create zip file with your name
zip -r FirstName_LastName.zip .
```

2. Include the following in your submission:
   - Source code (backend and frontend)
   - README.md with setup instructions
   - Deployment URLs (both frontend and backend)
   - Any additional documentation

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file
   - Verify MongoDB service status

2. **CORS Issues**
   - Backend CORS is configured to allow all origins in development
   - For production, update CORS settings to specific domains

3. **File Upload Issues**
   - Ensure `uploads` directory exists in backend
   - Check file size limits (max 5MB)
   - Verify allowed file types (JPEG, PNG, GIF)

4. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for any syntax errors in components

## 📞 Support

For any issues or questions regarding this project, please refer to:
- Console logs for debugging
- Network tab in browser dev tools for API calls
- MongoDB Compass for database verification

---

**Built with ❤️ for Bits and Volts Pvt. Ltd. Internship Assessment**

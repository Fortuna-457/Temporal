# WordTriss
![wordtriss-high-resolution-logo](https://github.com/Tristan-Al/WordTriss/assets/101890965/db26a828-1e5d-444d-83e3-058846317ada)

A Full-Stack Blog CMS
=====================

## Table of Contents
* [Overview](#overview)
* [Main features](#main-features)
* [Technologies](#technologies)

### Overview
This manual provides comprehensive documentation for WordTriss, a full-stack blog CMS. The frontend is developed using React, the backend uses Node.js, and the database is managed with MySQL. This manual details the application's architecture, features, and usage. The Blog Application is a web-based platform for creating, managing, and publishing blog posts.

### Main Features
#### Authentication and Authorization
- **JWT (JSON Web Tokens)**: Used for authentication and securing API endpoints.
- **Role-Based Access Control (RBAC)**: Different permissions are assigned based on user roles.

#### User Roles and Permissions
- **Admin**
    - Full access to all functionalities.
- **Editor**
    - Content Management: Can create, edit, publish and delete all posts, categories, and tags. Also can moderate comments.
- **Author**
    - Post Creation: Can create, edit, publish and delete their own posts. Can create categories and tags but not delete.
- **Contributor**
    - Limited Post Creation: Can create and edit their own posts but need approval from an Editor or Admin. Also can create tags but not categories.
- **Subscriber**
    - Read-Only Access: Can view posts and leave comments. Default role when creating a new user

#### Technologies
<table>
  <tr>
    <td align="center">
      <img width="441" height="1">
      <p><strong>FRONTEND</strong></p>
    </td>
    <td align="center">
      <img width="441" height="1">
      <p><strong>BACKEND</strong></p>
    </td>
    <td align="center">
      <img width="441" height="1">
      <p><strong>TOOLS</strong></p>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/>
      <img width="50" src="https://user-images.githubusercontent.com/25181517/202896760-337261ed-ee92-4979-84c4-d4b829c7355d.png" alt="Tailwind CSS" title="Tailwind CSS"/>
      <img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/62091613/b40892ef-efb8-4b0e-a6b5-d1cfc2f3fc35" alt="Vite" title="Vite"/>
      <img width="50" src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png" alt="JavaScript" title="JavaScript"/>
    </td>
    <td align="center">
      <img width="50" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/>
      <img width="50" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" alt="Express" title="Express"/>
      <img width="50" src="https://user-images.githubusercontent.com/25181517/183896128-ec99105a-ec1a-4d85-b08b-1aa1620b2046.png" alt="MySQL" title="MySQL"/>
    </td>
    <td align="center">
      <img width="50" src="https://user-images.githubusercontent.com/25181517/192108374-8da61ba1-99ec-41d7-80b8-fb2f7c0a4948.png" alt="GitHub" title="GitHub"/>
      <img width="50" src="https://user-images.githubusercontent.com/25181517/192108372-f71d70ac-7ae6-4c0d-8395-51d8870c2ef0.png" alt="Git" title="Git"/>
      <img width="50" src="https://user-images.githubusercontent.com/25181517/192109061-e138ca71-337c-4019-8d42-4792fdaa7128.png" alt="Postman" title="Postman"/>
      <img width="50" src="https://user-images.githubusercontent.com/25181517/121401671-49102800-c959-11eb-9f6f-74d49a5e1774.png" alt="npm" title="npm"/>
      <img width="50" src="https://user-images.githubusercontent.com/25181517/192107858-fe19f043-c502-4009-8c47-476fc89718ad.png" alt="REST" title="REST"/>
    </td>
  </tr>
</table>

### Project Architecture
The application is structured into three main components:
- **Frontend**: React application for the user interface.
- **Backend**: Node.js application using Express.js to handle API requests.
- **Database**: MySQL database for storing all data.

### Project Structure
```bash
WordTriss/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ ├── database.js (DB Configuration)
│ │ ├── controllers/
│ │ │ └── ... (Logic for handling requests)
│ │ ├── middlewares/
│ │ │ └── ... (Custom middlewares)
│ │ ├── models/
│ │ │ └── ... (Database models)
│ │ ├── routes/
│ │ │ └── ... (Express routes)
│ │ ├── uploads/
│ │ │ ├── avatars/
│ │ │ │ └── ... (Users profile images uploaded)
│ │ │ ├── posts/
│ │ │ │ └── ... (Users posts images uploaded)
│ │ ├── utils/
│ │ │ ├── initialSetup.js (Insert initial data in db)
│ │ │ └── utils.js (Utility functions and scripts)
│ │ ├── app.js
│ │ └── index.js
│ ├── .gitignore
│ ├── .dockerignore
│ ├── .prettierrc
│ ├── .env
│ ├── Dockerfile
│ ├── package.json
│ └── README.md
├── frontend/
│ ├── public/
│ │ └── ... (React public files)
│ ├── src/
│ │ ├── assets/
│ │ │ ├── css/
│ │ │ │ └── ... (CSS Stylesheets)
│ │ │ ├── img/
│ │ │ │ └── ... (Images)
│ │ ├── components/
│ │ │ └── ... (React components)
│ │ ├── hooks/
│ │ │ └── ... (Custom hooks)
│ │ ├── layouts/
│ │ │ └── ... (Layout for pages)
│ │ ├── pages/
│ │ │ └── ... (React pages)
│ │ ├── providers/
│ │ │ └── ThemeProvider.jsx (Provider for theme)
│ │ ├── routes/
│ │ │ ├── AdminRoutes.jsx (Routes for Admin Area)
│ │ │ └── PublicRoutes.jsx (Routes for Public Area)
│ │ ├── services/
│ │ │ └── ... (Handles API service calls)
│ │ └── index.js
│ ├── .gitignore
│ ├── .dockerignore
│ ├── .prettierrc
│ ├── .env
│ ├── Dockerfile
│ ├── tailwind.config.js
│ ├── vite.config.js
│ ├── package.json
│ └── README.md
└──
```

### Frontend (React) Documentation
- **Technology Stack**
  - **React**: A JavaScript library for building user interfaces.
  - **Redux**: For state management
  - **React Router**: For navigation and routing.
- **Dependencies Usage**
  - **@auth-kit/react-router**: Integrates authentication capabilities with React Router.
  - **@heroicons/react**: Provides a set of free, high-quality SVG icons for React.
  - **@material-tailwind/react**: A library that combines Material Design with Tailwind CSS for building beautiful interfaces.
  - **@tinymce/tinymce-react**: A rich text editor component for React.
  - **date-fns**: A modern JavaScript date utility library.
  - **js-cookie**: A simple, lightweight JavaScript API for handling cookies.
  - **jwt-decode**: A library to decode JSON Web Tokens (JWT).
  - **react-auth-kit**: Provides a comprehensive authentication solution for React.
  - **react-dom**: Serves as the entry point to the DOM and server renderers for React.
  - **react-toastify**: A library to add notifications to your app with ease.

### Backend (Node.js) Documentation
- **Technology Stack**
  - **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
  - **Express.js**: A minimal and flexible Node.js web application framework.
  - **Sequelize**: An ORM for MySQL, providing a straightforward way to interact with the database.
  - **JWT (jsonwebtoken)**: For authentication via JSON Web Tokens.
- **Dependencies Usage**
  - **bcryptjs**: For hashing and comparing passwords.
  - **cors**: To enable Cross-Origin Resource Sharing.
  - **dotenv**: To load environment variables from a .env file.
  - **multer**: Middleware for handling multipart/form-data, used for file uploads.
  - **mysql2**: A MySQL client for Node.js, optimized for performance.
  - **nodemon**: A utility that monitors for any changes in your source and automatically restarts your server.
  - **process**: Provides various process-related utilities.

### Endpoints
### Authentication
#### Login
- **Endpoint**: `POST api/login`
- **Requires**: JSON object with the user's data.
- **Response**: JSON object with the JWT token.

#### Refresh Token
- **Endpoint**: `POST /api/refresh-token`
- **Requires**: JSON object with the user's data.

### User
#### Get all
- **Endpoint**: `GET /api/users`
- **Response**: JSON array of all users.

#### Get by Id
- **Endpoint**: `GET /api/users/:id`
- **Response**: JSON object with the user’s data.

#### Create
- **Endpoint**: `POST /api/users`
- **Requires**: JSON object with the user's data.
- **Response**: JSON object with the new user's data.

#### Update
- **Endpoint**: `POST /api/users`
- **Requires**: JSON object with the user data.
- **Response**: JSON object with the updated user data.

#### Delete
- **Endpoint**: `DELETE /api/users/:id`
- **Requires**: JSON object with the user's data.
- **Response**: Success message.

### Get Posts
- **Endpoint**: `GET /api/users/:id/posts`
- **Response**: JSON array of all user posts.

### Post
#### Get all
- **Endpoint**: `GET /api/posts`
- **Response**: JSON array of all posts.

#### Get by Id
- **Endpoint**: `GET /api/posts/:id`
- **Response**: JSON object with the post data.

#### Create
- **Endpoint**: `POST /api/posts`
- **Requires**: JSON object with the post data.
- **Response**: JSON object with the new post data.

#### Update
- **Endpoint**: `POST /api/posts`
- **Requires**: JSON object with the user data.
- **Response**: JSON object with the updated post data.

#### Delete
- **Endpoint**: `DELETE /api/posts/:id`
- **Requires**: JSON object with the post data.
- **Response**: Success message.

### Categories
#### Get all
- **Endpoint**: `GET /api/categories`
- **Response**: JSON array of all categories.

#### Get by Id
- **Endpoint**: `GET /api/categories/:id`
- **Response**: JSON object with the category data.

#### Create
- **Endpoint**: `POST /api/categories`
- **Requires**: JSON object with the category data.
- **Response**: JSON object with the new category data.

#### Update
- **Endpoint**: `POST /api/categories`
- **Requires**: JSON object with the category data.
- **Response**: JSON object with the updated category data.

#### Delete
- **Endpoint**: `DELETE /api/categories/:id`
- **Requires**: JSON object with the category data.
- **Response**: Success message.

### Get Posts
- **Endpoint**: `GET /api/categories/:id/posts`
- **Response**: JSON array of all posts which contains the category.

### Tag
#### Get all
- **Endpoint**: `GET /api/tags`
- **Response**: JSON array of all tags.

#### Get by Id
- **Endpoint**: `GET /api/tags/:id`
- **Response**: JSON object with the tag data.

#### Create
- **Endpoint**: `POST /api/tags`
- **Requires**: JSON object with the tag data.
- **Response**: JSON object with the new tag data.

#### Update
- **Endpoint**: `POST /api/tags`
- **Requires**: JSON object with the tag data.
- **Response**: JSON object with the updated tag data.

#### Delete
- **Endpoint**: `DELETE /api/tags/:id`
- **Requires**: JSON object with the tag data.
- **Response**: Success message.

### Get Posts
- **Endpoint**: `GET /api/tags/:id/posts`
- **Response**: JSON array of all posts which contains the tag.

### Comment
#### Get all
- **Endpoint**: `GET /api/comments`
- **Response**: JSON array of all comments.

#### Get by Id
- **Endpoint**: `GET /api/comments/:id`
- **Response**: JSON object with the comment data.

#### Create
- **Endpoint**: `POST /api/comments`
- **Requires**: JSON object with the comment data.
- **Response**: JSON object with the new comment data.

#### Update
- **Endpoint**: `POST /api/comments`
- **Requires**: JSON object with the comment data.
- **Response**: JSON object with the updated comment data.

#### Delete
- **Endpoint**: `DELETE /api/comments/:id`
- **Requires**: JSON object with the comment data.
- **Response**: Success message.

### Example Response
```http request
# Request GET USER BY ID
GET http://localhost:5000/api/users/1

# Success Response
{
  "ok": true,
  "statusCode": 200,
  "timestamp": "2024-06-06T12:52:33.149Z",
  "message": "Success",
  "details": null,
  "body": {
    "id": 1,
    "displayName": "Example Name",
    "username": "username",
    "email": "user@wordtriss.com",
    "biography": "My example biography",
    "picture": null,
    "roleId": 5
  }
}

# Bad Response
{
  "ok": false,
  "statusCode": 404,
  "timestamp": "2024-06-06T12:55:39.063Z",
  "message": "No user found",
  "details": null,
  "body": null
}

# Token Expired
{
  "ok": false,
  "statusCode": 403,
  "timestamp": "2024-06-06T12:55:39.063Z",
  "message": "jwt expired",
  "details": null,
  "body": null
}
```

### Database Schema
![database-schema](https://github.com/Tristan-Al/WordTriss/assets/101890965/3f69e76b-f222-40aa-825c-019887dcae02)


#### Automatic Schema Creation
The WordTriss project is configured to automatically create the database schema upon installation. This feature simplifies the setup process and ensures that the necessary tables and relationships are correctly established without requiring manual intervention.

### Configuration Details
#### Sequelize
The project uses Sequelize, an ORM for Node.js, to manage database interactions. Sequelize's sync method is utilized to create the database schema based on the defined models.

#### initialSetup.js
This utility script handles the initial setup, including schema creation and the insertion of initial data.

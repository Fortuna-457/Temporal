import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import RequireAuth from '@auth-kit/react-router/RequireAuth'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/Admin/Dashboard/Dashboard'
import PostsDashboard from '../pages/Admin/Posts/PostsDashboard'
import EditPost from '../pages/Admin/Posts/EditPost'
import Profile from '../pages/Admin/Profile/Profile'
import CreatePost from '../pages/Admin/Posts/CreatePost'
import CategoriesDashboard from '../pages/Admin/Categories/CategoriesDashboard'
import TagsDashboard from '../pages/Admin/Tags/TagsDashboard'
import UsersDashboard from '../pages/Admin/Users/UsersDashboard'
import EditUser from '../pages/Admin/Users/EditUser'
import CreateUser from '../pages/Admin/Users/CreateUser'
import CommentsDashboard from '../pages/Admin/Comments/CommentsDashboard'

export default function AdminRoutes() {
  return (
    <>
      <Route
        path='/wt-content/dashboard'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<Dashboard />} />
          </RequireAuth>
        }
      />
      <Route
        path='/wt-content/profile'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<Profile />} />
          </RequireAuth>
        }
      />

      {/* Posts */}
      <Route
        path='/wt-content/posts'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<PostsDashboard />} />
          </RequireAuth>
        }
      />

      <Route
        path='/wt-content/posts/edit/:id'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <EditPost />
          </RequireAuth>
        }
      />

      <Route
        path='/wt-content/posts/create'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <CreatePost />
          </RequireAuth>
        }
      />

      {/* Categories */}
      <Route
        path='/wt-content/categories'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<CategoriesDashboard />} />
          </RequireAuth>
        }
      />

      {/* Tags */}
      <Route
        path='/wt-content/tags'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<TagsDashboard />} />
          </RequireAuth>
        }
      />

      {/* Users */}
      <Route
        path='/wt-content/users'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<UsersDashboard />} />
          </RequireAuth>
        }
      />

      <Route
        path='/wt-content/users/edit/:id'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<EditUser />} />
          </RequireAuth>
        }
      />

      <Route
        path='/wt-content/users/create'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<CreateUser />} />
          </RequireAuth>
        }
      />

      {/* Comments */}
      <Route
        path='/wt-content/comments'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<CommentsDashboard />} />
          </RequireAuth>
        }
      />

      {/* Settings */}
      <Route
        path='/wt-content/settings'
        element={
          <RequireAuth fallbackPath={'/login'}>
            <AdminLayout children={<div>Settings</div>} />
          </RequireAuth>
        }
      />

      <Route
        path='/wt-content'
        element={<Navigate to='/wt-content/dashboard' replace />}
      />
      <Route
        path='/wt-content/*'
        element={<Navigate to='/wt-content/dashboard' replace />}
      />
    </>
  )
}

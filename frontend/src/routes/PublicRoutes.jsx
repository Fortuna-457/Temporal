import React from 'react'
import { Route } from 'react-router-dom'
import DefaultLayout from '../layouts/DefaultLayout'
import Home from '../pages/Public/Home'
import Login from '../pages/Public/Login'
import Register from '../pages/Public/Register'
import Blog from '../pages/Public/Blog'
import SinglePost from '../pages/Public/Single'
import Archives from '../pages/Public/Archives'
import NotFound from '../pages/Public/NotFound'
import Contact from '../pages/Public/Contact'

export default function PublicRoutes() {
  return (
    <>
      <Route path='*' element={<NotFound />} />

      <Route index element={<Home />} />

      <Route path='/login' element={<Login />} />

      <Route path='/register' element={<Register />} />

      <Route path='/contact' element={<Contact />} />

      <Route
        path='/blog'
        element={<DefaultLayout children={<Blog />} title={'Blog'} />}
      />

      <Route path='/posts/:id' element={<SinglePost />} />

      <Route
        path='/:topic/:id'
        element={<DefaultLayout children={<Archives />} title={'Archives'} />}
      />
    </>
  )
}

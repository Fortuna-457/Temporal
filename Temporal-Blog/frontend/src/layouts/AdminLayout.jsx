import React, { useState } from 'react'
import AdminSidebar from '../components/Sidebars/AdminSidebar'

export default function AdminAreaLayout({ children }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className='App bg-gray-200 dark:bg-gray-900 flex'>
      <AdminSidebar
        expanded={expanded}
        onClick={() => setExpanded((curr) => !curr)}
      />
      <main className={`w-full py-2 pr-2`}>{children}</main>
    </div>
  )
}

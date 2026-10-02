import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home.tsx';
import Course from './pages/Course.tsx';
import About from './pages/About.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Organization from './users/Organization.tsx';
import Education from './users/Education.tsx';
import MyCourse from './users/MyCourse.tsx';
import Profile from './users/Profile.tsx';
import MyTest from './users/MyTest.tsx';
import Dashboard from './admin/Dashboard.tsx';
import Users from './admin/Users.tsx';
import Courses from './admin/Courses.tsx';
import Organizations from './admin/Organizations.tsx';
import NotFound from './pages/NotFound.tsx';

// Admin Layout (Sidebar + Topbar এর জন্য)
import AdminLayout from './admin/AdminLayout.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/courses",
        element: <Course />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/users/organization",
        element: <Organization />,
      },
      {
        path: "users/education",
        element: <Education />
      },
      {
        path: "/users/my-courses",
        element: <MyCourse />
      },
      {
        path: "/users/my-profile",
        element: <Profile />
      },
      {
        path: "/users/my-tests",
        element: <MyTest />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "organizations",
        element: <Organizations />,
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
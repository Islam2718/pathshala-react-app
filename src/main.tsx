import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home.tsx';
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
        path: "/admin/dashboard",
        element: <Dashboard />
      },
      {
        path: "/admin/users",
        element: <Users />
      },
      {
        path: "/admin/courses",
        element: <Courses />
      },
      {
        path: "/admin/organizations",
        element: <Organizations />
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
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)

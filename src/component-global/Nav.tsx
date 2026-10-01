import { Link } from "react-router-dom";

function Nav() {
  return (
    <>
      <header>
        <h1>Pathshala</h1>
      </header>
      <nav>
        <Link to="/home">Home</Link> |{" "}
        <Link to="/about">About</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Signup</Link> |{" "}
        <Link to="/users/organization">Organization</Link> |{" "}
        <Link to="/users/education">Education</Link> |{" "}
        <Link to="/users/my-courses">My Courses</Link> |{" "}
        <Link to="/users/my-profile">My Profile</Link> |{" "}
        <Link to="/users/my-tests">My Tests</Link> |{" "}
        <Link to="/admin/dashboard">Dashboard</Link> |{" "}
        <Link to="/admin/users">Users</Link> |{" "}
        <Link to="/admin/courses">Courses</Link> |{" "}
        <Link to="/admin/organizations">Organizations</Link>
      </nav>
    </>
  )
}
export default Nav;
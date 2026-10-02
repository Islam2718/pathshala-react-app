import { Outlet, useLocation } from "react-router-dom";
import Nav from "./component-global/Nav.tsx";
import Footer from "./component-global/Footer.tsx";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { session } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Nav />}
      <Outlet context={{ session }} />
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
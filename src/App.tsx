import { Outlet } from "react-router-dom";
import Nav from "./component-global/Nav.tsx";
import Footer from "./component-global/Footer.tsx";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { session } = useAuth();

  return (
    <>
      <Nav />
      <Outlet context={{ session }} />
      <Footer />
    </>
  );
}

export default App;
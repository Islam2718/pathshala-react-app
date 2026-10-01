import { Outlet } from "react-router-dom";
import Nav from "./component-global/Nav.tsx";

function App() {  
  // const projectName = 'Pathshala App';
  return (
    <>
      {/* <Nav /> nav & header  */}
      <Nav />
      <Outlet />
    </>
  )
}

export default App

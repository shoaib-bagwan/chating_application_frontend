import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Add Bootstrap
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { ChatProvider } from "./Components/Context";
import Home from "./Components/Home";
import Login from "./Components/Login";
import NewRegister from "./Components/NewRegister";
function App() {
  return (
    <BrowserRouter>
      
      <ChatProvider>
        <Routes>
          <Route path="/register" element={<NewRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./admin/Dashboard";
import UserApp from "./user/UserApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Dashboard */}
        <Route path="/admin/*" element={<Dashboard />} />

        {/* Public App */}
        <Route path="/*" element={<UserApp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
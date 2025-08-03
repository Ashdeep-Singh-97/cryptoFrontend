import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import AuthForm from "./Pages/AuthForm"
import WithAuth from "./HOC/WithAuth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/Dashboard" element={
          <WithAuth>
            <Dashboard />
          </WithAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;

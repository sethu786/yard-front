import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Transactions from "./components/transactions";
import Dashboard from "./components/dashboard";
import Budgets from "./components/budgets";
import AddTransaction from "./components/addTransaction";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h2 className="logo">💸 Finance Manager</h2>
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/transactions">Transactions</Link></li>
            <li><Link to="/add-transaction">Add Transaction</Link></li>
            <li><Link to="/budgets">Budgets</Link></li>
            {/* <li><Link to="/login">Login</Link></li> */}
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/add-transaction" element={<AddTransaction/>} />
            <Route path="/budgets" element={<Budgets />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Layout from "./components/Layout.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/transactions/Transactions.jsx";
import AddTransaction from "./pages/transactions/AddTransaction.jsx";
import EditTransaction from "./pages/transactions/EditTransaction.jsx";
import Categories from "./pages/Categories.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import Reports from "./pages/Reports.jsx";
import Profile from "./pages/Profile.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminTransactions from "./pages/admin/AdminTransactions.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/add" element={<AddTransaction />} />
        <Route path="transactions/:id/edit" element={<EditTransaction />} />
        <Route path="categories" element={<Categories />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />

        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="admin/transactions"
          element={
            <AdminRoute>
              <AdminTransactions />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;

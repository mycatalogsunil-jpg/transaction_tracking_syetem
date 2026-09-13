import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import TransactionForm from "./TransactionForm.jsx";

const AddTransaction = () => {
  const navigate = useNavigate();

  const submit = async (data) => {
    await api.post("/transactions", data);
    navigate("/transactions");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Add Transaction</h2>
      <p className="mt-1 text-sm text-slate-500">
        Record a new income or expense.
      </p>

      <TransactionForm onSubmit={submit} submitLabel="Save Transaction" />
    </div>
  );
};

export default AddTransaction;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";
import TransactionForm from "./TransactionForm.jsx";

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    api.get(`/transactions/${id}`).then((res) => {
      setTransaction(res.data.transaction);
    });
  }, [id]);

  const submit = async (data) => {
    await api.put(`/transactions/${id}`, data);
    navigate("/transactions");
  };

  if (!transaction) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Edit Transaction</h2>
      <p className="mt-1 text-sm text-slate-500">
        Update transaction details.
      </p>

      <TransactionForm
        initialData={transaction}
        onSubmit={submit}
        submitLabel="Update Transaction"
      />
    </div>
  );
};

export default EditTransaction;

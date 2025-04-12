

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios";
import { useSharedMonth } from "../hooks/MonthContext";
import { Trash2 } from "lucide-react";


// Mock data - will be fetched from backend
const getMonthData = (monthOffset) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthOffset);
  const monthName = date.toLocaleString("default", { month: "long", year: "numeric" });

  return {
    month: monthName,
    chartData: [
      { day: "Week 1", amount: 1200 },
      { day: "Week 2", amount: 1800 },
      { day: "Week 3", amount: 1500 },
      { day: "Week 4", amount: 2100 },
    ],
    expenses: [
      { id: 1, amount: 45, category: "Food", date: "2024-01-15 14:30", description: "Lunch" },
      { id: 2, amount: 120, category: "Shopping", date: "2024-01-14 10:20", description: "Clothes" },
      { id: 3, amount: 30, category: "Transport", date: "2024-01-13 08:15", description: "Uber" },
      { id: 4, amount: 85, category: "Entertainment", date: "2024-01-12 19:45", description: "Movie tickets" },
    ],
  };
};

const Expense = () => {
  // const [monthOffset, setMonthOffset] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: "", category: "" });
  const [userData, setUserData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  // const [month, setMonth] = useState("");

  const { month, monthOffset, setMonthOffset } = useSharedMonth();

  //const data = getMonthData(monthOffset);

  // const getMonthData = (monthOffset) => {
  //   const date = new Date();
  //   date.setMonth(date.getMonth() - monthOffset);
  //   const monthName = date.toLocaleString("default", { month: "long", year: "numeric" });
  //   setMonth(monthName);
  //   console.log("Month:", monthName);
  // }

  const fetchuserData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem("user"));
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchuserData();
    // fetchExpenses();
    // totalExpenses();
    // getMonthData(monthOffset);
  }, []);

  useEffect(() => {
    if (userData && month) {
      fetchExpenses();
      totalExpenses();
    }
  }, [userData, month]);

  const handleAddExpense = async () => {
    // This will send data to backend
    // const res = await axios.post("http://localhost:5000/expenses", {
    //   user_id: 2, //userData.id,
    //   category: newExpense.category,
    //   amount: newExpense.amount,
    // })
    // console.log("Adding expense:", res);
    // setIsDialogOpen(false);
    // setNewExpense({ amount: "", category: "" });
    // fetchExpenses();
    // totalExpenses();
    try {
      await axios.post("http://localhost:5000/expenses", {
        user_id: 2, //userData.id,
        category: newExpense.category,
        amount: newExpense.amount,
      });

      setIsDialogOpen(false);
      setNewExpense({ category: "", amount: "" });

      // ✅ Re-fetch current month’s expenses immediately
      fetchExpenses();
      totalExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };



  useEffect(() => {
    // Whenever 'month' changes, fetch that month's expenses
    if (month) {
      fetchExpenses();
      totalExpenses();
    }
  }, [month]);

  const fetchExpenses = async () => {
    try {
      // const res = await axios.post(`http://localhost:5000/expenses/${userData.id}`);
      const res = await axios.post(`http://localhost:5000/expenses/2`, {
        month: month
      });
      setExpenses(res.data);
      console.log("Expenses:", res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  // useEffect(() => {
  //   if (userData) {
  //     fetchExpenses();
  //   }
  // }, [userData]);


  const totalExpenses = async () => {
    try {
      //    const res = await axios.post(`http://localhost:5000/expenses/${userData.id}/group_expense`, {
      //   month: month
      // });
      const res = await axios.post(`http://localhost:5000/expenses/2/group_expense`, {
        month: month
      });
      console.log("Month in totalExpenses:", month);
      const formattedData = res.data.map(item => ({
        ...item,
        total_amount: parseFloat(item.total_amount),
      }));
      setGroupedExpenses(formattedData);
      console.log("Grouped Expenses:", formattedData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }

  const deleteExpense = (expense_id) => async () => {
    try {
      // const res = await axios.delete(`http://localhost:5000/budget/${userData.id}/${budget_id}`);
      const res = await axios.delete(`http://localhost:5000/expenses/2/${expense_id}`);
      console.log("Deleted Expense:", res);
      fetchExpenses();
      totalExpenses();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDialogOpen(false)} />
          <div className="relative z-50 w-[90%] max-w-md rounded-2xl bg-red-100 shadow-2xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Expense</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4 text-gray-900" />
              </button>
            </div>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium leading-none text-gray-900 mb-1">Amount</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium leading-none text-gray-900 mb-1">Category</label>
                <select
                  id="category"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-gray-700 bg-white"
                >
                  <option value="">Select category</option>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="bills">Bills</option>
                </select>
              </div>
              <button
                onClick={handleAddExpense}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Monthly Expenses</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMonthOffset(monthOffset + 1)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-semibold min-w-[180px] text-center">
                {month}
              </span>
              <button
                onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))}
                disabled={monthOffset === 0}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupedExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_amount" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Recent Expenses</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.expense_id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-semibold">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category} • {expense.date}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold text-lg">${expense.amount}</span>
                  <Trash2 onClick={deleteExpense(expense.expense_id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;


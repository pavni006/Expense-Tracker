import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import  {useSharedMonth}  from "../hooks/MonthContext";



// Mock data - will be fetched from backend
const getMonthBudgets = (monthOffset) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthOffset);
  const monthName = date.toLocaleString("default", { month: "long", year: "numeric" });

  return {
    month: monthName,
    budgets: [
      { id: 1, category: "Food", amount: 5000, spent: 4500, percentage: 90 },
      { id: 2, category: "Transport", amount: 3000, spent: 2300, percentage: 77 },
      { id: 3, category: "Entertainment", amount: 2000, spent: 1800, percentage: 90 },
      { id: 4, category: "Shopping", amount: 4000, spent: 3200, percentage: 80 },
    ],
  };
};

const Income = () => {
 // const [monthOffset, setMonthOffset] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({ amount: "", category: "" });
  const [userData, setUserData] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState([]);
 // const [month, setMonth] = useState("");

  const { month, monthOffset, setMonthOffset } = useSharedMonth();

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
}, []);

useEffect(() => {
  if (month) {
    fetchBudgets();
    totalSpent();
  }
}, [month]);

  // const data = getMonthBudgets(monthOffset);

  const handleAddBudget = async () => {
    // const res = await axios.post("http://localhost:5000/budget", {
    //   user_id: 2, //userData._id,
    //   category: newBudget.category,
    //   amount: newBudget.amount,
    // })
    // console.log("Adding budget:", res);
    // setIsDialogOpen(false);
    // setNewBudget({ amount: "", category: "" });
    // fetchBudgets();
    // totalSpent();
    try {
    await axios.post("http://localhost:5000/budget", {
      user_id: 2, //userData.id,
      category: newBudget.category,
      amount: newBudget.amount,
    });

    setIsDialogOpen(false);
    setNewBudget({ category: "", amount: "" });

    // ✅ Re-fetch current month’s expenses immediately
    fetchBudgets();
    totalSpent();
  } catch (error) {
    console.error("Error adding expense:", error);
  }
  };

  

  useEffect(() => {
    // Whenever 'month' changes, fetch that month's expenses
    if (month) {
      fetchBudgets();
      totalSpent();
    }
  }, [month]);

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-primary";
  };

  const fetchBudgets = async () => {
    try {
      // const res = await axios.post(`http://localhost:5000/budget/${userData.id}`, {
      //   month: month
      // });
      const res = await axios.post(`http://localhost:5000/budget/2` , {
        month: month
      });
      const formattedData = res.data.map(item => ({
        ...item,
        amount: parseFloat(item.amount) || 0,
      }));
      setBudgets(formattedData);
      console.log("budgets : ", formattedData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  // useEffect(() => {
  //   if (userData) {
  //     fetchBudgets();
  //   }
  // }, [userData]);

  //   const fetchBudgets = async () => {
  //   try {
  //     // 1️⃣ Fetch budgets
  //     // const res = await axios.get(`http://localhost:5000/budget/${userData.id}`);
  //     const res = await axios.get(`http://localhost:5000/budget/2`);
  //     const budgetsData = res.data;

  //     // 2️⃣ Then fetch total spent
  //     const spentRes = await axios.get(`http://localhost:5000/budget/2/total_spent`);
  //     const spentData = spentRes.data.map(item => ({
  //       ...item,
  //       total_amount: parseFloat(item.total_amount),
  //     }));

  //     // 3️⃣ Merge category-wise
  //     const mergedData = budgetsData.map(budget => {
  //       const matchedExpense = spentData.find(
  //         expense => expense.category.toLowerCase() === budget.category.toLowerCase()
  //       );

  //       const amount = parseFloat(budget.amount) || 0;
  //   const spent = matchedExpense ? parseFloat(matchedExpense.total_amount) || 0 : 0;
  //   const percentage = amount ? Math.round((spent / amount) * 100) : 0;

  //       return { ...budget, spent, percentage };
  //     });

  //     // 4️⃣ Set merged data
  //     setBudgets(mergedData);
  //     setTotalExpenses(spentData);

  //     console.log("Merged Budgets:", mergedData);
  //   } catch (error) {
  //     console.error("Error fetching budgets or expenses:", error);
  //   }
  // };


  const totalSpent = async () => {
    try {
      // const res = await axios.post(`http://localhost:5000/expenses/${userData.id}/group_expense`, {
      //   month: month
      // });
      const res = await axios.post(`http://localhost:5000/expenses/2/group_expense`, {
        month: month
      });
      const formattedData = res.data.map(item => ({
        ...item,
        total_amount: parseFloat(item.total_amount),
      }));
      setTotalExpenses(formattedData);
      console.log(" spent : ", formattedData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }


  // useEffect(() => {
  //   if (budgets.length
  //     // && totalExpenses.length

  //   ) {
  //     const mergedData = budgets.map(budget => {
  //       const matchedExpense = totalExpenses.find(
  //         exp => exp.category.toLowerCase() === budget.category.toLowerCase()
  //       );

  //       const amount = parseFloat(budget.amount) || 0;
  //       const spent = matchedExpense ? parseFloat(matchedExpense.total_amount) || 0 : 0;
  //       const percentage = amount ? Math.round((spent / amount) * 100) : 0;

  //       return { ...budget, amount, spent, percentage };
  //     });

  //     setBudgets(mergedData);
  //     console.log(setBudgets);
  //   }
  // }, [budgets, totalExpenses]);

  useEffect(() => {
  if (budgets.length || totalExpenses.length) {
    const mergedData = budgets.map(budget => {
      const matchedExpense = totalExpenses.find(
        exp => exp.category.toLowerCase() === budget.category.toLowerCase()
      );

      const amount = parseFloat(budget.amount) || 0;
      const spent = matchedExpense ? parseFloat(matchedExpense.total_amount) || 0 : 0;
      const percentage = amount ? Math.round((spent / amount) * 100) : 0;

      return { ...budget, spent, percentage };
    });

    // ✅ Only update when merged data actually changes
    setBudgets(prev => JSON.stringify(prev) === JSON.stringify(mergedData) ? prev : mergedData);
  }
}, [totalExpenses]);



  const deleteBudget = (budget_id) => async () => {
    try {
      // const res = await axios.delete(`http://localhost:5000/budget/${userData.id}/${budget_id}`);
      const res = await axios.delete(`http://localhost:5000/budget/2/${budget_id}`);
      console.log("Deleted budget:", res);
      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="h-4 w-4" />
          Add Budget
        </button>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDialogOpen(false)} />
          <div className="relative z-50 w-[90%] max-w-md rounded-2xl bg-red-100 shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">Add New Budget</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4 text-gray-900" />
              </button>
            </div>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="budget-amount" className="text-sm font-medium leading-none text-gray-900 mb-1">Amount</label>
                <input
                  id="budget-amount"
                  type="number"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="budget-category" className="text-sm font-medium leading-none text-gray-900 mb-1">Category</label>
                <select
                  id="budget-category"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
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
                onClick={handleAddBudget}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Add Budget
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Monthly Budgets</h3>
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
          <div className="space-y-6">
            {budgets.map((budget) => (
              <div key={budget.budget_id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{budget.category}</span>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      ${budget.amount}
                    </span>
                    <Trash2 onClick={deleteBudget(budget.budget_id)} />
                  </div>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full w-full flex-1 transition-all ${getProgressColor(budget.percentage)}`}
                    style={{ transform: `translateX(-${100 - budget.percentage}%)` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      budget.percentage >= 90
                        ? "text-destructive font-bold"
                        : "text-muted-foreground"
                    }
                  >
                    {budget.percentage}% used
                  </span>
                  <span className="text-muted-foreground">
                    ${((budget.amount || 0) - (budget.spent || 0)).toLocaleString()} remaining
                  </span>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Budget Summary</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-semibold">Total Budget</span>
              <span className="font-bold text-lg">
                ${budgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-semibold">Total Spent</span>
              <span className="font-bold text-lg">
                ${budgets.reduce((sum, b) => sum + b.spent, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <span className="font-semibold">Remaining</span>
              <span className="font-bold text-lg text-primary">
                $
                {budgets
                  .reduce((sum, b) => sum + (b.amount - b.spent), 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;

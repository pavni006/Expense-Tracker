

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSharedMonth } from "../hooks/MonthContext";

// Mock data - will be fetched from backend
const expenseData = [
  { category: "Food", amount: 4500, color: "hsl(var(--chart-1))" },
  { category: "Transport", amount: 2300, color: "hsl(var(--chart-2))" },
  { category: "Entertainment", amount: 1800, color: "hsl(var(--chart-3))" },
  { category: "Shopping", amount: 3200, color: "hsl(var(--chart-4))" },
  { category: "Bills", amount: 2800, color: "hsl(var(--chart-5))" },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");
  const [groupExpenseData, setGroupExpenseData] = useState([]);

   const { month } = useSharedMonth(); 

  // const fetchuserData = async () => {
  //   try {
  //     const data = JSON.parse(localStorage.getItem("user"));
  //     setUserData(data);
  //     setUserName(data?.name || "");
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser);
      setUserName(storedUser.name || "");
    }
  }, []);

  // Fetch user data on component mount
  // useEffect(() => {
  //   fetchuserData();
  //   fetchExpenses();
  // }, []);

  // const fetchExpenses = async () => {
  //   try {
  //     // const res = await axios.post(`http://localhost:5000/expenses/${userData.id}/group_expense`, {
  //     // month : month});
  //     const res = await axios.post(`http://localhost:5000/expenses/2/group_expense`, {
  //       month : month
  //     });
  //     const formattedData = res.data.map(item => ({
  //     ...item,
  //     total_amount: parseFloat(item.total_amount),
  //   }));
  //     setGroupExpenseData(formattedData);
  //   } catch (error) {
  //     console.error("Error fetching expenses:", error);
  //   }
  // }

  useEffect(() => {
    if (!userData || !month) return;

    const fetchExpenses = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5000/expenses/2/group_expense`,
          { month }
        );

        console.log("Sending month:", month);


        const formattedData = res.data.map((item, index) => ({
          ...item,
          total_amount: parseFloat(item.total_amount),
          color: COLORS[index % COLORS.length],
        }));

        setGroupExpenseData(formattedData);
        console.log("Fetched grouped expenses:", formattedData);
      } catch (error) {
        console.error("Error fetching grouped expenses:", error);
      }
    };

    fetchExpenses();
  }, [userData, month]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your expense overview
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Expenses by Category</h3>
          </div>
          <div className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={groupExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total_amount"
                >
                  {groupExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}  />
                  ))}
                </Pie>
                <Tooltip />
                <Legend formatter={(value, entry, index) => groupExpenseData[index].category} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Category Breakdown</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {groupExpenseData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <span className="font-bold">${item.total_amount}</span>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-primary">
                    $
                    {groupExpenseData
                      .reduce((sum, item) => sum + item.total_amount, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

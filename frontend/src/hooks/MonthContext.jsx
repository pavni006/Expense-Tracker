import { createContext, useContext, useState, useEffect } from "react";

const MonthContext = createContext();

export const MonthProvider = ({ children }) => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [month, setMonth] = useState("");

  useEffect(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthOffset);
    const monthName = date.toLocaleString("default", { month: "long", year: "numeric" });
    setMonth(monthName);
  }, [monthOffset]);

  return (
    <MonthContext.Provider value={{ month, monthOffset, setMonthOffset }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useSharedMonth = () => useContext(MonthContext);

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Screens/Dashboard';
import Income from './Screens/Income';
import Expense from './Screens/Expense';
import NotFound from './Screens/NotFound';
import Layout from './components/Layout';
import { MonthProvider } from "./hooks/MonthContext";

const App = () => {
  return (
    <BrowserRouter>
      <MonthProvider>
        <Layout>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/income' element={<Income />} />
            <Route path='/expense' element={<Expense />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </MonthProvider>
    </BrowserRouter>
  )
}

export default App

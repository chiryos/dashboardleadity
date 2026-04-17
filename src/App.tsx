import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PeriodProvider } from './context/PeriodContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Metrics from './pages/Metrics';
import Statistics from './pages/Statistics';
import Conversations from './pages/Conversations';
import Offers from './pages/Offers';
import Setter from './pages/Setter';
import Login from './pages/Login';

export default function App() {
  return (
    <ThemeProvider>
    <PeriodProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="offers" element={<Offers />} />
          <Route path="setter" element={<Setter />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </PeriodProvider>
    </ThemeProvider>
  );
}

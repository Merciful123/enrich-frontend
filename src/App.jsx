import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import CreateTest from './pages/CreateTest';
import TestReport from './pages/TestReport';
import ReportView from './pages/ReportView';
import TestHistory from './pages/TestHistory';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-test" element={<CreateTest />} />
            <Route path="/test/:testId" element={<TestReport />} />     //Creator view
            <Route path="/report/:testId" element={<ReportView />} />   //Shared view
            <Route path="/history" element={<TestHistory />} />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;
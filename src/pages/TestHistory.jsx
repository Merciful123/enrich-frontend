import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Calendar, 
  BarChart3, 
  Search, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { baseUrl } from '../utils/utilities';

const TestHistory = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // useCallback with proper dependencies
  const fetchTests = useCallback(async (email = searchEmail, page = currentPage) => {
    try {
      setLoading(true);
      const userEmail = email || 'demo@example.com';
      const response = await axios.get(`${baseUrl}/api/tests/history/${encodeURIComponent(userEmail)}?page=${page}&limit=10`);
      
      if (response.data.success) {
        setTests(response.data.data.tests);
        setTotalPages(response.data.data.pagination.pages);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching test history:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load test history';
      toast.error(errorMessage);
      
      if (error.response?.status === 404) {
        setTests([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // Empty dependencies since we pass parameters

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTests();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTests(searchEmail, 1);
  };

  const handleClear = () => {
    setSearchEmail('');
    setCurrentPage(1);
    fetchTests('', 1);
  };

  const handleInputChange = (e) => {
    setSearchEmail(e.target.value);
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      completed: <CheckCircle className="h-5 w-5 text-green-500" />,
      processing: <Clock className="h-5 w-5 text-blue-500" />,
      failed: <XCircle className="h-5 w-5 text-red-500" />,
      waiting: <Clock className="h-5 w-5 text-yellow-500" />,
      created: <Clock className="h-5 w-5 text-gray-400" />
    };
    return statusIcons[status] || <Clock className="h-5 w-5 text-gray-400" />;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed: 'text-green-800 bg-green-100',
      processing: 'text-blue-800 bg-blue-100',
      failed: 'text-red-800 bg-red-100',
      waiting: 'text-yellow-800 bg-yellow-100',
      created: 'text-gray-800 bg-gray-100'
    };
    return statusColors[status] || 'text-gray-800 bg-gray-100';
  };

  const formatDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.round((end - start) / 1000);
    
    if (duration < 60) return `${duration}s`;
    return `${Math.round(duration / 60)}m ${duration % 60}s`;
  };

  //Added test parameter
  const ExportButton = () => (
    <button
      onClick={() => toast.success('Export feature coming soon!')}
      className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
    >
      <Download className="h-4 w-4 mr-1" />
      Export
    </button>
  );

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading test history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
              <p className="text-gray-600 mt-1">
                View your past email deliverability tests and compare results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                to="/create-test"
                className="inline-flex bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 items-center px-4 py-2 !text-white rounded-md transition-colors"
              >
                <Mail className="h-4 w-4 mr-2"/>
                New Test
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter email address to search test history..."
                  value={searchEmail}
                  onChange={handleInputChange} //  Separate handler
                  className="w-full pl-10 pr-4 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                {/* <SearchIcon className="h-4 w-4 mr-2 inline" /> */}
                Search
              </button>
              {searchEmail && (
                <button
                  type="button"
                  onClick={handleClear} // Use separate handler
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tests Grid */}
        {tests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {/* <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchEmail ? 'No tests found' : 'No test history yet'}
            </h3> */}
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchEmail
                ? `No test history found for "${searchEmail}". Make sure you've entered the correct email address used for testing.`
                : 'Get started by running your first email deliverability test to see your history here.'
              }
            </p>
            <Link
              to="/create-test"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 !text-white rounded-md hover:opacity-90 transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" />
              Run Your First Test
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {tests.length} test{tests.length !== 1 ? 's' : ''} 
                {searchEmail && ` for ${searchEmail}`}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <RefreshCw className="h-4 w-4" />
                <span>Auto-updates every 30 seconds</span>
              </div>
            </div>

            {tests.map((test) => (
              <div
                key={test.testId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Test: {test.testCode}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(test.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(test.overallScore)}`}>
                      {test.overallScore}%
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Score</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-600">Delivered</span>
                    <span className="font-semibold text-lg">{test.deliveredCount}/5</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">Spam</span>
                    <span className="font-semibold text-lg text-red-600">{test.spamCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">Status</span>
                    <span className={`status-badge ${getStatusColor(test.status)} px-2 py-1 rounded-full text-xs font-medium`}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">
                      {formatDuration(test.createdAt, test.completedAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Test ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{test.testId}</code>
                  </div>
                  <div className="flex space-x-3">
                    <ExportButton test={test} /> {/*Pass test prop */}
                    <Link
                      to={`/report/${test.testId}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 !text-white rounded-md hover:opacity-90 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Report
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => {
                const newPage = Math.max(currentPage - 1, 1);
                setCurrentPage(newPage);
                fetchTests(searchEmail, newPage);
              }}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Page</span>
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm font-medium">
                {currentPage}
              </span>
              <span className="text-sm text-gray-500">of {totalPages}</span>
            </div>
            
            <button
              onClick={() => {
                const newPage = Math.min(currentPage + 1, totalPages);
                setCurrentPage(newPage);
                fetchTests(searchEmail, newPage);
              }}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Info Box */}
        {tests.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> Test history is automatically cleared after 24 hours. 
                For permanent records, use the PDF export feature on individual test reports.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistory;
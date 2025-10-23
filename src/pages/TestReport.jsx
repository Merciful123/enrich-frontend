import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download,
  Share2,
  ArrowLeft,
  BarChart3,
  Inbox,
  AlertTriangle,
  Clock,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { useTestStatus } from '../hooks/useTest.js';




const TestReport = ({ testId: testIdFromProps, isSharedView = false }) => {
  const params = useParams();
  const testId = testIdFromProps || params.testId;
  
  console.log('TestReport - Test ID:', testId, 'isSharedView:', isSharedView);

  const { test, loading, error: statusError } = useTestStatus(
    testId, 
    isSharedView ? 0 : 5000
  );
  
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (statusError) {
      toast.error(statusError);
    }
  }, [statusError]);

  const copyShareLink = async () => {
    if (test?.shareableLink) {
      try {
        await navigator.clipboard.writeText(test.shareableLink);
        setCopied(true);
        toast.success('Share link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = test.shareableLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(true);
        toast.success('Share link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
        console.log(err)
      }
    } else {
      toast.error('No shareable link available');
    }
  };

  // PDF export using text-based approach (more reliable)
  const exportToPDFTextBased = async () => {
    if (!test) {
      toast.error('No test data available');
      return;
    }

    try {
      setExporting(true);
      toast.loading('Generating PDF report...', { id: 'pdf-export' });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Email Deliverability Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Test Information
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Test Code: ${test.testCode}`, 20, yPosition);
      pdf.text(`Created: ${new Date(test.createdAt).toLocaleString()}`, pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 20;

      // Score Summary
      pdf.setFontSize(16);
      pdf.setTextColor(33, 33, 33);
      pdf.text('Score Summary', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      const scores = [
        `Overall Deliverability Score: ${test.overallScore}%`,
        `Inbox Placements: ${test.results.filter(r => r.folder === 'inbox').length}`,
        `Spam Placements: ${test.results.filter(r => r.folder === 'spam').length}`,
        `Total Providers Tested: ${test.results.length}`
      ];

      scores.forEach(score => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(score, 25, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Detailed Results
      pdf.setFontSize(16);
      pdf.text('Detailed Results', 20, yPosition);
      yPosition += 15;

      test.results.forEach((result) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setTextColor(33, 33, 33);
        pdf.text(`${result.emailProvider.toUpperCase()}`, 25, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Email: ${result.emailAddress}`, 30, yPosition);
        yPosition += 5;

        const statusText = `Status: ${result.status === 'delivered' ? 'Delivered' : result.status === 'not_delivered' ? 'Not Delivered' : 'Error'}`;
        pdf.text(statusText, 30, yPosition);
        yPosition += 5;

        if (result.folder && result.folder !== 'not_found') {
          pdf.text(`Folder: ${result.folder}`, 30, yPosition);
          yPosition += 5;
        }

        if (result.error) {
          pdf.setTextColor(200, 0, 0);
          pdf.text(`Error: ${result.error}`, 30, yPosition);
          pdf.setTextColor(100, 100, 100);
          yPosition += 5;
        }

        yPosition += 8; // Space between results
      });

      // Add footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
          `Page ${i} of ${totalPages} - Generated on ${new Date().toLocaleString()}`,
          pageWidth / 2,
          290,
          { align: 'center' }
        );
      }

      pdf.save(`email-deliverability-report-${test.testCode}.pdf`);
      toast.success('PDF exported successfully!', { id: 'pdf-export' });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-export' });
    } finally {
      setExporting(false);
    }
  };

  const getStatusIcon = (status, folder) => {
    if (status === 'delivered') {
      if (folder === 'inbox') return <CheckCircle className="h-5 w-5 text-green-500" />;
      if (folder === 'spam') return <AlertTriangle className="h-5 w-5 text-red-500" />;
      return <Inbox className="h-5 w-5 text-yellow-500" />;
    }
    if (status === 'not_delivered') return <XCircle className="h-5 w-5 text-red-500" />;
    if (status === 'error') return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      delivered: 'bg-green-100 text-green-800',
      not_delivered: 'bg-red-100 text-red-800',
      error: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  const getFolderBadgeClass = (folder) => {
    const classes = {
      inbox: 'bg-green-100 text-green-800 border-green-200',
      spam: 'bg-red-100 text-red-800 border-red-200',
      promotions: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      social: 'bg-blue-100 text-blue-800 border-blue-200',
      updates: 'bg-purple-100 text-purple-800 border-purple-200',
      forums: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return classes[folder] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFolderDisplayName = (folder) => {
    const names = {
      inbox: 'Primary Inbox',
      spam: 'Spam Folder',
      promotions: 'Promotions Tab',
      social: 'Social Tab',
      updates: 'Updates Tab',
      forums: 'Forums Tab'
    };
    return names[folder] || folder.charAt(0).toUpperCase() + folder.slice(1);
  };

  if (loading && !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test report...</p>
          <p className="text-sm text-gray-500 mt-2">Test ID: {testId}</p>
        </div>
      </div>
    );
  }

  if (statusError || !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Not Found</h2>
          <p className="text-gray-600 mb-4">
            {statusError || `The test with ID ${testId} was not found or may have expired.`}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deliveredCount = test.results.filter(r => r.status === 'delivered').length;
  const inboxCount = test.results.filter(r => r.folder === 'inbox').length;
  const spamCount = test.results.filter(r => r.folder === 'spam').length;
  const totalProviders = test.results.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Deliverability Report</h1>
              <p className="text-gray-600 mt-1">
                Test Code: <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{test.testCode}</code>
                {test.createdAt && (
                  <span className="ml-4">
                    Created: {new Date(test.createdAt).toLocaleString()}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <button
                onClick={copyShareLink}
                disabled={!test.shareableLink}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
              
              {/* Updated PDF Export Button */}
              <button
                onClick={exportToPDFTextBased} // Using text-based version for reliability
                disabled={exporting || !test}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-md shadow-sm text-sm font-medium hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {exporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Report Content - Added PDF-specific styling */}
        <div 
          id="test-report" 
          className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          style={{ backgroundColor: '#ffffff' }} // Ensure white background for PDF
        >
          {/* Rest of your existing JSX remains exactly the same */}
          {/* Processing Status */}
          {test.status === 'processing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <div>
                  <p className="text-blue-800 font-medium">Checking email inboxes...</p>
                  <p className="text-blue-700 text-sm mt-1">
                    This usually takes 2-5 minutes. The page will update automatically.
                    {test.startedAt && (
                      <span> Started: {new Date(test.startedAt).toLocaleTimeString()}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Status */}
          {test.status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="text-red-800 font-medium">Test failed to complete</p>
                  <p className="text-red-700 text-sm mt-1">
                    There was an error processing your test. Please try creating a new test.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Score Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{test.overallScore}%</div>
                <div className="text-sm text-gray-500">Deliverability Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{inboxCount}</div>
                <div className="text-sm text-gray-500">Inbox Placements</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-600">{spamCount}</div>
                <div className="text-sm text-gray-500">Spam Placements</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{deliveredCount}/{totalProviders}</div>
                <div className="text-sm text-gray-500">Emails Delivered</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Overall Deliverability Score</span>
                <span>{test.overallScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${test.overallScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Based on {inboxCount} inbox placements out of {totalProviders} providers
              </p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Detailed Results by Provider</h2>
              <p className="text-sm text-gray-600 mt-1">
                Results from checking each email provider's inbox
              </p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {test.results.map((result, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(result.status, result.folder)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 capitalize text-lg">
                          {result.emailProvider}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono truncate">
                          {result.emailAddress}
                        </p>
                        {result.subject && (
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Subject:</span> "{result.subject}"
                          </p>
                        )}
                        {result.error && (
                          <p className="text-sm text-red-600 mt-1">
                            <span className="font-medium">Error:</span> {result.error}
                          </p>
                        )}
                        {result.checkedAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Last checked: {new Date(result.checkedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 sm:text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(result.status)}`}>
                        {result.status === 'delivered' ? 'Delivered' : 
                         result.status === 'not_delivered' ? 'Not Delivered' : 
                         result.status === 'error' ? 'Error' : 
                         result.status === 'processing' ? 'Checking...' : 'Pending'}
                      </span>
                      
                      {result.folder && result.folder !== 'not_found' && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getFolderBadgeClass(result.folder)}`}>
                          📁 {getFolderDisplayName(result.folder)}
                        </span>
                      )}
                      
                      {result.receivedAt && (
                        <p className="text-xs text-gray-500">
                          Received: {new Date(result.receivedAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Inbox className="h-5 w-5 mr-2 text-gray-400" />
                Placement Summary
              </h3>
              <div className="space-y-3">
                {['inbox', 'spam', 'promotions', 'social', 'updates', 'forums'].map(folder => {
                  const count = test.results.filter(r => r.folder === folder).length;
                  if (count === 0) return null;
                  
                  return (
                    <div key={folder} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-gray-600 flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-3 ${getFolderBadgeClass(folder).split(' ')[0]}`}></span>
                        {getFolderDisplayName(folder)}
                      </span>
                      <span className="font-semibold text-gray-900">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-gray-400" />
                Test Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Test Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(test.status)}`}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Started:</span>
                  <span>{test.startedAt ? new Date(test.startedAt).toLocaleString() : 'Not started'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Completed:</span>
                  <span>{test.completedAt ? new Date(test.completedAt).toLocaleString() : 'In Progress'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Duration:</span>
                  <span>
                    {test.startedAt && test.completedAt 
                      ? `${Math.round((new Date(test.completedAt) - new Date(test.startedAt)) / 1000)} seconds`
                      : test.startedAt 
                      ? 'Still processing...' 
                      : 'Not started'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/history"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Test History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestReport;
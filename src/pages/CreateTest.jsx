// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, Copy, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { baseUrl } from '../utils/utilities';

// const CreateTest = () => {
//   const [formData, setFormData] = useState({
//     userEmail: '',
//     userName: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [testData, setTestData] = useState(null);
//   const [copiedItems, setCopiedItems] = useState({});
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post(`${baseUrl}/api/tests/create`, formData);
      
//       if (response.data.success) {
//         setTestData(response.data.data);
//         toast.success('Test created successfully!');
        
//         // Start email checking
//         await axios.post(`${baseUrl}/api/email/start-check`, {
//           testId: response.data.data.testId
//         });
        
//         toast.success('Email checking started! Results will be ready in 2-5 minutes.');
//       }
//     } catch (error) {
//       console.error('Error creating test:', error);
//       toast.error(error.response?.data?.message || 'Failed to create test');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = async (text, itemName) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedItems(prev => ({ ...prev, [itemName]: true }));
//       toast.success('Copied to clipboard!');
      
//       setTimeout(() => {
//         setCopiedItems(prev => ({ ...prev, [itemName]: false }));
//       }, 2000);
//     } catch (error) {
//       toast.error('Failed to copy to clipboard');
//       console.log(error)
//     }
//   };

//   if (testData) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Link
//             to="/"
//             className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
//           >
//             <ArrowLeft className="h-4 w-4 mr-1" />
//             Back to Home
//           </Link>

//           <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6 mb-8">
//             <div className="flex items-center mb-4">
//               <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
//               <h1 className="text-2xl font-bold text-gray-900">Test Created Successfully!</h1>
//             </div>
            
//             <div className="grid md:grid-cols-2 gap-6 mb-8">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Test Code
//                   </label>
//                   <div className="flex items-center space-x-2">
//                     <code className="flex-1 bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-lg font-mono border">
//                       {testData.testCode}
//                     </code>
//                     <button
//                       onClick={() => copyToClipboard(testData.testCode, 'testCode')}
//                       className="p-2 text-gray-500 hover:text-gray-700 border rounded-md hover:bg-gray-50"
//                     >
//                       {copiedItems.testCode ? (
//                         <CheckCircle className="h-5 w-5 text-green-500" />
//                       ) : (
//                         <Copy className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">
//                     Shareable Report Link
//                   </label>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="text"
//                       readOnly
//                       value={testData.shareableLink}
//                       className="flex-1 px-3 py-2 border text-gray-800 border-gray-300 rounded-md text-sm bg-gray-50"
//                     />
//                     <button
//                       onClick={() => copyToClipboard(testData.shareableLink, 'shareLink')}
//                       className="p-2 text-gray-500 hover:text-gray-700 border rounded-md hover:bg-gray-50"
//                     >
//                       {copiedItems.shareLink ? (
//                         <CheckCircle className="h-5 w-5 text-green-500" />
//                       ) : (
//                         <Copy className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
//                 <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
//                   <li>Send an email from your email account to all test addresses below</li>
//                   <li>Include the test code in the subject OR body of the email</li>
//                   <li>Wait 2-5 minutes for automatic analysis</li>
//                   <li>Check your report at the link above</li>
//                 </ol>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Test Inbox Addresses
//               </h3>
//               <div className="space-y-3">
//                 {testData.testInboxes.map((inbox, index) => (
//                   <div
//                     key={inbox.provider}
//                     className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                         <Mail className="h-5 w-5 text-gray-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900 capitalize">
//                           {inbox.provider}
//                         </div>
//                         <div className="text-sm text-gray-500 font-mono">
//                           {inbox.email}
//                         </div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => copyToClipboard(inbox.email, `email-${index}`)}
//                       className="p-2 text-gray-500 hover:text-gray-700 border rounded-md hover:bg-gray-50"
//                     >
//                       {copiedItems[`email-${index}`] ? (
//                         <CheckCircle className="h-5 w-5 text-green-500" />
//                       ) : (
//                         <Copy className="h-5 w-5" />
//                       )}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <button
//                 onClick={() => navigate(`/test/${testData.testId}`)}
//                 className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 font-medium"
//               >
//                 View Live Report
//               </button>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 font-medium"
//               >
//                 Create New Test
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         <Link
//           to="/"
//           className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
//         >
//           <ArrowLeft className="h-4 w-4 mr-1" />
//           Back to Home
//         </Link>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Mail className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">
//               Start Email Deliverability Test
//             </h1>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
//                 Your Email Address *
//               </label>
//               <input
//                 type="email"
//                 id="userEmail"
//                 name="userEmail"
//                 required
//                 value={formData.userEmail}
//                 onChange={handleChange}
//                 placeholder="Enter your email to receive the report"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>

//             <div>
//               <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
//                 Your Name (Optional)
//               </label>
//               <input
//                 type="text"
//                 id="userName"
//                 name="userName"
//                 value={formData.userName}
//                 onChange={handleChange}
//                 placeholder="Enter your name for personalized reports"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex">
//                 <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
//                 <div className="text-sm text-blue-800">
//                   <strong>How it works:</strong>
//                   <ul className="mt-1 list-disc list-inside space-y-1">
//                     <li>We generate a unique test code for you</li>
//                     <li>You send one email to all test addresses with the code</li>
//                     <li>We automatically detect where your email lands</li>
//                     <li>Get a comprehensive report in under 5 minutes</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Creating Test...
//                 </div>
//               ) : (
//                 'Create Test & Get Test Inboxes'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateTest;


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Copy, CheckCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { baseUrl } from '../utils/utilities';

const CreateTest = () => {
  const [formData, setFormData] = useState({
    userEmail: '',
    userName: ''
  });
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState(null);
  const [copiedItems, setCopiedItems] = useState({});
  const [checkingStatus, setCheckingStatus] = useState(null); // 'waiting', 'checking', 'completed'
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/tests/create`, formData);
      
      if (response.data.success) {
        setTestData(response.data.data);
        setCheckingStatus('waiting'); // Wait for user to send emails first
        toast.success('Test created successfully! Send emails to start analysis.');
      }
    } catch (error) {
      console.error('Error creating test:', error);
      toast.error(error.response?.data?.message || 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  const startEmailCheck = async () => {
    if (!testData) return;
    
    setCheckingStatus('checking');
    
    try {
      const response = await axios.post(`${baseUrl}/api/email/start-check`, {
        testId: testData.testId
      });
      
      if (response.data.success) {
        toast.success('Email analysis started! Checking inboxes...');
        
        // Poll for status updates
        pollTestStatus();
      }
    } catch (error) {
      console.error('Error starting email check:', error);
      toast.error('Failed to start email analysis');
      setCheckingStatus('waiting');
    }
  };

  const pollTestStatus = async () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/tests/status/${testData.testId}`);
        
        if (response.data.success) {
          const test = response.data.data;
          
          if (test.status === 'completed' || test.status === 'failed') {
            clearInterval(pollInterval);
            setCheckingStatus('completed');
            
            if (test.status === 'completed') {
              toast.success('Email analysis completed! Check your report.');
              // Update test data with latest results
              setTestData(prev => ({ ...prev, ...test }));
            } else {
              toast.error('Email analysis failed. Please try again.');
            }
          }
          // If still processing, continue polling
        }
      } catch (error) {
        console.error('Error polling test status:', error);
        clearInterval(pollInterval);
        setCheckingStatus('waiting');
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 10 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (checkingStatus === 'checking') {
        toast.error('Analysis timed out. Please check the report manually.');
        setCheckingStatus('waiting');
      }
    }, 10 * 60 * 1000);
  };

  const copyToClipboard = async (text, itemName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => ({ ...prev, [itemName]: true }));
      toast.success('Copied to clipboard!');
      
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [itemName]: false }));
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
      console.log(error)
    }
  };

  const handleSendTestEmails = () => {
    // This would ideally open the user's email client with pre-filled content
    const subject = `Email Deliverability Test - ${testData.testCode}`;
    const body = `This is a test email for deliverability testing.\n\nTest Code: ${testData.testCode}\n\nPlease include this test code in your email.`;
    
    const emailLinks = testData.testInboxes.map(inbox => 
      `mailto:${inbox.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
    
    // Open first email link (user can send to others manually)
    if (emailLinks.length > 0) {
      window.open(emailLinks[0], '_blank');
    }
    
    toast.success('Opening email composer. Send to all test addresses!');
  };

  if (testData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>

          <div className={`rounded-lg shadow-sm border p-6 mb-8 ${
            checkingStatus === 'completed' 
              ? 'bg-green-50 border-green-200' 
              : checkingStatus === 'checking'
              ? 'bg-blue-50 border-blue-200'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center mb-4">
              {checkingStatus === 'completed' ? (
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              ) : checkingStatus === 'checking' ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              ) : (
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {checkingStatus === 'completed' 
                  ? 'Analysis Complete!' 
                  : checkingStatus === 'checking'
                  ? 'Analyzing Email Delivery...'
                  : 'Test Created Successfully!'}
              </h1>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Test Code
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-lg font-mono border">
                      {testData.testCode}
                    </code>
                    <button
                      onClick={() => copyToClipboard(testData.testCode, 'testCode')}
                      className="p-2 text-gray-500 hover:text-gray-700 border rounded-md hover:bg-gray-50"
                    >
                      {copiedItems.testCode ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Shareable Report Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={testData.shareableLink}
                      className="flex-1 px-3 py-2 border text-gray-800 border-gray-300 rounded-md text-sm bg-gray-50"
                    />
                    <button
                      onClick={() => copyToClipboard(testData.shareableLink, 'shareLink')}
                      className="p-2 text-gray-500 hover:text-gray-700 border rounded-md hover:bg-gray-50"
                    >
                      {copiedItems.shareLink ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {checkingStatus === 'checking' ? 'Analysis in Progress:' : 'Next Steps:'}
                </h3>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  {checkingStatus === 'checking' ? (
                    <>
                      <li>System is checking all test inboxes</li>
                      <li>This may take 2-5 minutes</li>
                      <li>Results will update automatically</li>
                      <li>You'll receive an email when complete</li>
                    </>
                  ) : checkingStatus === 'completed' ? (
                    <>
                      <li>Analysis completed successfully</li>
                      <li>Check your email for detailed report</li>
                      <li>View full results in the report below</li>
                    </>
                  ) : (
                    <>
                      <li>Send an email from your email account to all test addresses below</li>
                      <li><strong>Include this test code in the subject or body:</strong> {testData.testCode}</li>
                      <li>Wait 2-5 minutes after sending</li>
                      <li>Click "Start Analysis" to begin checking</li>
                    </>
                  )}
                </ol>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Test Inbox Addresses
                </h3>
                {checkingStatus === 'waiting' && (
                  <button
                    onClick={handleSendTestEmails}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                  >
                    <Send className="h-4 w-4" />
                    <span>Open Email Composer</span>
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {testData.testInboxes.map((inbox, index) => (
                  <div
                    key={inbox.provider}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {inbox.provider}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          {inbox.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(inbox.email, `email-${index}`)}
                        className="p-2 text-gray-500 hover:text-gray-700 border rounded-md hover:bg-gray-50"
                      >
                        {copiedItems[`email-${index}`] ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {checkingStatus === 'waiting' && (
                <button
                  onClick={startEmailCheck}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 font-medium"
                >
                  I've Sent the Emails - Start Analysis
                </button>
              )}
              
              {checkingStatus === 'checking' && (
                <button
                  disabled
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium opacity-50 cursor-not-allowed"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Email Delivery...
                  </div>
                </button>
              )}
              
              {checkingStatus === 'completed' && (
                <button
                  onClick={() => navigate(`/test/${testData.testId}`)}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 font-medium"
                >
                  View Detailed Report
                </button>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 font-medium"
              >
                Create New Test
              </button>
            </div>

            {checkingStatus === 'waiting' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Important:</strong> You must send an email containing the test code <code className="bg-yellow-100 px-1 py-0.5 rounded">{testData.testCode}</code> to all test addresses above before starting the analysis. The system will not send test emails automatically.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Start Email Deliverability Test
            </h1>
            <p className="text-gray-600">
              Test how your emails perform across different providers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email Address *
              </label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                required
                value={formData.userEmail}
                onChange={handleChange}
                placeholder="Enter your email to receive the report"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your name for personalized reports"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>How it works:</strong>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>We generate a unique test code for you</li>
                    <li><strong>You send one email</strong> to all test addresses with the code</li>
                    <li>Click "Start Analysis" after sending your email</li>
                    <li>We detect where your email lands (inbox, spam, etc.)</li>
                    <li>Get a comprehensive report in under 5 minutes</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Test...
                </div>
              ) : (
                'Create Test & Get Test Inboxes'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;
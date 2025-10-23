import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/utilities';



export const useTest = (testId) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTest = useCallback(async (signal) => {
    if (!testId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${baseUrl}/api/tests/report/${testId}`, {
        signal
      });
      
      if (response.data.success) {
        setTest(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch test data');
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to fetch test'
        );
        setTest(null);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [testId, baseUrl]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchTest(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchTest]);

  // ADDED: Retry function for better UX
  const retry = useCallback(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetchTest(signal);
    return () => abortController.abort();
  }, [fetchTest]);

  return { test, loading, error, retry };
};
// export const useTestStatus = (testId, pollInterval = 10000) => {
//   const [test, setTest] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [polling, setPolling] = useState(true);

//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {
//         const response = await axios.get(`${baseUrl}/api/tests/status/${testId}`);
//         if (response.data.success) {
//           setTest(response.data.data);
          
//           if (['completed', 'failed'].includes(response.data.data.status)) {
//             setPolling(false);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching test status:', error);
//         setPolling(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStatus();

//     if (polling) {
//       const interval = setInterval(fetchStatus, pollInterval);
//       return () => clearInterval(interval);
//     }
//   }, [testId, polling, pollInterval]);

//   return { test, loading, polling };
// };



export const useTestStatus = (testId, pollInterval = 10000) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);
  const [error, setError] = useState(null);

  //  Use useCallback to prevent infinite re-renders
  const fetchStatus = useCallback(async () => {
    if (!testId) return;
    
    try {
      const response = await axios.get(`${baseUrl}/api/tests/status/${testId}`);
      if (response.data.success) {
        const testData = response.data.data;
        setTest(testData);
        
        // Stop polling for these statuses
        if (['completed', 'failed', 'expired'].includes(testData.status)) {
          setPolling(false);
        }
        
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching test status:', error);
      setError('Failed to fetch test status');
      setPolling(false); // Stop polling on error
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    if (!testId) {
      setLoading(false);
      setPolling(false);
      return;
    }

    fetchStatus();

    let intervalId;
    if (polling && pollInterval > 0) {
      intervalId = setInterval(fetchStatus, pollInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [testId, polling, pollInterval, fetchStatus]);

  return { test, loading, polling, error };
};
import { useParams } from 'react-router-dom';
import TestReport from './TestReport';

const ReportView = () => {
  const { testId } = useParams();

   return <TestReport testId={testId} isSharedView={true} />;
};

export default ReportView;
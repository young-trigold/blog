import Header, { HeaderHeight } from '@/components/Header';
import { Calculator } from './components/Calculator';

const CalculatorPage = () => {
  return (
    <div>
      <Header></Header>
      <div
        style={{
          height: `calc(100vh - ${HeaderHeight}px)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Calculator />
      </div>
    </div>
  );
};

export default CalculatorPage;

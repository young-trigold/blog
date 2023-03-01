import Header, { HeaderHeight } from '@/components/Header';
import { Calculator } from './components/Calculator';
import CalculatorBackgroundImageURL from '@/static/image/calculator_background_image.jpg';

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
          backgroundImage: `url(${CalculatorBackgroundImageURL})`,
          backgroundSize: 'cover',
        }}
      >
        <Calculator />
      </div>
    </div>
  );
};

export default CalculatorPage;

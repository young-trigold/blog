import LogoIcon from '@/static/icon/my_icon_512.png';
import { useNavigate } from 'react-router-dom';

export const Logo: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        marginRight: '2em'
      }}
      onClick={goHome}
    >
      <img
        src={LogoIcon}
        alt="logo"
        width={24}
        style={{
          marginRight: '8px',
        }}
      />
      <strong>
        <em>Trigold's Blog</em>
      </strong>
    </span>
  );
};

import { useTheme } from 'styled-components';

//메인 페이지
const Home = () => {
  const { colors } = useTheme();

  return (
    <div style={{ color: colors.primary, background: colors.accentLight }}>
      Home
    </div>
  );
};

export default Home;

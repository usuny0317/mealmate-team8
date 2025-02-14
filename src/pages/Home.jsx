import styled from 'styled-components';
import SearchField from '../components/home/SearchField';

//메인 페이지
const Home = () => {
  return (
    <StHomeWrapper>
      <article id='home'>
        <SearchField />
      </article>
    </StHomeWrapper>
  );
};

export default Home;
const StHomeWrapper = styled.div`
  #home {
    padding-top: 10vh;
    /* height: 100vh; */
    width: 80vw;
    margin: 0 auto;
    min-width: 300px;
    max-width: 1440px;
    /* background-color: pink; */
  }
`;

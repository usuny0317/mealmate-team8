import Router from './routes/Router';
import { AuthProVider } from './context/AuthContext';
//app.jsx
function App() {
  return (
    <>
      <AuthProVider>
        <Router />
      </AuthProVider>
    </>
  );
}

export default App;

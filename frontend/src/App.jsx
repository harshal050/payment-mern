import Dashboard from './components/Dashboard';
import {Route,Routes,BrowserRouter} from 'react-router-dom'
import Signin from './components/Signin';
import Signup from './components/Signup';
import Transactions from './components/Transactions';
import {useState} from 'react';

function App() {
  const [isSignin , setisSignin] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Dashboard isSignin={isSignin} setisSignin={setisSignin}/>} />
        <Route path="/signup"  element={<Signup/>} />
        <Route path="/signin"  element={<Signin setisSignin={setisSignin}/>}  />
        <Route path="/transactions"  element={<Transactions isSignin={isSignin}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import Typography from '@mui/material/Typography';
import {useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import './Login.css';

/**
 * Login component
 *
 * @return {object} JSX
 */
function Login() {
  const [user, setUser] = React.useState({email: '', password: ''});
  const [errorMsg, setErrorMsg] = React.useState('');
  const history = useNavigate();

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const onSubmit = (event, setErrorMsg) => {
    event.preventDefault();
    fetch('http://localhost:3010/v0/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          // console.log(`/login res: ${res}`);
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        localStorage.setItem('user', JSON.stringify(json));
        history('/');
      })
      .catch((err) => {
        // alert('Error logging in, please try again');
        setErrorMsg('Error logging in, please try again');
      });
  };

  return (
    <form onSubmit={(e) => onSubmit(e, setErrorMsg)}>
      <AppBar position='static'>
        <Typography aria-label='welcome' id='welcome'
          variant="h4" gutterBottom component="div">
          CSE186 Email Reader Login
        </Typography>
      </AppBar>
      <input
        aria-label="email"
        type="email"
        name="email"
        placeholder="EMail"
        onChange={handleInputChange}
        required
      />
      <input
        aria-label="password"
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleInputChange}
        required
      />
      <input aria-label="submit" type="submit" value="Submit"/>
      <div>{errorMsg}</div>
    </form>
  );
}

export default Login;

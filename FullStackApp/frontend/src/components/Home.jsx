import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import {useNavigate} from 'react-router'; // here
import EmailTable from './EmailTable';
import './Home.css';
// import './Home.css';
import MyContext from './MyContext';

const fetchBooks = (setEmails, mailbox, setError, history, setIsDataLoaded) => {
  // console.log('gothere1');
  const item = localStorage.getItem('user');
  if (!item) {
    // console.log('gothere2, !item');
    // history('/login');
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user.accessToken;
  // console.log(`gothere3\nbearerToken: ${bearerToken}`);
  fetch(`http://localhost:3010/v0/email?mailbox=${mailbox}`, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  })
    .then((response) => {
      // console.log('gothere4');
      if (!response.ok) {
        throw response;
      }
      // setError('!response.ok');
      return response.json();
    })
    .then((json) => {
      // console.log('gothere5');
      setError('');
      // console.log(`setEmails(json), json:\n${JSON.stringify(json)}`);
      setEmails(json);
      setIsDataLoaded(true);
    })
    .catch((error) => {
      // console.log('gothere6');
      console.log(error);
      setEmails([]);
      setError(`${error.status} - ${error.statusText}`);
    });
};

/**
 * @return {object} JSX Table
 */
function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [mailbox, setMailbox] = React.useState('inbox');
  const [emails, setEmails] = React.useState([]);
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const [name, setName] = React.useState(user ? user.name : '');
  const [error, setError] = React.useState('Logged Out');
  const history = useNavigate(); // here

  const logout = () => {
    localStorage.removeItem('user');
    setEmails([]);
    setName('');
    setIsDataLoaded(false);
    setError('Logged Out');
    // history('/login'); // here
  };

  const login = () => {
    history('/login'); // here
  };

  React.useEffect(() => {
    fetchBooks(setEmails, 'inbox', setError, history, setIsDataLoaded);
  }, [history]);

  return (
    <MyContext.Provider value={{setEmails, emails, setMailbox, mailbox,
      history}}>
      <div aria-label='homeroot'>
        <AppBar position='static'>
          <Typography aria-label='welcome' id='welcome'
            variant="h4" gutterBottom component="div">
          CSE186 Email Reader Home
          </Typography>
        </AppBar>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <PersonRoundedIcon />
          </Grid>
          <Grid item>
            {name ? name : ''}
          </Grid>
        </Grid>
        <Stack spacing={2} direction="row">
          <Button variant='outlined' aria-label='Login'
            onClick={login}>Login</Button>
          <Button variant='contained' aria-label='Logout' disabled={!name}
            onClick={logout}>Logout</Button>
        </Stack>
        <p/>
        <div>
          {isDataLoaded ? <EmailTable /> : null}
        </div>
        <div>
          {error}
        </div>
      </div>
    </MyContext.Provider>
  );
}

export default Home;

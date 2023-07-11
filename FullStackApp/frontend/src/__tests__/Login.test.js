import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import userEvent from '@testing-library/user-event';

import {MemoryRouter, Routes, Route} from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';

const URL1 = 'http://localhost:3010/v0/email';
const URL2 = 'http://localhost:3010/v0/login';

const user = {
  name: 'Molly',
  accessToken: ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbGF'+
  'kZHJlc3MiOiJtb2xseUBib29rcy5jb20iLCJtZW1iZXJuYW1lIjoiTW9sbHkiL'+
  'CJpYXQiOjE2NTg0Mzc1NTMsImV4cCI6MTY1ODQzOTM1M30.ib3bMoUOZSj9FVMp'+
  '_cZuhYHiXD51UJjumQQFivRAIuk'),
};

const server = setupServer(
  rest.get(URL1, (req, res, ctx) => {
    return res(ctx.status(404), ctx.json());
  }),
  rest.post(URL2, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(user));
  }),
);

const server2 = setupServer(
  rest.get(URL1, (req, res, ctx) => {
    return res(ctx.status(404), ctx.json());
  }),
  rest.post(URL2, (req, res, ctx) => {
    return res(ctx.status(404), ctx.json());
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// const userInvalid = {
//   name: 'Molly',
//   accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbGF
//                kZHJlc3MiOiJtb2xseUBib29rcy5jb20iLCJtZW1iZXJuYW1lIjoiTW9sbHkiL
//                CJpYXQiOjE2NTg0Mzc1NTMsImV4cCI6MTY1ODQzOTM1M30.ib3bMoUOZSj9FVM
//                 p_cZuhYHiXD51UJjumQQFivRAIuk`,
// };

/**
 * @param {error} err adfa
 */
const login = async (err) => {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByText('CSE186 Email Reader Home');
  // console.log((await screen.findByText('Login')).outerHTML);
  fireEvent.click(await screen.findByText('Login'));
  await screen.findByText('CSE186 Email Reader Login');
};

test('Logout, enter email, enter password, then click submit', async () => {
  // localStorage.setItem('user', JSON.stringify(user));
  await login();
  const emailBox = screen.getByLabelText('email');
  await userEvent.type(emailBox, 'molly@books.com');
  const pwdBox = screen.getByLabelText('password');
  await userEvent.type(pwdBox, 'mollymember');
  fireEvent.click(screen.getByLabelText('submit'));
  await screen.findByText('CSE186 Email Reader Home');
});

test('Logout, enter email, enter wrong password, click submit', async () => {
  // localStorage.setItem('user', JSON.stringify(user));
  server.close();
  server2.listen();
  await login();
  const emailBox = screen.getByLabelText('email');
  // console.log(emailBox.outerHTML);
  await userEvent.type(emailBox, 'molly@books.com');
  const pwdBox = screen.getByLabelText('password');
  await userEvent.type(pwdBox, 'notthepassword');
  fireEvent.click(screen.getByLabelText('submit'));
  await screen.findByText('Error logging in, please try again');
  server2.close();
  server.listen();
});

import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import {MemoryRouter, Routes, Route} from 'react-router-dom';
import Home from '../components/Home';

const URL = 'http://localhost:3010/v0/email';

// '2022-07-21T22:01:00Z'
const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(ctx.json([
      {
        'name': 'inbox',
        'mail': [
          {
            'identifier': 'a02968f8-0cc8-44d3-8ee2-449a5e22803e',
            'emailid': '3805aa8e-6a6f-436d-a5aa-ad232cb1642b',
            'fromname': 'Anna',
            'toname': 'Molly',
            'content': {
              'message': 'Hi Molly(this is anna)',
            },
            'senttime': '2011-10-05T14:48:00.000Z',
            'receivedtime': '2011-11-05T14:48:00.000Z',
            'emailsubject': 'hello from anna',
          },
          {
            'identifier': 'a02968f8-0cc8-44d3-8ee2-449a5e22803e',
            'emailid': '36513f65-bc11-4fbe-9599-47cb7a839a5a',
            'fromname': 'Andy',
            'toname': 'Molly',
            'content': {
              'message': 'Hi Molly(this is andy)',
            },
            'senttime': '2011-10-05T14:48:00.000Z',
            'receivedtime': (new Date()).toISOString(),
            'emailsubject': 'hello from andy',
          },
          {
            'identifier': 'a02968f8-0cc8-44d3-8ee2-449a5e22803e',
            'emailid': '802e5220-c2c5-478b-98f6-221ce3b61bd6',
            'fromname': 'hannah',
            'toname': 'Molly',
            'content': {
              'message': 'Hi Molly(this is hannah)',
            },
            'senttime': '2011-10-05T14:48:00.000Z',
            'receivedtime': '2022-03-21T22:01:00Z',
            'emailsubject': 'hello from hannah',
          },
        ],
      },
    ]));
  }),
);

const server2 = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(ctx.status(404), ctx.json());
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const user = {
  name: 'Molly',
  accessToken: ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbGF'+
  'kZHJlc3MiOiJtb2xseUBib29rcy5jb20iLCJtZW1iZXJuYW1lIjoiTW9sbHkiL'+
  'CJpYXQiOjE2NTg0Mzc1NTMsImV4cCI6MTY1ODQzOTM1M30.ib3bMoUOZSj9FVMp'+
  '_cZuhYHiXD51UJjumQQFivRAIuk'),
};

const userInvalid = {
  name: 'Molly',
  accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbGF
                kZHJlc3MiOiJtb2xseUBib29rcy5jb20iLCJtZW1iZXJuYW1lIjoiTW9sbHkiL
                CJpYXQiOjE2NTg0Mzc1NTMsImV4cCI6MTY1ODQzOTM1M30.ib3bMoUOZSj9FVM
                p_cZuhYHiXD51UJjumQQFivRAIuk`,
};

/**
 * @param {error} err adfa
 */
const logout = async (err) => {
  render(
    <MemoryRouter>
      <Routes>
        <Route path='/login' exact element={<div>Test Login</div>} />
        <Route path='/' exact element={<Home/>} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByText('CSE186 Email Reader Home');
  fireEvent.click(screen.getByLabelText('Logout'));
  await screen.findByText('Test Login');
};

test('Logout redirect - With User', async () => {
  localStorage.setItem('user', JSON.stringify(user));
  logout();
});

test('Logout redirect - No User', async () => {
  localStorage.removeItem('user');
  logout();
});

test('Logout redirect - invalid token', async () => {
  server.close();
  localStorage.setItem('user', JSON.stringify(userInvalid));
  logout();
  server.listen();
});

test('just render Home', async () => {
  localStorage.setItem('user', JSON.stringify(user));
  render(
    <MemoryRouter>
      <Routes>
        <Route path='/login' exact element={<div>Test Login</div>} />
        <Route path='/' exact element={<Home/>} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByText('hello from anna');
});

test('response !ok', async () => {
  server.close();
  server2.listen();
  localStorage.setItem('user', JSON.stringify(user));
  render(
    <MemoryRouter>
      <Routes>
        <Route path='/login' exact element={<div>Test Login</div>} />
        <Route path='/' exact element={<Home/>} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByText('404 - Not Found');
  server2.close();
  server.listen();
});


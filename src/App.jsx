import { useState } from 'react';
import { useEffect } from 'react';

const baseApi = 'https://testcookie.com:3000/api';

function App() {
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [fields, setFields] = useState({
    email: 'testmail@gmail.com',
    password: '123456',
  });

  const setFieldValue = ({ target: { name, value } }) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetch(`${baseApi}/auth/me`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((me) => setUser(me));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${baseApi}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(fields),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then((me) => setUser(me))
      .catch((error) => {
        if (error.status === 401) return setError('Email hoặc mật khẩu không chính xác!');
      });
  };

  const handleLogout = () => {
    fetch(`${baseApi}/auth/logout`, {
      credentials: 'include',
    }).then((res) => {
      if (res.ok) return setUser(null);
    });
  };

  return (
    <>
      {user ? (
        <>
          <p>Xin chào, {user.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <br />
            <input type="email" name="email" id="email" value={fields.email} onChange={setFieldValue} />
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <input
              type="password"
              name="password"
              id="password"
              value={fields.password}
              onChange={setFieldValue}
            />
            <br />
            <button type="submit">Login</button>
          </form>
          {!!error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </>
  );
}

export default App;

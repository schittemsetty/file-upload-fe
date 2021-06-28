import React, { useState } from 'react';
import axios from 'axios';
// import { setUserSession } from './Utils/Common';

function Register(props) {
  const [loading, setLoading] = useState(false);
  const firstname = useFormInput('');
  const lastname = useFormInput('');
  const email = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post('http://localhost:8080/v1/auth/api/user/register', { firstname: firstname.value, lastname: lastname.value, email: email.value, password: password.value }).then(response => {
      setLoading(false);
      if (response && response.status === 200) {
        alert(response.data.body);
        props.history.push('/login');
      }
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  }

  return (
    <div>
      Register<br /><br />
      <div>
        First Name<br />
        <input type="text" {...firstname} autoComplete="new-password" />
      </div>
      <div>
        Last Name<br />
        <input type="text" {...lastname} autoComplete="new-password" />
      </div>
      <div>
        Email<br />
        <input type="text" {...email} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Regsiter'} onClick={handleLogin} disabled={loading} /><br />
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Register;
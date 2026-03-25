import CustomButton from '../../components/button/indx';
import { CustomInput } from '../../components/input';
import loginStyles from './login.module.scss';
import { useState } from 'react';
import { isEmail } from '../../helpers/helper';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [apiError, setApiError] = useState('');

  const [errors, setErrors] = useState({
    email: [] as string[],
    password: [] as string[],
  });

  function handleEmail(value: string) {
    let arr: string[] = [];

    if (value === '') {
      arr.push('Must enter this field');
    } else if (!isEmail(value)) {
      arr.push('Wrong email');
    }

    setErrors((prev) => ({ ...prev, email: arr }));
    setEmail(value);
  }

  function handlePassword(value: string) {
    let arr: string[] = [];

    if (value.length === 0) {
      arr.push('Password should be more than 5 length');
      arr.push('Must enter this field');
    } else if (value.length < 5) {
      arr.push('Password should be more than 5 length');
    }

    setErrors((prev) => ({ ...prev, password: arr }));
    setPassword(value);
  }

  const isValid =
    errors.email.length === 0 &&
    errors.password.length === 0 &&
    email !== '' &&
    password !== '';

  function logInUser() {
    setApiError('');

    axios
      .post('http://127.0.0.1:9696/authentication/dashboard_login', {
        email: email,
        password: password,
      })
      .then(function (response) {
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        window.location.href = '/index.html';
      })
      .catch(function (error) {
        if (error.response?.data?.error) {
          setApiError(error.response.data.error.message);
        }
      });
  }

  return (
    <div className={`container-fluid ${loginStyles['login-container']}`}>
      <div className='row'>
        <div className='offset-4 col-4'>
          <div className={loginStyles['loginbox']}>
            <div className='row'>
              <div className='col-12 d-flex justify-content-center'>
                <div className={loginStyles['Signin']}>
                  <span className={loginStyles['highlight']}>Si</span>gn in
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='col-12 d-flex justify-content-center'>
                {apiError && <div className='error-message'>{apiError}</div>}
              </div>
            </div>

            <div className='row mb-4'>
              <div className='col-12'>
                <CustomInput
                  labeltext={'Email address'}
                  type={'text'}
                  id={'signIn'}
                  placeholder={'Example@mail.com'}
                  className={loginStyles['inputsignin']}
                  value={email}
                  onChange={(e) => handleEmail(e.target.value)}
                  error={errors.email}
                />
              </div>
            </div>

            <div className='row mb-4'>
              <div className='col-12'>
                <CustomInput
                  labeltext={'Password'}
                  type={'password'}
                  id={'Password'}
                  placeholder={'Enter your password'}
                  className={loginStyles['inputsignin']}
                  value={password}
                  onChange={(e) => handlePassword(e.target.value)}
                  error={errors.password}
                />
              </div>
            </div>

            <div className='row'>
              <div className='col-12'>
                <CustomButton
                  className={loginStyles['buttonsignin']}
                  id={'login'}
                  buttontext={'Login'}
                  onClick={logInUser}
                  disabled={!isValid}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

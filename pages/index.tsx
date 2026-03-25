import homeStyles from './home.module.scss';
import './common/sideMenu.scss';
import { Link } from '../components/link';
import { useContext, useEffect, useState } from 'react';
import ProfileLink from '../components/profileLink';
import SideMenu from '../components/sideMenu';
import NavBar from '../components/navBar';
import { refreshTokenFun } from '../api/api';
import { isEmail, removeError, showError } from '../helpers/helper';
import { AppContext } from '../store';

export function HomePage() {
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    let token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/login';
    }

    let refreshToken = localStorage.getItem('refreshToken');

    const apiUrl = 'http://localhost:9696';
  }, []);
  return (
    <div className='container-fluid'>
      <div className='row'>
        <SideMenu />
        <div className={state.sideMenuToggle ? 'col-10' : 'col-11'} id='home'>
          <NavBar />
          <div className='row welcome-box'>
            <div className='col-12 text-center'>
              <h1 className='welcome-title'>Welcome</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import './home.scss';
import './common/sideMenu.scss';
import { Link } from '../components/link';
import { useEffect, useState } from 'react';
import ProfileLink from '../components/profileLink';
import SideMenu from '../components/sideMenu';
import NavBar from '../components/navBar';
import { refreshTokenFun } from '../api/api';
import { isEmail, removeError, showError } from '../helpers/helper';

export function HomePage() {
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
        <div className='col-10' id='home'>
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

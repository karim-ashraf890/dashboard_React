import { useContext } from 'react';
import { Link } from '../link';
import ProfileLink from '../profileLink';
import { AppContext } from '../../store';

export default function SideMenu() {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div
      className={`${
        state.sideMenuToggle ? 'col-2' : 'col-1'
      } d-flex flex-column nav-bar`}
      id='navBar'
    >
      <ProfileLink />

      <div className='menu-container d-flex flex-column '>
        <Link
          name='Dashboard'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-chart-line'></i>}
        />
        <Link
          name='Admins'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-users-gear'></i>}
        />
        <Link
          name='Trainees'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-user-tie'></i>}
        />
        <Link
          name='Organizations'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-sitemap'></i>}
        />
        <Link
          name='Update Requests'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-square-caret-up'></i>}
        />
        <Link
          name='Categories'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-layer-group'></i>}
        />
        <Link
          name='Sub categories'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-diagram-next'></i>}
        />
        <Link
          name='Courses'
          href='/dashboard.html'
          icon={<i className='fa-regular fa-lightbulb'></i>}
        />
        <Link
          name='Bags'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-briefcase'></i>}
        />
        <Link
          name='Consultation Requests'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-pen-to-square'></i>}
        />
        <Link
          name='Pages'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-newspaper'></i>}
        />
        <Link
          name='Logout'
          href='/dashboard.html'
          icon={<i className='fa-solid fa-right-from-bracket'></i>}
          iconClassName='logout-icon'
          onClick={(event) => {
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            window.location.href = '/login.html';
          }}
        />
      </div>
    </div>
  );
}

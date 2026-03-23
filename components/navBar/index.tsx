import { useContext } from 'react';
import { AppContext } from '../../store';

export default function NavBar() {
  const { state, dispatch } = useContext(AppContext);

  return (
    <>
      <div className='row'>
        <div className='col-12 hyder'>
          {state.sideMenuToggle ? (
            <div
              className='navbarcontrolicon'
              onClick={() => {
                dispatch({ type: 'UPDATE_SIDEMENU_TOGGLE', payload: false });
              }}
            >
              <i className='fa-solid fa-minus' id='closing'></i>
            </div>
          ) : (
            <div
              className='navbarcontrolicon'
              onClick={() => {
                dispatch({ type: 'UPDATE_SIDEMENU_TOGGLE', payload: true });
              }}
            >
              <i className='fa-solid fa-x' id='open'></i>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

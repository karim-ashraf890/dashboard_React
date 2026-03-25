import React, { ReactNode } from 'react';
import loginStyles from './link.module.scss';

type LinkProps = {
  name: string;
  href: string;
  icon: ReactNode;
  iconClassName?: string;
  onClick?: (event: any) => void;
};

export function Link({ name, href, icon, iconClassName, onClick }: LinkProps) {
  return (
    <a href={href} className='side-menu-link' onClick={onClick}>
      <div className='side-menu-item'>
        <div className={`side-menu-icon ${iconClassName}`}>{icon}</div>
        <div className='side-menu-title'>{name}</div>
      </div>
    </a>
  );
}

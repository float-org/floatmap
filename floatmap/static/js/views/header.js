import React from 'react';
import classnames from 'classnames';

import Logo from './Logo';
import SearchForm from './SearchForm';
import Navigation from './Navigation';
/**
 * Stateless Component - header for Float Map
 */
const Header = ({ isMobileNavActive, onSearch, onTourClick, onAboutClick, onMobileToggle }) => {

  const navLinks = [
    {
      name: "About",
      url: '#about',
      handler: onAboutClick,
    },
    {
      name: "Tour",
      url: "#tour",
      handler: onTourClick
    }
  ];

  const navClassNames = classnames('component-navigation', {
    'visible': isMobileNavActive
  });

  return (
    <header className="component-header">
        <Logo text="Float" url="/" />
        <SearchForm onSearch={onSearch} placeholder="Enter an address..." />
        <Navigation items={navLinks} className={navClassNames} onMobileToggle={onMobileToggle} />
    </header>
  );
};

module.exports = Header;

import React from 'react';

/**
 * Stateless Component - navigation for Float Map
 */
const Navigation = ({ items, className='component-navigation', onMobileToggle  }) => (
  <div className={className}>
    <nav>
      <ul>
        {items && items.map((item) => (
          <li>
            <a href={item.url} onClick={item.handler}>{item.name}</a>
          </li>
        ))}
      </ul>
    </nav>
    <button onClick={onMobileToggle}>
      <span className="sr-only">Toggle navigation</span>
      <span className="glyphicon glyphicon-menu-hamburger" />
    </button>
  </div>
);

module.exports = Navigation;

import React from 'react';

/**
 * Stateless Component - Float Map logo
 * @TODO: Probably should support an image if we ever go that route...
 */
const Logo = ({ text, url }) => (
  <div className="component-logo">
    <a href={url}>
      <h1>{text}</h1>
    </a>
  </div>
);

module.exports = Logo;

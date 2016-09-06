import React from 'react';

/**
 * Stateless Component - share buttons for Float Map
 * @TODO: Makes sense to create ShareButton + ShareButtonContainer?
 */
const Share = ({ className }) => {

  const handleClick = (e) => {
    e.preventDefault();
    const url = e.nativeEvent.target.href;
    return window.open( url, "window", "height = 500, width = 559, resizable = 0" );
  };

  return (
    <div className={`component-share ${className}`}>
      <div>
        <h5>share:</h5>
        <a onClick={handleClick} href="https://www.facebook.com/sharer/sharer.php?u=http://www.floatmap.us" className="button fb" />
        <a onClick={handleClick} href="https://twitter.com/intent/tweet?url=http%3A%2F%2Fwww.floatmap.us&text=How%20will%20floods%20get%20worse%20for%20communities%20in%20the%20Midwest%20US%20due%20to%20climate%20change%3F%20Check%20your%20neighborhood%20on%20Float." className="button tw" />
      </div>
    </div>
  );
};

module.exports = Share;

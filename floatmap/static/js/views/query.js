import React from 'react';
import classnames from 'classnames';

/**
 * Stateless Component - query UI for Float Map, located in legend
 */
const Query = ({ data }) => {

  const classNames = classnames('component-query', {
    'active': data.shouldDisplay
  });

  return (
    <div className={classNames}>
      <div className="query-results">
        <h4>Flooding Risk Factors at This Location</h4>
        <ul className="metrics">
          <li><span>{data.ap}</span></li>
          <li><span>{data.ep}</span></li>
        </ul>
      </div>
    </div>
  );
}

module.exports = Query;

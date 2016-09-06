import React from 'react';
import { makeLabelFromClass } from '../utils';

/**
 * Stateless Component - Represents layer toggle on the legend
 */
const LayerSwitch = ({ type, isActive = true, tooltipText }, { _handleSwitch }) => {
  const labelText = makeLabelFromClass(type);
  const fooonChange = () => {
    console.log('foo!');
  }

  return (
    <div className={`component-layer-switch ${type}`}>
      <label>
        {labelText}
        <span className="glyphicon glyphicon-question-sign" data-place='left' data-tip={tooltipText} />
        <input type="checkbox" className={`ios-switch`} checked={isActive} onChange={fooonChange} />
        <div className="switch" data-type={type} onClick={_handleSwitch} />
      </label>
    </div>
  );
};

/**
 * React context
 * @param {Func} handleSwitch
 */
LayerSwitch.contextTypes = {
  _handleSwitch: React.PropTypes.func
};

module.exports = LayerSwitch;

import React from 'react';
import $ from 'jquery';
import 'jquery.cookie';
import { getColor } from '../utils';
import _ from 'underscore';
import L from 'leaflet';
import Query from './Query';
import LayerSwitch from './LayerSwitch';
import ReactTooltip from 'react-tooltip';

const LAYER_TOOLTIPS = {
  ANNUAL_PRECIPITATION: 'Increase in the average amount of precipitation each year in 2040-2070, relative to the present. (NOAA 2014)',
  STORM_FREQUENCY: 'Increase in the average number of days with precipitation greater than 1 inch each year in 2040-2070, relative to the present. (NOAA 2014)',
  FLOOD_ZONES: 'Areas with a serious risk of flooding even without climate change, based on historical record and topography. (FEMA 2014)'
};

/**
 * Class representing legend component for Float Map
 * @TODO This seriously needs some love.
 * @extends React.Component
 */
class Legend extends React.Component {

  /**
   * Create Base Component
   * @param {Object} Props - Props passed into component
   * @TODO Probably shouldn't be using so much jQuery
   */
  constructor(props) {
    super(props);
  }

  /**
   * React Component Lifecycle - Called by React when the component has had state update (re-render)
   * @instance
   */
  componentDidUpdate() {
    if (!$("button.navbar-toggle").is(":visible")) {
      $('.legend-wrapper, .component-legend-toggle, .component-legend').addClass('active');
      let callback = () => $('.legend-wrapper').removeClass('invisible');
      setTimeout(callback, 150);
    }
  }

  /**
   * Handles toggling of legend visibility
   * Return {Function} setTimeout that then adds or removes a class
   * @TODO This should be handled by React
   */
  _handleLegendToggle(e) {
    e.stopPropagation();
    if ($('.legend-wrapper').hasClass('active')) { // i.e. if panel is open
      $('.legend-wrapper').addClass('invisible');
      return setTimeout(() => $('.legend-wrapper, .component-legend-toggle, .component-legend').removeClass('active')
      , 1);
    } else {
      $('.legend-wrapper, .component-legend-toggle, .component-legend').addClass('active');
      return setTimeout(() => $('.legend-wrapper').removeClass('invisible')
      , 150);
    }
  }

  /**
   * React Component Lifecycle - Render
   * @instance
   */
  render() {
    const apGrades = _.range(0,13,1);
    return (
      <div className={`component-legend ${this.props.className}`}>
        <div className="mobile-toggle" onClick={this._handleLegendToggle} />
        <ReactTooltip place="left" type="light" effect="float"/>
        <div className="component-legend-toggle" onClick={this._handleLegendToggle}><span className="glyphicon glyphicon-arrow-up"></span></div>
        <div className="legend-wrapper invisible">
          <Query data={this.props.queryResult} />

          <div className='legend-layer-toggles'>
            <LayerSwitch type="annual-precipitation" isActive={this.props.layers.showAnnualPrecipitation} tooltipText={LAYER_TOOLTIPS.ANNUAL_PRECIPITATION} isActive />
            <LayerSwitch type="storm-frequency" isActive={this.props.layers.showStormFrequency} tooltipText={LAYER_TOOLTIPS.STORM_FREQUENCY} />
            <LayerSwitch type="flood-zones" isActive={this.props.layers.showFloodZones} tooltipText={LAYER_TOOLTIPS.FLOOD_ZONES} />
          </div>
          <div className='legend-data'>
            <div className='apRange'>
              <div className='ap-values'>
                {apGrades.map((grade) => {
                  const label = grade % 4 === 0 ? <span>{grade}%</span> : '';
                  return (
                    <div key={grade}>
                      <i style={{ background: getColor("ap", grade) }} />
                      {label}
                    </div>
                  )
                })}
              </div>
              <div className='ap-arrow' />
              <span className='ap-text'>Increasing Average Precipitation</span>
            </div>
            <div className='epRange'>
              <svg width="205" height="85">
                <rect x="0" y="0" width="47" height="23" className="low-mid dots"></rect>
                <rect x="47" y="0" width="47" height="23" className="mid-high dots"></rect>
                <rect x="94" y="0" width="47" height="23" className="high-extreme dots"></rect>
                <rect x="141" y="0" width="47" height="23" className="extreme-severe dots"></rect>
                <defs>
                 <marker id="arrow" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="10" markerHeight="10" orient="auto"><path d="M0,-5L10,0L0,5"></path></marker>
                </defs>
                <text x="1" y="37">+12%</text>
                <text x="56" y="37">+26%</text>
                <text x="121" y="37">+40%</text>
                <text x="177" y="37">+54%</text>
                <line x1="0" y1="45" x2="195" y2="45" className="link arrow" markerEnd="url(#arrow)"></line>
                <text x="0" y="55">Increasing Storm Frequency</text>
              </svg>
            </div>

            <ul className='floodRange'>
              <li className="year-500">
                <div></div>
                <span>High Flooding</span>
              </li>
              <li className="year-100">
                <div></div>
                <span>Extreme Flooding</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

/**
 * React context
 * @param {Func} handleSwitch
 */
Legend.contextTypes = {
  _handleSwitch: React.PropTypes.func
};

module.exports = Legend;

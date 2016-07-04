import React from 'react';
import Modal from 'react-modal';

/**
 * Stateless Component - welcome modal for Float Map
 * @TODO: Merge w/ welcome modal into one shared component?
 */
const Welcome = ({ onClose, onContinue, isWelcomeOpen }) => {

  return (
    <Modal
      className="component-modal"
      overlayClassName="component-overlay"
      isOpen={isWelcomeOpen}
    >
      <div className="modal-header">
        <button className="close" onClick={onClose}><span>&times;</span></button>
        <h1 className="modal-title">Welcome to Float</h1>
      </div>
      <div className="modal-body">
        <p>Float shows the <strong>projected impacts of climate change</strong> on American communities in the <strong>2040-2070 period</strong>.</p>

        <p>Float currently shows how <strong>key risk factors for floods</strong> are projected to worsen in <strong>the Midwest US</strong>.</p>

        <p>If you see areas without some of the data present, that doesn’t mean those places are risk free--it just means the science hasn’t got there yet. <strong>We only show projections where a large majority of studies agree</strong>.</p>
      </div>
      <div className="modal-footer">
        <button className="btn btn-primary" onClick={onContinue} >Continue</button>
        <button className="btn btn-default" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}

module.exports = Welcome;

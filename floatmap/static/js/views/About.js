import React from 'react';
import Modal from 'react-modal';
import Collapse, { Panel } from 'rc-collapse';

/**
 * Stateless Component - about modal for Float Map
 * @TODO: Merge w/ welcome modal into one shared component?
 */
const About = ({ onClose, isAboutOpen }) => {

  return (
    <Modal
      className="component-modal"
      overlayClassName="component-overlay"
      isOpen={isAboutOpen}
    >
     <div className="modal-header clearfix">
       <h1 className="modal-title">About Float</h1>
       <button className="close" onClick={onClose}>&times;</button>
     </div>
     <div className="modal-body">
       <Collapse accordion={true}>
         <Panel header="Overview">
           <p>Float Map shows the projected impacts of unchecked climate change on American homes, businesses, and communities.</p>
           <p>Float Map shows projections of the 2040-2070 time period, if the current path continues with no serious reductions in climate pollution.</p>
           <p>Float Map currently shows projections related to worsening flooding in the Midwest US. We are preparing expansions into other impacts and further regions in the United States.</p>
           <p>We use data only from the most recent available NOAA and FEMA research, and we always share our sources. </p>
           <p>Float is an independent, non-partisan, not-for-profit organization. Float received the Judges’ Choice and Popular Choice awards in the MIT Climate Colab competition.</p>
         </Panel>
          <Panel header="Data Sources">
             <p>The <strong>Average Precipitation</strong> layer shows how total rain and snowfall each year is projected to grow by the 2040-2070 period. More annual precipitation means more water going into rivers, lakes and snowbanks--a key risk factor for bigger floods. The Average Precipitation layer uses data from the National Oceanic and Atmospheric Administration’s “Regional Climate Trends and Scenarios for the U.S. National Climate Assessment” (Technical Report 142, 2013, <a href="http://www.nesdis.noaa.gov/technical_reports/142_Climate_Scenarios.html">link</a>). This layer shows the percent change between high-emissions scenario (A2) projections of the 2040-2070 time period, versus the historical climate data from 1971-1999. The data presented on Float is a multi-model average of the results from 15 distinct climate models (Atmosphere-Ocean General Circulation Models), compiled in the Coupled Model Intercomparison Project phase 3 dataset. The Float average precipitation layer uses only the NOAA data where a majority of the models show statistically significant change, and over 67% of the models agree on the direction of the change, which is the highest category of data significance which NOAA distinguishes in this report. This data is visualized in the NOAA report for the Midwest (142-3) in Section 3.7, Figure 40, center left.</p>

             <p>The <strong>Storm Frequency</strong> layer uses shows how days with heavy rain or snow (over 1 inch per day) are projected to come more often, by the 2040-2070 period. More storm frequency means more rapid surges of water into rivers and lakes--a key risk factor for more frequent flooding. The Storm Frequency layer uses data from the National Oceanic and Atmospheric Administration’s “Regional Climate Trends and Scenarios for the U.S. National Climate Assessment” (Technical Report 142, 2013, <a href="http://www.nesdis.noaa.gov/technical_reports/142_Climate_Scenarios.html">link</a>). This layer shows the percent change between high-emissions scenario (A2) projections of the 2040-2070 time period, versus the historical climate data from 1980-2000. The data presented on Float is a multi-model average of the results from 11 distinct climate models compiled in the North American Regional Climate Change Assessment Program dataset. The Float storm frequency layer uses only the NOAA data where a majority of the models show statistically significant change, and over 67% of the models agree on the direction of the change, which is the highest category of data significance which NOAA distinguishes in this report. This data is visualized in the NOAA report for the Midwest (142-3) in Section 3.9, Figure 44, top.</p>

             <p>The <strong>Flood Zones</strong> layer shows the areas that already are at major risk for flooding, based on where floods have historically reached. If floods become larger and more frequent, many neighboring areas to these historical flood zones are likely to start experience flooding. The Flood Zones layer uses the Special Flood Hazard Areas data from the Federal Emergency Management Administration (FEMA) Flood Maps. The layer shows the areas currently judged to be at significant risk of flooding, based on statistical analysis of river flow records, consultation with community members, extensive topographic surveys, hydrologic analyses, hydraulic analyses, and analyses of historical storm tides and rainfall. The FEMA Flood Maps are the official data used in support of the National Flood Insurance Program, and are updated on an ongoing basis. Public access to the FEMA Flood maps is available through the FEMA Map Service Center (<a href="https://msc.fema.gov/portal">link</a>).</p>

             <p>We selected the data layers used for Float after consultation with experts at Lawrence Berkeley National Laboratory, the National Center for Atmospheric Research, and the National Climate Data Center. All of these organization are public, not-for-profit research institutions.</p>

             <p>Float Map utilizes several open-source frameworks and libraries, including Django, Elasticsearch, React, and Leaflet. View the full source and stay up to date with our progress on <a href="https://github.com/float-org/floatmap/">Github.</a></p>
          </Panel>

          <Panel header="About Our Team">
             <p>Float is an independent, not-for-profit organization.</p>

             <h3>Keith Brower Brown</h3>
             <div className="headshot">
               <img src="static/img/kbb.jpeg" />
             </div>
             <p>Growing up in Oregon, with family on an apple orchard and summers on Cascade trails,  Keith became passionate for protecting how communities depend on their land and climate. After studying Environmental Economics and Geography at UC Berkeley, Keith worked in the energy industry at PG&E and Navigant Consulting, before founding Float in 2013.</p>

             <h3>Mike Vattuone</h3>
             <div className="headshot">
               <img src="static/img/mv.jpg" />
             </div>
             <p>With a background in cognitive science and user experience research, Mike has a unique interest in both modular software architecture and user interface design. Formerly a full-stack developer at Citizen Engagement Laboratory, Mike has worked on several climate related campaigns for a number of online advocacy organizations.</p>

             <h3>Max Gardner</h3>
             <div className="headshot">
               <img src="static/img/mg.jpeg" />
             </div>
             <p>Max has worked as a geologist for the U.S. Geological Survey Menlo Park, a GIS consultant for Urban Mapping Inc., and a smart-grid analyst for Oracle Corporation. He is currently pursuing his PhD in Systems Engineering at UC Berkeley where he leverages his experience in GIS, data analytics, and sensor networks to improve the operational efficiencies of urban systems.</p>

             <h3>Matteo Banerjee</h3>
             <div className="headshot">
               <img src="static/img/mb.jpeg" />
             </div>
             <p>Matteo is a software engineer with a deep interest in politics and public policy. With several years of experience at companies like Google and Beats Music, he currently leads data engineering at Brigade, a social network focused on civic engagement.</p>
          </Panel>

          <Panel header="Contact Us">
           <p>Please feel free to send questions and your feedback on how to make Float better: <br />
            <a href="mailto:info@floatmap.us">info@floatmap.us</a>
           </p>
           <div id="copyright">
             <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style={{borderWidth: 0}} src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
           </div>
          </Panel>
        </Collapse>
      </div>
      <div className="modal-footer clearfix">
        <button className="btn btn-default" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}

module.exports = About;

import React from 'react';

/**
 * Stateless Component - search form for Float Map, used to geocode searched addresses
 */

const SearchForm = ({ onSearch, placeholder }) => (
  <form action="#" method="POST" className="component-search-form" onSubmit={onSearch}>
    <input type="text" placeholder={placeholder} />
    <button className="glyphicon glyphicon-search" />
  </form>
);

module.exports = SearchForm;

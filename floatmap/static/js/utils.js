import Rainbow from 'rainbowvis.js';

/**
 * Creates a gradient from the start color and end color using setSpectrum
 * @param {String} data type - (e.g. 'ex precip, avg precip')
 * @param {String} data value - value returned from query are associating color with
 * @return {String} hex Value that corresponds to the color for that particular number/data value
*/
const getColor = function(type, d) {
  if (type === 'ap') {
    let rainbow = new Rainbow();
    rainbow.setSpectrum('#94FFDB', '#0003FF'); // Probably just need to set once
    rainbow.setNumberRange(0, 12);
    return `#${rainbow.colourAt(d)}`;
  }
};

/**
 * Accepts class names in the `foo-bar-baz` format, returning
 * @param {String} slug - slug to convert to label
 * @return {String} Readable label for display
 */
const makeLabelFromClass = function(slug) {
  var words = slug.split('-');

  for(var i = 0; i < words.length; i++) {
    var word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(' ');
}

/**
 * Creates a gradient from the start color and end color using setSpectrum
 * @param {String} data type - (e.g. 'ex precip, avg precip')
 * @param {String} data value - value returned from query are associating color with
 * @return {String} class name which corresponds to one of four SVG patterns, which inherit styles from CSS
*/
const getPattern = function(type, d) {
  if (type === 'ep') {
    if (d === null) {
      return false;
    }
    let pattern = 'dots ';
    if (d <= 22) {
      pattern += 'low-mid';
    } else if (d >= 23 && d <= 33) {
      pattern += 'mid-high';
    } else if (d >= 34 && d <= 44) {
      pattern += 'high-extreme';
    } else if (d >= 45 && d <= 55) {
      pattern += 'extreme-severe';
    }
    return pattern;
  }
};

module.exports = {
  getColor,
  getPattern,
  makeLabelFromClass
}

  # Accepts a data type (e.g. 'ex precip, avg precip') and a data value (e.g 'DN')
  # Creates a gradient from the start color and end color using setSpectrum
  # Returns a hex Value that corresponds to the color for that particular number/data value
  
  utils = {}

  utils.getColor = (type, d) ->
    if type == 'ap'
      rainbow = new Rainbow
      rainbow.setSpectrum '#94FFDB', '#0003FF' # Probably just need to set once
      rainbow.setNumberRange 0, 12
      '#' + rainbow.colourAt(d)

  # Accepts a data type and a data value (e.g NOAA Ext. Precipitation DN value)
  # Returns a class which corresponds to one of four SVG patterns, which inherit styles from CSS
  utils.getPattern = (type, d) ->
    if type == 'ep'
      if d is null
        return false
      pattern = 'dots '
      if d <= 22
        pattern += 'low-mid' 
      else if d >= 23 and d <= 33
        pattern += 'mid-high' 
      else if d >= 34 and d <= 44
        pattern += 'high-extreme' 
      else if d >= 45 and d <= 55
        pattern += 'extreme-severe' 
      return pattern
/*
 Leaflet 0.8-dev (8f3a353), a JS library for interactive maps. http://leafletjs.com
 (c) 2010-2015 Vladimir Agafonkin, (c) 2010-2011 CloudMade
*/
!function(t,e,i){function n(){var e=t.L;o.noConflict=function(){return t.L=e,this},t.L=o}var o={version:"0.8-dev"};"object"==typeof module&&"object"==typeof module.exports?module.exports=o:"function"==typeof define&&define.amd&&define(o),"undefined"!=typeof t&&n(),o.Util={extend:function(t){var e,i,n,o;for(i=1,n=arguments.length;n>i;i++){o=arguments[i];for(e in o)t[e]=o[e]}return t},create:Object.create||function(){function t(){}return function(e){return t.prototype=e,new t}}(),bind:function(t,e){var i=Array.prototype.slice;if(t.bind)return t.bind.apply(t,i.call(arguments,1));var n=i.call(arguments,2);return function(){return t.apply(e,n.length?n.concat(i.call(arguments)):arguments)}},stamp:function(t){return t._leaflet_id=t._leaflet_id||++o.Util.lastId,t._leaflet_id},lastId:0,throttle:function(t,e,i){var n,o,s,r;return r=function(){n=!1,o&&(s.apply(i,o),o=!1)},s=function(){n?o=arguments:(t.apply(i,arguments),setTimeout(r,e),n=!0)}},wrapNum:function(t,e,i){var n=e[1],o=e[0],s=n-o;return t===n&&i?t:((t-o)%s+s)%s+o},falseFn:function(){return!1},formatNum:function(t,e){var i=Math.pow(10,e||5);return Math.round(t*i)/i},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},splitWords:function(t){return o.Util.trim(t).split(/\s+/)},setOptions:function(t,e){t.hasOwnProperty("options")||(t.options=t.options?o.Util.create(t.options):{});for(var i in e)t.options[i]=e[i];return t.options},getParamString:function(t,e,i){var n=[];for(var o in t)n.push(encodeURIComponent(i?o.toUpperCase():o)+"="+encodeURIComponent(t[o]));return(e&&-1!==e.indexOf("?")?"&":"?")+n.join("&")},template:function(t,e){return t.replace(o.Util.templateRe,function(t,n){var o=e[n];if(o===i)throw new Error("No value provided for variable "+t);return"function"==typeof o&&(o=o(e)),o})},templateRe:/\{ *([\w_]+) *\}/g,isArray:Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="},function(){function e(e){return t["webkit"+e]||t["moz"+e]||t["ms"+e]}function i(e){var i=+new Date,o=Math.max(0,16-(i-n));return n=i+o,t.setTimeout(e,o)}var n=0,s=t.requestAnimationFrame||e("RequestAnimationFrame")||i,r=t.cancelAnimationFrame||e("CancelAnimationFrame")||e("CancelRequestAnimationFrame")||function(e){t.clearTimeout(e)};o.Util.requestAnimFrame=function(e,n,r){return r&&s===i?void e.call(n):s.call(t,o.bind(e,n))},o.Util.cancelAnimFrame=function(e){e&&r.call(t,e)}}(),o.extend=o.Util.extend,o.bind=o.Util.bind,o.stamp=o.Util.stamp,o.setOptions=o.Util.setOptions,o.Class=function(){},o.Class.extend=function(t){var e=function(){this.initialize&&this.initialize.apply(this,arguments),this.callInitHooks()},i=e.__super__=this.prototype,n=o.Util.create(i);n.constructor=e,e.prototype=n;for(var s in this)this.hasOwnProperty(s)&&"prototype"!==s&&(e[s]=this[s]);return t.statics&&(o.extend(e,t.statics),delete t.statics),t.includes&&(o.Util.extend.apply(null,[n].concat(t.includes)),delete t.includes),n.options&&(t.options=o.Util.extend(o.Util.create(n.options),t.options)),o.extend(n,t),n._initHooks=[],n.callInitHooks=function(){if(!this._initHooksCalled){i.callInitHooks&&i.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=n._initHooks.length;e>t;t++)n._initHooks[t].call(this)}},e},o.Class.include=function(t){o.extend(this.prototype,t)},o.Class.mergeOptions=function(t){o.extend(this.prototype.options,t)},o.Class.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),i="function"==typeof t?t:function(){this[t].apply(this,e)};this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(i)},o.Evented=o.Class.extend({on:function(t,e,i){if("object"==typeof t)for(var n in t)this._on(n,t[n],e);else{t=o.Util.splitWords(t);for(var s=0,r=t.length;r>s;s++)this._on(t[s],e,i)}return this},off:function(t,e,i){if(t)if("object"==typeof t)for(var n in t)this._off(n,t[n],e);else{t=o.Util.splitWords(t);for(var s=0,r=t.length;r>s;s++)this._off(t[s],e,i)}else delete this._events;return this},_on:function(t,e,i){var n=this._events=this._events||{},s=i&&i!==this&&o.stamp(i);if(s){var r=t+"_idx",a=t+"_len",h=n[r]=n[r]||{},l=o.stamp(e)+"_"+s;h[l]||(h[l]={fn:e,ctx:i},n[a]=(n[a]||0)+1)}else n[t]=n[t]||[],n[t].push({fn:e})},_off:function(t,e,i){var n=this._events,s=t+"_idx",r=t+"_len";if(n){if(!e)return delete n[t],delete n[s],void delete n[r];var a,h,l,u,c,d=i&&i!==this&&o.stamp(i);if(d)c=o.stamp(e)+"_"+d,a=n[s],a&&a[c]&&(u=a[c],delete a[c],n[r]--);else if(a=n[t])for(h=0,l=a.length;l>h;h++)if(a[h].fn===e){u=a[h],a.splice(h,1);break}u&&(u.fn=o.Util.falseFn)}},fire:function(t,e,i){if(!this.listens(t,i))return this;var n=o.Util.extend({},e,{type:t,target:this}),s=this._events;if(s){var r,a,h,l,u=s[t+"_idx"];if(s[t])for(h=s[t].slice(),r=0,a=h.length;a>r;r++)h[r].fn.call(this,n);for(l in u)u[l].fn.call(u[l].ctx,n)}return i&&this._propagateEvent(n),this},listens:function(t,e){var i=this._events;if(i&&(i[t]||i[t+"_len"]))return!0;if(e)for(var n in this._eventParents)if(this._eventParents[n].listens(t,e))return!0;return!1},once:function(t,e,i){if("object"==typeof t){for(var n in t)this.once(n,t[n],e);return this}var s=o.bind(function(){this.off(t,e,i).off(t,s,i)},this);return this.on(t,e,i).on(t,s,i)},addEventParent:function(t){return this._eventParents=this._eventParents||{},this._eventParents[o.stamp(t)]=t,this},removeEventParent:function(t){return this._eventParents&&delete this._eventParents[o.stamp(t)],this},_propagateEvent:function(t){for(var e in this._eventParents)this._eventParents[e].fire(t.type,o.extend({layer:t.target},t),!0)}});var s=o.Evented.prototype;s.addEventListener=s.on,s.removeEventListener=s.clearAllEventListeners=s.off,s.addOneTimeEventListener=s.once,s.fireEvent=s.fire,s.hasEventListeners=s.listens,o.Mixin={Events:s},function(){var i=navigator.userAgent.toLowerCase(),n=e.documentElement,s="ActiveXObject"in t,r=-1!==i.indexOf("webkit"),a=-1!==i.indexOf("phantom"),h=-1!==i.search("android [23]"),l=-1!==i.indexOf("chrome"),u=-1!==i.indexOf("gecko")&&!r&&!t.opera&&!s,c="undefined"!=typeof orientation||-1!==i.indexOf("mobile"),d=navigator.msPointerEnabled&&navigator.msMaxTouchPoints&&!t.PointerEvent,_=t.PointerEvent&&navigator.pointerEnabled&&navigator.maxTouchPoints||d,m=s&&"transition"in n.style,p="WebKitCSSMatrix"in t&&"m11"in new t.WebKitCSSMatrix&&!h,f="MozPerspective"in n.style,g="OTransition"in n.style,v=!t.L_NO_TOUCH&&!a&&(_||"ontouchstart"in t||t.DocumentTouch&&e instanceof t.DocumentTouch);o.Browser={ie:s,ielt9:s&&!e.addEventListener,webkit:r,gecko:u,android:-1!==i.indexOf("android"),android23:h,chrome:l,safari:!l&&-1!==i.indexOf("safari"),ie3d:m,webkit3d:p,gecko3d:f,opera12:g,any3d:!t.L_DISABLE_3D&&(m||p||f)&&!g&&!a,mobile:c,mobileWebkit:c&&r,mobileWebkit3d:c&&p,mobileOpera:c&&t.opera,mobileGecko:c&&u,touch:!!v,msPointer:!!d,pointer:!!_,retina:(t.devicePixelRatio||t.screen.deviceXDPI/t.screen.logicalXDPI)>1}}(),o.Point=function(t,e,i){this.x=i?Math.round(t):t,this.y=i?Math.round(e):e},o.Point.prototype={clone:function(){return new o.Point(this.x,this.y)},add:function(t){return this.clone()._add(o.point(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(o.point(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},ceil:function(){return this.clone()._ceil()},_ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this},distanceTo:function(t){t=o.point(t);var e=t.x-this.x,i=t.y-this.y;return Math.sqrt(e*e+i*i)},equals:function(t){return t=o.point(t),t.x===this.x&&t.y===this.y},contains:function(t){return t=o.point(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+o.Util.formatNum(this.x)+", "+o.Util.formatNum(this.y)+")"}},o.point=function(t,e,n){return t instanceof o.Point?t:o.Util.isArray(t)?new o.Point(t[0],t[1]):t===i||null===t?t:new o.Point(t,e,n)},o.Bounds=function(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;o>n;n++)this.extend(i[n])},o.Bounds.prototype={extend:function(t){return t=o.point(t),this.min||this.max?(this.min.x=Math.min(t.x,this.min.x),this.max.x=Math.max(t.x,this.max.x),this.min.y=Math.min(t.y,this.min.y),this.max.y=Math.max(t.y,this.max.y)):(this.min=t.clone(),this.max=t.clone()),this},getCenter:function(t){return new o.Point((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,t)},getBottomLeft:function(){return new o.Point(this.min.x,this.max.y)},getTopRight:function(){return new o.Point(this.max.x,this.min.y)},getSize:function(){return this.max.subtract(this.min)},contains:function(t){var e,i;return t="number"==typeof t[0]||t instanceof o.Point?o.point(t):o.bounds(t),t instanceof o.Bounds?(e=t.min,i=t.max):e=i=t,e.x>=this.min.x&&i.x<=this.max.x&&e.y>=this.min.y&&i.y<=this.max.y},intersects:function(t){t=o.bounds(t);var e=this.min,i=this.max,n=t.min,s=t.max,r=s.x>=e.x&&n.x<=i.x,a=s.y>=e.y&&n.y<=i.y;return r&&a},isValid:function(){return!(!this.min||!this.max)}},o.bounds=function(t,e){return!t||t instanceof o.Bounds?t:new o.Bounds(t,e)},o.Transformation=function(t,e,i,n){this._a=t,this._b=e,this._c=i,this._d=n},o.Transformation.prototype={transform:function(t,e){return this._transform(t.clone(),e)},_transform:function(t,e){return e=e||1,t.x=e*(this._a*t.x+this._b),t.y=e*(this._c*t.y+this._d),t},untransform:function(t,e){return e=e||1,new o.Point((t.x/e-this._b)/this._a,(t.y/e-this._d)/this._c)}},o.DomUtil={get:function(t){return"string"==typeof t?e.getElementById(t):t},getStyle:function(t,i){var n=t.style[i]||t.currentStyle&&t.currentStyle[i];if((!n||"auto"===n)&&e.defaultView){var o=e.defaultView.getComputedStyle(t,null);n=o?o[i]:null}return"auto"===n?null:n},create:function(t,i,n){var o=e.createElement(t);return o.className=i,n&&n.appendChild(o),o},remove:function(t){var e=t.parentNode;e&&e.removeChild(t)},empty:function(t){for(;t.firstChild;)t.removeChild(t.firstChild)},toFront:function(t){t.parentNode.appendChild(t)},toBack:function(t){var e=t.parentNode;e.insertBefore(t,e.firstChild)},hasClass:function(t,e){if(t.classList!==i)return t.classList.contains(e);var n=o.DomUtil.getClass(t);return n.length>0&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(n)},addClass:function(t,e){if(t.classList!==i)for(var n=o.Util.splitWords(e),s=0,r=n.length;r>s;s++)t.classList.add(n[s]);else if(!o.DomUtil.hasClass(t,e)){var a=o.DomUtil.getClass(t);o.DomUtil.setClass(t,(a?a+" ":"")+e)}},removeClass:function(t,e){t.classList!==i?t.classList.remove(e):o.DomUtil.setClass(t,o.Util.trim((" "+o.DomUtil.getClass(t)+" ").replace(" "+e+" "," ")))},setClass:function(t,e){t.className.baseVal===i?t.className=e:t.className.baseVal=e},getClass:function(t){return t.className.baseVal===i?t.className:t.className.baseVal},setOpacity:function(t,e){"opacity"in t.style?t.style.opacity=e:"filter"in t.style&&o.DomUtil._setOpacityIE(t,e)},_setOpacityIE:function(t,e){var i=!1,n="DXImageTransform.Microsoft.Alpha";try{i=t.filters.item(n)}catch(o){if(1===e)return}e=Math.round(100*e),i?(i.Enabled=100!==e,i.Opacity=e):t.style.filter+=" progid:"+n+"(opacity="+e+")"},testProp:function(t){for(var i=e.documentElement.style,n=0;n<t.length;n++)if(t[n]in i)return t[n];return!1},setTransform:function(t,e,i){var n=e||new o.Point(0,0);t.style[o.DomUtil.TRANSFORM]="translate3d("+n.x+"px,"+n.y+"px,0)"+(i?" scale("+i+")":"")},setPosition:function(t,e,i){t._leaflet_pos=e,o.Browser.any3d&&!i?o.DomUtil.setTransform(t,e):(t.style.left=e.x+"px",t.style.top=e.y+"px")},getPosition:function(t){return t._leaflet_pos}},function(){o.DomUtil.TRANSFORM=o.DomUtil.testProp(["transform","WebkitTransform","OTransform","MozTransform","msTransform"]);var i=o.DomUtil.TRANSITION=o.DomUtil.testProp(["webkitTransition","transition","OTransition","MozTransition","msTransition"]);if(o.DomUtil.TRANSITION_END="webkitTransition"===i||"OTransition"===i?i+"End":"transitionend","onselectstart"in e)o.DomUtil.disableTextSelection=function(){o.DomEvent.on(t,"selectstart",o.DomEvent.preventDefault)},o.DomUtil.enableTextSelection=function(){o.DomEvent.off(t,"selectstart",o.DomEvent.preventDefault)};else{var n=o.DomUtil.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]);o.DomUtil.disableTextSelection=function(){if(n){var t=e.documentElement.style;this._userSelect=t[n],t[n]="none"}},o.DomUtil.enableTextSelection=function(){n&&(e.documentElement.style[n]=this._userSelect,delete this._userSelect)}}o.DomUtil.disableImageDrag=function(){o.DomEvent.on(t,"dragstart",o.DomEvent.preventDefault)},o.DomUtil.enableImageDrag=function(){o.DomEvent.off(t,"dragstart",o.DomEvent.preventDefault)},o.DomUtil.preventOutline=function(e){o.DomUtil.restoreOutline(),this._outlineElement=e,this._outlineStyle=e.style.outline,e.style.outline="none",o.DomEvent.on(t,"keydown",o.DomUtil.restoreOutline,this)},o.DomUtil.restoreOutline=function(){this._outlineElement&&(this._outlineElement.style.outline=this._outlineStyle,delete this._outlineElement,delete this._outlineStyle,o.DomEvent.off(t,"keydown",o.DomUtil.restoreOutline,this))}}(),o.LatLng=function(t,e,n){if(isNaN(t)||isNaN(e))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=+t,this.lng=+e,n!==i&&(this.alt=+n)},o.LatLng.prototype={equals:function(t,e){if(!t)return!1;t=o.latLng(t);var n=Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng));return(e===i?1e-9:e)>=n},toString:function(t){return"LatLng("+o.Util.formatNum(this.lat,t)+", "+o.Util.formatNum(this.lng,t)+")"},distanceTo:function(t){return o.CRS.Earth.distance(this,o.latLng(t))},wrap:function(){return o.CRS.Earth.wrapLatLng(this)},toBounds:function(t){var e=180*t/40075017,i=e/Math.cos(Math.PI/180*this.lat);return o.latLngBounds([this.lat-e,this.lng-i],[this.lat+e,this.lng+i])}},o.latLng=function(t,e,n){return t instanceof o.LatLng?t:o.Util.isArray(t)&&"object"!=typeof t[0]?3===t.length?new o.LatLng(t[0],t[1],t[2]):2===t.length?new o.LatLng(t[0],t[1]):null:t===i||null===t?t:"object"==typeof t&&"lat"in t?new o.LatLng(t.lat,"lng"in t?t.lng:t.lon,t.alt):e===i?null:new o.LatLng(t,e,n)},o.LatLngBounds=function(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;o>n;n++)this.extend(i[n])},o.LatLngBounds.prototype={extend:function(t){var e,i,n=this._southWest,s=this._northEast;if(t instanceof o.LatLng)e=t,i=t;else{if(!(t instanceof o.LatLngBounds))return t?this.extend(o.latLng(t)||o.latLngBounds(t)):this;if(e=t._southWest,i=t._northEast,!e||!i)return this}return n||s?(n.lat=Math.min(e.lat,n.lat),n.lng=Math.min(e.lng,n.lng),s.lat=Math.max(i.lat,s.lat),s.lng=Math.max(i.lng,s.lng)):(this._southWest=new o.LatLng(e.lat,e.lng),this._northEast=new o.LatLng(i.lat,i.lng)),this},pad:function(t){var e=this._southWest,i=this._northEast,n=Math.abs(e.lat-i.lat)*t,s=Math.abs(e.lng-i.lng)*t;return new o.LatLngBounds(new o.LatLng(e.lat-n,e.lng-s),new o.LatLng(i.lat+n,i.lng+s))},getCenter:function(){return new o.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new o.LatLng(this.getNorth(),this.getWest())},getSouthEast:function(){return new o.LatLng(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t="number"==typeof t[0]||t instanceof o.LatLng?o.latLng(t):o.latLngBounds(t);var e,i,n=this._southWest,s=this._northEast;return t instanceof o.LatLngBounds?(e=t.getSouthWest(),i=t.getNorthEast()):e=i=t,e.lat>=n.lat&&i.lat<=s.lat&&e.lng>=n.lng&&i.lng<=s.lng},intersects:function(t){t=o.latLngBounds(t);var e=this._southWest,i=this._northEast,n=t.getSouthWest(),s=t.getNorthEast(),r=s.lat>=e.lat&&n.lat<=i.lat,a=s.lng>=e.lng&&n.lng<=i.lng;return r&&a},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t){return t?(t=o.latLngBounds(t),this._southWest.equals(t.getSouthWest())&&this._northEast.equals(t.getNorthEast())):!1},isValid:function(){return!(!this._southWest||!this._northEast)}},o.latLngBounds=function(t,e){return!t||t instanceof o.LatLngBounds?t:new o.LatLngBounds(t,e)},o.Projection={},o.Projection.LonLat={project:function(t){return new o.Point(t.lng,t.lat)},unproject:function(t){return new o.LatLng(t.y,t.x)},bounds:o.bounds([-180,-90],[180,90])},o.Projection.SphericalMercator={R:6378137,project:function(t){var e=Math.PI/180,i=1-1e-15,n=Math.max(Math.min(Math.sin(t.lat*e),i),-i);return new o.Point(this.R*t.lng*e,this.R*Math.log((1+n)/(1-n))/2)},unproject:function(t){var e=180/Math.PI;return new o.LatLng((2*Math.atan(Math.exp(t.y/this.R))-Math.PI/2)*e,t.x*e/this.R)},bounds:function(){var t=6378137*Math.PI;return o.bounds([-t,-t],[t,t])}()},o.CRS={latLngToPoint:function(t,e){var i=this.projection.project(t),n=this.scale(e);return this.transformation._transform(i,n)},pointToLatLng:function(t,e){var i=this.scale(e),n=this.transformation.untransform(t,i);return this.projection.unproject(n)},project:function(t){return this.projection.project(t)},unproject:function(t){return this.projection.unproject(t)},scale:function(t){return 256*Math.pow(2,t)},getProjectedBounds:function(t){if(this.infinite)return null;var e=this.projection.bounds,i=this.scale(t),n=this.transformation.transform(e.min,i),s=this.transformation.transform(e.max,i);return o.bounds(n,s)},wrapLatLng:function(t){var e=this.wrapLng?o.Util.wrapNum(t.lng,this.wrapLng,!0):t.lng,i=this.wrapLat?o.Util.wrapNum(t.lat,this.wrapLat,!0):t.lat,n=t.alt;return o.latLng(i,e,n)}},o.CRS.Simple=o.extend({},o.CRS,{projection:o.Projection.LonLat,transformation:new o.Transformation(1,0,-1,0),scale:function(t){return Math.pow(2,t)},distance:function(t,e){var i=e.lng-t.lng,n=e.lat-t.lat;return Math.sqrt(i*i+n*n)},infinite:!0}),o.CRS.Earth=o.extend({},o.CRS,{wrapLng:[-180,180],R:6378137,distance:function(t,e){var i=Math.PI/180,n=t.lat*i,o=e.lat*i,s=Math.sin(n)*Math.sin(o)+Math.cos(n)*Math.cos(o)*Math.cos((e.lng-t.lng)*i);return this.R*Math.acos(Math.min(s,1))}}),o.CRS.EPSG3857=o.extend({},o.CRS.Earth,{code:"EPSG:3857",projection:o.Projection.SphericalMercator,transformation:function(){var t=.5/(Math.PI*o.Projection.SphericalMercator.R);return new o.Transformation(t,.5,-t,.5)}()}),o.CRS.EPSG900913=o.extend({},o.CRS.EPSG3857,{code:"EPSG:900913"}),o.CRS.EPSG4326=o.extend({},o.CRS.Earth,{code:"EPSG:4326",projection:o.Projection.LonLat,transformation:new o.Transformation(1/180,1,-1/180,.5)}),o.Map=o.Evented.extend({options:{crs:o.CRS.EPSG3857,fadeAnimation:!0,trackResize:!0,markerZoomAnimation:!0},initialize:function(t,e){e=o.setOptions(this,e),this._initContainer(t),this._initLayout(),this._onResize=o.bind(this._onResize,this),this._initEvents(),e.maxBounds&&this.setMaxBounds(e.maxBounds),e.zoom!==i&&(this._zoom=this._limitZoom(e.zoom)),e.center&&e.zoom!==i&&this.setView(o.latLng(e.center),e.zoom,{reset:!0}),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._sizeChanged=!0,this.callInitHooks(),this._addLayers(this.options.layers)},setView:function(t,e){return e=e===i?this.getZoom():e,this._resetView(o.latLng(t),this._limitZoom(e)),this},setZoom:function(t,e){return this._loaded?this.setView(this.getCenter(),t,{zoom:e}):(this._zoom=this._limitZoom(t),this)},zoomIn:function(t,e){return this.setZoom(this._zoom+(t||1),e)},zoomOut:function(t,e){return this.setZoom(this._zoom-(t||1),e)},setZoomAround:function(t,e,i){var n=this.getZoomScale(e),s=this.getSize().divideBy(2),r=t instanceof o.Point?t:this.latLngToContainerPoint(t),a=r.subtract(s).multiplyBy(1-1/n),h=this.containerPointToLatLng(s.add(a));return this.setView(h,e,{zoom:i})},_getBoundsCenterZoom:function(t,e){e=e||{},t=t.getBounds?t.getBounds():o.latLngBounds(t);var i=o.point(e.paddingTopLeft||e.padding||[0,0]),n=o.point(e.paddingBottomRight||e.padding||[0,0]),s=this.getBoundsZoom(t,!1,i.add(n));s=e.maxZoom?Math.min(e.maxZoom,s):s;var r=n.subtract(i).divideBy(2),a=this.project(t.getSouthWest(),s),h=this.project(t.getNorthEast(),s),l=this.unproject(a.add(h).divideBy(2).add(r),s);return{center:l,zoom:s}},fitBounds:function(t,e){var i=this._getBoundsCenterZoom(t,e);return this.setView(i.center,i.zoom,e)},fitWorld:function(t){return this.fitBounds([[-90,-180],[90,180]],t)},panTo:function(t,e){return this.setView(t,this._zoom,{pan:e})},panBy:function(t){return this.fire("movestart"),this._rawPanBy(o.point(t)),this.fire("move"),this.fire("moveend")},setMaxBounds:function(t){return(t=o.latLngBounds(t))?(this.options.maxBounds&&this.off("moveend",this._panInsideMaxBounds),this.options.maxBounds=t,this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds)):this.off("moveend",this._panInsideMaxBounds)},setMinZoom:function(t){return this.options.minZoom=t,this._loaded&&this.getZoom()<this.options.minZoom?this.setZoom(t):this},setMaxZoom:function(t){return this.options.maxZoom=t,this._loaded&&this.getZoom()>this.options.maxZoom?this.setZoom(t):this},panInsideBounds:function(t,e){var i=this.getCenter(),n=this._limitCenter(i,this._zoom,t);return i.equals(n)?this:this.panTo(n,e)},invalidateSize:function(t){if(!this._loaded)return this;t=o.extend({animate:!1,pan:!0},t===!0?{animate:!0}:t);var e=this.getSize();this._sizeChanged=!0,this._initialCenter=null;var i=this.getSize(),n=e.divideBy(2).round(),s=i.divideBy(2).round(),r=n.subtract(s);return r.x||r.y?(t.animate&&t.pan?this.panBy(r):(t.pan&&this._rawPanBy(r),this.fire("move"),t.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(o.bind(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:e,newSize:i})):this},stop:function(){return o.Util.cancelAnimFrame(this._flyToFrame),this._panAnim&&this._panAnim.stop(),this},addHandler:function(t,e){if(!e)return this;var i=this[t]=new e(this);return this._handlers.push(i),this.options[t]&&i.enable(),this},remove:function(){this._initEvents(!0);try{delete this._container._leaflet}catch(t){this._container._leaflet=i}return o.DomUtil.remove(this._mapPane),this._clearControlPos&&this._clearControlPos(),this._clearHandlers(),this._loaded&&this.fire("unload"),this},createPane:function(t,e){var i="leaflet-pane"+(t?" leaflet-"+t.replace("Pane","")+"-pane":""),n=o.DomUtil.create("div",i,e||this._mapPane);return t&&(this._panes[t]=n),n},getCenter:function(){return this._checkIfLoaded(),this._initialCenter&&!this._moved()?this._initialCenter:this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var t=this.getPixelBounds(),e=this.unproject(t.getBottomLeft()),i=this.unproject(t.getTopRight());return new o.LatLngBounds(e,i)},getMinZoom:function(){return this.options.minZoom===i?this._layersMinZoom||0:this.options.minZoom},getMaxZoom:function(){return this.options.maxZoom===i?this._layersMaxZoom===i?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(t,e,i){t=o.latLngBounds(t);var n,s=this.getMinZoom()-(e?1:0),r=this.getMaxZoom(),a=this.getSize(),h=t.getNorthWest(),l=t.getSouthEast(),u=!0;i=o.point(i||[0,0]);do s++,n=this.project(l,s).subtract(this.project(h,s)).add(i).floor(),u=e?n.x<a.x||n.y<a.y:a.contains(n);while(u&&r>=s);return u&&e?null:e?s:s-1},getSize:function(){return(!this._size||this._sizeChanged)&&(this._size=new o.Point(this._container.clientWidth,this._container.clientHeight),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(t,e){var i=this._getTopLeftPoint(t,e);return new o.Bounds(i,i.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._pixelOrigin},getPixelWorldBounds:function(t){return this.options.crs.getProjectedBounds(t===i?this.getZoom():t)},getPane:function(t){return"string"==typeof t?this._panes[t]:t},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(t,e){var n=this.options.crs;return e=e===i?this._zoom:e,n.scale(t)/n.scale(e)},getScaleZoom:function(t,e){return e=e===i?this._zoom:e,e+Math.log(t)/Math.LN2},project:function(t,e){return e=e===i?this._zoom:e,this.options.crs.latLngToPoint(o.latLng(t),e)},unproject:function(t,e){return e=e===i?this._zoom:e,this.options.crs.pointToLatLng(o.point(t),e)},layerPointToLatLng:function(t){var e=o.point(t).add(this.getPixelOrigin());return this.unproject(e)},latLngToLayerPoint:function(t){var e=this.project(o.latLng(t))._round();return e._subtract(this.getPixelOrigin())},wrapLatLng:function(t){return this.options.crs.wrapLatLng(o.latLng(t))},distance:function(t,e){return this.options.crs.distance(o.latLng(t),o.latLng(e))},containerPointToLayerPoint:function(t){return o.point(t).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(t){return o.point(t).add(this._getMapPanePos())},containerPointToLatLng:function(t){var e=this.containerPointToLayerPoint(o.point(t));return this.layerPointToLatLng(e)},latLngToContainerPoint:function(t){return this.layerPointToContainerPoint(this.latLngToLayerPoint(o.latLng(t)))},mouseEventToContainerPoint:function(t){return o.DomEvent.getMousePosition(t,this._container)},mouseEventToLayerPoint:function(t){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t))},mouseEventToLatLng:function(t){return this.layerPointToLatLng(this.mouseEventToLayerPoint(t))},_initContainer:function(t){var e=this._container=o.DomUtil.get(t);if(!e)throw new Error("Map container not found.");if(e._leaflet)throw new Error("Map container is already initialized.");o.DomEvent.addListener(e,"scroll",this._onScroll,this),e._leaflet=!0},_initLayout:function(){var t=this._container;this._fadeAnimated=this.options.fadeAnimation&&o.Browser.any3d,o.DomUtil.addClass(t,"leaflet-container"+(o.Browser.touch?" leaflet-touch":"")+(o.Browser.retina?" leaflet-retina":"")+(o.Browser.ielt9?" leaflet-oldie":"")+(o.Browser.safari?" leaflet-safari":"")+(this._fadeAnimated?" leaflet-fade-anim":""));var e=o.DomUtil.getStyle(t,"position");"absolute"!==e&&"relative"!==e&&"fixed"!==e&&(t.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var t=this._panes={};this._paneRenderers={},this._mapPane=this.createPane("mapPane",this._container),this.createPane("tilePane"),this.createPane("shadowPane"),this.createPane("overlayPane"),this.createPane("markerPane"),this.createPane("popupPane"),this.options.markerZoomAnimation||(o.DomUtil.addClass(t.markerPane,"leaflet-zoom-hide"),o.DomUtil.addClass(t.shadowPane,"leaflet-zoom-hide"))},_resetView:function(t,e,i,n){var s=this._zoom!==e;n||(this.fire("movestart"),s&&this.fire("zoomstart")),this._zoom=e,this._initialCenter=t,i||o.DomUtil.setPosition(this._mapPane,new o.Point(0,0)),this._pixelOrigin=this._getNewPixelOrigin(t);var r=!this._loaded;this._loaded=!0,this.fire("viewreset",{hard:!i}),r&&this.fire("load"),this.fire("move"),(s||n)&&this.fire("zoomend"),this.fire("moveend",{hard:!i})},_rawPanBy:function(t){o.DomUtil.setPosition(this._mapPane,this._getMapPanePos().subtract(t))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_panInsideMaxBounds:function(){this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(e){if(o.DomEvent){this._targets={};var i=e?"off":"on";o.DomEvent[i](this._container,"click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress",this._handleDOMEvent,this),this.options.trackResize&&o.DomEvent[i](t,"resize",this._onResize,this)}},_onResize:function(){o.Util.cancelAnimFrame(this._resizeRequest),this._resizeRequest=o.Util.requestAnimFrame(function(){this.invalidateSize({debounceMoveend:!0})},this,!1,this._container)},_onScroll:function(){this._container.scrollTop=0,this._container.scrollLeft=0},_findEventTarget:function(t){for(;t;){var e=this._targets[o.stamp(t)];if(e)return e;if(t===this._container)break;t=t.parentNode}return null},_handleDOMEvent:function(t){if(this._loaded&&!o.DomEvent._skipped(t)){var e=this._findEventTarget(t.target||t.srcElement),i="keypress"===t.type&&13===t.keyCode?"click":t.type;(e||"mouseover"!==i&&"mouseout"!==i||o.DomEvent._checkMouse(this._container,t))&&("mousedown"===i&&o.DomUtil.preventOutline(t.target||t.srcElement),this._fireDOMEvent(e||this,t,i))}},_fireDOMEvent:function(t,e,i){if((t.listens(i,!0)||"click"===i&&t.listens("preclick",!0))&&("contextmenu"===i&&o.DomEvent.preventDefault(e),"click"!==e.type||e._simulated||!this._draggableMoved(t))){var n={originalEvent:e};"keypress"!==e.type&&(n.containerPoint=t instanceof o.Marker?this.latLngToContainerPoint(t.getLatLng()):this.mouseEventToContainerPoint(e),n.layerPoint=this.containerPointToLayerPoint(n.containerPoint),n.latlng=this.layerPointToLatLng(n.layerPoint)),"click"===i&&t.fire("preclick",n,!0),t.fire(i,n,!0)}},_draggableMoved:function(t){return t=t.options.draggable?t:this,t.dragging&&t.dragging.moved()||this.boxZoom&&this.boxZoom.moved()},_clearHandlers:function(){for(var t=0,e=this._handlers.length;e>t;t++)this._handlers[t].disable()},whenReady:function(t,e){return this._loaded?t.call(e||this,{target:this}):this.on("load",t,e),this},_getMapPanePos:function(){return o.DomUtil.getPosition(this._mapPane)||new o.Point(0,0)},_moved:function(){var t=this._getMapPanePos();return t&&!t.equals([0,0])},_getTopLeftPoint:function(t,e){var n=t&&e!==i?this._getNewPixelOrigin(t,e):this.getPixelOrigin();return n.subtract(this._getMapPanePos())},_getNewPixelOrigin:function(t,e){var i=this.getSize()._divideBy(2);return this.project(t,e)._subtract(i)._add(this._getMapPanePos())._round()},_latLngToNewLayerPoint:function(t,e,i){var n=this._getNewPixelOrigin(i,e);return this.project(t,e)._subtract(n)},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(t){return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint())},_limitCenter:function(t,e,i){if(!i)return t;var n=this.project(t,e),s=this.getSize().divideBy(2),r=new o.Bounds(n.subtract(s),n.add(s)),a=this._getBoundsOffset(r,i,e);return this.unproject(n.add(a),e)},_limitOffset:function(t,e){if(!e)return t;var i=this.getPixelBounds(),n=new o.Bounds(i.min.add(t),i.max.add(t));return t.add(this._getBoundsOffset(n,e))},_getBoundsOffset:function(t,e,i){var n=this.project(e.getNorthWest(),i).subtract(t.min),s=this.project(e.getSouthEast(),i).subtract(t.max),r=this._rebound(n.x,-s.x),a=this._rebound(n.y,-s.y);return new o.Point(r,a)},_rebound:function(t,e){return t+e>0?Math.round(t-e)/2:Math.max(0,Math.ceil(t))-Math.max(0,Math.floor(e))},_limitZoom:function(t){var e=this.getMinZoom(),i=this.getMaxZoom();return Math.max(e,Math.min(i,t))}}),o.map=function(t,e){return new o.Map(t,e)},o.Layer=o.Evented.extend({options:{pane:"overlayPane"},addTo:function(t){return t.addLayer(this),this},remove:function(){return this.removeFrom(this._map||this._mapToAdd)},removeFrom:function(t){return t&&t.removeLayer(this),this},getPane:function(t){return this._map.getPane(t?this.options[t]||t:this.options.pane)},addInteractiveTarget:function(t){return this._map._targets[o.stamp(t)]=this,this},removeInteractiveTarget:function(t){return delete this._map._targets[o.stamp(t)],this},_layerAdd:function(t){var e=t.target;e.hasLayer(this)&&(this._map=e,this._zoomAnimated=e._zoomAnimated,this.onAdd(e),this.getAttribution&&this._map.attributionControl&&this._map.attributionControl.addAttribution(this.getAttribution()),
this.getEvents&&e.on(this.getEvents(),this),this.fire("add"),e.fire("layeradd",{layer:this}))}}),o.Map.include({addLayer:function(t){var e=o.stamp(t);return this._layers[e]?t:(this._layers[e]=t,t._mapToAdd=this,t.beforeAdd&&t.beforeAdd(this),this.whenReady(t._layerAdd,t),this)},removeLayer:function(t){var e=o.stamp(t);return this._layers[e]?(this._loaded&&t.onRemove(this),t.getAttribution&&this.attributionControl&&this.attributionControl.removeAttribution(t.getAttribution()),t.getEvents&&this.off(t.getEvents(),t),delete this._layers[e],this._loaded&&(this.fire("layerremove",{layer:t}),t.fire("remove")),t._map=t._mapToAdd=null,this):this},hasLayer:function(t){return!!t&&o.stamp(t)in this._layers},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},_addLayers:function(t){t=t?o.Util.isArray(t)?t:[t]:[];for(var e=0,i=t.length;i>e;e++)this.addLayer(t[e])},_addZoomLimit:function(t){(isNaN(t.options.maxZoom)||!isNaN(t.options.minZoom))&&(this._zoomBoundLayers[o.stamp(t)]=t,this._updateZoomLevels())},_removeZoomLimit:function(t){var e=o.stamp(t);this._zoomBoundLayers[e]&&(delete this._zoomBoundLayers[e],this._updateZoomLevels())},_updateZoomLevels:function(){var t=1/0,e=-(1/0),n=this._getZoomSpan();for(var o in this._zoomBoundLayers){var s=this._zoomBoundLayers[o].options;t=s.minZoom===i?t:Math.min(t,s.minZoom),e=s.maxZoom===i?e:Math.max(e,s.maxZoom)}this._layersMaxZoom=e===-(1/0)?i:e,this._layersMinZoom=t===1/0?i:t,n!==this._getZoomSpan()&&this.fire("zoomlevelschange")}}),o.Projection.Mercator={R:6378137,R_MINOR:6356752.314245179,bounds:o.bounds([-20037508.34279,-15496570.73972],[20037508.34279,18764656.23138]),project:function(t){var e=Math.PI/180,i=this.R,n=t.lat*e,s=this.R_MINOR/i,r=Math.sqrt(1-s*s),a=r*Math.sin(n),h=Math.tan(Math.PI/4-n/2)/Math.pow((1-a)/(1+a),r/2);return n=-i*Math.log(Math.max(h,1e-10)),new o.Point(t.lng*e*i,n)},unproject:function(t){for(var e,i=180/Math.PI,n=this.R,s=this.R_MINOR/n,r=Math.sqrt(1-s*s),a=Math.exp(-t.y/n),h=Math.PI/2-2*Math.atan(a),l=0,u=.1;15>l&&Math.abs(u)>1e-7;l++)e=r*Math.sin(h),e=Math.pow((1-e)/(1+e),r/2),u=Math.PI/2-2*Math.atan(a*e)-h,h+=u;return new o.LatLng(h*i,t.x*i/n)}},o.CRS.EPSG3395=o.extend({},o.CRS.Earth,{code:"EPSG:3395",projection:o.Projection.Mercator,transformation:function(){var t=.5/(Math.PI*o.Projection.Mercator.R);return new o.Transformation(t,.5,-t,.5)}()}),o.GridLayer=o.Layer.extend({options:{pane:"tilePane",tileSize:256,opacity:1,updateWhenIdle:o.Browser.mobile,updateInterval:200,attribution:null,zIndex:null,bounds:null,minZoom:0},initialize:function(t){t=o.setOptions(this,t)},onAdd:function(){this._initContainer(),this._levels={},this._tiles={},this._viewReset(),this._update()},beforeAdd:function(t){t._addZoomLimit(this)},onRemove:function(t){o.DomUtil.remove(this._container),t._removeZoomLimit(this),this._container=null,this._tileZoom=null},bringToFront:function(){return this._map&&(o.DomUtil.toFront(this._container),this._setAutoZIndex(Math.max)),this},bringToBack:function(){return this._map&&(o.DomUtil.toBack(this._container),this._setAutoZIndex(Math.min)),this},getAttribution:function(){return this.options.attribution},getContainer:function(){return this._container},setOpacity:function(t){return this.options.opacity=t,this._updateOpacity(),this},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},isLoading:function(){return this._loading},redraw:function(){return this._map&&(this._removeAllTiles(),this._update()),this},getEvents:function(){var t={viewreset:this._viewReset,moveend:this._move};return this.options.updateWhenIdle||(t.move=o.Util.throttle(this._move,this.options.updateInterval,this)),this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},createTile:function(){return e.createElement("div")},_updateZIndex:function(){this._container&&this.options.zIndex!==i&&null!==this.options.zIndex&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(t){for(var e,i=this.getPane().children,n=-t(-(1/0),1/0),o=0,s=i.length;s>o;o++)e=i[o].style.zIndex,i[o]!==this._container&&e&&(n=t(n,+e));isFinite(n)&&(this.options.zIndex=n+t(-1,1),this._updateZIndex())},_updateOpacity:function(){if(this._map){var t=this.options.opacity;if(!o.Browser.ielt9&&!this._map._fadeAnimated)return void o.DomUtil.setOpacity(this._container,t);var e=+new Date,i=!1;for(var n in this._tiles){var s=this._tiles[n];if(s.current&&s.loaded&&!s.active){var r=Math.min(1,(e-s.loaded)/200);1>r?(o.DomUtil.setOpacity(s.el,t*r),i=!0):(o.DomUtil.setOpacity(s.el,t),s.active=!0,this._pruneTiles())}}i&&(o.Util.cancelAnimFrame(this._fadeFrame),this._fadeFrame=o.Util.requestAnimFrame(this._updateOpacity,this))}},_initContainer:function(){this._container||(this._container=o.DomUtil.create("div","leaflet-layer"),this._updateZIndex(),this.options.opacity<1&&this._updateOpacity(),this.getPane().appendChild(this._container))},_updateLevels:function(){var t=this._tileZoom,e=this.options.maxZoom;for(var i in this._levels)this._levels[i].el.children.length||i===t?this._levels[i].el.style.zIndex=e-Math.abs(t-i):(o.DomUtil.remove(this._levels[i].el),delete this._levels[i]);var n=this._levels[t],s=this._map;return n||(n=this._levels[t]={},n.el=o.DomUtil.create("div","leaflet-tile-container leaflet-zoom-animated",this._container),n.el.style.zIndex=e,n.origin=s.project(s.unproject(s.getPixelOrigin()),t).round(),n.zoom=t,this._setZoomTransform(n,s.getCenter(),s.getZoom()),o.Util.falseFn(n.el.offsetWidth)),this._level=n,n},_pruneTiles:function(){var t,e;for(t in this._tiles)e=this._tiles[t],e.retain=e.current;for(t in this._tiles)if(e=this._tiles[t],e.current&&!e.active){var i=e.coords;this._retainParent(i.x,i.y,i.z,i.z-5)||this._retainChildren(i.x,i.y,i.z,i.z+2)}for(t in this._tiles)this._tiles[t].retain||this._removeTile(t)},_removeAllTiles:function(){for(var t in this._tiles)this._removeTile(t)},_retainParent:function(t,e,i,n){var o=Math.floor(t/2),s=Math.floor(e/2),r=i-1,a=o+":"+s+":"+r,h=this._tiles[a];return h&&h.active?(h.retain=!0,!0):(h&&h.loaded&&(h.retain=!0),r>n?this._retainParent(o,s,r,n):!1)},_retainChildren:function(t,e,i,n){for(var o=2*t;2*t+2>o;o++)for(var s=2*e;2*e+2>s;s++){var r=o+":"+s+":"+(i+1),a=this._tiles[r];a&&a.active?a.retain=!0:(a&&a.loaded&&(a.retain=!0),n>i+1&&this._retainChildren(o,s,i+1,n))}},_viewReset:function(t){this._reset(this._map.getCenter(),this._map.getZoom(),t&&t.hard)},_animateZoom:function(t){this._reset(t.center,t.zoom,!1,!0,t.noUpdate)},_reset:function(t,e,i,n,s){var r=Math.round(e),a=this._tileZoom!==r;s||!i&&!a||(this._abortLoading&&this._abortLoading(),this._tileZoom=r,this._updateLevels(),this._resetGrid(),o.Browser.mobileWebkit||this._update(t,r),n||this._pruneTiles()),this._setZoomTransforms(t,e)},_setZoomTransforms:function(t,e){for(var i in this._levels)this._setZoomTransform(this._levels[i],t,e)},_setZoomTransform:function(t,e,i){var n=this._map.getZoomScale(i,t.zoom),s=t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(e,i)).round();o.DomUtil.setTransform(t.el,s,n)},_resetGrid:function(){var t=this._map,e=t.options.crs,i=this._tileSize=this._getTileSize(),n=this._tileZoom,o=this._map.getPixelWorldBounds(this._tileZoom);o&&(this._globalTileRange=this._pxBoundsToTileRange(o)),this._wrapX=e.wrapLng&&[Math.floor(t.project([0,e.wrapLng[0]],n).x/i),Math.ceil(t.project([0,e.wrapLng[1]],n).x/i)],this._wrapY=e.wrapLat&&[Math.floor(t.project([e.wrapLat[0],0],n).y/i),Math.ceil(t.project([e.wrapLat[1],0],n).y/i)]},_getTileSize:function(){return this.options.tileSize},_move:function(){this._update(),this._pruneTiles()},_update:function(t,n){var s=this._map;if(s){t===i&&(t=s.getCenter()),n===i&&(n=Math.round(s.getZoom()));var r=s.getPixelBounds(t,n),a=this._pxBoundsToTileRange(r),h=a.getCenter(),l=[];for(var u in this._tiles)this._tiles[u].current=!1;for(var c=a.min.y;c<=a.max.y;c++)for(var d=a.min.x;d<=a.max.x;d++){var _=new o.Point(d,c);if(_.z=n,this._isValidTile(_)){var m=this._tiles[this._tileCoordsToKey(_)];m?m.current=!0:l.push(_)}}if(l.sort(function(t,e){return t.distanceTo(h)-e.distanceTo(h)}),0!==l.length){this._loading||(this._loading=!0,this.fire("loading"));var p=e.createDocumentFragment();for(d=0;d<l.length;d++)this._addTile(l[d],p);this._level.el.appendChild(p)}}},_isValidTile:function(t){var e=this._map.options.crs;if(!e.infinite){var i=this._globalTileRange;if(!e.wrapLng&&(t.x<i.min.x||t.x>i.max.x)||!e.wrapLat&&(t.y<i.min.y||t.y>i.max.y))return!1}if(!this.options.bounds)return!0;var n=this._tileCoordsToBounds(t);return o.latLngBounds(this.options.bounds).intersects(n)},_keyToBounds:function(t){return this._tileCoordsToBounds(this._keyToTileCoords(t))},_tileCoordsToBounds:function(t){var e=this._map,i=this._getTileSize(),n=t.multiplyBy(i),s=n.add([i,i]),r=e.wrapLatLng(e.unproject(n,t.z)),a=e.wrapLatLng(e.unproject(s,t.z));return new o.LatLngBounds(r,a)},_tileCoordsToKey:function(t){return t.x+":"+t.y+":"+t.z},_keyToTileCoords:function(t){var e=t.split(":"),i=new o.Point(+e[0],+e[1]);return i.z=+e[2],i},_removeTile:function(t){var e=this._tiles[t];e&&(o.DomUtil.remove(e.el),delete this._tiles[t],this.fire("tileunload",{tile:e.el,coords:this._keyToTileCoords(t)}))},_initTile:function(t){o.DomUtil.addClass(t,"leaflet-tile"),t.style.width=this._tileSize+"px",t.style.height=this._tileSize+"px",t.onselectstart=o.Util.falseFn,t.onmousemove=o.Util.falseFn,o.Browser.ielt9&&this.options.opacity<1&&o.DomUtil.setOpacity(t,this.options.opacity),o.Browser.android&&!o.Browser.android23&&(t.style.WebkitBackfaceVisibility="hidden")},_addTile:function(t,e){var i=this._getTilePos(t),n=this._tileCoordsToKey(t),s=this.createTile(this._wrapCoords(t),o.bind(this._tileReady,this,t));this._initTile(s),this.createTile.length<2&&setTimeout(o.bind(this._tileReady,this,t,null,s),0),o.DomUtil.setPosition(s,i,!0),this._tiles[n]={el:s,coords:t,current:!0},e.appendChild(s),this.fire("tileloadstart",{tile:s,coords:t})},_tileReady:function(t,e,i){if(this._map){e&&this.fire("tileerror",{error:e,tile:i,coords:t});var n=this._tileCoordsToKey(t);i=this._tiles[n],i&&(i.loaded=+new Date,this._map._fadeAnimated?(o.DomUtil.setOpacity(i.el,0),o.Util.cancelAnimFrame(this._fadeFrame),this._fadeFrame=o.Util.requestAnimFrame(this._updateOpacity,this)):(i.active=!0,this._pruneTiles()),o.DomUtil.addClass(i.el,"leaflet-tile-loaded"),this.fire("tileload",{tile:i.el,coords:t}),this._noTilesToLoad()&&(this._loading=!1,this.fire("load")))}},_getTilePos:function(t){return t.multiplyBy(this._tileSize).subtract(this._level.origin)},_wrapCoords:function(t){var e=new o.Point(this._wrapX?o.Util.wrapNum(t.x,this._wrapX):t.x,this._wrapY?o.Util.wrapNum(t.y,this._wrapY):t.y);return e.z=t.z,e},_pxBoundsToTileRange:function(t){return new o.Bounds(t.min.divideBy(this._tileSize).floor(),t.max.divideBy(this._tileSize).ceil().subtract([1,1]))},_noTilesToLoad:function(){for(var t in this._tiles)if(!this._tiles[t].loaded)return!1;return!0}}),o.gridLayer=function(t){return new o.GridLayer(t)},o.TileLayer=o.GridLayer.extend({options:{maxZoom:18,subdomains:"abc",errorTileUrl:"",zoomOffset:0,maxNativeZoom:null,tms:!1,zoomReverse:!1,detectRetina:!1,crossOrigin:!1},initialize:function(t,e){this._url=t,e=o.setOptions(this,e),e.detectRetina&&o.Browser.retina&&e.maxZoom>0&&(e.tileSize=Math.floor(e.tileSize/2),e.zoomOffset++,e.minZoom=Math.max(0,e.minZoom),e.maxZoom--),"string"==typeof e.subdomains&&(e.subdomains=e.subdomains.split("")),o.Browser.android||this.on("tileunload",this._onTileRemove)},setUrl:function(t,e){return this._url=t,e||this.redraw(),this},createTile:function(t,i){var n=e.createElement("img");return n.onload=o.bind(this._tileOnLoad,this,i,n),n.onerror=o.bind(this._tileOnError,this,i,n),this.options.crossOrigin&&(n.crossOrigin=""),n.alt="",n.src=this.getTileUrl(t),n},getTileUrl:function(t){return o.Util.template(this._url,o.extend({r:this.options.detectRetina&&o.Browser.retina&&this.options.maxZoom>0?"@2x":"",s:this._getSubdomain(t),x:t.x,y:this.options.tms?this._globalTileRange.max.y-t.y:t.y,z:this._getZoomForUrl()},this.options))},_tileOnLoad:function(t,e){o.Browser.ielt9?setTimeout(o.bind(t,this,null,e),0):t(null,e)},_tileOnError:function(t,e,i){var n=this.options.errorTileUrl;n&&(e.src=n),t(i,e)},_getTileSize:function(){var t=this._map,e=this.options,i=this._tileZoom+e.zoomOffset,n=e.maxNativeZoom;return null!==n&&i>n?Math.round(e.tileSize/t.getZoomScale(n,i)):e.tileSize},_onTileRemove:function(t){t.tile.onload=null},_getZoomForUrl:function(){var t=this.options,e=this._tileZoom;return t.zoomReverse&&(e=t.maxZoom-e),e+=t.zoomOffset,t.maxNativeZoom?Math.min(e,t.maxNativeZoom):e},_getSubdomain:function(t){var e=Math.abs(t.x+t.y)%this.options.subdomains.length;return this.options.subdomains[e]},_abortLoading:function(){var t,e;for(t in this._tiles)e=this._tiles[t].el,e.onload=o.Util.falseFn,e.onerror=o.Util.falseFn,e.complete||(e.src=o.Util.emptyImageUrl,o.DomUtil.remove(e))}}),o.tileLayer=function(t,e){return new o.TileLayer(t,e)},o.TileLayer.WMS=o.TileLayer.extend({defaultWmsParams:{service:"WMS",request:"GetMap",version:"1.1.1",layers:"",styles:"",format:"image/jpeg",transparent:!1},options:{crs:null,uppercase:!1},initialize:function(t,e){this._url=t;var i=o.extend({},this.defaultWmsParams);for(var n in e)n in this.options||(i[n]=e[n]);e=o.setOptions(this,e),i.width=i.height=e.tileSize*(e.detectRetina&&o.Browser.retina?2:1),this.wmsParams=i},onAdd:function(t){this._crs=this.options.crs||t.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var e=this._wmsVersion>=1.3?"crs":"srs";this.wmsParams[e]=this._crs.code,o.TileLayer.prototype.onAdd.call(this,t)},getTileUrl:function(t){var e=this._tileCoordsToBounds(t),i=this._crs.project(e.getNorthWest()),n=this._crs.project(e.getSouthEast()),s=(this._wmsVersion>=1.3&&this._crs===o.CRS.EPSG4326?[n.y,i.x,i.y,n.x]:[i.x,n.y,n.x,i.y]).join(","),r=o.TileLayer.prototype.getTileUrl.call(this,t);return r+o.Util.getParamString(this.wmsParams,r,this.options.uppercase)+(this.options.uppercase?"&BBOX=":"&bbox=")+s},setParams:function(t,e){return o.extend(this.wmsParams,t),e||this.redraw(),this}}),o.tileLayer.wms=function(t,e){return new o.TileLayer.WMS(t,e)},o.ImageOverlay=o.Layer.extend({options:{opacity:1,alt:"",interactive:!1},initialize:function(t,e,i){this._url=t,this._bounds=o.latLngBounds(e),o.setOptions(this,i)},onAdd:function(){this._image||(this._initImage(),this.options.opacity<1&&this._updateOpacity()),this.options.interactive&&(o.DomUtil.addClass(this._image,"leaflet-interactive"),this.addInteractiveTarget(this._image)),this.getPane().appendChild(this._image),this._reset()},onRemove:function(){o.DomUtil.remove(this._image),this.options.interactive&&this.removeInteractiveTarget(this._image)},setOpacity:function(t){return this.options.opacity=t,this._image&&this._updateOpacity(),this},setStyle:function(t){return t.opacity&&this.setOpacity(t.opacity),this},bringToFront:function(){return this._map&&o.DomUtil.toFront(this._image),this},bringToBack:function(){return this._map&&o.DomUtil.toBack(this._image),this},setUrl:function(t){return this._url=t,this._image&&(this._image.src=t),this},getAttribution:function(){return this.options.attribution},getEvents:function(){var t={viewreset:this._reset};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},getBounds:function(){return this._bounds},_initImage:function(){var t=this._image=o.DomUtil.create("img","leaflet-image-layer "+(this._zoomAnimated?"leaflet-zoom-animated":""));t.onselectstart=o.Util.falseFn,t.onmousemove=o.Util.falseFn,t.onload=o.bind(this.fire,this,"load"),t.src=this._url,t.alt=this.options.alt},_animateZoom:function(t){var e=new o.Bounds(this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(),t.zoom,t.center),this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(),t.zoom,t.center)),i=e.min.add(e.getSize()._multiplyBy((1-1/t.scale)/2));o.DomUtil.setTransform(this._image,i,t.scale)},_reset:function(){var t=this._image,e=new o.Bounds(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),this._map.latLngToLayerPoint(this._bounds.getSouthEast())),i=e.getSize();o.DomUtil.setPosition(t,e.min),t.style.width=i.x+"px",t.style.height=i.y+"px"},_updateOpacity:function(){o.DomUtil.setOpacity(this._image,this.options.opacity)}}),o.imageOverlay=function(t,e,i){return new o.ImageOverlay(t,e,i)},o.Icon=o.Class.extend({initialize:function(t){o.setOptions(this,t)},createIcon:function(t){return this._createIcon("icon",t)},createShadow:function(t){return this._createIcon("shadow",t)},_createIcon:function(t,e){var i=this._getIconUrl(t);if(!i){if("icon"===t)throw new Error("iconUrl not set in Icon options (see the docs).");return null}var n=this._createImg(i,e&&"IMG"===e.tagName?e:null);return this._setIconStyles(n,t),n},_setIconStyles:function(t,e){var i=this.options,n=o.point(i[e+"Size"]),s=o.point("shadow"===e&&i.shadowAnchor||i.iconAnchor||n&&n.divideBy(2,!0));t.className="leaflet-marker-"+e+" "+(i.className||""),s&&(t.style.marginLeft=-s.x+"px",t.style.marginTop=-s.y+"px"),n&&(t.style.width=n.x+"px",t.style.height=n.y+"px")},_createImg:function(t,i){return i=i||e.createElement("img"),i.src=t,i},_getIconUrl:function(t){return o.Browser.retina&&this.options[t+"RetinaUrl"]||this.options[t+"Url"]}}),o.icon=function(t){return new o.Icon(t)},o.Icon.Default=o.Icon.extend({options:{iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]},_getIconUrl:function(t){var e=t+"Url";if(this.options[e])return this.options[e];var i=o.Icon.Default.imagePath;if(!i)throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");return i+"/marker-"+t+(o.Browser.retina&&"icon"===t?"-2x":"")+".png"}}),o.Icon.Default.imagePath=function(){var t,i,n,o,s=e.getElementsByTagName("script"),r=/[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;for(t=0,i=s.length;i>t;t++)if(n=s[t].src,n.match(r))return o=n.split(r)[0],(o?o+"/":"")+"images"}(),o.Marker=o.Layer.extend({options:{pane:"markerPane",icon:new o.Icon.Default,interactive:!0,keyboard:!0,zIndexOffset:0,opacity:1,riseOffset:250},initialize:function(t,e){o.setOptions(this,e),this._latlng=o.latLng(t)},onAdd:function(t){this._zoomAnimated=this._zoomAnimated&&t.options.markerZoomAnimation,this._initIcon(),this.update()},onRemove:function(){this.dragging&&this.dragging.enabled()&&this.dragging.removeHooks(),this._removeIcon(),this._removeShadow()},getEvents:function(){var t={viewreset:this.update};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},getLatLng:function(){return this._latlng},setLatLng:function(t){var e=this._latlng;return this._latlng=o.latLng(t),this.update(),this.fire("move",{oldLatLng:e,latlng:this._latlng})},setZIndexOffset:function(t){return this.options.zIndexOffset=t,this.update()},setIcon:function(t){return this.options.icon=t,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup,this._popup.options),this},update:function(){if(this._icon){var t=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(t)}return this},_initIcon:function(){var t=this.options,e="leaflet-zoom-"+(this._zoomAnimated?"animated":"hide"),i=t.icon.createIcon(this._icon),n=!1;i!==this._icon&&(this._icon&&this._removeIcon(),n=!0,t.title&&(i.title=t.title),t.alt&&(i.alt=t.alt)),o.DomUtil.addClass(i,e),t.keyboard&&(i.tabIndex="0"),this._icon=i,this._initInteraction(),t.riseOnHover&&this.on({mouseover:this._bringToFront,mouseout:this._resetZIndex});var s=t.icon.createShadow(this._shadow),r=!1;s!==this._shadow&&(this._removeShadow(),r=!0),s&&o.DomUtil.addClass(s,e),this._shadow=s,t.opacity<1&&this._updateOpacity(),n&&this.getPane().appendChild(this._icon),s&&r&&this.getPane("shadowPane").appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&this.off({mouseover:this._bringToFront,mouseout:this._resetZIndex}),o.DomUtil.remove(this._icon),this.removeInteractiveTarget(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&o.DomUtil.remove(this._shadow),this._shadow=null},_setPos:function(t){o.DomUtil.setPosition(this._icon,t),this._shadow&&o.DomUtil.setPosition(this._shadow,t),this._zIndex=t.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(t){this._icon.style.zIndex=this._zIndex+t},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPos(e)},_initInteraction:function(){if(this.options.interactive&&(o.DomUtil.addClass(this._icon,"leaflet-interactive"),this.addInteractiveTarget(this._icon),o.Handler.MarkerDrag)){var t=this.options.draggable;this.dragging&&(t=this.dragging.enabled(),this.dragging.disable()),this.dragging=new o.Handler.MarkerDrag(this),t&&this.dragging.enable()}},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},_updateOpacity:function(){var t=this.options.opacity;o.DomUtil.setOpacity(this._icon,t),this._shadow&&o.DomUtil.setOpacity(this._shadow,t)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)}}),o.marker=function(t,e){return new o.Marker(t,e)},o.DivIcon=o.Icon.extend({options:{iconSize:[12,12],className:"leaflet-div-icon",html:!1},createIcon:function(t){var i=t&&"DIV"===t.tagName?t:e.createElement("div"),n=this.options;return i.innerHTML=n.html!==!1?n.html:"",n.bgPos&&(i.style.backgroundPosition=-n.bgPos.x+"px "+-n.bgPos.y+"px"),this._setIconStyles(i,"icon"),i},createShadow:function(){return null}}),o.divIcon=function(t){return new o.DivIcon(t)},o.Map.mergeOptions({closePopupOnClick:!0}),o.Popup=o.Layer.extend({options:{pane:"popupPane",minWidth:50,maxWidth:300,offset:[0,7],autoPan:!0,autoPanPadding:[5,5],closeButton:!0,autoClose:!0,zoomAnimation:!0},initialize:function(t,e){o.setOptions(this,t),this._source=e},onAdd:function(t){this._zoomAnimated=this._zoomAnimated&&this.options.zoomAnimation,this._container||this._initLayout(),t._fadeAnimated&&o.DomUtil.setOpacity(this._container,0),clearTimeout(this._removeTimeout),this.getPane().appendChild(this._container),this.update(),t._fadeAnimated&&o.DomUtil.setOpacity(this._container,1),t.fire("popupopen",{popup:this}),this._source&&this._source.fire("popupopen",{popup:this},!0)},openOn:function(t){return t.openPopup(this),this},onRemove:function(t){t._fadeAnimated?(o.DomUtil.setOpacity(this._container,0),this._removeTimeout=setTimeout(o.bind(o.DomUtil.remove,o.DomUtil,this._container),200)):o.DomUtil.remove(this._container),t.fire("popupclose",{popup:this}),this._source&&this._source.fire("popupclose",{popup:this},!0)},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=o.latLng(t),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(t){return this._content=t,this.update(),this},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},getEvents:function(){var t={viewreset:this._updatePosition},e=this.options;return this._zoomAnimated&&(t.zoomanim=this._animateZoom),("closeOnClick"in e?e.closeOnClick:this._map.options.closePopupOnClick)&&(t.preclick=this._close),e.keepInView&&(t.moveend=this._adjustPan),t},isOpen:function(){return!!this._map&&this._map.hasLayer(this)},_close:function(){this._map&&this._map.closePopup(this)},_initLayout:function(){var t="leaflet-popup",e=this._container=o.DomUtil.create("div",t+" "+(this.options.className||"")+" leaflet-zoom-"+(this._zoomAnimated?"animated":"hide"));if(this.options.closeButton){var i=this._closeButton=o.DomUtil.create("a",t+"-close-button",e);i.href="#close",i.innerHTML="&#215;",o.DomEvent.on(i,"click",this._onCloseButtonClick,this)}var n=this._wrapper=o.DomUtil.create("div",t+"-content-wrapper",e);this._contentNode=o.DomUtil.create("div",t+"-content",n),o.DomEvent.disableClickPropagation(n).disableScrollPropagation(this._contentNode).on(n,"contextmenu",o.DomEvent.stopPropagation),this._tipContainer=o.DomUtil.create("div",t+"-tip-container",e),this._tip=o.DomUtil.create("div",t+"-tip",this._tipContainer)},_updateContent:function(){if(this._content){var t=this._contentNode,e="function"==typeof this._content?this._content(this._source||this):this._content;if("string"==typeof e)t.innerHTML=e;else{for(;t.hasChildNodes();)t.removeChild(t.firstChild);t.appendChild(e)}this.fire("contentupdate")}},_updateLayout:function(){var t=this._contentNode,e=t.style;e.width="",e.whiteSpace="nowrap";var i=t.offsetWidth;i=Math.min(i,this.options.maxWidth),i=Math.max(i,this.options.minWidth),e.width=i+1+"px",e.whiteSpace="",e.height="";var n=t.offsetHeight,s=this.options.maxHeight,r="leaflet-popup-scrolled";s&&n>s?(e.height=s+"px",o.DomUtil.addClass(t,r)):o.DomUtil.removeClass(t,r),this._containerWidth=this._container.offsetWidth},_updatePosition:function(){if(this._map){var t=this._map.latLngToLayerPoint(this._latlng),e=o.point(this.options.offset);this._zoomAnimated?o.DomUtil.setPosition(this._container,t):e=e.add(t);var i=this._containerBottom=-e.y,n=this._containerLeft=-Math.round(this._containerWidth/2)+e.x;this._container.style.bottom=i+"px",this._container.style.left=n+"px"}},_animateZoom:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center);o.DomUtil.setPosition(this._container,e)},_adjustPan:function(){if(this.options.autoPan){var t=this._map,e=this._container.offsetHeight,i=this._containerWidth,n=new o.Point(this._containerLeft,-e-this._containerBottom);this._zoomAnimated&&n._add(o.DomUtil.getPosition(this._container));var s=t.layerPointToContainerPoint(n),r=o.point(this.options.autoPanPadding),a=o.point(this.options.autoPanPaddingTopLeft||r),h=o.point(this.options.autoPanPaddingBottomRight||r),l=t.getSize(),u=0,c=0;s.x+i+h.x>l.x&&(u=s.x+i-l.x+h.x),s.x-u-a.x<0&&(u=s.x-a.x),s.y+e+h.y>l.y&&(c=s.y+e-l.y+h.y),s.y-c-a.y<0&&(c=s.y-a.y),(u||c)&&t.fire("autopanstart").panBy([u,c])}},_onCloseButtonClick:function(t){this._close(),o.DomEvent.stop(t)}}),o.popup=function(t,e){return new o.Popup(t,e)},o.Map.include({openPopup:function(t,e,i){return t instanceof o.Popup||(t=new o.Popup(i).setContent(t)),e&&t.setLatLng(e),this.hasLayer(t)?this:(this._popup&&this._popup.options.autoClose&&this.closePopup(),this._popup=t,this.addLayer(t))},closePopup:function(t){return t&&t!==this._popup||(t=this._popup,this._popup=null),t&&this.removeLayer(t),this}}),o.Layer.include({bindPopup:function(t,e){return t instanceof o.Popup?(o.setOptions(t,e),this._popup=t,t._source=this):((!this._popup||e)&&(this._popup=new o.Popup(e,this)),this._popup.setContent(t)),this._popupHandlersAdded||(this.on({click:this._openPopup,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this.off({click:this._openPopup,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!1,this._popup=null),this},openPopup:function(t,e){if(t instanceof o.Layer||(e=t,t=this),t instanceof o.FeatureGroup)for(var i in this._layers){t=this._layers[i];break}return e||(e=t.getCenter?t.getCenter():t.getLatLng()),this._popup&&this._map&&(this._popup.options.offset=this._popupAnchor(t),this._popup._source=t,this._popup.update(),this._map.openPopup(this._popup,e)),this},closePopup:function(){return this._popup&&this._popup._close(),this},togglePopup:function(t){return this._popup&&(this._popup._map?this.closePopup():this.openPopup(t)),this},setPopupContent:function(t){return this._popup&&this._popup.setContent(t),this},getPopup:function(){return this._popup},_openPopup:function(t){var e=t.layer||t.target;if(this._popup&&this._map)return e instanceof o.Path?void this.openPopup(t.layer||t.target,t.latlng):void(this._map.hasLayer(this._popup)&&this._popup._source===e?this.closePopup():this.openPopup(e,t.latlng))},_popupAnchor:function(t){var e=t._getPopupAnchor?t._getPopupAnchor():[0,0];return o.point(e).add(o.Popup.prototype.options.offset)},_movePopup:function(t){this._popup.setLatLng(t.latlng)}}),o.Marker.include({_getPopupAnchor:function(){return this.options.icon.options.popupAnchor||[0,0]}}),o.LayerGroup=o.Layer.extend({initialize:function(t){this._layers={};var e,i;if(t)for(e=0,i=t.length;i>e;e++)this.addLayer(t[e])},addLayer:function(t){var e=this.getLayerId(t);return this._layers[e]=t,this._map&&this._map.addLayer(t),this},removeLayer:function(t){var e=t in this._layers?t:this.getLayerId(t);return this._map&&this._layers[e]&&this._map.removeLayer(this._layers[e]),delete this._layers[e],this},hasLayer:function(t){return!!t&&(t in this._layers||this.getLayerId(t)in this._layers)},clearLayers:function(){for(var t in this._layers)this.removeLayer(this._layers[t]);return this},invoke:function(t){var e,i,n=Array.prototype.slice.call(arguments,1);for(e in this._layers)i=this._layers[e],i[t]&&i[t].apply(i,n);return this},onAdd:function(t){for(var e in this._layers)t.addLayer(this._layers[e])},onRemove:function(t){for(var e in this._layers)t.removeLayer(this._layers[e])},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},getLayer:function(t){return this._layers[t]},getLayers:function(){var t=[];for(var e in this._layers)t.push(this._layers[e]);return t},setZIndex:function(t){return this.invoke("setZIndex",t)},getLayerId:function(t){return o.stamp(t)}}),o.layerGroup=function(t){return new o.LayerGroup(t)},o.FeatureGroup=o.LayerGroup.extend({addLayer:function(t){return this.hasLayer(t)?this:(t.addEventParent(this),o.LayerGroup.prototype.addLayer.call(this,t),this.fire("layeradd",{layer:t}))},removeLayer:function(t){return this.hasLayer(t)?(t in this._layers&&(t=this._layers[t]),t.removeEventParent(this),o.LayerGroup.prototype.removeLayer.call(this,t),this.fire("layerremove",{layer:t})):this},setStyle:function(t){return this.invoke("setStyle",t)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var t=new o.LatLngBounds;for(var e in this._layers){var i=this._layers[e];t.extend(i.getBounds?i.getBounds():i.getLatLng())}return t}}),o.featureGroup=function(t){return new o.FeatureGroup(t)},o.Renderer=o.Layer.extend({options:{padding:0},initialize:function(t){o.setOptions(this,t),o.stamp(this)},onAdd:function(){this._container||(this._initContainer(),this._zoomAnimated&&o.DomUtil.addClass(this._container,"leaflet-zoom-animated")),this.getPane().appendChild(this._container),this._update()},onRemove:function(){o.DomUtil.remove(this._container)},getEvents:function(){var t={moveend:this._update};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},_animateZoom:function(t){var e=t.origin.subtract(this._map._getCenterLayerPoint()),i=this._bounds.min.add(e.multiplyBy(1-t.scale)).add(t.offset).round();o.DomUtil.setTransform(this._container,i,t.scale)},_update:function(){var t=this.options.padding,e=this._map.getSize(),i=this._map.containerPointToLayerPoint(e.multiplyBy(-t)).round();this._bounds=new o.Bounds(i,i.add(e.multiplyBy(1+2*t)).round())}}),o.Map.include({getRenderer:function(t){var e=t.options.renderer||this._getPaneRenderer(t.options.pane)||this.options.renderer||this._renderer;return e||(e=this._renderer=o.SVG&&o.svg()||o.Canvas&&o.canvas()),this.hasLayer(e)||this.addLayer(e),e},_getPaneRenderer:function(t){if("overlayPane"===t||t===i)return!1;var e=this._paneRenderers[t];return e===i&&(e=o.SVG&&o.svg({pane:t})||o.Canvas&&o.canvas({pane:t}),this._paneRenderers[t]=e),e}}),o.Path=o.Layer.extend({options:{stroke:!0,color:"#3388ff",weight:3,opacity:1,lineCap:"round",lineJoin:"round",fillOpacity:.2,fillRule:"evenodd",interactive:!0},onAdd:function(){this._renderer=this._map.getRenderer(this),this._renderer._initPath(this),this._project(),this._update(),this._renderer._addPath(this)},onRemove:function(){this._renderer._removePath(this)},getEvents:function(){return{viewreset:this._project,moveend:this._update}},redraw:function(){return this._map&&this._renderer._updatePath(this),this},setStyle:function(t){
return o.setOptions(this,t),this._renderer&&this._renderer._updateStyle(this),this},bringToFront:function(){return this._renderer&&this._renderer._bringToFront(this),this},bringToBack:function(){return this._renderer&&this._renderer._bringToBack(this),this},_clickTolerance:function(){return(this.options.stroke?this.options.weight/2:0)+(o.Browser.touch?10:0)}}),o.LineUtil={simplify:function(t,e){if(!e||!t.length)return t.slice();var i=e*e;return t=this._reducePoints(t,i),t=this._simplifyDP(t,i)},pointToSegmentDistance:function(t,e,i){return Math.sqrt(this._sqClosestPointOnSegment(t,e,i,!0))},closestPointOnSegment:function(t,e,i){return this._sqClosestPointOnSegment(t,e,i)},_simplifyDP:function(t,e){var n=t.length,o=typeof Uint8Array!=i+""?Uint8Array:Array,s=new o(n);s[0]=s[n-1]=1,this._simplifyDPStep(t,s,e,0,n-1);var r,a=[];for(r=0;n>r;r++)s[r]&&a.push(t[r]);return a},_simplifyDPStep:function(t,e,i,n,o){var s,r,a,h=0;for(r=n+1;o-1>=r;r++)a=this._sqClosestPointOnSegment(t[r],t[n],t[o],!0),a>h&&(s=r,h=a);h>i&&(e[s]=1,this._simplifyDPStep(t,e,i,n,s),this._simplifyDPStep(t,e,i,s,o))},_reducePoints:function(t,e){for(var i=[t[0]],n=1,o=0,s=t.length;s>n;n++)this._sqDist(t[n],t[o])>e&&(i.push(t[n]),o=n);return s-1>o&&i.push(t[s-1]),i},clipSegment:function(t,e,i,n,o){var s,r,a,h=n?this._lastCode:this._getBitCode(t,i),l=this._getBitCode(e,i);for(this._lastCode=l;;){if(!(h|l))return[t,e];if(h&l)return!1;s=h||l,r=this._getEdgeIntersection(t,e,s,i,o),a=this._getBitCode(r,i),s===h?(t=r,h=a):(e=r,l=a)}},_getEdgeIntersection:function(t,e,i,n,s){var r,a,h=e.x-t.x,l=e.y-t.y,u=n.min,c=n.max;return 8&i?(r=t.x+h*(c.y-t.y)/l,a=c.y):4&i?(r=t.x+h*(u.y-t.y)/l,a=u.y):2&i?(r=c.x,a=t.y+l*(c.x-t.x)/h):1&i&&(r=u.x,a=t.y+l*(u.x-t.x)/h),new o.Point(r,a,s)},_getBitCode:function(t,e){var i=0;return t.x<e.min.x?i|=1:t.x>e.max.x&&(i|=2),t.y<e.min.y?i|=4:t.y>e.max.y&&(i|=8),i},_sqDist:function(t,e){var i=e.x-t.x,n=e.y-t.y;return i*i+n*n},_sqClosestPointOnSegment:function(t,e,i,n){var s,r=e.x,a=e.y,h=i.x-r,l=i.y-a,u=h*h+l*l;return u>0&&(s=((t.x-r)*h+(t.y-a)*l)/u,s>1?(r=i.x,a=i.y):s>0&&(r+=h*s,a+=l*s)),h=t.x-r,l=t.y-a,n?h*h+l*l:new o.Point(r,a)}},o.Polyline=o.Path.extend({options:{smoothFactor:1},initialize:function(t,e){o.setOptions(this,e),this._setLatLngs(t)},getLatLngs:function(){return this._latlngs},setLatLngs:function(t){return this._setLatLngs(t),this.redraw()},addLatLng:function(t){return t=o.latLng(t),this._latlngs.push(t),this._bounds.extend(t),this.redraw()},spliceLatLngs:function(){var t=[].splice.apply(this._latlngs,arguments);return this._setLatLngs(this._latlngs),this.redraw(),t},closestLayerPoint:function(t){for(var e,i,n=1/0,s=null,r=o.LineUtil._sqClosestPointOnSegment,a=0,h=this._parts.length;h>a;a++)for(var l=this._parts[a],u=1,c=l.length;c>u;u++){e=l[u-1],i=l[u];var d=r(t,e,i,!0);n>d&&(n=d,s=r(t,e,i))}return s&&(s.distance=Math.sqrt(n)),s},getCenter:function(){var t,e,i,n,o,s,r,a=this._rings[0],h=a.length;if(!h)return null;for(t=0,e=0;h-1>t;t++)e+=a[t].distanceTo(a[t+1])/2;if(0===e)return this._map.layerPointToLatLng(a[0]);for(t=0,n=0;h-1>t;t++)if(o=a[t],s=a[t+1],i=o.distanceTo(s),n+=i,n>e)return r=(n-e)/i,this._map.layerPointToLatLng([s.x-r*(s.x-o.x),s.y-r*(s.y-o.y)])},getBounds:function(){return this._bounds},_setLatLngs:function(t){this._bounds=new o.LatLngBounds,this._latlngs=this._convertLatLngs(t)},_convertLatLngs:function(t){for(var e=[],i=this._flat(t),n=0,s=t.length;s>n;n++)i?(e[n]=o.latLng(t[n]),this._bounds.extend(e[n])):e[n]=this._convertLatLngs(t[n]);return e},_flat:function(t){return!o.Util.isArray(t[0])||"object"!=typeof t[0][0]},_project:function(){this._rings=[],this._projectLatlngs(this._latlngs,this._rings);var t=this._clickTolerance(),e=new o.Point(t,-t);this._latlngs.length&&(this._pxBounds=new o.Bounds(this._map.latLngToLayerPoint(this._bounds.getSouthWest())._subtract(e),this._map.latLngToLayerPoint(this._bounds.getNorthEast())._add(e)))},_projectLatlngs:function(t,e){var i,n,s=t[0]instanceof o.LatLng,r=t.length;if(s){for(n=[],i=0;r>i;i++)n[i]=this._map.latLngToLayerPoint(t[i]);e.push(n)}else for(i=0;r>i;i++)this._projectLatlngs(t[i],e)},_clipPoints:function(){if(this.options.noClip)return void(this._parts=this._rings);this._parts=[];var t,e,i,n,s,r,a,h=this._parts,l=this._renderer._bounds;for(t=0,i=0,n=this._rings.length;n>t;t++)for(a=this._rings[t],e=0,s=a.length;s-1>e;e++)r=o.LineUtil.clipSegment(a[e],a[e+1],l,e,!0),r&&(h[i]=h[i]||[],h[i].push(r[0]),(r[1]!==a[e+1]||e===s-2)&&(h[i].push(r[1]),i++))},_simplifyPoints:function(){for(var t=this._parts,e=this.options.smoothFactor,i=0,n=t.length;n>i;i++)t[i]=o.LineUtil.simplify(t[i],e)},_update:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),this._updatePath())},_updatePath:function(){this._renderer._updatePoly(this)}}),o.polyline=function(t,e){return new o.Polyline(t,e)},o.PolyUtil={},o.PolyUtil.clipPolygon=function(t,e,i){var n,s,r,a,h,l,u,c,d,_=[1,4,2,8],m=o.LineUtil;for(s=0,u=t.length;u>s;s++)t[s]._code=m._getBitCode(t[s],e);for(a=0;4>a;a++){for(c=_[a],n=[],s=0,u=t.length,r=u-1;u>s;r=s++)h=t[s],l=t[r],h._code&c?l._code&c||(d=m._getEdgeIntersection(l,h,c,e,i),d._code=m._getBitCode(d,e),n.push(d)):(l._code&c&&(d=m._getEdgeIntersection(l,h,c,e,i),d._code=m._getBitCode(d,e),n.push(d)),n.push(h));t=n}return t},o.Polygon=o.Polyline.extend({options:{fill:!0},getCenter:function(){var t,e,i,n,o,s,r,a,h,l=this._rings[0],u=l.length;if(!u)return null;for(s=r=a=0,t=0,e=u-1;u>t;e=t++)i=l[t],n=l[e],o=i.y*n.x-n.y*i.x,r+=(i.x+n.x)*o,a+=(i.y+n.y)*o,s+=3*o;return h=0===s?l[0]:[r/s,a/s],this._map.layerPointToLatLng(h)},_convertLatLngs:function(t){var e=o.Polyline.prototype._convertLatLngs.call(this,t),i=e.length;return i>=2&&e[0]instanceof o.LatLng&&e[0].equals(e[i-1])&&e.pop(),e},_clipPoints:function(){if(this.options.noClip)return void(this._parts=this._rings);var t=this._renderer._bounds,e=this.options.weight,i=new o.Point(e,e);t=new o.Bounds(t.min.subtract(i),t.max.add(i)),this._parts=[];for(var n,s=0,r=this._rings.length;r>s;s++)n=o.PolyUtil.clipPolygon(this._rings[s],t,!0),n.length&&this._parts.push(n)},_updatePath:function(){this._renderer._updatePoly(this,!0)}}),o.polygon=function(t,e){return new o.Polygon(t,e)},o.Rectangle=o.Polygon.extend({initialize:function(t,e){o.Polygon.prototype.initialize.call(this,this._boundsToLatLngs(t),e)},setBounds:function(t){this.setLatLngs(this._boundsToLatLngs(t))},_boundsToLatLngs:function(t){return t=o.latLngBounds(t),[t.getSouthWest(),t.getNorthWest(),t.getNorthEast(),t.getSouthEast()]}}),o.rectangle=function(t,e){return new o.Rectangle(t,e)},o.CircleMarker=o.Path.extend({options:{fill:!0,radius:10},initialize:function(t,e){o.setOptions(this,e),this._latlng=o.latLng(t),this._radius=this.options.radius},setLatLng:function(t){return this._latlng=o.latLng(t),this.redraw(),this.fire("move",{latlng:this._latlng})},getLatLng:function(){return this._latlng},setRadius:function(t){return this.options.radius=this._radius=t,this.redraw()},getRadius:function(){return this._radius},setStyle:function(t){var e=t&&t.radius||this._radius;return o.Path.prototype.setStyle.call(this,t),this.setRadius(e),this},_project:function(){this._point=this._map.latLngToLayerPoint(this._latlng),this._updateBounds()},_updateBounds:function(){var t=this._radius,e=this._radiusY||t,i=this._clickTolerance(),n=[t+i,e+i];this._pxBounds=new o.Bounds(this._point.subtract(n),this._point.add(n))},_update:function(){this._map&&this._updatePath()},_updatePath:function(){this._renderer._updateCircle(this)},_empty:function(){return this._radius&&!this._renderer._bounds.intersects(this._pxBounds)}}),o.circleMarker=function(t,e){return new o.CircleMarker(t,e)},o.Circle=o.CircleMarker.extend({initialize:function(t,e,i){o.setOptions(this,i),this._latlng=o.latLng(t),this._mRadius=e},setRadius:function(t){return this._mRadius=t,this.redraw()},getRadius:function(){return this._mRadius},getBounds:function(){var t=[this._radius,this._radiusY];return new o.LatLngBounds(this._map.layerPointToLatLng(this._point.subtract(t)),this._map.layerPointToLatLng(this._point.add(t)))},setStyle:o.Path.prototype.setStyle,_project:function(){var t=this._latlng.lng,e=this._latlng.lat,i=this._map,n=i.options.crs;if(n.distance===o.CRS.Earth.distance){var s=Math.PI/180,r=this._mRadius/o.CRS.Earth.R/s,a=i.project([e+r,t]),h=i.project([e-r,t]),l=a.add(h).divideBy(2),u=i.unproject(l).lat,c=Math.acos((Math.cos(r*s)-Math.sin(e*s)*Math.sin(u*s))/(Math.cos(e*s)*Math.cos(u*s)))/s;this._point=l.subtract(i.getPixelOrigin()),this._radius=isNaN(c)?0:Math.max(Math.round(l.x-i.project([u,t-c]).x),1),this._radiusY=Math.max(Math.round(l.y-a.y),1)}else{var d=n.unproject(n.project(this._latlng).subtract([this._mRadius,0]));this._point=i.latLngToLayerPoint(this._latlng),this._radius=this._point.x-i.latLngToLayerPoint(d).x}this._updateBounds()}}),o.circle=function(t,e,i){return new o.Circle(t,e,i)},o.SVG=o.Renderer.extend({_initContainer:function(){this._container=o.SVG.create("svg"),this._container.setAttribute("pointer-events","none")},_update:function(){if(!this._map._animatingZoom||!this._bounds){o.Renderer.prototype._update.call(this);var t=this._bounds,e=t.getSize(),i=this._container;o.DomUtil.setPosition(i,t.min),this._svgSize&&this._svgSize.equals(e)||(this._svgSize=e,i.setAttribute("width",e.x),i.setAttribute("height",e.y)),o.DomUtil.setPosition(i,t.min),i.setAttribute("viewBox",[t.min.x,t.min.y,e.x,e.y].join(" "))}},_initPath:function(t){var e=t._path=o.SVG.create("path");t.options.className&&o.DomUtil.addClass(e,t.options.className),t.options.interactive&&o.DomUtil.addClass(e,"leaflet-interactive"),this._updateStyle(t)},_addPath:function(t){this._container.appendChild(t._path),t.addInteractiveTarget(t._path)},_removePath:function(t){o.DomUtil.remove(t._path),t.removeInteractiveTarget(t._path)},_updatePath:function(t){t._project(),t._update()},_updateStyle:function(t){var e=t._path,i=t.options;e&&(i.stroke?(e.setAttribute("stroke",i.color),e.setAttribute("stroke-opacity",i.opacity),e.setAttribute("stroke-width",i.weight),e.setAttribute("stroke-linecap",i.lineCap),e.setAttribute("stroke-linejoin",i.lineJoin),i.dashArray?e.setAttribute("stroke-dasharray",i.dashArray):e.removeAttribute("stroke-dasharray"),i.dashOffset?e.setAttribute("stroke-dashoffset",i.dashOffset):e.removeAttribute("stroke-dashoffset")):e.setAttribute("stroke","none"),i.fill?(e.setAttribute("fill",i.fillColor||i.color),e.setAttribute("fill-opacity",i.fillOpacity),e.setAttribute("fill-rule",i.fillRule||"evenodd")):e.setAttribute("fill","none"),e.setAttribute("pointer-events",i.pointerEvents||(i.interactive?"visiblePainted":"none")))},_updatePoly:function(t,e){this._setPath(t,o.SVG.pointsToPath(t._parts,e))},_updateCircle:function(t){var e=t._point,i=t._radius,n=t._radiusY||i,o="a"+i+","+n+" 0 1,0 ",s=t._empty()?"M0 0":"M"+(e.x-i)+","+e.y+o+2*i+",0 "+o+2*-i+",0 ";this._setPath(t,s)},_setPath:function(t,e){t._path.setAttribute("d",e)},_bringToFront:function(t){o.DomUtil.toFront(t._path)},_bringToBack:function(t){o.DomUtil.toBack(t._path)}}),o.extend(o.SVG,{create:function(t){return e.createElementNS("http://www.w3.org/2000/svg",t)},pointsToPath:function(t,e){var i,n,s,r,a,h,l="";for(i=0,s=t.length;s>i;i++){for(a=t[i],n=0,r=a.length;r>n;n++)h=a[n],l+=(n?"L":"M")+h.x+" "+h.y;l+=e?o.Browser.svg?"z":"x":""}return l||"M0 0"}}),o.Browser.svg=!(!e.createElementNS||!o.SVG.create("svg").createSVGRect),o.svg=function(t){return o.Browser.svg||o.Browser.vml?new o.SVG(t):null},o.Browser.vml=!o.Browser.svg&&function(){try{var t=e.createElement("div");t.innerHTML='<v:shape adj="1"/>';var i=t.firstChild;return i.style.behavior="url(#default#VML)",i&&"object"==typeof i.adj}catch(n){return!1}}(),o.SVG.include(o.Browser.vml?{_initContainer:function(){this._container=o.DomUtil.create("div","leaflet-vml-container"),this._paths={},this._initEvents()},_update:function(){this._map._animatingZoom||o.Renderer.prototype._update.call(this)},_initPath:function(t){var e=t._container=o.SVG.create("shape");o.DomUtil.addClass(e,"leaflet-vml-shape "+(this.options.className||"")),e.coordsize="1 1",t._path=o.SVG.create("path"),e.appendChild(t._path),this._updateStyle(t)},_addPath:function(t){var e=t._container;this._container.appendChild(e),this._paths[o.stamp(e)]=t},_removePath:function(t){var e=t._container;o.DomUtil.remove(e),delete this._paths[o.stamp(e)]},_updateStyle:function(t){var e=t._stroke,i=t._fill,n=t.options,s=t._container;s.stroked=!!n.stroke,s.filled=!!n.fill,n.stroke?(e||(e=t._stroke=o.SVG.create("stroke"),s.appendChild(e)),e.weight=n.weight+"px",e.color=n.color,e.opacity=n.opacity,n.dashArray?e.dashStyle=o.Util.isArray(n.dashArray)?n.dashArray.join(" "):n.dashArray.replace(/( *, *)/g," "):e.dashStyle="",e.endcap=n.lineCap.replace("butt","flat"),e.joinstyle=n.lineJoin):e&&(s.removeChild(e),t._stroke=null),n.fill?(i||(i=t._fill=o.SVG.create("fill"),s.appendChild(i)),i.color=n.fillColor||n.color,i.opacity=n.fillOpacity):i&&(s.removeChild(i),t._fill=null)},_updateCircle:function(t){var e=t._point.round(),i=Math.round(t._radius),n=Math.round(t._radiusY||i);this._setPath(t,t._empty()?"M0 0":"AL "+e.x+","+e.y+" "+i+","+n+" 0,23592600")},_setPath:function(t,e){t._path.v=e},_bringToFront:function(t){o.DomUtil.toFront(t._container)},_bringToBack:function(t){o.DomUtil.toBack(t._container)}}:{}),o.Browser.vml&&(o.SVG.create=function(){try{return e.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(t){return e.createElement("<lvml:"+t+' class="lvml">')}}catch(t){return function(t){return e.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}}()),o.Canvas=o.Renderer.extend({onAdd:function(){o.Renderer.prototype.onAdd.call(this),this._layers=this._layers||{},this._draw()},_initContainer:function(){var t=this._container=e.createElement("canvas");o.DomEvent.on(t,"mousemove",this._onMouseMove,this).on(t,"click dblclick mousedown mouseup contextmenu",this._onClick,this),this._ctx=t.getContext("2d")},_update:function(){if(!this._map._animatingZoom||!this._bounds){o.Renderer.prototype._update.call(this);var t=this._bounds,e=this._container,i=t.getSize(),n=o.Browser.retina?2:1;o.DomUtil.setPosition(e,t.min),e.width=n*i.x,e.height=n*i.y,e.style.width=i.x+"px",e.style.height=i.y+"px",o.Browser.retina&&this._ctx.scale(2,2),this._ctx.translate(-t.min.x,-t.min.y)}},_initPath:function(t){this._layers[o.stamp(t)]=t},_addPath:o.Util.falseFn,_removePath:function(t){t._removed=!0,this._requestRedraw(t)},_updatePath:function(t){this._redrawBounds=t._pxBounds,this._draw(!0),t._project(),t._update(),this._draw(),this._redrawBounds=null},_updateStyle:function(t){this._requestRedraw(t)},_requestRedraw:function(t){this._map&&(this._redrawBounds=this._redrawBounds||new o.Bounds,this._redrawBounds.extend(t._pxBounds.min).extend(t._pxBounds.max),this._redrawRequest=this._redrawRequest||o.Util.requestAnimFrame(this._redraw,this))},_redraw:function(){this._redrawRequest=null,this._draw(!0),this._draw(),this._redrawBounds=null},_draw:function(t){this._clear=t;var e;for(var i in this._layers)e=this._layers[i],(!this._redrawBounds||e._pxBounds.intersects(this._redrawBounds))&&e._updatePath(),t&&e._removed&&(delete e._removed,delete this._layers[i])},_updatePoly:function(t,e){var i,n,o,s,r=t._parts,a=r.length,h=this._ctx;if(a){for(h.beginPath(),i=0;a>i;i++){for(n=0,o=r[i].length;o>n;n++)s=r[i][n],h[n?"lineTo":"moveTo"](s.x,s.y);e&&h.closePath()}this._fillStroke(h,t)}},_updateCircle:function(t){if(!t._empty()){var e=t._point,i=this._ctx,n=t._radius,o=(t._radiusY||n)/n;1!==o&&(i.save(),i.scale(1,o)),i.beginPath(),i.arc(e.x,e.y/o,n,0,2*Math.PI,!1),1!==o&&i.restore(),this._fillStroke(i,t)}},_fillStroke:function(t,e){var i=this._clear,n=e.options;t.globalCompositeOperation=i?"destination-out":"source-over",n.fill&&(t.globalAlpha=i?1:n.fillOpacity,t.fillStyle=n.fillColor||n.color,t.fill(n.fillRule||"evenodd")),n.stroke&&0!==n.weight&&(t.globalAlpha=i?1:n.opacity,e._prevWeight=t.lineWidth=i?e._prevWeight+1:n.weight,t.strokeStyle=n.color,t.lineCap=n.lineCap,t.lineJoin=n.lineJoin,t.stroke())},_onClick:function(t){var e=this._map.mouseEventToLayerPoint(t);for(var i in this._layers)this._layers[i]._containsPoint(e)&&(o.DomEvent._fakeStop(t),this._fireEvent(this._layers[i],t))},_onMouseMove:function(t){if(this._map&&!this._map._animatingZoom){var e=this._map.mouseEventToLayerPoint(t);for(var i in this._layers)this._handleHover(this._layers[i],t,e)}},_handleHover:function(t,e,i){t.options.interactive&&(t._containsPoint(i)?(t._mouseInside||(o.DomUtil.addClass(this._container,"leaflet-interactive"),this._fireEvent(t,e,"mouseover"),t._mouseInside=!0),this._fireEvent(t,e)):t._mouseInside&&(o.DomUtil.removeClass(this._container,"leaflet-interactive"),this._fireEvent(t,e,"mouseout"),t._mouseInside=!1))},_fireEvent:function(t,e,i){this._map._fireDOMEvent(t,e,i||e.type)},_bringToFront:o.Util.falseFn,_bringToBack:o.Util.falseFn}),o.Browser.canvas=function(){return!!e.createElement("canvas").getContext}(),o.canvas=function(t){return o.Browser.canvas?new o.Canvas(t):null},o.Polyline.prototype._containsPoint=function(t,e){var i,n,s,r,a,h,l=this._clickTolerance();if(!this._pxBounds.contains(t))return!1;for(i=0,r=this._parts.length;r>i;i++)for(h=this._parts[i],n=0,a=h.length,s=a-1;a>n;s=n++)if((e||0!==n)&&o.LineUtil.pointToSegmentDistance(t,h[s],h[n])<=l)return!0;return!1},o.Polygon.prototype._containsPoint=function(t){var e,i,n,s,r,a,h,l,u=!1;if(!this._pxBounds.contains(t))return!1;for(s=0,h=this._parts.length;h>s;s++)for(e=this._parts[s],r=0,l=e.length,a=l-1;l>r;a=r++)i=e[r],n=e[a],i.y>t.y!=n.y>t.y&&t.x<(n.x-i.x)*(t.y-i.y)/(n.y-i.y)+i.x&&(u=!u);return u||o.Polyline.prototype._containsPoint.call(this,t,!0)},o.CircleMarker.prototype._containsPoint=function(t){return t.distanceTo(this._point)<=this._radius+this._clickTolerance()},o.GeoJSON=o.FeatureGroup.extend({initialize:function(t,e){o.setOptions(this,e),this._layers={},t&&this.addData(t)},addData:function(t){var e,i,n,s=o.Util.isArray(t)?t:t.features;if(s){for(e=0,i=s.length;i>e;e++)n=s[e],(n.geometries||n.geometry||n.features||n.coordinates)&&this.addData(n);return this}var r=this.options;if(r.filter&&!r.filter(t))return this;var a=o.GeoJSON.geometryToLayer(t,r);return a.feature=o.GeoJSON.asFeature(t),a.defaultOptions=a.options,this.resetStyle(a),r.onEachFeature&&r.onEachFeature(t,a),this.addLayer(a)},resetStyle:function(t){return t.options=t.defaultOptions,this._setLayerStyle(t,this.options.style),this},setStyle:function(t){return this.eachLayer(function(e){this._setLayerStyle(e,t)},this)},_setLayerStyle:function(t,e){"function"==typeof e&&(e=e(t.feature)),t.setStyle&&t.setStyle(e)}}),o.extend(o.GeoJSON,{geometryToLayer:function(t,e){var i,n,s,r,a="Feature"===t.type?t.geometry:t,h=a.coordinates,l=[],u=e&&e.pointToLayer,c=e&&e.coordsToLatLng||this.coordsToLatLng;switch(a.type){case"Point":return i=c(h),u?u(t,i):new o.Marker(i);case"MultiPoint":for(s=0,r=h.length;r>s;s++)i=c(h[s]),l.push(u?u(t,i):new o.Marker(i));return new o.FeatureGroup(l);case"LineString":case"MultiLineString":return n=this.coordsToLatLngs(h,"LineString"===a.type?0:1,c),new o.Polyline(n,e);case"Polygon":case"MultiPolygon":return n=this.coordsToLatLngs(h,"Polygon"===a.type?1:2,c),new o.Polygon(n,e);case"GeometryCollection":for(s=0,r=a.geometries.length;r>s;s++)l.push(this.geometryToLayer({geometry:a.geometries[s],type:"Feature",properties:t.properties},e));return new o.FeatureGroup(l);default:throw new Error("Invalid GeoJSON object.")}},coordsToLatLng:function(t){return new o.LatLng(t[1],t[0],t[2])},coordsToLatLngs:function(t,e,i){for(var n,o=[],s=0,r=t.length;r>s;s++)n=e?this.coordsToLatLngs(t[s],e-1,i):(i||this.coordsToLatLng)(t[s]),o.push(n);return o},latLngToCoords:function(t){return t.alt!==i?[t.lng,t.lat,t.alt]:[t.lng,t.lat]},latLngsToCoords:function(t,e,i){for(var n=[],s=0,r=t.length;r>s;s++)n.push(e?o.GeoJSON.latLngsToCoords(t[s],e-1,i):o.GeoJSON.latLngToCoords(t[s]));return!e&&i&&n.push(n[0]),n},getFeature:function(t,e){return t.feature?o.extend({},t.feature,{geometry:e}):o.GeoJSON.asFeature(e)},asFeature:function(t){return"Feature"===t.type?t:{type:"Feature",properties:{},geometry:t}}});var r={toGeoJSON:function(){return o.GeoJSON.getFeature(this,{type:"Point",coordinates:o.GeoJSON.latLngToCoords(this.getLatLng())})}};o.Marker.include(r),o.Circle.include(r),o.CircleMarker.include(r),o.Polyline.prototype.toGeoJSON=function(){var t=!this._flat(this._latlngs),e=o.GeoJSON.latLngsToCoords(this._latlngs,t?1:0);return o.GeoJSON.getFeature(this,{type:(t?"Multi":"")+"LineString",coordinates:e})},o.Polygon.prototype.toGeoJSON=function(){var t=!this._flat(this._latlngs),e=t&&!this._flat(this._latlngs[0]),i=o.GeoJSON.latLngsToCoords(this._latlngs,e?2:t?1:0,!0);return t||(i=[i]),o.GeoJSON.getFeature(this,{type:(e?"Multi":"")+"Polygon",coordinates:i})},o.LayerGroup.include({toMultiPoint:function(){var t=[];return this.eachLayer(function(e){t.push(e.toGeoJSON().geometry.coordinates)}),o.GeoJSON.getFeature(this,{type:"MultiPoint",coordinates:t})},toGeoJSON:function(){var t=this.feature&&this.feature.geometry&&this.feature.geometry.type;if("MultiPoint"===t)return this.toMultiPoint();var e="GeometryCollection"===t,i=[];return this.eachLayer(function(t){if(t.toGeoJSON){var n=t.toGeoJSON();i.push(e?n.geometry:o.GeoJSON.asFeature(n))}}),e?o.GeoJSON.getFeature(this,{geometries:i,type:"GeometryCollection"}):{type:"FeatureCollection",features:i}}}),o.geoJson=function(t,e){return new o.GeoJSON(t,e)};var a="_leaflet_events";o.DomEvent={on:function(t,e,i,n){if("object"==typeof e)for(var s in e)this._on(t,s,e[s],i);else{e=o.Util.splitWords(e);for(var r=0,a=e.length;a>r;r++)this._on(t,e[r],i,n)}return this},off:function(t,e,i,n){if("object"==typeof e)for(var s in e)this._off(t,s,e[s],i);else{e=o.Util.splitWords(e);for(var r=0,a=e.length;a>r;r++)this._off(t,e[r],i,n)}return this},_on:function(e,i,n,s){var r=i+o.stamp(n)+(s?"_"+o.stamp(s):"");if(e[a]&&e[a][r])return this;var h=function(i){return n.call(s||e,i||t.event)},l=h;return o.Browser.pointer&&0===i.indexOf("touch")?this.addPointerListener(e,i,h,r):o.Browser.touch&&"dblclick"===i&&this.addDoubleTapListener?this.addDoubleTapListener(e,h,r):"addEventListener"in e?"mousewheel"===i?(e.addEventListener("DOMMouseScroll",h,!1),e.addEventListener(i,h,!1)):"mouseenter"===i||"mouseleave"===i?(h=function(i){i=i||t.event,o.DomEvent._checkMouse(e,i)&&l(i)},e.addEventListener("mouseenter"===i?"mouseover":"mouseout",h,!1)):("click"===i&&o.Browser.android&&(h=function(t){return o.DomEvent._filterClick(t,l)}),e.addEventListener(i,h,!1)):"attachEvent"in e&&e.attachEvent("on"+i,h),e[a]=e[a]||{},e[a][r]=h,this},_off:function(t,e,i,n){var s=e+o.stamp(i)+(n?"_"+o.stamp(n):""),r=t[a]&&t[a][s];return r?(o.Browser.pointer&&0===e.indexOf("touch")?this.removePointerListener(t,e,s):o.Browser.touch&&"dblclick"===e&&this.removeDoubleTapListener?this.removeDoubleTapListener(t,s):"removeEventListener"in t?"mousewheel"===e?(t.removeEventListener("DOMMouseScroll",r,!1),t.removeEventListener(e,r,!1)):t.removeEventListener("mouseenter"===e?"mouseover":"mouseleave"===e?"mouseout":e,r,!1):"detachEvent"in t&&t.detachEvent("on"+e,r),t[a][s]=null,this):this},stopPropagation:function(t){return t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,o.DomEvent._skipped(t),this},disableScrollPropagation:function(t){return o.DomEvent.on(t,"mousewheel MozMousePixelScroll",o.DomEvent.stopPropagation)},disableClickPropagation:function(t){var e=o.DomEvent.stopPropagation;return o.DomEvent.on(t,o.Draggable.START.join(" "),e),o.DomEvent.on(t,{click:o.DomEvent._fakeStop,dblclick:e})},preventDefault:function(t){return t.preventDefault?t.preventDefault():t.returnValue=!1,this},stop:function(t){return o.DomEvent.preventDefault(t).stopPropagation(t)},getMousePosition:function(t,e){if(!e)return new o.Point(t.clientX,t.clientY);var i=e.getBoundingClientRect();return new o.Point(t.clientX-i.left-e.clientLeft,t.clientY-i.top-e.clientTop)},getWheelDelta:function(t){var e=0;return t.wheelDelta&&(e=t.wheelDelta/120),t.detail&&(e=-t.detail/3),e},_skipEvents:{},_fakeStop:function(t){o.DomEvent._skipEvents[t.type]=!0},_skipped:function(t){var e=this._skipEvents[t.type];return this._skipEvents[t.type]=!1,e},_checkMouse:function(t,e){var i=e.relatedTarget;if(!i)return!0;try{for(;i&&i!==t;)i=i.parentNode}catch(n){return!1}return i!==t},_filterClick:function(t,e){var i=t.timeStamp||t.originalEvent.timeStamp,n=o.DomEvent._lastClick&&i-o.DomEvent._lastClick;return n&&n>100&&500>n||t.target._simulatedClick&&!t._simulated?void o.DomEvent.stop(t):(o.DomEvent._lastClick=i,void e(t))}},o.DomEvent.addListener=o.DomEvent.on,o.DomEvent.removeListener=o.DomEvent.off,o.Draggable=o.Evented.extend({statics:{START:o.Browser.touch?["touchstart","mousedown"]:["mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},initialize:function(t,e,i){this._element=t,this._dragStartTarget=e||t,this._preventOutline=i},enable:function(){this._enabled||(o.DomEvent.on(this._dragStartTarget,o.Draggable.START.join(" "),this._onDown,this),this._enabled=!0)},disable:function(){this._enabled&&(o.DomEvent.off(this._dragStartTarget,o.Draggable.START.join(" "),this._onDown,this),this._enabled=!1,this._moved=!1)},_onDown:function(t){if(this._moved=!1,!(t.shiftKey||1!==t.which&&1!==t.button&&!t.touches||(o.DomEvent.stopPropagation(t),this._preventOutline&&o.DomUtil.preventOutline(this._element),o.DomUtil.hasClass(this._element,"leaflet-zoom-anim")||(o.DomUtil.disableImageDrag(),o.DomUtil.disableTextSelection(),this._moving)))){this.fire("down");var i=t.touches?t.touches[0]:t;this._startPoint=new o.Point(i.clientX,i.clientY),this._startPos=this._newPos=o.DomUtil.getPosition(this._element),o.DomEvent.on(e,o.Draggable.MOVE[t.type],this._onMove,this).on(e,o.Draggable.END[t.type],this._onUp,this)}},_onMove:function(t){if(t.touches&&t.touches.length>1)return void(this._moved=!0);var i=t.touches&&1===t.touches.length?t.touches[0]:t,n=new o.Point(i.clientX,i.clientY),s=n.subtract(this._startPoint);(s.x||s.y)&&(o.Browser.touch&&Math.abs(s.x)+Math.abs(s.y)<3||(o.DomEvent.preventDefault(t),this._moved||(this.fire("dragstart"),this._moved=!0,this._startPos=o.DomUtil.getPosition(this._element).subtract(s),o.DomUtil.addClass(e.body,"leaflet-dragging"),this._lastTarget=t.target||t.srcElement,o.DomUtil.addClass(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(s),this._moving=!0,o.Util.cancelAnimFrame(this._animRequest),this._lastEvent=t,this._animRequest=o.Util.requestAnimFrame(this._updatePosition,this,!0,this._dragStartTarget)))},_updatePosition:function(){var t={originalEvent:this._lastEvent};this.fire("predrag",t),o.DomUtil.setPosition(this._element,this._newPos),this.fire("drag",t)},_onUp:function(){o.DomUtil.removeClass(e.body,"leaflet-dragging"),this._lastTarget&&(o.DomUtil.removeClass(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null);for(var t in o.Draggable.MOVE)o.DomEvent.off(e,o.Draggable.MOVE[t],this._onMove,this).off(e,o.Draggable.END[t],this._onUp,this);o.DomUtil.enableImageDrag(),o.DomUtil.enableTextSelection(),this._moved&&this._moving&&(o.Util.cancelAnimFrame(this._animRequest),this.fire("dragend",{distance:this._newPos.distanceTo(this._startPos)})),this._moving=!1}}),o.Handler=o.Class.extend({initialize:function(t){this._map=t},enable:function(){this._enabled||(this._enabled=!0,this.addHooks())},disable:function(){this._enabled&&(this._enabled=!1,this.removeHooks())},enabled:function(){return!!this._enabled}}),o.Map.mergeOptions({dragging:!0,inertia:!o.Browser.android23,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,easeLinearity:.2,worldCopyJump:!1}),o.Map.Drag=o.Handler.extend({addHooks:function(){if(!this._draggable){var t=this._map;this._draggable=new o.Draggable(t._mapPane,t._container),this._draggable.on({down:this._onDown,dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),t.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDrag,this),t.on("viewreset",this._onViewReset,this),t.whenReady(this._onViewReset,this))}this._draggable.enable()},removeHooks:function(){this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},_onDown:function(){this._map.stop()},_onDragStart:function(){var t=this._map;t.fire("movestart").fire("dragstart"),t.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(t){if(this._map.options.inertia){var e=this._lastTime=+new Date,i=this._lastPos=this._draggable._absPos||this._draggable._newPos;this._positions.push(i),this._times.push(e),e-this._times[0]>50&&(this._positions.shift(),this._times.shift())}this._map.fire("move",t).fire("drag",t)},_onViewReset:function(){var t=this._map.getSize().divideBy(2),e=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=e.subtract(t).x,this._worldWidth=this._map.getPixelWorldBounds().getSize().x},_onPreDrag:function(){var t=this._worldWidth,e=Math.round(t/2),i=this._initialWorldOffset,n=this._draggable._newPos.x,o=(n-e+i)%t+e-i,s=(n+e+i)%t-e-i,r=Math.abs(o+i)<Math.abs(s+i)?o:s;this._draggable._absPos=this._draggable._newPos.clone(),this._draggable._newPos.x=r},_onDragEnd:function(t){var e=this._map,i=e.options,n=!i.inertia||this._times.length<2;if(e.fire("dragend",t),n)e.fire("moveend");else{var s=this._lastPos.subtract(this._positions[0]),r=(this._lastTime-this._times[0])/1e3,a=i.easeLinearity,h=s.multiplyBy(a/r),l=h.distanceTo([0,0]),u=Math.min(i.inertiaMaxSpeed,l),c=h.multiplyBy(u/l),d=u/(i.inertiaDeceleration*a),_=c.multiplyBy(-d/2).round();_.x&&_.y?(_=e._limitOffset(_,e.options.maxBounds),o.Util.requestAnimFrame(function(){e.panBy(_,{duration:d,easeLinearity:a,noMoveStart:!0,animate:!0})})):e.fire("moveend")}}}),o.Map.addInitHook("addHandler","dragging",o.Map.Drag),o.Map.mergeOptions({doubleClickZoom:!0}),o.Map.DoubleClickZoom=o.Handler.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(t){var e=this._map,i=e.getZoom(),n=t.originalEvent.shiftKey?Math.ceil(i)-1:Math.floor(i)+1;"center"===e.options.doubleClickZoom?e.setZoom(n):e.setZoomAround(t.containerPoint,n)}}),o.Map.addInitHook("addHandler","doubleClickZoom",o.Map.DoubleClickZoom),o.Map.mergeOptions({scrollWheelZoom:!0,wheelDebounceTime:40}),o.Map.ScrollWheelZoom=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,{mousewheel:this._onWheelScroll,MozMousePixelScroll:o.DomEvent.preventDefault},this),this._delta=0},removeHooks:function(){o.DomEvent.off(this._map._container,{mousewheel:this._onWheelScroll,MozMousePixelScroll:o.DomEvent.preventDefault},this)},_onWheelScroll:function(t){var e=o.DomEvent.getWheelDelta(t),i=this._map.options.wheelDebounceTime;this._delta+=e,this._lastMousePos=this._map.mouseEventToContainerPoint(t),this._startTime||(this._startTime=+new Date);var n=Math.max(i-(+new Date-this._startTime),0);clearTimeout(this._timer),this._timer=setTimeout(o.bind(this._performZoom,this),n),o.DomEvent.stop(t)},_performZoom:function(){var t=this._map,e=this._delta,i=t.getZoom();t.stop(),e=e>0?Math.ceil(e):Math.floor(e),e=Math.max(Math.min(e,4),-4),e=t._limitZoom(i+e)-i,this._delta=0,this._startTime=null,e&&("center"===t.options.scrollWheelZoom?t.setZoom(i+e):t.setZoomAround(this._lastMousePos,i+e))}}),o.Map.addInitHook("addHandler","scrollWheelZoom",o.Map.ScrollWheelZoom),o.extend(o.DomEvent,{_touchstart:o.Browser.msPointer?"MSPointerDown":o.Browser.pointer?"pointerdown":"touchstart",_touchend:o.Browser.msPointer?"MSPointerUp":o.Browser.pointer?"pointerup":"touchend",addDoubleTapListener:function(t,e,i){function n(t){var e;if(e=o.Browser.pointer?o.DomEvent._pointersCount:t.touches.length,!(e>1)){var i=Date.now(),n=i-(r||i);a=t.touches?t.touches[0]:t,h=n>0&&l>=n,r=i}}function s(){if(h){if(o.Browser.pointer){var t,i,n={};for(i in a)t=a[i],n[i]=t&&t.bind?t.bind(a):t;

a=n}a.type="dblclick",e(a),r=null}}var r,a,h=!1,l=250,u="_leaflet_",c=this._touchstart,d=this._touchend;return t[u+c+i]=n,t[u+d+i]=s,t.addEventListener(c,n,!1),t.addEventListener(d,s,!1),this},removeDoubleTapListener:function(t,e){var i="_leaflet_",n=t[i+this._touchend+e];return t.removeEventListener(this._touchstart,t[i+this._touchstart+e],!1),t.removeEventListener(this._touchend,n,!1),this}}),o.extend(o.DomEvent,{POINTER_DOWN:o.Browser.msPointer?"MSPointerDown":"pointerdown",POINTER_MOVE:o.Browser.msPointer?"MSPointerMove":"pointermove",POINTER_UP:o.Browser.msPointer?"MSPointerUp":"pointerup",POINTER_CANCEL:o.Browser.msPointer?"MSPointerCancel":"pointercancel",_pointers:{},_pointersCount:0,addPointerListener:function(t,e,i,n){return"touchstart"===e?this._addPointerStart(t,i,n):"touchmove"===e?this._addPointerMove(t,i,n):"touchend"===e&&this._addPointerEnd(t,i,n),this},removePointerListener:function(t,e,i){var n=t["_leaflet_"+e+i];return"touchstart"===e?t.removeEventListener(this.POINTER_DOWN,n,!1):"touchmove"===e?t.removeEventListener(this.POINTER_MOVE,n,!1):"touchend"===e&&(t.removeEventListener(this.POINTER_UP,n,!1),t.removeEventListener(this.POINTER_CANCEL,n,!1)),this},_addPointerStart:function(t,i,n){var s=o.bind(function(t){o.DomEvent.preventDefault(t),this._handlePointer(t,i)},this);if(t["_leaflet_touchstart"+n]=s,t.addEventListener(this.POINTER_DOWN,s,!1),!this._pointerDocListener){var r=o.bind(this._globalPointerUp,this);e.documentElement.addEventListener(this.POINTER_DOWN,o.bind(this._globalPointerDown,this),!0),e.documentElement.addEventListener(this.POINTER_MOVE,o.bind(this._globalPointerMove,this),!0),e.documentElement.addEventListener(this.POINTER_UP,r,!0),e.documentElement.addEventListener(this.POINTER_CANCEL,r,!0),this._pointerDocListener=!0}},_globalPointerDown:function(t){this._pointers[t.pointerId]=t,this._pointersCount++},_globalPointerMove:function(t){this._pointers[t.pointerId]&&(this._pointers[t.pointerId]=t)},_globalPointerUp:function(t){delete this._pointers[t.pointerId],this._pointersCount--},_handlePointer:function(t,e){t.touches=[];for(var i in this._pointers)t.touches.push(this._pointers[i]);t.changedTouches=[t],e(t)},_addPointerMove:function(t,e,i){var n=o.bind(function(t){(t.pointerType!==t.MSPOINTER_TYPE_MOUSE&&"mouse"!==t.pointerType||0!==t.buttons)&&this._handlePointer(t,e)},this);t["_leaflet_touchmove"+i]=n,t.addEventListener(this.POINTER_MOVE,n,!1)},_addPointerEnd:function(t,e,i){var n=o.bind(function(t){this._handlePointer(t,e)},this);t["_leaflet_touchend"+i]=n,t.addEventListener(this.POINTER_UP,n,!1),t.addEventListener(this.POINTER_CANCEL,n,!1)}}),o.Map.mergeOptions({touchZoom:o.Browser.touch&&!o.Browser.android23,bounceAtZoomLimits:!0}),o.Map.TouchZoom=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){o.DomEvent.off(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(t){var i=this._map;if(t.touches&&2===t.touches.length&&!i._animatingZoom&&!this._zooming){var n=i.mouseEventToLayerPoint(t.touches[0]),s=i.mouseEventToLayerPoint(t.touches[1]),r=i._getCenterLayerPoint();this._startCenter=n.add(s)._divideBy(2),this._startDist=n.distanceTo(s),this._moved=!1,this._zooming=!0,this._centerOffset=r.subtract(this._startCenter),i.stop(),o.DomEvent.on(e,"touchmove",this._onTouchMove,this).on(e,"touchend",this._onTouchEnd,this),o.DomEvent.preventDefault(t)}},_onTouchMove:function(t){if(t.touches&&2===t.touches.length&&this._zooming){var e=this._map,i=e.mouseEventToLayerPoint(t.touches[0]),n=e.mouseEventToLayerPoint(t.touches[1]);if(this._scale=i.distanceTo(n)/this._startDist,this._delta=i._add(n)._divideBy(2)._subtract(this._startCenter),!e.options.bounceAtZoomLimits){var s=e.getScaleZoom(this._scale);if(s<=e.getMinZoom()&&this._scale<1||s>=e.getMaxZoom()&&this._scale>1)return}this._moved||(e.fire("movestart").fire("zoomstart"),this._moved=!0),o.Util.cancelAnimFrame(this._animRequest),this._animRequest=o.Util.requestAnimFrame(this._updateOnMove,this,!0,this._map._container),o.DomEvent.preventDefault(t)}},_updateOnMove:function(){var t=this._map;"center"===t.options.touchZoom?this._center=t.getCenter():this._center=t.layerPointToLatLng(this._getTargetCenter()),this._zoom=t.getScaleZoom(this._scale),(1!==this._scale||0!==this._delta.x||0!==this._delta.y)&&t._animateZoom(this._center,this._zoom,!1,!0)},_onTouchEnd:function(){if(!this._moved||!this._zooming)return void(this._zooming=!1);this._zooming=!1,o.Util.cancelAnimFrame(this._animRequest),o.DomEvent.off(e,"touchmove",this._onTouchMove).off(e,"touchend",this._onTouchEnd);var t=this._map,i=t.getZoom(),n=this._zoom-i,s=t._limitZoom(n>0?Math.ceil(this._zoom):Math.floor(this._zoom));t._animateZoom(this._center,s,!0,!0)},_getTargetCenter:function(){var t=this._centerOffset.subtract(this._delta).divideBy(this._scale);return this._startCenter.add(t)}}),o.Map.addInitHook("addHandler","touchZoom",o.Map.TouchZoom),o.Map.mergeOptions({tap:!0,tapTolerance:15}),o.Map.Tap=o.Handler.extend({addHooks:function(){o.DomEvent.on(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){o.DomEvent.off(this._map._container,"touchstart",this._onDown,this)},_onDown:function(t){if(t.touches){if(o.DomEvent.preventDefault(t),this._fireClick=!0,t.touches.length>1)return this._fireClick=!1,void clearTimeout(this._holdTimeout);var i=t.touches[0],n=i.target;this._startPos=this._newPos=new o.Point(i.clientX,i.clientY),n.tagName&&"a"===n.tagName.toLowerCase()&&o.DomUtil.addClass(n,"leaflet-active"),this._holdTimeout=setTimeout(o.bind(function(){this._isTapValid()&&(this._fireClick=!1,this._onUp(),this._simulateEvent("contextmenu",i))},this),1e3),this._simulateEvent("mousedown",i),o.DomEvent.on(e,{touchmove:this._onMove,touchend:this._onUp},this)}},_onUp:function(t){if(clearTimeout(this._holdTimeout),o.DomEvent.off(e,{touchmove:this._onMove,touchend:this._onUp},this),this._fireClick&&t&&t.changedTouches){var i=t.changedTouches[0],n=i.target;n&&n.tagName&&"a"===n.tagName.toLowerCase()&&o.DomUtil.removeClass(n,"leaflet-active"),this._simulateEvent("mouseup",i),this._isTapValid()&&this._simulateEvent("click",i)}},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_onMove:function(t){var e=t.touches[0];this._newPos=new o.Point(e.clientX,e.clientY)},_simulateEvent:function(i,n){var o=e.createEvent("MouseEvents");o._simulated=!0,n.target._simulatedClick=!0,o.initMouseEvent(i,!0,!0,t,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null),n.target.dispatchEvent(o)}}),o.Browser.touch&&!o.Browser.pointer&&o.Map.addInitHook("addHandler","tap",o.Map.Tap),o.Map.mergeOptions({boxZoom:!0}),o.Map.BoxZoom=o.Handler.extend({initialize:function(t){this._map=t,this._container=t._container,this._pane=t._panes.overlayPane},addHooks:function(){o.DomEvent.on(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){o.DomEvent.off(this._container,"mousedown",this._onMouseDown,this)},moved:function(){return this._moved},_onMouseDown:function(t){return!t.shiftKey||1!==t.which&&1!==t.button?!1:(this._moved=!1,o.DomUtil.disableTextSelection(),o.DomUtil.disableImageDrag(),this._startPoint=this._map.mouseEventToContainerPoint(t),void o.DomEvent.on(e,{contextmenu:o.DomEvent.stop,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this))},_onMouseMove:function(t){this._moved||(this._moved=!0,this._box=o.DomUtil.create("div","leaflet-zoom-box",this._container),o.DomUtil.addClass(this._container,"leaflet-crosshair"),this._map.fire("boxzoomstart")),this._point=this._map.mouseEventToContainerPoint(t);var e=new o.Bounds(this._point,this._startPoint),i=e.getSize();o.DomUtil.setPosition(this._box,e.min),this._box.style.width=i.x+"px",this._box.style.height=i.y+"px"},_finish:function(){this._moved&&(o.DomUtil.remove(this._box),o.DomUtil.removeClass(this._container,"leaflet-crosshair")),o.DomUtil.enableTextSelection(),o.DomUtil.enableImageDrag(),o.DomEvent.off(e,{contextmenu:o.DomEvent.stop,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseUp:function(t){if((1===t.which||1===t.button)&&(this._finish(),this._moved)){var e=new o.LatLngBounds(this._map.containerPointToLatLng(this._startPoint),this._map.containerPointToLatLng(this._point));this._map.fitBounds(e).fire("boxzoomend",{boxZoomBounds:e})}},_onKeyDown:function(t){27===t.keyCode&&this._finish()}}),o.Map.addInitHook("addHandler","boxZoom",o.Map.BoxZoom),o.Map.mergeOptions({keyboard:!0,keyboardPanOffset:80,keyboardZoomOffset:1}),o.Map.Keyboard=o.Handler.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,54,173]},initialize:function(t){this._map=t,this._setPanOffset(t.options.keyboardPanOffset),this._setZoomOffset(t.options.keyboardZoomOffset)},addHooks:function(){var t=this._map._container;-1===t.tabIndex&&(t.tabIndex="0"),o.DomEvent.on(t,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.on({focus:this._addHooks,blur:this._removeHooks},this)},removeHooks:function(){this._removeHooks(),o.DomEvent.off(this._map._container,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.off({focus:this._addHooks,blur:this._removeHooks},this)},_onMouseDown:function(){if(!this._focused){var i=e.body,n=e.documentElement,o=i.scrollTop||n.scrollTop,s=i.scrollLeft||n.scrollLeft;this._map._container.focus(),t.scrollTo(s,o)}},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanOffset:function(t){var e,i,n=this._panKeys={},o=this.keyCodes;for(e=0,i=o.left.length;i>e;e++)n[o.left[e]]=[-1*t,0];for(e=0,i=o.right.length;i>e;e++)n[o.right[e]]=[t,0];for(e=0,i=o.down.length;i>e;e++)n[o.down[e]]=[0,t];for(e=0,i=o.up.length;i>e;e++)n[o.up[e]]=[0,-1*t]},_setZoomOffset:function(t){var e,i,n=this._zoomKeys={},o=this.keyCodes;for(e=0,i=o.zoomIn.length;i>e;e++)n[o.zoomIn[e]]=t;for(e=0,i=o.zoomOut.length;i>e;e++)n[o.zoomOut[e]]=-t},_addHooks:function(){o.DomEvent.on(e,"keydown",this._onKeyDown,this)},_removeHooks:function(){o.DomEvent.off(e,"keydown",this._onKeyDown,this)},_onKeyDown:function(t){if(!(t.altKey||t.ctrlKey||t.metaKey)){var e=t.keyCode,i=this._map;if(e in this._panKeys){if(i._panAnim&&i._panAnim._inProgress)return;i.panBy(this._panKeys[e]),i.options.maxBounds&&i.panInsideBounds(i.options.maxBounds)}else if(e in this._zoomKeys)i.setZoom(i.getZoom()+(t.shiftKey?3:1)*this._zoomKeys[e]);else{if(27!==e)return;i.closePopup()}o.DomEvent.stop(t)}}}),o.Map.addInitHook("addHandler","keyboard",o.Map.Keyboard),o.Handler.MarkerDrag=o.Handler.extend({initialize:function(t){this._marker=t},addHooks:function(){var t=this._marker._icon;this._draggable||(this._draggable=new o.Draggable(t,t,!0)),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this).enable(),o.DomUtil.addClass(t,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this).disable(),this._marker._icon&&o.DomUtil.removeClass(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_onDragStart:function(){this._marker.closePopup().fire("movestart").fire("dragstart")},_onDrag:function(t){var e=this._marker,i=e._shadow,n=o.DomUtil.getPosition(e._icon),s=e._map.layerPointToLatLng(n);i&&o.DomUtil.setPosition(i,n),e._latlng=s,t.latlng=s,e.fire("move",t).fire("drag",t)},_onDragEnd:function(t){this._marker.fire("moveend").fire("dragend",t)}}),o.Control=o.Class.extend({options:{position:"topright"},initialize:function(t){o.setOptions(this,t)},getPosition:function(){return this.options.position},setPosition:function(t){var e=this._map;return e&&e.removeControl(this),this.options.position=t,e&&e.addControl(this),this},getContainer:function(){return this._container},addTo:function(t){this.remove(),this._map=t;var e=this._container=this.onAdd(t),i=this.getPosition(),n=t._controlCorners[i];return o.DomUtil.addClass(e,"leaflet-control"),-1!==i.indexOf("bottom")?n.insertBefore(e,n.firstChild):n.appendChild(e),this},remove:function(){return this._map?(o.DomUtil.remove(this._container),this.onRemove&&this.onRemove(this._map),this._map=null,this):this},_refocusOnMap:function(t){this._map&&t&&t.screenX>0&&t.screenY>0&&this._map.getContainer().focus()}}),o.control=function(t){return new o.Control(t)},o.Map.include({addControl:function(t){return t.addTo(this),this},removeControl:function(t){return t.remove(),this},_initControlPos:function(){function t(t,s){var r=i+t+" "+i+s;e[t+s]=o.DomUtil.create("div",r,n)}var e=this._controlCorners={},i="leaflet-",n=this._controlContainer=o.DomUtil.create("div",i+"control-container",this._container);t("top","left"),t("top","right"),t("bottom","left"),t("bottom","right")},_clearControlPos:function(){o.DomUtil.remove(this._controlContainer)}}),o.Control.Zoom=o.Control.extend({options:{position:"topleft",zoomInText:"+",zoomInTitle:"Zoom in",zoomOutText:"-",zoomOutTitle:"Zoom out"},onAdd:function(t){var e="leaflet-control-zoom",i=o.DomUtil.create("div",e+" leaflet-bar"),n=this.options;return this._zoomInButton=this._createButton(n.zoomInText,n.zoomInTitle,e+"-in",i,this._zoomIn),this._zoomOutButton=this._createButton(n.zoomOutText,n.zoomOutTitle,e+"-out",i,this._zoomOut),this._updateDisabled(),t.on("zoomend zoomlevelschange",this._updateDisabled,this),i},onRemove:function(t){t.off("zoomend zoomlevelschange",this._updateDisabled,this)},disable:function(){return this._disabled=!0,this._updateDisabled(),this},enable:function(){return this._disabled=!1,this._updateDisabled(),this},_zoomIn:function(t){this._disabled||this._map.zoomIn(t.shiftKey?3:1)},_zoomOut:function(t){this._disabled||this._map.zoomOut(t.shiftKey?3:1)},_createButton:function(t,e,i,n,s){var r=o.DomUtil.create("a",i,n);return r.innerHTML=t,r.href="#",r.title=e,o.DomEvent.on(r,"mousedown dblclick",o.DomEvent.stopPropagation).on(r,"click",o.DomEvent.stop).on(r,"click",s,this).on(r,"click",this._refocusOnMap,this),r},_updateDisabled:function(){var t=this._map,e="leaflet-disabled";o.DomUtil.removeClass(this._zoomInButton,e),o.DomUtil.removeClass(this._zoomOutButton,e),(this._disabled||t._zoom===t.getMinZoom())&&o.DomUtil.addClass(this._zoomOutButton,e),(this._disabled||t._zoom===t.getMaxZoom())&&o.DomUtil.addClass(this._zoomInButton,e)}}),o.Map.mergeOptions({zoomControl:!0}),o.Map.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new o.Control.Zoom,this.addControl(this.zoomControl))}),o.control.zoom=function(t){return new o.Control.Zoom(t)},o.Control.Attribution=o.Control.extend({options:{position:"bottomright",prefix:'<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'},initialize:function(t){o.setOptions(this,t),this._attributions={}},onAdd:function(t){this._container=o.DomUtil.create("div","leaflet-control-attribution"),o.DomEvent&&o.DomEvent.disableClickPropagation(this._container);for(var e in t._layers)t._layers[e].getAttribution&&this.addAttribution(t._layers[e].getAttribution());return this._update(),this._container},setPrefix:function(t){return this.options.prefix=t,this._update(),this},addAttribution:function(t){return t?(this._attributions[t]||(this._attributions[t]=0),this._attributions[t]++,this._update(),this):this},removeAttribution:function(t){return t?(this._attributions[t]&&(this._attributions[t]--,this._update()),this):this},_update:function(){if(this._map){var t=[];for(var e in this._attributions)this._attributions[e]&&t.push(e);var i=[];this.options.prefix&&i.push(this.options.prefix),t.length&&i.push(t.join(", ")),this._container.innerHTML=i.join(" | ")}}}),o.Map.mergeOptions({attributionControl:!0}),o.Map.addInitHook(function(){this.options.attributionControl&&(this.attributionControl=(new o.Control.Attribution).addTo(this))}),o.control.attribution=function(t){return new o.Control.Attribution(t)},o.Control.Scale=o.Control.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0},onAdd:function(t){var e="leaflet-control-scale",i=o.DomUtil.create("div",e),n=this.options;return this._addScales(n,e+"-line",i),t.on(n.updateWhenIdle?"moveend":"move",this._update,this),t.whenReady(this._update,this),i},onRemove:function(t){t.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(t,e,i){t.metric&&(this._mScale=o.DomUtil.create("div",e,i)),t.imperial&&(this._iScale=o.DomUtil.create("div",e,i))},_update:function(){var t=this._map,e=t.getSize().y/2,i=o.CRS.Earth.distance(t.containerPointToLatLng([0,e]),t.containerPointToLatLng([this.options.maxWidth,e]));this._updateScales(i)},_updateScales:function(t){this.options.metric&&t&&this._updateMetric(t),this.options.imperial&&t&&this._updateImperial(t)},_updateMetric:function(t){var e=this._getRoundNum(t),i=1e3>e?e+" m":e/1e3+" km";this._updateScale(this._mScale,i,e/t)},_updateImperial:function(t){var e,i,n,o=3.2808399*t;o>5280?(e=o/5280,i=this._getRoundNum(e),this._updateScale(this._iScale,i+" mi",i/e)):(n=this._getRoundNum(o),this._updateScale(this._iScale,n+" ft",n/o))},_updateScale:function(t,e,i){t.style.width=Math.round(this.options.maxWidth*i)+"px",t.innerHTML=e},_getRoundNum:function(t){var e=Math.pow(10,(Math.floor(t)+"").length-1),i=t/e;return i=i>=10?10:i>=5?5:i>=3?3:i>=2?2:1,e*i}}),o.control.scale=function(t){return new o.Control.Scale(t)},o.Control.Layers=o.Control.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0,hideSingleBase:!1},initialize:function(t,e,i){o.setOptions(this,i),this._layers={},this._lastZIndex=0,this._handlingClick=!1;for(var n in t)this._addLayer(t[n],n);for(n in e)this._addLayer(e[n],n,!0)},onAdd:function(){return this._initLayout(),this._update(),this._container},addBaseLayer:function(t,e){return this._addLayer(t,e),this._update()},addOverlay:function(t,e){return this._addLayer(t,e,!0),this._update()},removeLayer:function(t){return t.off("add remove",this._onLayerChange,this),delete this._layers[o.stamp(t)],this._update()},_initLayout:function(){var t="leaflet-control-layers",e=this._container=o.DomUtil.create("div",t);e.setAttribute("aria-haspopup",!0),o.Browser.touch?o.DomEvent.on(e,"click",o.DomEvent.stopPropagation):o.DomEvent.disableClickPropagation(e).disableScrollPropagation(e);var i=this._form=o.DomUtil.create("form",t+"-list");if(this.options.collapsed){o.Browser.android||o.DomEvent.on(e,{mouseenter:this._expand,mouseleave:this._collapse},this);var n=this._layersLink=o.DomUtil.create("a",t+"-toggle",e);n.href="#",n.title="Layers",o.Browser.touch?o.DomEvent.on(n,"click",o.DomEvent.stop).on(n,"click",this._expand,this):o.DomEvent.on(n,"focus",this._expand,this),o.DomEvent.on(i,"click",function(){setTimeout(o.bind(this._onInputClick,this),0)},this),this._map.on("click",this._collapse,this)}else this._expand();this._baseLayersList=o.DomUtil.create("div",t+"-base",i),this._separator=o.DomUtil.create("div",t+"-separator",i),this._overlaysList=o.DomUtil.create("div",t+"-overlays",i),e.appendChild(i)},_addLayer:function(t,e,i){t.on("add remove",this._onLayerChange,this);var n=o.stamp(t);this._layers[n]={layer:t,name:e,overlay:i},this.options.autoZIndex&&t.setZIndex&&(this._lastZIndex++,t.setZIndex(this._lastZIndex))},_update:function(){if(!this._container)return this;o.DomUtil.empty(this._baseLayersList),o.DomUtil.empty(this._overlaysList);var t,e,i,n,s=0;for(i in this._layers)n=this._layers[i],this._addItem(n),e=e||n.overlay,t=t||!n.overlay,s+=n.overlay?0:1;return this.options.hideSingleBase&&(t=t&&s>1,this._baseLayersList.style.display=t?"":"none"),this._separator.style.display=e&&t?"":"none",this},_onLayerChange:function(t){this._handlingClick||this._update();var e=this._layers[o.stamp(t.target)].overlay,i=e?"add"===t.type?"overlayadd":"overlayremove":"add"===t.type?"baselayerchange":null;i&&this._map.fire(i,t.target)},_createRadioElement:function(t,i){var n='<input type="radio" class="leaflet-control-layers-selector" name="'+t+'"'+(i?' checked="checked"':"")+"/>",o=e.createElement("div");return o.innerHTML=n,o.firstChild},_addItem:function(t){var i,n=e.createElement("label"),s=this._map.hasLayer(t.layer);t.overlay?(i=e.createElement("input"),i.type="checkbox",i.className="leaflet-control-layers-selector",i.defaultChecked=s):i=this._createRadioElement("leaflet-base-layers",s),i.layerId=o.stamp(t.layer),o.DomEvent.on(i,"click",this._onInputClick,this);var r=e.createElement("span");r.innerHTML=" "+t.name,n.appendChild(i),n.appendChild(r);var a=t.overlay?this._overlaysList:this._baseLayersList;return a.appendChild(n),n},_onInputClick:function(){var t,e,i,n=this._form.getElementsByTagName("input"),o=[],s=[];this._handlingClick=!0;for(var r=0,a=n.length;a>r;r++)t=n[r],e=this._layers[t.layerId].layer,i=this._map.hasLayer(e),t.checked&&!i?o.push(e):!t.checked&&i&&s.push(e);for(r=0;r<s.length;r++)this._map.removeLayer(s[r]);for(r=0;r<o.length;r++)this._map.addLayer(o[r]);this._handlingClick=!1,this._refocusOnMap()},_expand:function(){o.DomUtil.addClass(this._container,"leaflet-control-layers-expanded")},_collapse:function(){o.DomUtil.removeClass(this._container,"leaflet-control-layers-expanded")}}),o.control.layers=function(t,e,i){return new o.Control.Layers(t,e,i)},o.PosAnimation=o.Evented.extend({run:function(t,e,i,n){this.stop(),this._el=t,this._inProgress=!0,this._duration=i||.25,this._easeOutPower=1/Math.max(n||.5,.2),this._startPos=o.DomUtil.getPosition(t),this._offset=e.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(!0),this._complete())},_animate:function(){this._animId=o.Util.requestAnimFrame(this._animate,this),this._step()},_step:function(t){var e=+new Date-this._startTime,i=1e3*this._duration;i>e?this._runFrame(this._easeOut(e/i),t):(this._runFrame(1),this._complete())},_runFrame:function(t,e){var i=this._startPos.add(this._offset.multiplyBy(t));e&&i._round(),o.DomUtil.setPosition(this._el,i),this.fire("step")},_complete:function(){o.Util.cancelAnimFrame(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(t){return 1-Math.pow(1-t,this._easeOutPower)}}),o.Map.include({setView:function(t,e,n){if(e=e===i?this._zoom:this._limitZoom(e),t=this._limitCenter(o.latLng(t),e,this.options.maxBounds),n=n||{},this.stop(),this._loaded&&!n.reset&&n!==!0){n.animate!==i&&(n.zoom=o.extend({animate:n.animate},n.zoom),n.pan=o.extend({animate:n.animate},n.pan));var s=this._zoom!==e?this._tryAnimatedZoom&&this._tryAnimatedZoom(t,e,n.zoom):this._tryAnimatedPan(t,n.pan);if(s)return clearTimeout(this._sizeTimer),this}return this._resetView(t,e),this},panBy:function(t,e){if(t=o.point(t).round(),e=e||{},!t.x&&!t.y)return this;if(e.animate!==!0&&!this.getSize().contains(t))return this._resetView(this.unproject(this.project(this.getCenter()).add(t)),this.getZoom()),this;if(this._panAnim||(this._panAnim=new o.PosAnimation,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),e.noMoveStart||this.fire("movestart"),e.animate!==!1){o.DomUtil.addClass(this._mapPane,"leaflet-pan-anim");var i=this._getMapPanePos().subtract(t);this._panAnim.run(this._mapPane,i,e.duration||.25,e.easeLinearity)}else this._rawPanBy(t),this.fire("move").fire("moveend");return this},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){o.DomUtil.removeClass(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(t,e){var i=this._getCenterOffset(t)._floor();return(e&&e.animate)===!0||this.getSize().contains(i)?(this.panBy(i,e),(e&&e.animate)!==!1):!1}}),o.Map.mergeOptions({zoomAnimation:!0,zoomAnimationThreshold:4});var h=o.DomUtil.TRANSITION&&o.Browser.any3d&&!o.Browser.mobileOpera;h&&o.Map.addInitHook(function(){this._zoomAnimated=this.options.zoomAnimation,this._zoomAnimated&&(this._createAnimProxy(),o.DomEvent.on(this._proxy,o.DomUtil.TRANSITION_END,this._catchTransitionEnd,this))}),o.Map.include(h?{_createAnimProxy:function(){var t=this._proxy=o.DomUtil.create("div","leaflet-proxy leaflet-zoom-animated");this._panes.mapPane.appendChild(t),this.on("zoomanim",function(e){var i=o.DomUtil.TRANSFORM,n=t.style[i];o.DomUtil.setTransform(t,this.project(e.center,e.zoom),this.getZoomScale(e.zoom,1)),n===t.style[i]&&this._animatingZoom&&this._onZoomTransitionEnd()},this),this.on("load moveend",function(){var e=this.getCenter(),i=this.getZoom();o.DomUtil.setTransform(t,this.project(e,i),this.getZoomScale(i,1))},this)},_catchTransitionEnd:function(t){this._animatingZoom&&t.propertyName.indexOf("transform")>=0&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(t,e,i){if(this._animatingZoom)return!0;if(i=i||{},!this._zoomAnimated||i.animate===!1||this._nothingToAnimate()||Math.abs(e-this._zoom)>this.options.zoomAnimationThreshold)return!1;var n=this.getZoomScale(e),s=this._getCenterOffset(t)._divideBy(1-1/n);return i.animate===!0||this.getSize().contains(s)?(o.Util.requestAnimFrame(function(){this.fire("movestart").fire("zoomstart")._animateZoom(t,e,!0)},this),!0):!1},_animateZoom:function(t,e,i,n){i&&(this._animatingZoom=!0,this._animateToCenter=t,this._animateToZoom=e,o.DomUtil.addClass(this._mapPane,"leaflet-zoom-anim")),this.fire("zoomanim",{center:t,zoom:e,scale:this.getZoomScale(e),origin:this.latLngToLayerPoint(t),offset:this._getCenterOffset(t).multiplyBy(-1),noUpdate:n})},_onZoomTransitionEnd:function(){this._animatingZoom=!1,o.DomUtil.removeClass(this._mapPane,"leaflet-zoom-anim"),this._resetView(this._animateToCenter,this._animateToZoom,!0,!0)}}:{}),o.Map.include({flyTo:function(t,e,n){function s(t){var e=(v*v-g*g+(t?-1:1)*L*L*y*y)/(2*(t?v:g)*L*y);return Math.log(Math.sqrt(e*e+1)-e)}function r(t){return(Math.exp(t)-Math.exp(-t))/2}function a(t){return(Math.exp(t)+Math.exp(-t))/2}function h(t){return r(t)/a(t)}function l(t){return g*(a(x)/a(x+P*t))}function u(t){return g*(a(x)*h(x+P*t)-r(x))/L}function c(t){return 1-Math.pow(1-t,1.5)}function d(){var i=(Date.now()-w)/D,n=c(i)*b;1>=i?(this._flyToFrame=o.Util.requestAnimFrame(d,this),this._resetView(this.unproject(_.add(m.subtract(_).multiplyBy(u(n)/y)),f),this.getScaleZoom(g/l(n),f),!0,!0)):this._resetView(t,e,!0,!0)}if(n=n||{},n.animate===!1)return this.setView(t,e,n);this.stop();var _=this.project(this.getCenter()),m=this.project(t),p=this.getSize(),f=this._zoom;t=o.latLng(t),e=e===i?f:e;var g=Math.max(p.x,p.y),v=g*this.getZoomScale(f,e),y=m.distanceTo(_),P=1.42,L=P*P,x=s(0),w=Date.now(),b=(s(1)-x)/P,D=n.duration?1e3*n.duration:1e3*b*.8;return this.fire("zoomstart"),d.call(this),this},flyToBounds:function(t,e){var i=this._getBoundsCenterZoom(t,e);return this.flyTo(i.center,i.zoom,e)}}),o.Map.include({_defaultLocateOptions:{timeout:1e4,watch:!1},locate:function(t){if(t=this._locateOptions=o.extend({},this._defaultLocateOptions,t),!("geolocation"in navigator))return this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this;var e=o.bind(this._handleGeolocationResponse,this),i=o.bind(this._handleGeolocationError,this);return t.watch?this._locationWatchId=navigator.geolocation.watchPosition(e,i,t):navigator.geolocation.getCurrentPosition(e,i,t),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(t){var e=t.code,i=t.message||(1===e?"permission denied":2===e?"position unavailable":"timeout");this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:e,message:"Geolocation error: "+i+"."})},_handleGeolocationResponse:function(t){var e=t.coords.latitude,i=t.coords.longitude,n=new o.LatLng(e,i),s=n.toBounds(t.coords.accuracy),r=this._locateOptions;if(r.setView){var a=this.getBoundsZoom(s);this.setView(n,r.maxZoom?Math.min(a,r.maxZoom):a)}var h={latlng:n,bounds:s,timestamp:t.timestamp};for(var l in t.coords)"number"==typeof t.coords[l]&&(h[l]=t.coords[l]);this.fire("locationfound",h)}})}(window,document);;/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery.min.map
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.2",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=st(),k=st(),E=st(),S=!1,A=function(e,t){return e===t?(S=!0,0):0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=mt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+yt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,n,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function lt(e){return e[b]=!0,e}function ut(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ct(e,t){var n=e.split("|"),r=e.length;while(r--)o.attrHandle[n[r]]=t}function pt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function dt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return lt(function(t){return t=+t,lt(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.defaultView;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.attachEvent&&i!==i.top&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),r.getElementsByTagName=ut(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ut(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=K.test(n.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ut(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=K.test(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ut(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=K.test(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return pt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?pt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:lt,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=mt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?lt(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:lt(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?lt(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:lt(function(e){return function(t){return at(e,t).length>0}}),contains:lt(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:lt(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},o.pseudos.nth=o.pseudos.eq;for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=ft(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=dt(n);function gt(){}gt.prototype=o.filters=o.pseudos,o.setFilters=new gt;function mt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function yt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function vt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function bt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function wt(e,t,n,r,i,o){return r&&!r[b]&&(r=wt(r)),i&&!i[b]&&(i=wt(i,o)),lt(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||Nt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:xt(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=xt(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=xt(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function Tt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=vt(function(e){return e===t},s,!0),p=vt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[vt(bt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return wt(l>1&&bt(f),l>1&&yt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&Tt(e.slice(l,r)),i>r&&Tt(e=e.slice(r)),i>r&&yt(e))}f.push(n)}return bt(f)}function Ct(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=xt(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?lt(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=mt(e)),n=t.length;while(n--)o=Tt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Ct(i,r))}return o};function Nt(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function kt(e,t,n,i){var a,s,u,c,p,f=mt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&yt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}r.sortStable=b.split("").sort(A).join("")===b,r.detectDuplicates=S,p(),r.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(f.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||ct("type|href|height|width",function(e,n,r){return r?t:e.getAttribute(n,"type"===n.toLowerCase()?1:2)}),r.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||ct("value",function(e,n,r){return r||"input"!==e.nodeName.toLowerCase()?t:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||ct(B,function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&i.specified?i.value:e[n]===!0?n.toLowerCase():null}),x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!l||i&&!u||(t=t||[],t=[e,t.slice?t.slice():t],n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)}),n=s=l=u=r=o=null,t
}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,r=0,o=x(this),a=e.match(T)||[];while(t=a[r++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){nn(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);;//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=d(e,i,4);var o=!w(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=b(r,e);for(var u=null!=t&&t.length,i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t){var r=S.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||o,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=S[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var e=this,u=e._,i=Array.prototype,o=Object.prototype,a=Function.prototype,c=i.push,l=i.slice,f=o.toString,s=o.hasOwnProperty,p=Array.isArray,h=Object.keys,v=a.bind,g=Object.create,y=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):e._=m,m.VERSION="1.8.2";var d=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},b=function(n,t,r){return null==n?m.identity:m.isFunction(n)?d(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return b(n,t,1/0)};var x=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var l=o[c];t&&r[l]!==void 0||(r[l]=i[l])}return r}},_=function(n){if(!m.isObject(n))return{};if(g)return g(n);y.prototype=n;var t=new y;return y.prototype=null,t},j=Math.pow(2,53)-1,w=function(n){var t=n&&n.length;return"number"==typeof t&&t>=0&&j>=t};m.each=m.forEach=function(n,t,r){t=d(t,r);var e,u;if(w(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=b(t,r);for(var e=!w(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=w(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=b(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(b(t)),r)},m.every=m.all=function(n,t,r){t=b(t,r);for(var e=!w(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=b(t,r);for(var e=!w(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r){return w(n)||(n=m.values(n)),m.indexOf(n,t,"number"==typeof r&&r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=w(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=b(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=w(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=b(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=w(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(w(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=b(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var A=function(n){return function(t,r,e){var u={};return r=b(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=A(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=A(function(n,t,r){n[r]=t}),m.countBy=A(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):w(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:w(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=b(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var k=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=n&&n.length;a>o;o++){var c=n[o];if(w(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=k(c,t,r));var l=0,f=c.length;for(u.length+=f;f>l;)u[i++]=c[l++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return k(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){if(null==n)return[];m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=b(r,e));for(var u=[],i=[],o=0,a=n.length;a>o;o++){var c=n[o],l=r?r(c,o,n):c;t?(o&&i===l||u.push(c),i=l):r?m.contains(i,l)||(i.push(l),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(k(arguments,!0,!0))},m.intersection=function(n){if(null==n)return[];for(var t=[],r=arguments.length,e=0,u=n.length;u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=k(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,"length").length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=n&&n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.indexOf=function(n,t,r){var e=0,u=n&&n.length;if("number"==typeof r)e=0>r?Math.max(0,u+r):r;else if(r&&u)return e=m.sortedIndex(n,t),n[e]===t?e:-1;if(t!==t)return m.findIndex(l.call(n,e),m.isNaN);for(;u>e;e++)if(n[e]===t)return e;return-1},m.lastIndexOf=function(n,t,r){var e=n?n.length:0;if("number"==typeof r&&(e=0>r?e+r+1:Math.min(e,r+1)),t!==t)return m.findLastIndex(l.call(n,0,e),m.isNaN);for(;--e>=0;)if(n[e]===t)return e;return-1},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=b(r,e,1);for(var u=r(t),i=0,o=n.length;o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var O=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=_(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(v&&n.bind===v)return v.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return O(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return O(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var l=m.now();a||r.leading!==!1||(a=l);var f=t-(l-a);return e=this,u=arguments,0>=f||f>t?(o&&(clearTimeout(o),o=null),a=l,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,f)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var l=m.now()-o;t>l&&l>=0?e=setTimeout(c,t-l):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var l=r&&!e;return e||(e=setTimeout(c,t)),l&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var F=!{toString:null}.propertyIsEnumerable("toString"),S=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(h)return h(n);var t=[];for(var e in n)m.has(n,e)&&t.push(e);return F&&r(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var e in n)t.push(e);return F&&r(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=b(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=x(m.allKeys),m.extendOwn=m.assign=x(m.keys),m.findKey=function(n,t,r){t=b(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=d(t,r)):(u=k(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var l=u[a],f=o[l];e(f,l,o)&&(i[l]=f)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(k(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=x(m.allKeys,!0),m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var E=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=f.call(n);if(u!==f.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!E(n[c],t[c],r,e))return!1}else{var l,s=m.keys(n);if(c=s.length,m.keys(t).length!==c)return!1;for(;c--;)if(l=s[c],!m.has(t,l)||!E(n[l],t[l],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return E(n,t)},m.isEmpty=function(n){return null==n?!0:w(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=p||function(n){return"[object Array]"===f.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return f.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===f.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&s.call(n,t)},m.noConflict=function(){return e._=u,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=function(n){return function(t){return null==t?void 0:t[n]}},m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=d(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var M={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},N=m.invert(M),I=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=I(M),m.unescape=I(N),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var B=0;m.uniqueId=function(n){var t=++B+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,R={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},q=/\\|'|\r|\n|\u2028|\u2029/g,K=function(n){return"\\"+R[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||T).source,(t.interpolate||T).source,(t.evaluate||T).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(q,K),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},l=t.variable||"obj";return c.source="function("+l+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var z=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return c.apply(n,arguments),z(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=i[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],z(this,r)}}),m.each(["concat","join","slice"],function(n){var t=i[n];m.prototype[n]=function(){return z(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);
//# sourceMappingURL=underscore-min.map;//     Backbone.js 1.1.2

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    factory(root, exports, _);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.2';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model, options);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i] || {};
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute || 'id'];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);
          this._addReference(model, options);
        }

        // Do not add multiple models with the same `id`.
        model = existing || model;
        if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
        modelMap[model.id] = true;
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) return attrs;
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      if (model.id != null) this._byId[model.id] = model;
      if (!model.collection) model.collection = this;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch =
    typeof window !== 'undefined' && !!window.ActiveXObject &&
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = decodeURI(this.location.pathname + this.location.search);
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
        this.iframe = frame.hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot() && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      // Some environments will throw when clearing an undefined interval.
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;

}));;!function(e,n){"use strict";if("function"==typeof define&&define.amd)define(["backbone","underscore","jquery"],function(){return n.apply(e,arguments)});else if("object"==typeof exports){var t=require("backbone"),r=require("underscore");t.$=t.$||require("jquery"),module.exports=n.call(e,t,r,t.$)}else n.call(e,e.Backbone,e._,e.Backbone.$)}("object"==typeof global?global:this,function(e,n,t){"use strict";var r=this,i=e.View,a=Array.prototype.push,o=Array.prototype.concat,s=Array.prototype.splice,c=String.prototype.trim?n.bind(String.prototype.trim.call,String.prototype.trim):t.trim,l=e.View.extend({_render:function(){var e=this,n=e.__manager__,t=e.beforeRender,r=e.deferred();return e.hasRendered&&e._removeViews(),n.callback=function(){delete n.isAsync,delete n.callback,e.trigger("beforeRender",e),e._viewRender(n).render().then(function(){r.resolve()})},t&&t.call(e,e),n.isAsync||n.callback(),r.promise()},_applyTemplate:function(e,r,i){n.isString(e)&&(r.noel?(e=t.parseHTML(e,!0),this.$el.slice(1).remove(),this.$el.replaceWith(e),this.setElement(e,!1)):this.html(this.$el,e)),i.resolveWith(this,[this])},_viewRender:function(e){function t(n,t){var i;e.callback=function(n){delete e.isAsync,delete e.callback,o._applyTemplate(n,e,a)},l.cache(r,t),t&&(i=o.renderTemplate.call(o,t,n)),e.isAsync||o._applyTemplate(i,e,a)}var r,i,a,o=this;return{render:function(){var s=o.serialize,c=o.template;return a=o.deferred(),n.isFunction(s)&&(s=s.call(o)),e.callback=function(n){delete e.isAsync,delete e.callback,t(s,n)},"string"==typeof c&&(r=o.prefix+c),(i=l.cache(r))?(t(s,i,r),a):("string"==typeof c?i=o.fetchTemplate.call(o,o.prefix+c):"function"==typeof c?i=c:null!=c&&(i=o.fetchTemplate.call(o,c)),e.isAsync||t(s,i),a)}}},constructor:function(t){this.manage=!0,n.extend(this,t),e.View.apply(this,arguments)},async:function(){var e=this.__manager__;return e.isAsync=!0,e.callback},promise:function(){return this.__manager__.renderDeferred.promise()},then:function(){return this.promise().then.apply(this,arguments)},renderViews:function(e){var t=this,r=t.__manager__,i=t.deferred();e=e&&n.isArray(e)?n.chain(e):t.getViews(e);var a=e.map(function(e){return e.render().__manager__.renderDeferred}).value();return r.renderDeferred=i.promise(),t.when(a).then(function(){i.resolveWith(t,[t])}),t},insertView:function(e,n){return n?this.setView(e,n,!0):this.setView(e,!0)},insertViews:function(e){return n.isArray(e)?this.setViews({"":e}):(n.each(e,function(t,r){e[r]=n.isArray(t)?t:[t]}),this.setViews(e))},getView:function(e){return null==e&&(e=arguments[1]),this.getViews(e).first().value()},getViews:function(e){var t;return"string"==typeof e?(e=this.sections[e]||e,t=this.views[e]||[],n.chain([].concat(t))):(t=n.chain(this.views).map(function(e){return n.isArray(e)?e:[e]},this).flatten(),"object"==typeof e?t.where(e):"function"==typeof e?t.filter(e):t)},removeView:function(e){return this.getViews(e).each(function(e){e.remove()})},setView:function(e,n,t){var r,i,a=this;if("string"!=typeof e&&(t=n,n=e,e=""),r=n.__manager__,!r)throw new Error("The argument associated with selector '"+e+"' is defined and a View.  Set `manage` property to true for Backbone.View instances.");return r.parent=a,i=r.selector=a.sections[e]||e,t?(a.views[i]=o.call([],a.views[e]||[],n),a.__manager__.insert=!0,n):(a.getView(e)!==n&&a.removeView(e),a.views[i]=n)},setViews:function(e){return n.each(e,function(e,t){return n.isArray(e)?n.each(e,function(e){this.insertView(t,e)},this):void this.setView(t,e)},this),this},render:function(){function e(){function e(){var e=r.console,t=i.afterRender;t&&t.call(i,i),i.trigger("afterRender",i),a.noel&&i.$el.length>1&&n.isFunction(e.warn)&&!i.suppressWarnings&&(e.warn("`el: false` with multiple top level elements is not supported."),n.isFunction(e.trace)&&e.trace())}return n.each(i.views,function(e,t){n.isArray(e)&&i.htmlBatch(i,e,t)}),o&&!a.insertedViaFragment&&(i.contains(o.el,i.el)||o.partial(o.$el,i.$el,s,a)),i.delegateEvents(),i.hasRendered=!0,a.renderInProgress=!1,delete a.triggeredByRAF,a.queue&&a.queue.length?a.queue.shift()():delete a.queue,s&&(s.renderInProgress||s.queue)?o.once("afterRender",e):e(),c.resolveWith(i,[i])}function t(){i._render().done(function(){if(!n.keys(i.views).length)return e();var t=n.map(i.views,function(e){var t=n.isArray(e);return t&&e.length?i.when(n.map(e,function(e){return e.__manager__.insertedViaFragment=!0,e.render().__manager__.renderDeferred})):t?e:e.render().__manager__.renderDeferred});i.when(t).done(e)})}var i=this,a=i.__manager__,o=a.parent,s=o&&o.__manager__,c=i.deferred();return a.renderInProgress=!0,i._registerWithRAF(t,c),a.renderDeferred=c,i},remove:function(){return l._removeView(this,!0),this._remove.apply(this,arguments)},_registerWithRAF:function(e,n){function t(){o.rafID=null,o.triggeredByRAF=!0,e()}function r(){for(var e=0;e<o.deferreds.length;e++)o.deferreds[e].resolveWith(i,[i]);o.deferreds=[]}var i=this,o=i.__manager__,s=o.parent&&o.parent.__manager__;return this.useRAF===!1?void(o.queue?a.call(o.queue,e):(o.queue=[],e())):(o.deferreds=o.deferreds||[],o.deferreds.push(n),n.done(r),this._cancelQueuedRAFRender(),s&&s.triggeredByRAF?t():void(o.rafID=i.requestAnimationFrame(t)))},_cancelQueuedRAFRender:function(){var e=this,n=e.__manager__;null!=n.rafID&&e.cancelAnimationFrame(n.rafID)}},{_cache:{},_removeViews:function(e,n){"boolean"==typeof e&&(n=e,e=this),e=e||this,e.getViews().each(function(e){(e.hasRendered||n)&&l._removeView(e,n)})},_removeView:function(e,t){var r,i=e.__manager__,a=i.parent&&i.parent.__manager__,o="boolean"==typeof e.keep?e.keep:e.options.keep;if(!o&&a&&a.insert===!0||t){if(l.cleanViews(e),e._removeViews(!0),e.$el.remove(),e._cancelQueuedRAFRender(),!i.parent)return;if(r=i.parent.views[i.selector],n.isArray(r))return n.each(n.clone(r),function(e,n){e&&e.__manager__===i&&s.call(r,n,1)}),void(n.isEmpty(r)&&i.parent.trigger("empty",i.selector));delete i.parent.views[i.selector],i.parent.trigger("empty",i.selector)}},cache:function(e,n){return e in this._cache&&null==n?this._cache[e]:null!=e&&null!=n?this._cache[e]=n:void 0},cleanViews:function(t){n.each(o.call([],t),function(t){t.unbind(),t.model instanceof e.Model&&t.model.off(null,null,t),t.collection instanceof e.Collection&&t.collection.off(null,null,t),t.stopListening(),n.isFunction(t.cleanup)&&t.cleanup()})},configure:function(t){n.extend(l.prototype,t),t.manage&&(e.View.prototype.manage=!0),t.el===!1&&(e.View.prototype.el=!1),t.suppressWarnings===!0&&(e.View.prototype.suppressWarnings=!0),t.useRAF===!1&&(e.View.prototype.useRAF=!1)},setupView:function(t,r){r=n.extend({},r),n.each(o.call([],t),function(t){if(!t.__manager__){var i,a,o=l.prototype;n.defaults(t,{views:{},sections:{},__manager__:{},_removeViews:l._removeViews,_removeView:l._removeView},l.prototype),t.options=r,n.extend(t,r),t._remove=e.View.prototype.remove,t.render=l.prototype.render,t.remove!==o.remove&&(t._remove=t.remove,t.remove=o.remove),i=r.views||t.views,n.keys(i).length&&(a=i,t.views={},n.each(a,function(e,n){"function"==typeof e&&(a[n]=e.call(t,t))}),t.setViews(a))}})}});l.VERSION="0.9.6",e.Layout=l,e.View.prototype.constructor=function(e){var n;e=e||{},("el"in e?e.el===!1:this.el===!1)&&(n=!0),(e.manage||this.manage)&&l.setupView(this,e),this.__manager__&&(this.__manager__.noel=n,this.__manager__.suppressWarnings=e.suppressWarnings),i.apply(this,arguments)},e.View=e.View.prototype.constructor,e.View.extend=i.extend,e.View.prototype=i.prototype;var u={prefix:"",useRAF:!0,deferred:function(){return t.Deferred()},fetchTemplate:function(e){return n.template(t(e).html())},renderTemplate:function(e,n){return c(e.call(this,n))},serialize:function(){return this.model?n.clone(this.model.attributes):{}},partial:function(e,n,t,r){var i;r.selector&&(t.noel?(i=e.filter(r.selector),e=i.length?i:e.find(r.selector)):e=e.find(r.selector)),t.insert?this.insert(e,n):this.html(e,n)},html:function(e,n){e.html(n)},htmlBatch:function(e,r,i){var a=e.__manager__,o={selector:i},s=n.reduce(r,function(n,r){var i="boolean"==typeof r.keep?r.keep:r.options.keep,a=i&&t.contains(e.el,r.el);return r.el&&!a&&n.push(r.el),n},[]);return this.partial(e.$el,t(s),a,o)},insert:function(e,n){e.append(n)},when:function(e){return t.when.apply(null,e)},contains:function(e,n){return t.contains(e,n)},requestAnimationFrame:function(){for(var e=0,t=["ms","moz","webkit","o"],i=r.requestAnimationFrame,a=0;a<t.length&&!r.requestAnimationFrame;++a)i=r[t[a]+"RequestAnimationFrame"];return i||(i=function(n){var t=(new Date).getTime(),i=Math.max(0,16-(t-e)),a=r.setTimeout(function(){n(t+i)},i);return e=t+i,a}),n.bind(i,r)}(),cancelAnimationFrame:function(){for(var e=["ms","moz","webkit","o"],t=r.cancelAnimationFrame,i=0;i<e.length&&!r.requestAnimationFrame;++i)t=r[e[i]+"CancelAnimationFrame"]||r[e[i]+"CancelRequestAnimationFrame"];return t||(t=function(e){clearTimeout(e)}),n.bind(t,r)}()};return n.extend(l.prototype,u),l});;/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one(a.support.transition.end,function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b()})}(jQuery),+function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function c(){f.trigger("closed.bs.alert").remove()}var d=a(this),e=d.attr("data-target");e||(e=d.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,""));var f=a(e);b&&b.preventDefault(),f.length||(f=d.hasClass("alert")?d:d.parent()),f.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one(a.support.transition.end,c).emulateTransitionEnd(150):c())};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("bs.alert");e||d.data("bs.alert",e=new c(this)),"string"==typeof b&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.bs.alert.data-api",b,c.prototype.close)}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.isLoading=!1};b.DEFAULTS={loadingText:"loading..."},b.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",f.resetText||d.data("resetText",d[e]()),d[e](f[b]||this.options[b]),setTimeout(a.proxy(function(){"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},b.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}a&&this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof c&&c;e||d.data("bs.button",e=new b(this,f)),"toggle"==c?e.toggle():c&&e.setState(c)})},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.bs.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle"),b.preventDefault()})}(jQuery),+function(a){"use strict";var b=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},b.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},b.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},b.prototype.to=function(b){var c=this,d=this.getActiveIndex();return b>this.$items.length-1||0>b?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},b.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},b.prototype.next=function(){return this.sliding?void 0:this.slide("next")},b.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},b.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g="next"==b?"left":"right",h="next"==b?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}if(e.hasClass("active"))return this.sliding=!1;var j=a.Event("slide.bs.carousel",{relatedTarget:e[0],direction:g});return this.$element.trigger(j),j.isDefaultPrevented()?void 0:(this.sliding=!0,f&&this.pause(),this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid.bs.carousel",function(){var b=a(i.$indicators.children()[i.getActiveIndex()]);b&&b.addClass("active")})),a.support.transition&&this.$element.hasClass("slide")?(e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid.bs.carousel")},0)}).emulateTransitionEnd(1e3*d.css("transition-duration").slice(0,-1))):(d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid.bs.carousel")),f&&this.cycle(),this)};var c=a.fn.carousel;a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c),g="string"==typeof c?c:f.slide;e||d.data("bs.carousel",e=new b(this,f)),"number"==typeof c?e.to(c):g?e[g]():f.interval&&e.pause().cycle()})},a.fn.carousel.Constructor=b,a.fn.carousel.noConflict=function(){return a.fn.carousel=c,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(b){var c,d=a(this),e=a(d.attr("data-target")||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"")),f=a.extend({},e.data(),d.data()),g=d.attr("data-slide-to");g&&(f.interval=!1),e.carousel(f),(g=d.attr("data-slide-to"))&&e.data("bs.carousel").to(g),b.preventDefault()}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var b=a(this);b.carousel(b.data())})})}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.DEFAULTS={toggle:!0},b.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},b.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b=a.Event("show.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.$parent&&this.$parent.find("> .panel > .in");if(c&&c.length){var d=c.data("bs.collapse");if(d&&d.transitioning)return;c.collapse("hide"),d||c.data("bs.collapse",null)}var e=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[e](0),this.transitioning=1;var f=function(){this.$element.removeClass("collapsing").addClass("collapse in")[e]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return f.call(this);var g=a.camelCase(["scroll",e].join("-"));this.$element.one(a.support.transition.end,a.proxy(f,this)).emulateTransitionEnd(350)[e](this.$element[0][g])}}},b.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return a.support.transition?void this.$element[c](0).one(a.support.transition.end,a.proxy(d,this)).emulateTransitionEnd(350):d.call(this)}}},b.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},b.DEFAULTS,d.data(),"object"==typeof c&&c);!e&&f.toggle&&"show"==c&&(c=!c),e||d.data("bs.collapse",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(b){var c,d=a(this),e=d.attr("data-target")||b.preventDefault()||(c=d.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,""),f=a(e),g=f.data("bs.collapse"),h=g?"toggle":d.data(),i=d.attr("data-parent"),j=i&&a(i);g&&g.transitioning||(j&&j.find('[data-toggle=collapse][data-parent="'+i+'"]').not(d).addClass("collapsed"),d[f.hasClass("in")?"addClass":"removeClass"]("collapsed")),f.collapse(h)})}(jQuery),+function(a){"use strict";function b(b){a(d).remove(),a(e).each(function(){var d=c(a(this)),e={relatedTarget:this};d.hasClass("open")&&(d.trigger(b=a.Event("hide.bs.dropdown",e)),b.isDefaultPrevented()||d.removeClass("open").trigger("hidden.bs.dropdown",e))})}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}var d=".dropdown-backdrop",e="[data-toggle=dropdown]",f=function(b){a(b).on("click.bs.dropdown",this.toggle)};f.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;f.toggleClass("open").trigger("shown.bs.dropdown",h),e.focus()}return!1}},f.prototype.keydown=function(b){if(/(38|40|27)/.test(b.keyCode)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var f=c(d),g=f.hasClass("open");if(!g||g&&27==b.keyCode)return 27==b.which&&f.find(e).focus(),d.click();var h=" li:not(.divider):visible a",i=f.find("[role=menu]"+h+", [role=listbox]"+h);if(i.length){var j=i.index(i.filter(":focus"));38==b.keyCode&&j>0&&j--,40==b.keyCode&&j<i.length-1&&j++,~j||(j=0),i.eq(j).focus()}}}};var g=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new f(this)),"string"==typeof b&&d[b].call(c)})},a.fn.dropdown.Constructor=f,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=g,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",e,f.prototype.toggle).on("keydown.bs.dropdown.data-api",e+", [role=menu], [role=listbox]",f.prototype.keydown)}(jQuery),+function(a){"use strict";var b=function(b,c){this.options=c,this.$element=a(b),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};b.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},b.prototype.toggle=function(a){return this[this.isShown?"hide":"show"](a)},b.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d),this.isShown||d.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(document.body),c.$element.show().scrollTop(0),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one(a.support.transition.end,function(){c.$element.focus().trigger(e)}).emulateTransitionEnd(300):c.$element.focus().trigger(e)}))},b.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one(a.support.transition.end,a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},b.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.focus()},this))},b.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},b.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden.bs.modal")})},b.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},b.prototype.backdrop=function(b){var c=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var d=a.support.transition&&c;if(this.$backdrop=a('<div class="modal-backdrop '+c+'" />').appendTo(document.body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),d&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;d?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()):b&&b()};var c=a.fn.modal;a.fn.modal=function(c,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},b.DEFAULTS,e.data(),"object"==typeof c&&c);f||e.data("bs.modal",f=new b(this,g)),"string"==typeof c?f[c](d):g.show&&f.show(d)})},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());c.is("a")&&b.preventDefault(),e.modal(f,this).one("hide",function(){c.is(":visible")&&c.focus()})}),a(document).on("show.bs.modal",".modal",function(){a(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){a(document.body).removeClass("modal-open")})}(jQuery),+function(a){"use strict";var b=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};b.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},b.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},b.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},b.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show()},b.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},b.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(b),b.isDefaultPrevented())return;var c=this,d=this.tip();this.setContent(),this.options.animation&&d.addClass("fade");var e="function"==typeof this.options.placement?this.options.placement.call(this,d[0],this.$element[0]):this.options.placement,f=/\s?auto?\s?/i,g=f.test(e);g&&(e=e.replace(f,"")||"top"),d.detach().css({top:0,left:0,display:"block"}).addClass(e),this.options.container?d.appendTo(this.options.container):d.insertAfter(this.$element);var h=this.getPosition(),i=d[0].offsetWidth,j=d[0].offsetHeight;if(g){var k=this.$element.parent(),l=e,m=document.documentElement.scrollTop||document.body.scrollTop,n="body"==this.options.container?window.innerWidth:k.outerWidth(),o="body"==this.options.container?window.innerHeight:k.outerHeight(),p="body"==this.options.container?0:k.offset().left;e="bottom"==e&&h.top+h.height+j-m>o?"top":"top"==e&&h.top-m-j<0?"bottom":"right"==e&&h.right+i>n?"left":"left"==e&&h.left-i<p?"right":e,d.removeClass(l).addClass(e)}var q=this.getCalculatedOffset(e,h,i,j);this.applyPlacement(q,e),this.hoverState=null;var r=function(){c.$element.trigger("shown.bs."+c.type)};a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,r).emulateTransitionEnd(150):r()}},b.prototype.applyPlacement=function(b,c){var d,e=this.tip(),f=e[0].offsetWidth,g=e[0].offsetHeight,h=parseInt(e.css("margin-top"),10),i=parseInt(e.css("margin-left"),10);isNaN(h)&&(h=0),isNaN(i)&&(i=0),b.top=b.top+h,b.left=b.left+i,a.offset.setOffset(e[0],a.extend({using:function(a){e.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),e.addClass("in");var j=e[0].offsetWidth,k=e[0].offsetHeight;if("top"==c&&k!=g&&(d=!0,b.top=b.top+g-k),/bottom|top/.test(c)){var l=0;b.left<0&&(l=-2*b.left,b.left=0,e.offset(b),j=e[0].offsetWidth,k=e[0].offsetHeight),this.replaceArrow(l-f+j,j,"left")}else this.replaceArrow(k-g,k,"top");d&&e.offset(b)},b.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},b.prototype.hide=function(){function b(){"in"!=c.hoverState&&d.detach(),c.$element.trigger("hidden.bs."+c.type)}var c=this,d=this.tip(),e=a.Event("hide.bs."+this.type);return this.$element.trigger(e),e.isDefaultPrevented()?void 0:(d.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,b).emulateTransitionEnd(150):b(),this.hoverState=null,this)},b.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},b.prototype.hasContent=function(){return this.getTitle()},b.prototype.getPosition=function(){var b=this.$element[0];return a.extend({},"function"==typeof b.getBoundingClientRect?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},b.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},b.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},b.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},b.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},b.prototype.enable=function(){this.enabled=!0},b.prototype.disable=function(){this.enabled=!1},b.prototype.toggleEnabled=function(){this.enabled=!this.enabled},b.prototype.toggle=function(b){var c=b?a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;c.tip().hasClass("in")?c.leave(c):c.enter(c)},b.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof c&&c;(e||"destroy"!=c)&&(e||d.data("bs.tooltip",e=new b(this,f)),"string"==typeof c&&e[c]())})},a.fn.tooltip.Constructor=b,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(jQuery),+function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");b.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),b.prototype.constructor=b,b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content")[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},b.prototype.hasContent=function(){return this.getTitle()||this.getContent()},b.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},b.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var c=a.fn.popover;a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof c&&c;(e||"destroy"!=c)&&(e||d.data("bs.popover",e=new b(this,f)),"string"==typeof c&&e[c]())})},a.fn.popover.Constructor=b,a.fn.popover.noConflict=function(){return a.fn.popover=c,this}}(jQuery),+function(a){"use strict";function b(c,d){var e,f=a.proxy(this.process,this);this.$element=a(a(c).is("body")?window:c),this.$body=a("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",f),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||(e=a(c).attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=a([]),this.targets=a([]),this.activeTarget=null,this.refresh(),this.process()}b.DEFAULTS={offset:10},b.prototype.refresh=function(){var b=this.$element[0]==window?"offset":"position";this.offsets=a([]),this.targets=a([]);{var c=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[b]().top+(!a.isWindow(c.$scrollElement.get(0))&&c.$scrollElement.scrollTop()),e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){c.offsets.push(this[0]),c.targets.push(this[1])})}},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,d=c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(b>=d)return g!=(a=f.last()[0])&&this.activate(a);if(g&&b<=e[0])return g!=(a=f[0])&&this.activate(a);for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parentsUntil(this.options.target,".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")};var c=a.fn.scrollspy;a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=c,this},a(window).on("load",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(jQuery),+function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});if(b.trigger(f),!f.isDefaultPrevented()){var g=a(d);this.activate(b.parent("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})}}},b.prototype.activate=function(b,c,d){function e(){f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),g?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var f=c.find("> .active"),g=d&&a.support.transition&&f.hasClass("fade");g?f.one(a.support.transition.end,e).emulateTransitionEnd(150):e(),f.removeClass("in")};var c=a.fn.tab;a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new b(this)),"string"==typeof c&&e[c]()})},a.fn.tab.Constructor=b,a.fn.tab.noConflict=function(){return a.fn.tab=c,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})}(jQuery),+function(a){"use strict";var b=function(c,d){this.options=a.extend({},b.DEFAULTS,d),this.$window=a(window).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(c),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};b.RESET="affix affix-top affix-bottom",b.DEFAULTS={offset:0},b.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(b.RESET).addClass("affix");var a=this.$window.scrollTop(),c=this.$element.offset();return this.pinnedOffset=c.top-a},b.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},b.prototype.checkPosition=function(){if(this.$element.is(":visible")){var c=a(document).height(),d=this.$window.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;"top"==this.affixed&&(e.top+=d),"object"!=typeof f&&(h=g=f),"function"==typeof g&&(g=f.top(this.$element)),"function"==typeof h&&(h=f.bottom(this.$element));var i=null!=this.unpin&&d+this.unpin<=e.top?!1:null!=h&&e.top+this.$element.height()>=c-h?"bottom":null!=g&&g>=d?"top":!1;if(this.affixed!==i){this.unpin&&this.$element.css("top","");var j="affix"+(i?"-"+i:""),k=a.Event(j+".bs.affix");this.$element.trigger(k),k.isDefaultPrevented()||(this.affixed=i,this.unpin="bottom"==i?this.getPinnedOffset():null,this.$element.removeClass(b.RESET).addClass(j).trigger(a.Event(j.replace("affix","affixed"))),"bottom"==i&&this.$element.offset({top:c-h-this.$element.height()}))}}};var c=a.fn.affix;a.fn.affix=function(c){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof c&&c;e||d.data("bs.affix",e=new b(this,f)),"string"==typeof c&&e[c]()})},a.fn.affix.Constructor=b,a.fn.affix.noConflict=function(){return a.fn.affix=c,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var b=a(this),c=b.data();c.offset=c.offset||{},c.offsetBottom&&(c.offset.bottom=c.offsetBottom),c.offsetTop&&(c.offset.top=c.offsetTop),b.affix(c)})})}(jQuery);;/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
;/*
 @preserve Leaflet Data Visualization Framework, a JavaScript library for creating thematic maps using Leaflet
 (c) 2013-2014, Scott Fairgrieve, HumanGeo
*/
L.LinearFunction = L.Class.extend({
    initialize: function(minPoint, maxPoint, options) {
        this.setOptions(options);
        this.setRange(minPoint, maxPoint);
    },
    _calculateParameters: function(minPoint, maxPoint) {
        if (this._xRange === 0) {
            this._slope = 0;
            this._b = minPoint.y;
        } else {
            this._slope = (maxPoint.y - minPoint.y) / this._xRange;
            this._b = minPoint.y - this._slope * minPoint.x;
        }
    },
    _arrayToPoint: function(array) {
        return {
            x: array[0],
            y: array[1]
        };
    },
    setOptions: function(options) {
        L.Util.setOptions(this, options);
        this._preProcess = this.options.preProcess;
        this._postProcess = this.options.postProcess;
    },
    getBounds: function() {
        var minX = Math.min(this._minPoint.x, this._maxPoint.x);
        var maxX = Math.max(this._minPoint.x, this._maxPoint.x);
        var minY = Math.min(this._minPoint.y, this._maxPoint.y);
        var maxY = Math.max(this._minPoint.y, this._maxPoint.y);
        return [ new L.Point(minX, minY), new L.Point(maxX, maxY) ];
    },
    setRange: function(minPoint, maxPoint) {
        minPoint = minPoint instanceof Array ? this._arrayToPoint(minPoint) : minPoint;
        maxPoint = maxPoint instanceof Array ? this._arrayToPoint(maxPoint) : maxPoint;
        this._minPoint = minPoint;
        this._maxPoint = maxPoint;
        this._xRange = maxPoint.x - minPoint.x;
        this._calculateParameters(minPoint, maxPoint);
        return this;
    },
    setMin: function(point) {
        this.setRange(point, this._maxPoint);
        return this;
    },
    setMax: function(point) {
        this.setRange(this._minPoint, point);
        return this;
    },
    setPreProcess: function(preProcess) {
        this._preProcess = preProcess;
        return this;
    },
    setPostProcess: function(postProcess) {
        this._postProcess = postProcess;
        return this;
    },
    evaluate: function(x) {
        var y;
        if (this._preProcess) {
            x = this._preProcess(x);
        }
        y = Number((this._slope * x).toFixed(6)) + Number(this._b.toFixed(6));
        if (this._postProcess) {
            y = this._postProcess(y);
        }
        return y;
    },
    random: function() {
        var randomX = Math.random() * this._xRange + this._minPoint.x;
        return this.evaluate(randomX);
    },
    sample: function(count) {
        count = Math.max(count, 2);
        var segmentCount = count - 1;
        var segmentSize = this._xRange / segmentCount;
        var x = this._minPoint.x;
        var yValues = [];
        while (x <= this._maxPoint.x) {
            yValues.push(this.evaluate(x));
            x += segmentSize;
        }
        return yValues;
    },
    samplePoints: function(count) {
        count = Math.max(count, 2);
        var segmentCount = count - 1;
        var segmentSize = this._xRange / segmentCount;
        var x = this._minPoint.x;
        var points = [];
        while (x <= this._maxPoint.x) {
            points.push(new L.Point(x, this.evaluate(x)));
            x += segmentSize;
        }
        return points;
    },
    getIntersectionPoint: function(otherFunction) {
        var point = null;
        if (this._slope !== otherFunction._slope) {
            var x = (this._b - otherFunction._b) / (otherFunction._slope - this._slope);
            var y = this.evaluate(x);
            point = new L.Point(x, y);
        }
        return point;
    }
});

L.ColorFunction = L.LinearFunction.extend({
    options: {
        alpha: 1,
        includeAlpha: false
    },
    initialize: function(minPoint, maxPoint, options) {
        L.Util.setOptions(this, options);
        this._parts = [];
        this._dynamicPart = null;
        this._outputPrecision = 0;
        this._prefix = null;
        this._formatOutput = function(y) {
            return y.toFixed(this._outputPrecision);
        }, this._mapOutput = function(parts) {
            var outputParts = [];
            for (var i = 0; i < this._parts.length; ++i) {
                var part = this._parts[i];
                outputParts.push(parts[part]);
            }
            if (this.options.includeAlpha) {
                outputParts.push(this.options.alpha);
            }
            return outputParts;
        };
        this._getColorString = function(y) {
            y = this._formatOutput(y);
            this.options[this._dynamicPart] = y;
            var parts = this._mapOutput(this.options);
            return this._writeColor(this._prefix, parts);
        };
        this._writeColor = function(prefix, parts) {
            if (this.options.includeAlpha) {
                prefix += "a";
            }
            return prefix + "(" + parts.join(",") + ")";
        };
        options = this.options;
        var postProcess = function(y) {
            if (options && options.postProcess) {
                y = options.postProcess.call(this, y);
            }
            var colorString = this._getColorString(y);
            if (L.Browser.ie && colorString.indexOf("hsl") > -1 || options.rgb) {
                colorString = L.hslColor(colorString).toRGBString();
            }
            return colorString;
        };
        L.LinearFunction.prototype.initialize.call(this, minPoint, maxPoint, {
            preProcess: this.options.preProcess,
            postProcess: postProcess
        });
    }
});

L.HSLColorFunction = L.ColorFunction.extend({
    initialize: function(minPoint, maxPoint, options) {
        L.ColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._parts = [ "outputHue", "outputSaturation", "outputLuminosity" ];
        this._prefix = "hsl";
        this._outputPrecision = 2;
    }
});

L.RGBColorFunction = L.ColorFunction.extend({
    initialize: function(minPoint, maxPoint, options) {
        L.ColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._parts = [ "outputRed", "outputBlue", "outputGreen" ];
        this._prefix = "rgb";
        this._outputPrecision = 0;
    }
});

L.RGBRedFunction = L.LinearFunction.extend({
    options: {
        outputGreen: 0,
        outputBlue: 0
    },
    initialize: function(minPoint, maxPoint, options) {
        L.RGBColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._dynamicPart = "outputRed";
    }
});

L.RGBBlueFunction = L.LinearFunction.extend({
    options: {
        outputRed: 0,
        outputGreen: 0
    },
    initialize: function(minPoint, maxPoint, options) {
        L.RGBColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._dynamicPart = "outputBlue";
    }
});

L.RGBGreenFunction = L.LinearFunction.extend({
    options: {
        outputRed: 0,
        outputBlue: 0
    },
    initialize: function(minPoint, maxPoint, options) {
        L.RGBColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._dynamicPart = "outputGreen";
    }
});

L.RGBColorBlendFunction = L.LinearFunction.extend({
    initialize: function(minX, maxX, rgbMinColor, rgbMaxColor) {
        rgbMinColor = new L.RGBColor(rgbMinColor);
        rgbMaxColor = new L.RGBColor(rgbMaxColor);
        var red1 = rgbMinColor.r();
        var red2 = rgbMaxColor.r();
        var green1 = rgbMinColor.g();
        var green2 = rgbMaxColor.g();
        var blue1 = rgbMinColor.b();
        var blue2 = rgbMaxColor.b();
        this._minX = minX;
        this._maxX = maxX;
        this._redFunction = new L.LinearFunction(new L.Point(minX, red1), new L.Point(maxX, red2));
        this._greenFunction = new L.LinearFunction(new L.Point(minX, green1), new L.Point(maxX, green2));
        this._blueFunction = new L.LinearFunction(new L.Point(minX, blue1), new L.Point(maxX, blue2));
    },
    getBounds: function() {
        var redBounds = this._redFunction.getBounds();
        var greenBounds = this._greenFunction.getBounds();
        var blueBounds = this._blueFunction.getBounds();
        var minY = Math.min(redBounds[0].y, greenBounds[0].y, blueBounds[0].y);
        var maxY = Math.max(redBounds[0].y, greenBounds[0].y, blueBounds[0].y);
        return [ new L.Point(redBounds[0].x, minY), new L.Point(redBounds[1].x, maxY) ];
    },
    evaluate: function(x) {
        return new L.RGBColor([ this._redFunction.evaluate(x), this._greenFunction.evaluate(x), this._blueFunction.evaluate(x) ]).toRGBString();
    }
});

L.HSLHueFunction = L.HSLColorFunction.extend({
    options: {
        outputSaturation: "100%",
        outputLuminosity: "50%"
    },
    initialize: function(minPoint, maxPoint, options) {
        L.HSLColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._dynamicPart = "outputHue";
    }
});

L.HSLSaturationFunction = L.LinearFunction.extend({
    options: {
        outputHue: 0,
        outputLuminosity: "50%"
    },
    initialize: function(minPoint, maxPoint, options) {
        L.HSLColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._formatOutput = function(y) {
            return (y * 100).toFixed(this._outputPrecision) + "%";
        };
        this._dynamicPart = "outputSaturation";
    }
});

L.HSLLuminosityFunction = L.LinearFunction.extend({
    options: {
        outputHue: 0,
        outputSaturation: "100%"
    },
    initialize: function(minPoint, maxPoint, options) {
        L.HSLColorFunction.prototype.initialize.call(this, minPoint, maxPoint, options);
        this._formatOutput = function(y) {
            return (y * 100).toFixed(this._outputPrecision) + "%";
        };
        this._dynamicPart = "outputLuminosity";
    }
});

L.HSLColorBlendFunction = L.LinearFunction.extend({
    initialize: function(minX, maxX, hslMinColor, hslMaxColor) {
        hslMinColor = new L.HSLColor(hslMinColor);
        hslMaxColor = new L.HSLColor(hslMaxColor);
        var h1 = hslMinColor.h();
        var h2 = hslMaxColor.h();
        var s1 = hslMinColor.s();
        var s2 = hslMaxColor.s();
        var l1 = hslMinColor.l();
        var l2 = hslMaxColor.l();
        this._minX = minX;
        this._maxX = maxX;
        this._hueFunction = new L.LinearFunction(new L.Point(minX, h1), new L.Point(maxX, h2));
        this._saturationFunction = new L.LinearFunction(new L.Point(minX, s1), new L.Point(maxX, s2));
        this._luminosityFunction = new L.LinearFunction(new L.Point(minX, l1), new L.Point(maxX, l2));
    },
    getBounds: function() {
        var hBounds = this._hueFunction.getBounds();
        var sBounds = this._saturationFunction.getBounds();
        var lBounds = this._luminosityFunction.getBounds();
        var minY = Math.min(hBounds[0].y, sBounds[0].y, lBounds[0].y);
        var maxY = Math.max(hBounds[0].y, sBounds[0].y, lBounds[0].y);
        return [ new L.Point(hBounds[0].x, minY), new L.Point(hBounds[1].x, maxY) ];
    },
    evaluate: function(x) {
        return new L.HSLColor([ this._hueFunction.evaluate(x), this._saturationFunction.evaluate(x), this._luminosityFunction.evaluate(x) ]).toHSLString();
    }
});

L.PiecewiseFunction = L.LinearFunction.extend({
    initialize: function(functions, options) {
        L.Util.setOptions(this, options);
        this._functions = functions;
        var startPoint;
        var endPoint;
        startPoint = functions[0].getBounds()[0];
        endPoint = functions[functions.length - 1].getBounds()[1];
        L.LinearFunction.prototype.initialize.call(this, startPoint, endPoint, {
            preProcess: this.options.preProcess,
            postProcess: this.options.postProcess
        });
    },
    _getFunction: function(x) {
        var bounds;
        var startPoint;
        var endPoint;
        var found = false;
        var currentFunction;
        for (var index = 0; index < this._functions.length; ++index) {
            currentFunction = this._functions[index];
            bounds = currentFunction.getBounds();
            startPoint = bounds[0];
            endPoint = bounds[1];
            if (x >= startPoint.x && x < endPoint.x) {
                found = true;
                break;
            }
        }
        return found ? currentFunction : this._functions[this._functions.length - 1];
    },
    evaluate: function(x) {
        var currentFunction;
        var y = null;
        if (this._preProcess) {
            x = this._preProcess(x);
        }
        currentFunction = this._getFunction(x);
        if (currentFunction) {
            y = currentFunction.evaluate(x);
            if (this._postProcess) {
                y = this._postProcess(y);
            }
        }
        return y;
    }
});

L.CustomColorFunction = L.PiecewiseFunction.extend({
    options: {
        interpolate: true
    },
    initialize: function(minX, maxX, colors, options) {
        var range = maxX - minX;
        var xRange = range / (colors.length - 1);
        var functions = [];
        var colorFunction;
        L.Util.setOptions(this, options);
        for (var i = 0; i < colors.length; ++i) {
            var next = Math.min(i + 1, colors.length - 1);
            colorFunction = this.options.interpolate ? new L.RGBColorBlendFunction(minX + xRange * i, minX + xRange * next, colors[i], colors[next]) : new L.RGBColorBlendFunction(minX + xRange * i, minX + xRange * next, colors[i], colors[i]);
            functions.push(colorFunction);
        }
        L.PiecewiseFunction.prototype.initialize.call(this, functions);
    }
});

L.CategoryFunction = L.Class.extend({
    initialize: function(categoryMap, options) {
        L.Util.setOptions(this, options);
        this._categoryKeys = Object.keys(categoryMap);
        this._categoryMap = categoryMap;
        this._preProcess = this.options.preProcess;
        this._postProcess = this.options.postProcess;
    },
    evaluate: function(x) {
        var y;
        if (this._preProcess) {
            x = this._preProcess(x);
        }
        y = this._categoryMap[x];
        if (this._postProcess) {
            y = this._postProcess(y);
        }
        return y;
    },
    getCategories: function() {
        return this._categoryKeys;
    }
});

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = start || 0, j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}

if (!Object.keys) {
    Object.keys = function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !{
            toString: null
        }.propertyIsEnumerable("toString"), dontEnums = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ], dontEnumsLength = dontEnums.length;
        return function(obj) {
            var result, prop, i;
            if (typeof obj !== "object" && typeof obj !== "function" || obj === null) {
                throw new TypeError("Object.keys called on non-object");
            }
            result = [];
            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }
            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }();
}

L.Util.guid = function() {
    var s4 = function() {
        return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
};

L.Util.getProperty = function(obj, property, defaultValue) {
    return property in obj ? obj[property] : defaultValue;
};

L.Util.setFieldValue = function(record, fieldName, value) {
    var keyParts = fieldName.split(".");
    var pointer = record;
    var part;
    for (var i = 0; i < keyParts.length - 1; ++i) {
        part = keyParts[i];
        pointer[part] = pointer[part] || {};
        pointer = pointer[part];
    }
    pointer[keyParts[keyParts.length - 1]] = value;
};

L.Util.getFieldValue = function(record, fieldName) {
    var value = null;
    if (fieldName) {
        var parts = fieldName.split(".");
        var valueField = record;
        var part;
        var searchParts;
        var searchKey;
        var searchValue;
        var testObject;
        var searchPart;
        var bracketIndex = -1;
        var testValue;
        for (var partIndex = 0; partIndex < parts.length; ++partIndex) {
            part = parts[partIndex];
            bracketIndex = part.indexOf("[");
            if (bracketIndex > -1) {
                searchPart = part.substring(bracketIndex);
                part = part.substring(0, bracketIndex);
                searchPart = searchPart.replace("[", "").replace("]", "");
                searchParts = searchPart.split("=");
                searchKey = searchParts[0];
                searchValue = searchParts[1];
                valueField = valueField[part];
                for (var valueIndex = 0; valueIndex < valueField.length; ++valueIndex) {
                    testObject = valueField[valueIndex];
                    testValue = testObject[searchKey];
                    if (testValue && testValue === searchValue) {
                        valueField = testObject;
                    }
                }
            } else if (valueField && valueField.hasOwnProperty(part)) {
                valueField = valueField[part];
            } else {
                valueField = null;
                break;
            }
        }
        value = valueField;
    } else {
        value = record;
    }
    return value;
};

L.Util.getNumericRange = function(records, fieldName) {
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    for (var index in records) {
        if (records.hasOwnProperty(index)) {
            var record = records[index];
            var value = L.Util.getFieldValue(record, fieldName);
            min = Math.min(min, value);
            max = Math.max(max, value);
        }
    }
    return [ min, max ];
};

L.Util.pointToGeoJSON = function() {
    var feature = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [ this._latlng[1], this._latlng[0] ]
        },
        properties: {}
    };
    for (var key in this.options) {
        if (this.options.hasOwnProperty(key)) {
            var value = this.options[key];
            if (typeof value !== "function") {
                feature.properties[key] = value;
            }
        }
    }
    return feature;
};

L.Util.updateLayer = function(layer, updateFunction) {
    if (layer.eachLayer && !layer instanceof L.FeatureGroup) {
        layer.eachLayer(function(layer) {
            L.Util.updateLayer(layer, updateFunction);
        });
    } else {
        updateFunction.call(this, layer);
    }
};

L.CategoryLegend = L.Class.extend({
    initialize: function(options) {
        L.Util.setOptions(this, options);
    },
    generate: function(options) {
        options = options || {};
        var container = document.createElement("div");
        var legend = L.DomUtil.create("div", "legend", container);
        var className = options.className;
        var legendOptions = this.options;
        if (className) {
            L.DomUtil.addClass(legend, className);
        }
        if (options.title) {
            L.DomUtil.create("div", "legend-title", legend).innerHTML = options.title;
        }
        for (var key in legendOptions) {
            categoryOptions = legendOptions[key];
            var displayName = categoryOptions.displayName || key;
            var legendElement = L.DomUtil.create("div", "data-layer-legend", legend);
            var legendBox = L.DomUtil.create("div", "legend-box", legendElement);
            L.DomUtil.create("div", "key", legendElement).innerHTML = displayName;
            L.StyleConverter.applySVGStyle(legendBox, categoryOptions);
        }
        return container.innerHTML;
    }
});

L.LegendIcon = L.DivIcon.extend({
    initialize: function(fields, layerOptions, options) {
        var container = document.createElement("div");
        var legendContent = L.DomUtil.create("div", "legend", container);
        var legendTitle = L.DomUtil.create("div", "title", legendContent);
        var legendBox = L.DomUtil.create("div", "legend-box", legendContent);
        var legendValues = L.DomUtil.create("div", "legend-values", legendContent);
        var field;
        var title = layerOptions.title || layerOptions.name;
        if (title) {
            legendTitle.innerHTML = title;
        }
        for (var key in fields) {
            field = fields[key];
            L.DomUtil.create("div", "key", legendValues).innerHTML = field.name || key;
            L.DomUtil.create("div", "value", legendValues).innerHTML = field.value;
        }
        L.StyleConverter.applySVGStyle(legendBox, layerOptions);
        legendBox.style.height = "5px";
        options.html = container.innerHTML;
        options.className = options.className || "legend-icon";
        L.DivIcon.prototype.initialize.call(this, options);
    }
});

L.legendIcon = function(fields, layerOptions, options) {
    return new L.LegendIcon(fields, layerOptions, options);
};

L.GeometryUtils = {
    getName: function(geoJSON) {
        var name = null;
        if (geoJSON && geoJSON.features) {
            for (var index = 0; index < geoJSON.features.length; ++index) {
                var feature = geoJSON.features[index];
                if (feature.properties && feature.properties.name) {
                    name = feature.properties.name;
                    break;
                }
            }
        }
        return name;
    },
    getGeoJSONLocation: function(geoJSON, record, locationTextField, recordToLayer) {
        var geoJSONLayer = new L.GeoJSON(geoJSON, {
            pointToLayer: function(feature, latlng) {
                var location = {
                    location: latlng,
                    text: locationTextField ? L.Util.getFieldValue(record, locationTextField) : [ latlng.lat.toFixed(3), latlng.lng.toFixed(3) ].join(", "),
                    center: latlng
                };
                return recordToLayer(location, record);
            }
        });
        var center = null;
        try {
            center = L.GeometryUtils.loadCentroid(geoJSON);
        } catch (ex) {
            console.log("Error loading centroid for " + JSON.stringify(geoJSON));
        }
        return {
            location: geoJSONLayer,
            text: locationTextField ? L.Util.getFieldValue(record, locationTextField) : null,
            center: center
        };
    },
    mergeProperties: function(properties, featureCollection, mergeKey) {
        var features = featureCollection["features"];
        var featureIndex = L.GeometryUtils.indexFeatureCollection(features, mergeKey);
        var property;
        var mergeValue;
        var newFeatureCollection = {
            type: "FeatureCollection",
            features: []
        };
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                property = properties[key];
                mergeValue = property[mergeKey];
                if (mergeValue) {
                    var feature = featureIndex[mergeValue];
                    for (var prop in property) {
                        feature.properties[prop] = property[prop];
                    }
                    newFeatureCollection.features.push(feature);
                }
            }
        }
        return newFeatureCollection;
    },
    indexFeatureCollection: function(featureCollection, indexKey) {
        var features = featureCollection.features;
        var feature;
        var properties;
        var featureIndex = {};
        var value;
        for (var index = 0; index < features.length; ++index) {
            feature = features[index];
            properties = feature.properties;
            value = properties[indexKey];
            if (value in featureIndex) {
                var existingFeature = featureIndex[value];
                if (existingFeature.geometry.type !== "GeometryCollection") {
                    featureIndex[value] = {
                        type: "Feature",
                        geometry: {
                            type: "GeometryCollection",
                            geometries: [ feature.geometry, existingFeature.geometry ]
                        }
                    };
                } else {
                    existingFeature.geometry.geometries.push(feature.geometry);
                }
            } else {
                featureIndex[value] = feature;
            }
        }
        return featureIndex;
    },
    arrayToMap: function(array, fromKey, toKey) {
        var map = {};
        var item;
        var from;
        var to;
        for (var index = 0; index < array.length; ++index) {
            item = array[index];
            from = item[fromKey];
            to = toKey ? item[toKey] : item;
            map[from] = to;
        }
        return map;
    },
    arrayToMaps: function(array, mapLinks) {
        var map;
        var item;
        var from;
        var to;
        var maps = [];
        var mapLink;
        var fromKey;
        var toKey;
        for (var i = 0; i < mapLinks.length; ++i) {
            maps.push({});
        }
        for (var index = 0; index < array.length; ++index) {
            item = array[index];
            for (var keyIndex = 0; keyIndex < mapLinks.length; ++keyIndex) {
                map = maps[keyIndex];
                mapLink = mapLinks[keyIndex];
                fromKey = mapLink.from;
                toKey = mapLink.to;
                from = item[fromKey];
                to = toKey ? item[toKey] : item;
                map[from] = to;
            }
        }
        return maps;
    },
    loadCentroid: function(feature) {
        var centroidLatLng = null;
        var centroid;
        var x, y;
        if (feature.geometry && feature.geometry.type === "Point") {
            centroidLatLng = new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        } else if (typeof jsts !== "undefined") {
            var parser = new jsts.io.GeoJSONParser();
            var jstsFeature = parser.read(feature);
            if (jstsFeature.getCentroid) {
                centroid = jstsFeature.getCentroid();
                x = centroid.coordinate.x;
                y = centroid.coordinate.y;
            } else if (jstsFeature.features) {
                var totalCentroidX = 0;
                var totalCentroidY = 0;
                for (var i = 0; i < jstsFeature.features.length; ++i) {
                    centroid = jstsFeature.features[i].geometry.getCentroid();
                    totalCentroidX += centroid.coordinate.x;
                    totalCentroidY += centroid.coordinate.y;
                }
                x = totalCentroidX / jstsFeature.features.length;
                y = totalCentroidY / jstsFeature.features.length;
            } else {
                centroid = jstsFeature.geometry.getCentroid();
                x = centroid.coordinate.x;
                y = centroid.coordinate.y;
            }
            centroidLatLng = new L.LatLng(y, x);
        }
        return centroidLatLng;
    },
    loadCentroids: function(dictionary) {
        var centroids = {};
        var feature;
        for (var key in dictionary) {
            feature = dictionary[key];
            centroids[key] = L.GeometryUtils.loadCentroid(feature);
        }
        return centroids;
    }
};

L.SVGPathBuilder = L.Class.extend({
    initialize: function(points, innerPoints, options) {
        this._points = points || [];
        this._innerPoints = innerPoints || [];
        L.Util.setOptions(this, options);
    },
    options: {
        closePath: true
    },
    _getPathString: function(points, digits) {
        var pathString = "";
        if (points.length > 0) {
            var point = points[0];
            var digits = digits !== null ? digits : 2;
            var startChar = "M";
            var lineToChar = "L";
            var closePath = "Z";
            if (L.Browser.vml) {
                digits = 0;
                startChar = "m";
                lineToChar = "l";
                closePath = "xe";
            }
            pathString = startChar + point.x.toFixed(digits) + "," + point.y.toFixed(digits);
            for (var index = 1; index < points.length; index++) {
                point = points[index];
                pathString += lineToChar + point.x.toFixed(digits) + "," + point.y.toFixed(digits);
            }
            if (this.options.closePath) {
                pathString += closePath;
            }
        }
        return pathString;
    },
    addPoint: function(point, inner) {
        inner ? this._innerPoints.push(point) : this._points.push(point);
    },
    build: function(digits) {
        digits = digits || this.options.digits;
        var pathString = this._getPathString(this._points, digits);
        if (this._innerPoints) {
            pathString += this._getPathString(this._innerPoints, digits);
        }
        return pathString;
    }
});

L.StyleConverter = {
    keyMap: {
        fillColor: {
            property: [ "background-color" ],
            valueFunction: function(value) {
                return value;
            }
        },
        color: {
            property: [ "color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color" ],
            valueFunction: function(value) {
                return value;
            }
        },
        weight: {
            property: [ "border-width" ],
            valueFunction: function(value) {
                return Math.ceil(value) + "px";
            }
        },
        stroke: {
            property: [ "border-style" ],
            valueFunction: function(value) {
                return value === true ? "solid" : "none";
            }
        },
        dashArray: {
            property: [ "border-style" ],
            valueFunction: function(value) {
                var style = "solid";
                if (value) {
                    style = "dashed";
                }
                return style;
            }
        },
        barThickness: {
            property: [ "height" ],
            valueFunction: function(value) {
                return value + "px";
            }
        },
        radius: {
            property: [ "height" ],
            valueFunction: function(value) {
                return 2 * value + "px";
            }
        },
        fillOpacity: {
            property: [ "opacity" ],
            valueFunction: function(value) {
                return value;
            }
        }
    },
    applySVGStyle: function(element, svgStyle, additionalKeys) {
        var keyMap = L.StyleConverter.keyMap;
        if (additionalKeys) {
            keyMap = L.Util.extend(keyMap, additionalKeys);
        }
        element.style.borderStyle = "solid";
        for (var property in svgStyle) {
            L.StyleConverter.setCSSProperty(element, property, svgStyle[property], keyMap);
        }
        return element;
    },
    setCSSProperty: function(element, key, value, keyMap) {
        var keyMap = keyMap || L.StyleConverter.keyMap;
        var cssProperty = keyMap[key];
        var cssText = "";
        if (cssProperty) {
            var propertyKey = cssProperty.property;
            for (var propertyIndex = 0, propertyLength = propertyKey.length; propertyIndex < propertyLength; ++propertyIndex) {
                cssText += propertyKey[propertyIndex] + ":" + cssProperty.valueFunction(value) + ";";
            }
        }
        element.style.cssText += cssText;
        return element;
    }
};

L.StylesBuilder = L.Class.extend({
    initialize: function(categories, styleFunctionMap) {
        this._categories = categories;
        this._styleFunctionMap = styleFunctionMap;
        this._buildStyles();
    },
    _buildStyles: function() {
        var map = {};
        var category;
        var styleFunction;
        var styleValue;
        for (var index = 0; index < this._categories.length; ++index) {
            category = this._categories[index];
            map[category] = {};
            for (var property in this._styleFunctionMap) {
                styleFunction = this._styleFunctionMap[property];
                styleValue = styleFunction.evaluate ? styleFunction.evaluate(index) : typeof styleFunction === "function" ? styleFunction(index) : styleFunction;
                map[category][property] = styleValue;
            }
        }
        this._styleMap = map;
    },
    getStyles: function() {
        return this._styleMap;
    }
});

L.PaletteBuilder = L.Class.extend({
    initialize: function(styleFunctionMap) {
        this._styleFunctionMap = styleFunctionMap;
    },
    generate: function(options) {
        options = options || {};
        var container = document.createElement("div");
        var paletteElement = L.DomUtil.create("div", "palette", container);
        var count = options.count || 10;
        var categories = function(count) {
            var categoryArray = [];
            for (var i = 0; i < count; ++i) {
                categoryArray.push(i);
            }
            return categoryArray;
        }(count);
        var styleBuilder = new L.StylesBuilder(categories, this._styleFunctionMap);
        var styles = styleBuilder.getStyles();
        if (options.className) {
            L.DomUtil.addClass(paletteElement, options.className);
        }
        for (var styleKey in styles) {
            var i = L.DomUtil.create("i", "palette-element", paletteElement);
            var style = styles[styleKey];
            L.StyleConverter.applySVGStyle(i, style);
        }
        return container.innerHTML;
    }
});

L.HTMLUtils = {
    buildTable: function(obj, className, ignoreFields) {
        className = className || "table table-condensed table-striped table-bordered";
        var table = L.DomUtil.create("table", className);
        var thead = L.DomUtil.create("thead", "", table);
        var tbody = L.DomUtil.create("tbody", "", table);
        thead.innerHTML = "<tr><th>Name</th><th>Value</th></tr>";
        ignoreFields = ignoreFields || [];
        function inArray(arrayObj, value) {
            for (var i = 0, l = arrayObj.length; i < l; i++) {
                if (arrayObj[i] === value) {
                    return true;
                }
            }
            return false;
        }
        for (var property in obj) {
            if (obj.hasOwnProperty(property) && !inArray(ignoreFields, property)) {
                var value = obj[property];
                if (typeof value === "object") {
                    var container = document.createElement("div");
                    container.appendChild(L.HTMLUtils.buildTable(value, ignoreFields));
                    value = container.innerHTML;
                }
                tbody.innerHTML += "<tr><td>" + property + "</td><td>" + value + "</td></tr>";
            }
        }
        return table;
    }
};

L.AnimationUtils = {
    animate: function(layer, from, to, options) {
        var delay = options.delay || 0;
        var frames = options.frames || 30;
        var duration = options.duration || 500;
        var linearFunctions = {};
        var easeFunction = options.easeFunction || function(step) {
            return step;
        };
        var complete = options.complete;
        var step = duration / frames;
        for (var key in from) {
            if (key != "color" && key != "fillColor" && to[key]) {
                linearFunctions[key] = new L.LinearFunction([ 0, from[key] ], [ frames - 1, to[key] ]);
            } else if (key == "color" || key == "fillColor") {
                linearFunctions[key] = new L.RGBColorBlendFunction(0, frames - 1, from[key], to[key]);
            }
        }
        var layerOptions = {};
        var frame = 0;
        var updateLayer = function() {
            for (var key in linearFunctions) {
                layerOptions[key] = linearFunctions[key].evaluate(frame);
            }
            layer.options = L.extend({}, layer.options, layerOptions);
            layer.setStyle(layer.options).redraw();
            frame++;
            step = easeFunction(step);
            if (frame < frames) {
                setTimeout(updateLayer, step);
            } else {
                complete();
            }
        };
        setTimeout(updateLayer, delay);
    }
};

L.Color = L.Class.extend({
    initialize: function(colorDef) {
        this._rgb = [ 0, 0, 0 ];
        this._hsl = [ 0, 1, .5 ];
        this._a = 1;
        if (colorDef) {
            this.parseColorDef(colorDef);
        }
    },
    parseColorDef: function(colorDef) {},
    rgbToHSL: function(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > .5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

              case g:
                h = (b - r) / d + 2;
                break;

              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
        }
        return [ h, s, l ];
    },
    hslToRGB: function(h, s, l) {
        var r, g, b;
        if (s == 0) {
            r = g = b = l;
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            var q = l < .5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [ Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255) ];
    },
    setRGB: function(r, g, b) {
        this._rgb = [ r, g, b ];
        this._hsl = this.rgbToHSL(r, g, b);
        return this;
    },
    setHSL: function(h, s, l) {
        this._hsl = [ h, s, l ];
        this._rgb = this.hslToRGB(h, s, l);
        return this;
    },
    toHSL: function() {
        return this._hsl;
    },
    toHSLString: function() {
        var prefix = "hsl";
        if (this._a < 1) {
            prefix += "a";
        }
        return prefix + "(" + (this._hsl[0] * 360).toFixed(1) + "," + (this._hsl[1] * 100).toFixed(0) + "%," + (this._hsl[2] * 100).toFixed(0) + "%)";
    },
    toRGB: function() {
        return this._rgb;
    },
    toRGBString: function() {
        var rgbString;
        if (this._a < 1) {
            rgbString = "rgba(" + this._rgb[0].toFixed(0) + "," + this._rgb[1].toFixed(0) + "," + this._rgb[2].toFixed(0) + "," + this._a.toFixed(1) + ")";
        } else {
            var parts = [ this._rgb[0].toString(16), this._rgb[1].toString(16), this._rgb[2].toString(16) ];
            for (var i = 0; i < parts.length; ++i) {
                if (parts[i].length === 1) {
                    parts[i] = "0" + parts[i];
                }
            }
            rgbString = "#" + parts.join("");
        }
        return rgbString;
    },
    r: function(newR) {
        if (!arguments.length) return this._rgb[0];
        return this.setRGB(newR, this._rgb[1], this._rgb[2]);
    },
    g: function(newG) {
        if (!arguments.length) return this._rgb[1];
        return this.setRGB(this._rgb[0], newG, this._rgb[2]);
    },
    b: function(newB) {
        if (!arguments.length) return this._rgb[2];
        return this.setRGB(this._rgb[0], this._rgb[1], newB);
    },
    h: function(newH) {
        if (!arguments.length) return this._hsl[0];
        return this.setHSL(newH, this._hsl[1], this._hsl[2]);
    },
    s: function(newS) {
        if (!arguments.length) return this._hsl[1];
        return this.setHSL(this._hsl[0], newS, this._hsl[2]);
    },
    l: function(newL) {
        if (!arguments.length) return this._hsl[2];
        return this.setHSL(this._hsl[0], this._hsl[1], newL);
    },
    a: function(newA) {
        if (!arguments.length) return this._a;
        this._a = newA;
        return this;
    }
});

L.RGBColor = L.Color.extend({
    initialize: function(colorDef) {
        L.Color.prototype.initialize.call(this, colorDef);
    },
    parseColorDef: function(colorDef) {
        var isArray = colorDef instanceof Array;
        var isHex = colorDef.indexOf("#") === 0;
        var parts = [];
        var r, g, b, a;
        if (isArray) {
            r = Math.floor(colorDef[0]);
            g = Math.floor(colorDef[1]);
            b = Math.floor(colorDef[2]);
            a = colorDef.length === 4 ? colorDef[3] : 1;
        } else if (isHex) {
            colorDef = colorDef.replace("#", "");
            r = parseInt(colorDef.substring(0, 2), 16);
            g = parseInt(colorDef.substring(2, 4), 16);
            b = parseInt(colorDef.substring(4, 6), 16);
            a = colorDef.length === 8 ? parseInt(colorDef.substring(6, 8), 16) : 1;
        } else {
            parts = colorDef.replace("rgb", "").replace("a", "").replace(/\s+/g, "").replace("(", "").replace(")", "").split(",");
            r = parseInt(parts[0]);
            g = parseInt(parts[1]);
            b = parseInt(parts[2]);
            a = parts.length === 4 ? parseInt(parts[3]) : 1;
        }
        this.setRGB(r, g, b);
        this._a = a;
    }
});

L.rgbColor = function(colorDef) {
    return new L.RGBColor(colorDef);
};

L.HSLColor = L.Color.extend({
    initialize: function(colorDef) {
        L.Color.prototype.initialize.call(this, colorDef);
    },
    parseColorDef: function(colorDef) {
        var isArray = colorDef instanceof Array;
        var h, s, l, a;
        if (isArray) {
            h = colorDef[0];
            s = colorDef[1];
            l = colorDef[2];
            a = colorDef.length === 4 ? colorDef[3] : 1;
        } else {
            var parts = colorDef.replace("hsl", "").replace("a", "").replace("(", "").replace(/\s+/g, "").replace(/%/g, "").replace(")", "").split(",");
            h = Number(parts[0]) / 360;
            s = Number(parts[1]) / 100;
            l = Number(parts[2]) / 100;
            a = parts.length === 4 ? parseInt(parts[3]) : 1;
        }
        this.setHSL(h, s, l);
        this._a = a;
    }
});

L.hslColor = function(colorDef) {
    return new L.HSLColor(colorDef);
};

L.Animation = L.Class.extend({
    initialize: function(easeFunction, animateFrame) {
        this._easeFunction = easeFunction;
        this._animateFrame = animateFrame;
    },
    run: function(el, options) {
        this.stop();
        this._el = el;
        this._inProgress = true;
        this._duration = options.duration || .25;
        this._animationOptions = options;
        this._startTime = +new Date();
        this.fire("start");
        this._animate();
    },
    stop: function() {
        if (!this._inProgress) {
            return;
        }
        this._step();
        this._complete();
    },
    _animate: function() {
        this._animId = L.Util.requestAnimFrame(this._animate, this);
        this._step();
    },
    _step: function() {
        var elapsed = +new Date() - this._startTime, duration = this._duration * 1e3;
        if (elapsed < duration) {
            this._runFrame(this._easeFunction(elapsed / duration));
        } else {
            this._runFrame(1);
            this._complete();
        }
    },
    _runFrame: function(progress) {
        this._animateFrame(progress);
        this.fire("step");
    },
    _complete: function() {
        L.Util.cancelAnimFrame(this._animId);
        this._inProgress = false;
        this.fire("end");
    }
});

L.ColorBrewer = {
    Sequential: {
        YlGn: {
            3: [ "#f7fcb9", "#addd8e", "#31a354" ],
            4: [ "#ffffcc", "#c2e699", "#78c679", "#238443" ],
            5: [ "#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837" ],
            6: [ "#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837" ],
            7: [ "#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32" ],
            8: [ "#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32" ],
            9: [ "#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529" ]
        },
        YlGnBu: {
            3: [ "#edf8b1", "#7fcdbb", "#2c7fb8" ],
            4: [ "#ffffcc", "#a1dab4", "#41b6c4", "#225ea8" ],
            5: [ "#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494" ],
            6: [ "#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494" ],
            7: [ "#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84" ],
            8: [ "#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84" ],
            9: [ "#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58" ]
        },
        GnBu: {
            3: [ "#e0f3db", "#a8ddb5", "#43a2ca" ],
            4: [ "#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe" ],
            5: [ "#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac" ],
            6: [ "#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac" ],
            7: [ "#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e" ],
            8: [ "#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e" ],
            9: [ "#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081" ]
        },
        BuGn: {
            3: [ "#e5f5f9", "#99d8c9", "#2ca25f" ],
            4: [ "#edf8fb", "#b2e2e2", "#66c2a4", "#238b45" ],
            5: [ "#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c" ],
            6: [ "#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#2ca25f", "#006d2c" ],
            7: [ "#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824" ],
            8: [ "#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824" ],
            9: [ "#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b" ]
        },
        PuBuGn: {
            3: [ "#ece2f0", "#a6bddb", "#1c9099" ],
            4: [ "#f6eff7", "#bdc9e1", "#67a9cf", "#02818a" ],
            5: [ "#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59" ],
            6: [ "#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#1c9099", "#016c59" ],
            7: [ "#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450" ],
            8: [ "#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450" ],
            9: [ "#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636" ]
        },
        PuBu: {
            3: [ "#ece7f2", "#a6bddb", "#2b8cbe" ],
            4: [ "#f1eef6", "#bdc9e1", "#74a9cf", "#0570b0" ],
            5: [ "#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d" ],
            6: [ "#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe", "#045a8d" ],
            7: [ "#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b" ],
            8: [ "#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b" ],
            9: [ "#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858" ]
        },
        BuPu: {
            3: [ "#e0ecf4", "#9ebcda", "#8856a7" ],
            4: [ "#edf8fb", "#b3cde3", "#8c96c6", "#88419d" ],
            5: [ "#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c" ],
            6: [ "#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8856a7", "#810f7c" ],
            7: [ "#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b" ],
            8: [ "#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b" ],
            9: [ "#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b" ]
        },
        RdPu: {
            3: [ "#fde0dd", "#fa9fb5", "#c51b8a" ],
            4: [ "#feebe2", "#fbb4b9", "#f768a1", "#ae017e" ],
            5: [ "#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177" ],
            6: [ "#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177" ],
            7: [ "#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177" ],
            8: [ "#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177" ],
            9: [ "#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a" ]
        },
        PuRd: {
            3: [ "#e7e1ef", "#c994c7", "#dd1c77" ],
            4: [ "#f1eef6", "#d7b5d8", "#df65b0", "#ce1256" ],
            5: [ "#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043" ],
            6: [ "#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#dd1c77", "#980043" ],
            7: [ "#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f" ],
            8: [ "#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f" ],
            9: [ "#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f" ]
        },
        OrRd: {
            3: [ "#fee8c8", "#fdbb84", "#e34a33" ],
            4: [ "#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f" ],
            5: [ "#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000" ],
            6: [ "#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000" ],
            7: [ "#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000" ],
            8: [ "#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000" ],
            9: [ "#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000" ]
        },
        YlOrRd: {
            3: [ "#ffeda0", "#feb24c", "#f03b20" ],
            4: [ "#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c" ],
            5: [ "#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026" ],
            6: [ "#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026" ],
            7: [ "#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026" ],
            8: [ "#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026" ],
            9: [ "#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026" ]
        },
        YlOrBr: {
            3: [ "#fff7bc", "#fec44f", "#d95f0e" ],
            4: [ "#ffffd4", "#fed98e", "#fe9929", "#cc4c02" ],
            5: [ "#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404" ],
            6: [ "#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404" ],
            7: [ "#ffffd4", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04" ],
            8: [ "#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04" ],
            9: [ "#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506" ]
        },
        Purples: {
            3: [ "#efedf5", "#bcbddc", "#756bb1" ],
            4: [ "#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3" ],
            5: [ "#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f" ],
            6: [ "#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f" ],
            7: [ "#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486" ],
            8: [ "#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486" ],
            9: [ "#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d" ]
        },
        Blues: {
            3: [ "#deebf7", "#9ecae1", "#3182bd" ],
            4: [ "#eff3ff", "#bdd7e7", "#6baed6", "#2171b5" ],
            5: [ "#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c" ],
            6: [ "#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c" ],
            7: [ "#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594" ],
            8: [ "#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594" ],
            9: [ "#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b" ]
        },
        Greens: {
            3: [ "#e5f5e0", "#a1d99b", "#31a354" ],
            4: [ "#edf8e9", "#bae4b3", "#74c476", "#238b45" ],
            5: [ "#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c" ],
            6: [ "#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c" ],
            7: [ "#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32" ],
            8: [ "#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32" ],
            9: [ "#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b" ]
        },
        Oranges: {
            3: [ "#fee6ce", "#fdae6b", "#e6550d" ],
            4: [ "#feedde", "#fdbe85", "#fd8d3c", "#d94701" ],
            5: [ "#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603" ],
            6: [ "#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603" ],
            7: [ "#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04" ],
            8: [ "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04" ],
            9: [ "#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704" ]
        },
        Reds: {
            3: [ "#fee0d2", "#fc9272", "#de2d26" ],
            4: [ "#fee5d9", "#fcae91", "#fb6a4a", "#cb181d" ],
            5: [ "#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15" ],
            6: [ "#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15" ],
            7: [ "#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d" ],
            8: [ "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d" ],
            9: [ "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d" ]
        },
        Greys: {
            3: [ "#f0f0f0", "#bdbdbd", "#636363" ],
            4: [ "#f7f7f7", "#cccccc", "#969696", "#525252" ],
            5: [ "#f7f7f7", "#cccccc", "#969696", "#636363", "#252525" ],
            6: [ "#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#636363", "#252525" ],
            7: [ "#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525" ],
            8: [ "#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525" ],
            9: [ "#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000" ]
        }
    },
    Diverging: {
        PuOr: {
            3: [ "#f1a340", "#f7f7f7", "#998ec3" ],
            4: [ "#e66101", "#fdb863", "#b2abd2", "#5e3c99" ],
            5: [ "#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99" ],
            6: [ "#b35806", "#f1a340", "#fee0b6", "#d8daeb", "#998ec3", "#542788" ],
            7: [ "#b35806", "#f1a340", "#fee0b6", "#f7f7f7", "#d8daeb", "#998ec3", "#542788" ],
            8: [ "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788" ],
            9: [ "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788" ],
            10: [ "#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b" ],
            11: [ "#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b" ]
        },
        BrBG: {
            3: [ "#d8b365", "#f5f5f5", "#5ab4ac" ],
            4: [ "#a6611a", "#dfc27d", "#80cdc1", "#018571" ],
            5: [ "#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571" ],
            6: [ "#8c510a", "#d8b365", "#f6e8c3", "#c7eae5", "#5ab4ac", "#01665e" ],
            7: [ "#8c510a", "#d8b365", "#f6e8c3", "#f5f5f5", "#c7eae5", "#5ab4ac", "#01665e" ],
            8: [ "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e" ],
            9: [ "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e" ],
            10: [ "#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30" ],
            11: [ "#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30" ]
        },
        PRGn: {
            3: [ "#af8dc3", "#f7f7f7", "#7fbf7b" ],
            4: [ "#7b3294", "#c2a5cf", "#a6dba0", "#008837" ],
            5: [ "#7b3294", "#c2a5cf", "#f7f7f7", "#a6dba0", "#008837" ],
            6: [ "#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837" ],
            7: [ "#762a83", "#af8dc3", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#7fbf7b", "#1b7837" ],
            8: [ "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837" ],
            9: [ "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837" ],
            10: [ "#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b" ],
            11: [ "#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b" ]
        },
        PiYG: {
            3: [ "#e9a3c9", "#f7f7f7", "#a1d76a" ],
            4: [ "#d01c8b", "#f1b6da", "#b8e186", "#4dac26" ],
            5: [ "#d01c8b", "#f1b6da", "#f7f7f7", "#b8e186", "#4dac26" ],
            6: [ "#c51b7d", "#e9a3c9", "#fde0ef", "#e6f5d0", "#a1d76a", "#4d9221" ],
            7: [ "#c51b7d", "#e9a3c9", "#fde0ef", "#f7f7f7", "#e6f5d0", "#a1d76a", "#4d9221" ],
            8: [ "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221" ],
            9: [ "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221" ],
            10: [ "#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419" ],
            11: [ "#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419" ]
        },
        RdBu: {
            3: [ "#ef8a62", "#f7f7f7", "#67a9cf" ],
            4: [ "#ca0020", "#f4a582", "#92c5de", "#0571b0" ],
            5: [ "#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0" ],
            6: [ "#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac" ],
            7: [ "#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac" ],
            8: [ "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac" ],
            9: [ "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac" ],
            10: [ "#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061" ],
            11: [ "#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061" ]
        },
        RdGy: {
            3: [ "#ef8a62", "#ffffff", "#999999" ],
            4: [ "#ca0020", "#f4a582", "#bababa", "#404040" ],
            5: [ "#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040" ],
            6: [ "#b2182b", "#ef8a62", "#fddbc7", "#e0e0e0", "#999999", "#4d4d4d" ],
            7: [ "#b2182b", "#ef8a62", "#fddbc7", "#ffffff", "#e0e0e0", "#999999", "#4d4d4d" ],
            8: [ "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d" ],
            9: [ "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d" ],
            10: [ "#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a" ],
            11: [ "#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a" ]
        },
        RdYlBu: {
            3: [ "#fc8d59", "#ffffbf", "#91bfdb" ],
            4: [ "#d7191c", "#fdae61", "#abd9e9", "#2c7bb6" ],
            5: [ "#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6" ],
            6: [ "#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4" ],
            7: [ "#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4" ],
            8: [ "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4" ],
            9: [ "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4" ],
            10: [ "#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695" ],
            11: [ "#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695" ]
        },
        Spectral: {
            3: [ "#fc8d59", "#ffffbf", "#99d594" ],
            4: [ "#d7191c", "#fdae61", "#abdda4", "#2b83ba" ],
            5: [ "#d7191c", "#fdae61", "#ffffbf", "#abdda4", "#2b83ba" ],
            6: [ "#d53e4f", "#fc8d59", "#fee08b", "#e6f598", "#99d594", "#3288bd" ],
            7: [ "#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd" ],
            8: [ "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd" ],
            9: [ "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd" ],
            10: [ "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2" ],
            11: [ "#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2" ]
        },
        RdYlGn: {
            3: [ "#fc8d59", "#ffffbf", "#91cf60" ],
            4: [ "#d7191c", "#fdae61", "#a6d96a", "#1a9641" ],
            5: [ "#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641" ],
            6: [ "#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850" ],
            7: [ "#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850" ],
            8: [ "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850" ],
            9: [ "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850" ],
            10: [ "#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837" ],
            11: [ "#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837" ]
        }
    },
    Qualitative: {
        Accent: {
            3: [ "#7fc97f", "#beaed4", "#fdc086" ],
            4: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99" ],
            5: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0" ],
            6: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f" ],
            7: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17" ],
            8: [ "#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666" ]
        },
        Dark2: {
            3: [ "#1b9e77", "#d95f02", "#7570b3" ],
            4: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a" ],
            5: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e" ],
            6: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02" ],
            7: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d" ],
            8: [ "#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666" ]
        },
        Paired: {
            3: [ "#a6cee3", "#1f78b4", "#b2df8a" ],
            4: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c" ],
            5: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99" ],
            6: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c" ],
            7: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f" ],
            8: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00" ],
            9: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6" ],
            10: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a" ],
            11: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99" ],
            12: [ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928" ]
        },
        Pastel1: {
            3: [ "#fbb4ae", "#b3cde3", "#ccebc5" ],
            4: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4" ],
            5: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6" ],
            6: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc" ],
            7: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd" ],
            8: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec" ],
            9: [ "#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2" ]
        },
        Pastel2: {
            3: [ "#b3e2cd", "#fdcdac", "#cbd5e8" ],
            4: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4" ],
            5: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9" ],
            6: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae" ],
            7: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc" ],
            8: [ "#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc" ]
        },
        Set1: {
            3: [ "#e41a1c", "#377eb8", "#4daf4a" ],
            4: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3" ],
            5: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00" ],
            6: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33" ],
            7: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628" ],
            8: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf" ],
            9: [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999" ]
        },
        Set2: {
            3: [ "#66c2a5", "#fc8d62", "#8da0cb" ],
            4: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3" ],
            5: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854" ],
            6: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f" ],
            7: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494" ],
            8: [ "#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3" ]
        },
        Set3: {
            3: [ "#8dd3c7", "#ffffb3", "#bebada" ],
            4: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072" ],
            5: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3" ],
            6: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462" ],
            7: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69" ],
            8: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5" ],
            9: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9" ],
            10: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd" ],
            11: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5" ],
            12: [ "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f" ]
        }
    }
};

L.Palettes = {
    huePalette: function(min, max, minH, maxH, options) {
        return new L.HSLHueFunction(new L.Point(min, minH), new L.Point(max, maxH), options);
    },
    luminosityPalette: function(min, max, minL, maxL, options) {
        return new L.HSLLuminosityFunction(new L.Point(min, minL), new L.Point(max, maxL), options);
    },
    saturationPalette: function(min, max, minS, maxS, options) {
        return new L.HSLSaturationFunction(new L.Point(min, minS), new L.Point(max, maxS), options);
    },
    rgbBlendPalette: function(min, max, minColor, maxColor, options) {
        return new L.RGBColorBlendFunction(min, max, minColor, maxColor, options);
    },
    hslBlendPalette: function(min, max, minColor, maxColor, options) {
        return new L.HSLColorBlendFunction(min, max, minColor, maxColor, options);
    },
    customColorPalette: function(min, max, colors, options) {
        return new L.CustomColorFunction(min, max, colors, options);
    }
};

L.DynamicColorPalettes = {
    rainbow: {
        text: "Rainbow",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 0, 300, options);
        }
    },
    greentored: {
        text: "Green - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 120, 0, options);
        }
    },
    yellowtored: {
        text: "Yellow - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 60, 0, options);
        }
    },
    orangetored: {
        text: "Orange - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 30, 0, options);
        }
    },
    redtopurple: {
        text: "Red - Purple",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 360, 270, options);
        }
    },
    bluetored: {
        text: "Blue - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 210, 360, options);
        }
    },
    bluetored2: {
        text: "Blue - Red 2",
        getPalette: function(min, max, options) {
            return L.Palettes.huePalette(min, max, 180, 0, options);
        }
    },
    whitetored: {
        text: "White - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 0
            }));
        }
    },
    whitetoorange: {
        text: "White - Orange",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 30
            }));
        }
    },
    whitetoyellow: {
        text: "White - Yellow",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 60
            }));
        }
    },
    whitetogreen: {
        text: "White - Green",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 120
            }));
        }
    },
    whitetoltblue: {
        text: "White - Lt. Blue",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 180
            }));
        }
    },
    whitetoblue: {
        text: "White - Blue",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 240
            }));
        }
    },
    whitetopurple: {
        text: "White - Purple",
        getPalette: function(min, max, options) {
            return L.Palettes.luminosityPalette(min, max, 1, .5, L.Util.extend(option, {
                outputHue: 270
            }));
        }
    },
    graytored: {
        text: "Gray - Red",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 0
            }));
        }
    },
    graytoorange: {
        text: "Gray - Orange",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 30
            }));
        }
    },
    graytoyellow: {
        text: "Gray - Yellow",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 60
            }));
        }
    },
    graytogreen: {
        text: "Gray - Green",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 120
            }));
        }
    },
    graytoltblue: {
        text: "Gray - Lt. Blue",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 180
            }));
        }
    },
    graytoblue: {
        text: "Gray - Blue",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 240
            }));
        }
    },
    graytopurple: {
        text: "Gray - Purple",
        getPalette: function(min, max, options) {
            return L.Palettes.saturationPalette(min, max, 0, 1, L.Util.extend(option, {
                outputHue: 270
            }));
        }
    }
};

L.DynamicPaletteElement = L.Class.extend({
    initialize: function(key, dynamicPalette) {
        this._key = key;
        this._dynamicPalette = dynamicPalette;
    },
    generate: function(options) {
        var paletteElement = L.DomUtil.create("div", "palette");
        var count = options.count;
        var palette = this._dynamicPalette.getPalette(0, count - 1);
        var width = options.width;
        var showText = true;
        if (options.showText != undefined) {
            showText = options.showText;
        }
        paletteElement.setAttribute("data-palette-key", this._key);
        if (this._dynamicPalette.text && showText) {
            L.DomUtil.create("div", "palette-text", paletteElement).innerHTML = '<i class="icon-ok hidden"></i>' + this._dynamicPalette.text;
        }
        var elementWidth = width / count;
        if (options.className) {
            L.DomUtil.addClass(paletteElement, options.className);
        }
        for (var i = 0; i < count; ++i) {
            var i = L.DomUtil.create("i", "palette-element");
            for (var styleKey in palette) {
                var styleValue = palette[styleKey];
                var style = styleValue.evaluate ? styleValue.evaluate(i) : styleValue;
                L.StyleConverter.setCSSProperty(i, styleKey, style);
            }
            i.style.width = elementWidth + "px";
            paletteElement.appendChild(i);
        }
        return paletteElement;
    }
});

L.RegularPolygon = L.Polygon.extend({
    statics: {
        R: 6378.137,
        M_PER_KM: 1e3
    },
    initialize: function(centerLatLng, options) {
        this._centerLatLng = centerLatLng;
        L.Util.setOptions(this, options);
        L.Polygon.prototype.initialize.call(this, this._getLatLngs(), options);
    },
    options: {
        fill: true,
        radius: 1e3,
        numberOfSides: 4,
        rotation: 0,
        maxDegrees: 360
    },
    getLatLng: function() {
        return this._centerLatLng;
    },
    setRadius: function(radius) {
        this.options.radius = radius;
        this._latlngs = this._getLatLngs();
        this.redraw();
    },
    _getLatLngs: function() {
        var maxDegrees = this.options.maxDegrees || 360;
        var angleSize = maxDegrees / Math.max(this.options.numberOfSides, 3);
        var degrees = maxDegrees + this.options.rotation;
        var angle = this.options.rotation;
        var latlngs = [];
        var newLatLng;
        while (angle < degrees) {
            newLatLng = this._getPoint(angle);
            latlngs.push(newLatLng);
            angle += angleSize;
        }
        return latlngs;
    },
    _getPoint: function(angle) {
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        var toDeg = function(number) {
            return number * L.LatLng.RAD_TO_DEG;
        };
        var angleRadians = toRad(angle);
        var angularDistance = this.options.radius / L.RegularPolygon.M_PER_KM / L.RegularPolygon.R;
        var lat1 = toRad(this._centerLatLng.lat);
        var lon1 = toRad(this._centerLatLng.lng);
        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(angularDistance) + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(angleRadians));
        var lon2 = lon1 + Math.atan2(Math.sin(angleRadians) * Math.sin(angularDistance) * Math.cos(lat1), Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2));
        lat2 = toDeg(lat2);
        lon2 = toDeg(lon2);
        return new L.LatLng(lat2, lon2);
    },
    toGeoJSON: function() {
        var feature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [ [], [] ]
            },
            properties: this.options
        };
        for (var i = 0; i < this._latlngs.length; ++i) {
            var latlng = this._latlngs[i];
            feature.coordinates[0].push([ latlng[1], latlng[0] ]);
        }
        return feature;
    }
});

L.regularPolygon = function(centerLatLng, options) {
    return new L.RegularPolygon(centerLatLng, options);
};

L.Path.XLINK_NS = "http://www.w3.org/1999/xlink";

var TextFunctions = TextFunctions || {
    __updatePath: L.Path.prototype._updatePath,
    _updatePath: function() {
        this.__updatePath.call(this);
        if (this.options.text) {
            this._createText(this.options.text);
        }
    },
    _initText: function() {
        if (this.options.text) {
            this._createText(this.options.text);
        }
    },
    getTextAnchor: function() {
        if (this._point) {
            return this._point;
        }
    },
    setTextAnchor: function(anchorPoint) {
        if (this._text) {
            this._text.setAttribute("x", anchorPoint.x);
            this._text.setAttribute("y", anchorPoint.y);
        }
    },
    _createText: function(options) {
        if (this._text) {
            this._container.removeChild(this._text);
        }
        if (this._pathDef) {
            this._defs.removeChild(this._pathDef);
        }
        var setStyle = function(element, style) {
            var styleString = "";
            for (var key in style) {
                styleString += key + ": " + style[key] + ";";
            }
            element.setAttribute("style", styleString);
            return element;
        };
        var setAttr = function(element, attr) {
            for (var key in attr) {
                element.setAttribute(key, attr[key]);
            }
            return element;
        };
        this._text = this._createElement("text");
        var textNode = document.createTextNode(options.text);
        if (options.path) {
            var pathOptions = options.path;
            var pathID = L.Util.guid();
            var clonedPath = this._createElement("path");
            clonedPath.setAttribute("d", this._path.getAttribute("d"));
            clonedPath.setAttribute("id", pathID);
            if (!this._defs) {
                this._defs = this._createElement("defs");
                this._container.appendChild(this._defs);
            }
            this._defs.appendChild(clonedPath);
            this._pathDef = clonedPath;
            var textPath = this._createElement("textPath");
            if (pathOptions.startOffset) {
                textPath.setAttribute("startOffset", pathOptions.startOffset);
            }
            if (pathOptions.attr) {
                setAttr(textPath, pathOptions.attr);
            }
            if (pathOptions.style) {
                setStyle(textPath, pathOptions.style);
            }
            textPath.setAttributeNS(L.Path.XLINK_NS, "xlink:href", "#" + pathID);
            textPath.appendChild(textNode);
            this._text.appendChild(textPath);
        } else {
            this._text.appendChild(textNode);
            var anchorPoint = this.getTextAnchor();
            this.setTextAnchor(anchorPoint);
        }
        if (options.className) {
            this._text.setAttribute("class", options.className);
        } else {
            this._text.setAttribute("class", "leaflet-svg-text");
        }
        if (options.attr) {
            setAttr(this._text, options.attr);
        }
        if (options.style) {
            setStyle(this._text, options.style);
        }
        this._container.appendChild(this._text);
    }
};

var PathFunctions = PathFunctions || {
    __updateStyle: L.Path.prototype._updateStyle,
    _createDefs: function() {
        this._defs = this._createElement("defs");
        this._container.appendChild(this._defs);
    },
    _createGradient: function(options) {
        if (!this._defs) {
            this._createDefs();
        }
        if (this._gradient) {
            this._defs.removeChild(this._gradient);
        }
        options = options !== true ? L.extend({}, options) : {};
        var gradientGuid = L.Util.guid();
        this._gradientGuid = gradientGuid;
        var gradient;
        var gradientOptions;
        if (options.gradientType == "radial") {
            gradient = this._createElement("radialGradient");
            var gradientOptions = options.radial || {
                cx: "50%",
                cy: "50%",
                r: "50%",
                fx: "50%",
                fy: "50%"
            };
        } else {
            gradient = this._createElement("linearGradient");
            var vector = options.vector || [ [ "0%", "0%" ], [ "100%", "100%" ] ];
            var gradientOptions = {
                x1: vector[0][0],
                x2: vector[1][0],
                y1: vector[0][1],
                y2: vector[1][1]
            };
        }
        gradientOptions.id = "grad" + gradientGuid;
        var stops = options.stops || [ {
            offset: "0%",
            style: {
                color: "rgb(255, 255, 255)",
                opacity: 1
            }
        }, {
            offset: "60%",
            style: {
                color: this.options.fillColor || this.options.color,
                opacity: 1
            }
        } ];
        for (var key in gradientOptions) {
            gradient.setAttribute(key, gradientOptions[key]);
        }
        for (var i = 0; i < stops.length; ++i) {
            var stop = stops[i];
            var stopElement = this._createElement("stop");
            stop.style = stop.style || {};
            for (var key in stop) {
                var stopProperty = stop[key];
                if (key === "style") {
                    var styleProperty = "";
                    stopProperty.color = stopProperty.color || (this.options.fillColor || this.options.color);
                    stopProperty.opacity = typeof stopProperty.opacity === "undefined" ? 1 : stopProperty.opacity;
                    for (var propKey in stopProperty) {
                        styleProperty += "stop-" + propKey + ":" + stopProperty[propKey] + ";";
                    }
                    stopProperty = styleProperty;
                }
                stopElement.setAttribute(key, stopProperty);
            }
            gradient.appendChild(stopElement);
        }
        this._gradient = gradient;
        this._defs.appendChild(gradient);
    },
    _createDropShadow: function(options) {
        if (!this._defs) {
            this._createDefs();
        }
        if (this._dropShadow) {
            this._defs.removeChild(this._dropShadow);
        }
        var filterGuid = L.Util.guid();
        var filter = this._createElement("filter");
        var feOffset = this._createElement("feOffset");
        var feGaussianBlur = this._createElement("feGaussianBlur");
        var feBlend = this._createElement("feBlend");
        options = options || {
            width: "200%",
            height: "200%"
        };
        options.id = "filter" + filterGuid;
        for (var key in options) {
            filter.setAttribute(key, options[key]);
        }
        var offsetOptions = {
            result: "offOut",
            "in": "SourceAlpha",
            dx: "2",
            dy: "2"
        };
        var blurOptions = {
            result: "blurOut",
            "in": "offOut",
            stdDeviation: "2"
        };
        var blendOptions = {
            "in": "SourceGraphic",
            in2: "blurOut",
            mode: "lighten"
        };
        for (var key in offsetOptions) {
            feOffset.setAttribute(key, offsetOptions[key]);
        }
        for (var key in blurOptions) {
            feGaussianBlur.setAttribute(key, blurOptions[key]);
        }
        for (var key in blendOptions) {
            feBlend.setAttribute(key, blendOptions[key]);
        }
        filter.appendChild(feOffset);
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feBlend);
        this._dropShadow = filter;
        this._defs.appendChild(filter);
    },
    _createCustomElement: function(tag, attributes) {
        var element = this._createElement(tag);
        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element.setAttribute(key, attributes[key]);
            }
        }
        return element;
    },
    _createImage: function(imageOptions) {
        var image = this._createElement("image");
        image.setAttribute("width", imageOptions.width);
        image.setAttribute("height", imageOptions.height);
        image.setAttribute("x", imageOptions.x || 0);
        image.setAttribute("y", imageOptions.y || 0);
        image.setAttributeNS(L.Path.XLINK_NS, "xlink:href", imageOptions.url);
        return image;
    },
    _createPattern: function(patternOptions) {
        if (this._pattern) {
            this._defs.removeChild(this._pattern);
        }
        var pattern = this._createCustomElement("pattern", patternOptions);
        this._pattern = pattern;
        return pattern;
    },
    _createShape: function(type, shapeOptions) {
        if (this._shape) {
            this._container.removeChild(this._shape);
        }
        var shape = this._createCustomElement(type, shapeOptions);
        return shape;
    },
    _applyCustomStyles: function() {},
    _createFillPattern: function(imageOptions) {
        var patternGuid = L.Util.guid();
        var patternOptions = imageOptions.pattern;
        patternOptions.id = patternGuid;
        patternOptions.patternUnits = patternOptions.patternUnits || "objectBoundingBox";
        var pattern = this._createPattern(patternOptions);
        var image = this._createImage(imageOptions.image);
        image.setAttributeNS(L.Path.XLINK_NS, "xlink:href", imageOptions.url);
        pattern.appendChild(image);
        if (!this._defs) {
            this._createDefs();
        }
        this._defs.appendChild(pattern);
        this._path.setAttribute("fill", "url(#" + patternGuid + ")");
    },
    _getDefaultDiameter: function(radius) {
        return 1.75 * radius;
    },
    _createShapeImage: function(imageOptions) {
        imageOptions = imageOptions || {};
        var patternGuid = L.Util.guid();
        var radius = this.options.radius || Math.max(this.options.radiusX, this.options.radiusY);
        var diameter = this._getDefaultDiameter(radius);
        var imageSize = imageOptions.imageSize || new L.Point(diameter, diameter);
        var circleSize = imageOptions.radius || diameter / 2;
        var shapeOptions = imageOptions.shape || {
            circle: {
                r: circleSize,
                cx: 0,
                cy: 0
            }
        };
        var patternOptions = imageOptions.pattern || {
            width: imageSize.x,
            height: imageSize.y,
            x: 0,
            y: 0
        };
        var shapeKeys = Object.keys(shapeOptions);
        var shapeType = shapeKeys.length > 0 ? shapeKeys[0] : "circle";
        shapeOptions[shapeType].fill = "url(#" + patternGuid + ")";
        var shape = this._createShape(shapeType, shapeOptions[shapeType]);
        if (this.options.clickable) {
            shape.setAttribute("class", "leaflet-clickable");
        }
        patternOptions.id = patternGuid;
        patternOptions.patternUnits = patternOptions.patternUnits || "objectBoundingBox";
        var pattern = this._createPattern(patternOptions);
        var imageOptions = imageOptions.image || {
            width: imageSize.x,
            height: imageSize.y,
            x: 0,
            y: 0,
            url: this.options.imageCircleUrl
        };
        var image = this._createImage(imageOptions);
        image.setAttributeNS(L.Path.XLINK_NS, "xlink:href", imageOptions.url);
        pattern.appendChild(image);
        this._defs.appendChild(pattern);
        this._container.insertBefore(shape, this._defs);
        this._shape = shape;
        var me = this;
        this._shape.addEventListener("mouseover", function() {
            me.fire("mouseover");
        });
        this._shape.addEventListener("mouseout", function() {
            me.fire("mouseout");
        });
        this._shape.addEventListener("mousemove", function() {
            me.fire("mousemove");
        });
        var anchorPoint = this.getTextAnchor();
        if (this._shape && anchorPoint) {
            if (this._shape.tagName === "circle" || this._shape.tagName === "ellipse") {
                this._shape.setAttribute("cx", anchorPoint.x);
                this._shape.setAttribute("cy", anchorPoint.y);
            } else {
                var width = this._shape.getAttribute("width");
                var height = this._shape.getAttribute("height");
                this._shape.setAttribute("x", anchorPoint.x - Number(width) / 2);
                this._shape.setAttribute("y", anchorPoint.y - Number(height) / 2);
            }
        }
    },
    _updateStyle: function(layer) {
        this.__updateStyle.call(this, layer);
        var context = layer ? layer : this;
        if (context.options.stroke) {
            if (context.options.lineCap) {
                context._path.setAttribute("stroke-linecap", context.options.lineCap);
            }
            if (context.options.lineJoin) {
                context._path.setAttribute("stroke-linejoin", context.options.lineJoin);
            }
        }
        if (context.options.gradient) {
            context._createGradient(context.options.gradient);
            context._path.setAttribute("fill", "url(#" + context._gradient.getAttribute("id") + ")");
        } else if (!context.options.fill) {
            context._path.setAttribute("fill", "none");
        }
        if (context.options.dropShadow) {
            context._createDropShadow();
            context._path.setAttribute("filter", "url(#" + context._dropShadow.getAttribute("id") + ")");
        } else {
            context._path.removeAttribute("filter");
        }
        if (context.options.fillPattern) {
            context._createFillPattern(context.options.fillPattern);
        }
        context._applyCustomStyles();
    }
};

if (L.SVG) {
    var SVGStyleFunctions = L.Util.extend(PathFunctions, {
        __updateStyle: L.SVG.prototype._updateStyle
    });
    var SVGTextFunctions = L.Util.extend(TextFunctions, {
        __updatePath: L.SVG.prototype._updatePath
    });
    L.SVG.include(SVGStyleFunctions);
    L.SVG.include(SVGTextFunctions);
}

var LineTextFunctions = L.extend({}, TextFunctions);

LineTextFunctions.__updatePath = L.Polyline.prototype._updatePath;

LineTextFunctions.getCenter = function() {
    var latlngs = this._latlngs, len = latlngs.length, i, j, p1, p2, f, center;
    for (i = 0, j = len - 1, area = 0, lat = 0, lng = 0; i < len; j = i++) {
        p1 = latlngs[i];
        p2 = latlngs[j];
        f = p1.lat * p2.lng - p2.lat * p1.lng;
        lat += (p1.lat + p2.lat) * f;
        lng += (p1.lng + p2.lng) * f;
        area += f / 2;
    }
    center = area ? new L.LatLng(lat / (6 * area), lng / (6 * area)) : latlngs[0];
    center.area = area;
    return center;
};

LineTextFunctions.getTextAnchor = function() {
    var center = this.getCenter();
    return this._map.latLngToLayerPoint(center);
};

L.Polyline.include(LineTextFunctions);

L.CircleMarker.include(TextFunctions);

L.Path.include(PathFunctions);

L.Polygon.include(PathFunctions);

L.Polyline.include(PathFunctions);

L.CircleMarker.include(PathFunctions);

L.CircleMarker = L.CircleMarker.extend({
    _applyCustomStyles: function() {
        if (this.options.shapeImage || this.options.imageCircleUrl) {
            this._createShapeImage(this.options.shapeImage);
        }
    },
    getTextAnchor: function() {
        var point = null;
        if (this._point) {
            point = new L.Point(this._point.x, this._point.y);
        }
        return point;
    }
});

L.Point.prototype.rotate = function(angle, point) {
    var radius = this.distanceTo(point);
    var theta = angle * L.LatLng.DEG_TO_RAD + Math.atan2(this.y - point.y, this.x - point.x);
    this.x = point.x + radius * Math.cos(theta);
    this.y = point.y + radius * Math.sin(theta);
};

L.MapMarker = L.Path.extend({
    includes: TextFunctions,
    initialize: function(centerLatLng, options) {
        L.Path.prototype.initialize.call(this, options);
        this._latlng = centerLatLng;
    },
    options: {
        fill: true,
        fillOpacity: 1,
        opacity: 1,
        radius: 15,
        innerRadius: 5,
        position: {
            x: 0,
            y: 0
        },
        rotation: 0,
        numberOfSides: 50,
        color: "#000000",
        fillColor: "#0000FF",
        weight: 1,
        gradient: true,
        dropShadow: true,
        clickable: true
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
        if (this.options.innerRadius > 0) {
            this._innerPoints = this._getPoints(true).reverse();
        }
    },
    getBounds: function() {
        var map = this._map, height = this.options.radius * 3, point = map.project(this._latlng), swPoint = new L.Point(point.x - this.options.radius, point.y), nePoint = new L.Point(point.x + this.options.radius, point.y - height), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    getLatLng: function() {
        return this._latlng;
    },
    setRadius: function(radius) {
        this.options.radius = radius;
        return this.redraw();
    },
    setInnerRadius: function(innerRadius) {
        this.options.innerRadius = innerRadius;
        return this.redraw();
    },
    setRotation: function(rotation) {
        this.options.rotation = rotation;
        return this.redraw();
    },
    setNumberOfSides: function(numberOfSides) {
        this.options.numberOfSides = numberOfSides;
        return this.redraw();
    },
    getPathString: function() {
        var anchorPoint = this.getTextAnchor();
        if (this._shape) {
            if (this._shape.tagName === "circle" || this._shape.tagName === "ellipse") {
                this._shape.setAttribute("cx", anchorPoint.x);
                this._shape.setAttribute("cy", anchorPoint.y);
            } else {
                var width = this._shape.getAttribute("width");
                var height = this._shape.getAttribute("height");
                this._shape.setAttribute("x", anchorPoint.x - Number(width) / 2);
                this._shape.setAttribute("y", anchorPoint.y - Number(height) / 2);
            }
        }
        this._path.setAttribute("shape-rendering", "geometricPrecision");
        return new L.SVGPathBuilder(this._points, this._innerPoints).build(6);
    },
    getTextAnchor: function() {
        var point = null;
        if (this._point) {
            point = new L.Point(this._point.x, this._point.y - 2 * this.options.radius);
        }
        return point;
    },
    _getPoints: function(inner) {
        var maxDegrees = !inner ? 210 : 360;
        var angleSize = !inner ? maxDegrees / 50 : maxDegrees / Math.max(this.options.numberOfSides, 3);
        var degrees = !inner ? maxDegrees : maxDegrees + this.options.rotation;
        var angle = !inner ? -30 : this.options.rotation;
        var points = [];
        var newPoint;
        var angleRadians;
        var radius = this.options.radius;
        var multiplier = Math.sqrt(.75);
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        var startPoint = this._point;
        if (!inner) {
            points.push(startPoint);
            points.push(new L.Point(startPoint.x + multiplier * radius, startPoint.y - 1.5 * radius));
        }
        while (angle < degrees) {
            angleRadians = toRad(angle);
            newPoint = this._getPoint(angleRadians, radius, inner);
            points.push(newPoint);
            angle += angleSize;
        }
        if (!inner) {
            points.push(new L.Point(startPoint.x - multiplier * radius, startPoint.y - 1.5 * radius));
        }
        return points;
    },
    _getPoint: function(angle, radius, inner) {
        var markerRadius = radius;
        radius = !inner ? radius : this.options.innerRadius;
        return new L.Point(this._point.x + this.options.position.x + radius * Math.cos(angle), this._point.y - 2 * markerRadius + this.options.position.y - radius * Math.sin(angle));
    },
    _applyCustomStyles: function() {
        if (this.options.shapeImage || this.options.imageCircleUrl) {
            this._createShapeImage(this.options.shapeImage);
        }
    },
    toGeoJSON: function() {
        return L.Util.pointToGeoJSON.call(this);
    }
});

L.mapMarker = function(centerLatLng, options) {
    return new L.MapMarker(centerLatLng, options);
};

L.RegularPolygonMarker = L.Path.extend({
    includes: TextFunctions,
    initialize: function(centerLatLng, options) {
        L.Path.prototype.initialize ? L.Path.prototype.initialize.call(this, options) : L.setOptions(this, options);
        this._latlng = centerLatLng;
        this.options.numberOfSides = Math.max(this.options.numberOfSides, 3);
    },
    options: {
        fill: true,
        radiusX: 10,
        radiusY: 10,
        rotation: 0,
        numberOfSides: 3,
        position: {
            x: 0,
            y: 0
        },
        maxDegrees: 360,
        gradient: true,
        dropShadow: false,
        clickable: true
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
        if (this.options.innerRadius || this.options.innerRadiusX && this.options.innerRadiusY) {
            this._innerPoints = this._getPoints(true).reverse();
        }
    },
    getBounds: function() {
        var map = this._map, radiusX = this.options.radius || this.options.radiusX, radiusY = this.options.radius || this.options.radiusY, deltaX = radiusX * Math.cos(Math.PI / 4), deltaY = radiusY * Math.sin(Math.PI / 4), point = map.project(this._latlng), swPoint = new L.Point(point.x - deltaX, point.y + deltaY), nePoint = new L.Point(point.x + deltaX, point.y - deltaY), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    setRadius: function(radius) {
        this.options.radius = radius;
        return this.redraw();
    },
    setRadiusXY: function(radiusX, radiusY) {
        this.options.radius = null;
        this.options.radiusX = radiusX;
        this.options.radiusY = radiusY;
        return this.redraw();
    },
    setInnerRadius: function(innerRadius) {
        this.options.innerRadius = innerRadius;
        return this.redraw();
    },
    setInnerRadiusXY: function(innerRadiusX, innerRadiusY) {
        this.options.innerRadius = null;
        this.options.innerRadiusX = innerRadiusX;
        this.options.innerRadiusY = innerRadiusY;
        return this.redraw();
    },
    setRotation: function(rotation) {
        this.options.rotation = rotation;
        return this.redraw();
    },
    setNumberOfSides: function(numberOfSides) {
        this.options.numberOfSides = numberOfSides;
        return this.redraw();
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        var anchorPoint = this.getTextAnchor();
        if (this._shape) {
            if (this._shape.tagName === "circle" || this._shape.tagName === "ellipse") {
                this._shape.setAttribute("cx", anchorPoint.x);
                this._shape.setAttribute("cy", anchorPoint.y);
            } else {
                var width = this._shape.getAttribute("width");
                var height = this._shape.getAttribute("height");
                this._shape.setAttribute("x", anchorPoint.x - Number(width) / 2);
                this._shape.setAttribute("y", anchorPoint.y - Number(height) / 2);
            }
        }
        this._path.setAttribute("shape-rendering", "geometricPrecision");
        return new L.SVGPathBuilder(this._points, this._innerPoints).build(6);
    },
    _getPoints: function(inner) {
        var maxDegrees = this.options.maxDegrees || 360;
        var angleSize = maxDegrees / Math.max(this.options.numberOfSides, 3);
        var degrees = maxDegrees;
        var angle = 0;
        var points = [];
        var newPoint;
        var angleRadians;
        var radiusX = !inner ? this.options.radius || this.options.radiusX : this.options.innerRadius || this.options.innerRadiusX;
        var radiusY = !inner ? this.options.radius || this.options.radiusY : this.options.innerRadius || this.options.innerRadiusY;
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        while (angle < degrees) {
            angleRadians = toRad(angle);
            newPoint = this._getPoint(angleRadians, radiusX, radiusY);
            points.push(newPoint);
            angle += angleSize;
        }
        return points;
    },
    _getPoint: function(angle, radiusX, radiusY) {
        var startPoint = this.options.position ? this._point.add(new L.Point(this.options.position.x, this.options.position.y)) : this._point;
        var point = new L.Point(startPoint.x + radiusX * Math.cos(angle), startPoint.y + radiusY * Math.sin(angle));
        point.rotate(this.options.rotation, startPoint);
        return point;
    },
    _getDefaultDiameter: function(radius) {
        var angle = Math.PI / this.options.numberOfSides;
        var minLength = radius * Math.cos(angle);
        return 1.75 * minLength;
    },
    _applyCustomStyles: function() {
        if (this.options.shapeImage || this.options.imageCircleUrl) {
            this._createShapeImage(this.options.shapeImage);
        }
    },
    toGeoJSON: function() {
        return L.Util.pointToGeoJSON.call(this);
    }
});

L.regularPolygonMarker = function(centerLatLng, options) {
    return new L.RegularPolygonMarker(centerLatLng, options);
};

L.StarMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfPoints: 5,
        rotation: -15,
        maxDegrees: 360,
        gradient: true,
        dropShadow: true
    },
    setNumberOfPoints: function(numberOfPoints) {
        this.options.numberOfPoints = numberOfPoints;
        return this.redraw();
    },
    _getPoints: function(inner) {
        var maxDegrees = this.options.maxDegrees || 360;
        var angleSize = maxDegrees / this.options.numberOfPoints;
        var degrees = maxDegrees;
        var angle = 0;
        var points = [];
        var newPoint, newPointInner;
        var angleRadians;
        var radiusX = !inner ? this.options.radius || this.options.radiusX : this.options.innerRadius || this.options.innerRadiusX;
        var radiusY = !inner ? this.options.radius || this.options.radiusY : this.options.innerRadius || this.options.innerRadiusY;
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        while (angle < degrees) {
            angleRadians = toRad(angle);
            newPoint = this._getPoint(angleRadians, radiusX, radiusY);
            newPointInner = this._getPoint(angleRadians + toRad(angleSize) / 2, radiusX / 2, radiusY / 2);
            points.push(newPoint);
            points.push(newPointInner);
            angle += angleSize;
        }
        return points;
    }
});

L.starMarker = function(centerLatLng, options) {
    return new L.StarMarker(centerLatLng, options);
};

L.TriangleMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 3,
        rotation: 30,
        radius: 5
    }
});

L.triangleMarker = function(centerLatLng, options) {
    return new L.TriangleMarker(centerLatLng, options);
};

L.DiamondMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 4,
        radiusX: 5,
        radiusY: 10
    }
});

L.diamondMarker = function(centerLatLng, options) {
    return new L.DiamondMarker(centerLatLng, options);
};

L.SquareMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 4,
        rotation: 45,
        radius: 5
    }
});

L.squareMarker = function(centerLatLng, options) {
    return new L.SquareMarker(centerLatLng, options);
};

L.PentagonMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 5,
        rotation: -18,
        radius: 5
    }
});

L.pentagonMarker = function(centerLatLng, options) {
    return new L.PentagonMarker(centerLatLng, options);
};

L.HexagonMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 6,
        rotation: 30,
        radius: 5
    }
});

L.hexagonMarker = function(centerLatLng, options) {
    return new L.HexagonMarker(centerLatLng, options);
};

L.OctagonMarker = L.RegularPolygonMarker.extend({
    options: {
        numberOfSides: 8,
        rotation: 22.5,
        radius: 5
    }
});

L.octagonMarker = function(centerLatLng, options) {
    return new L.OctagonMarker(centerLatLng, options);
};

L.SVGMarker = L.Path.extend({
    initialize: function(latlng, options) {
        L.Path.prototype.initialize.call(this, options);
        this._svg = options.svg;
        if (this._svg.indexOf("<") === 0) {
            this._data = this._svg;
        }
        this._latlng = latlng;
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        this.redraw();
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        var me = this;
        var addSVG = function() {
            var g = me._path.parentNode;
            while (g.nodeName.toLowerCase() !== "g") {
                g = g.parentNode;
            }
            if (me.options.clickable) {
                g.setAttribute("class", "leaflet-clickable");
            }
            var data = me._data;
            var svg = data.nodeName.toLowerCase() === "svg" ? data.cloneNode(true) : data.querySelector("svg").cloneNode(true);
            if (me.options.setStyle) {
                me.options.setStyle.call(me, svg);
            }
            var elementWidth = svg.getAttribute("width");
            var elementHeight = svg.getAttribute("height");
            var width = elementWidth ? elementWidth.replace("px", "") : "100%";
            var height = elementHeight ? elementHeight.replace("px", "") : "100%";
            if (width === "100%") {
                width = me.options.size.x;
                height = me.options.size.y;
                svg.setAttribute("width", width + (String(width).indexOf("%") !== -1 ? "" : "px"));
                svg.setAttribute("height", height + (String(height).indexOf("%") !== -1 ? "" : "px"));
            }
            var size = me.options.size || new L.Point(width, height);
            var scaleSize = new L.Point(size.x / width, size.y / height);
            var old = g.getElementsByTagName("svg");
            if (old.length > 0) {
                old[0].parentNode.removeChild(old[0]);
            }
            g.appendChild(svg);
            var transforms = [];
            var anchor = me.options.anchor || new L.Point(-size.x / 2, -size.y / 2);
            var x = me._point.x + anchor.x;
            var y = me._point.y + anchor.y;
            transforms.push("translate(" + x + " " + y + ")");
            transforms.push("scale(" + scaleSize.x + " " + scaleSize.y + ")");
            if (me.options.rotation) {
                transforms.push("rotate(" + me.options.rotation + " " + width / 2 + " " + height / 2 + ")");
            }
            g.setAttribute("transform", transforms.join(" "));
        };
        if (!this._data) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    me._data = this.responseXML;
                    addSVG();
                }
            };
            xhr.open("GET", this._svg, true);
            xhr.send(null);
        } else {
            addSVG();
        }
    },
    toGeoJSON: function() {
        return pointToGeoJSON.call(this);
    }
});

L.MarkerGroup = L.FeatureGroup.extend({
    initialize: function(latlng, markers) {
        L.FeatureGroup.prototype.initialize.call(this, markers);
        this.setLatLng(latlng);
    },
    setStyle: function(style) {
        return this;
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        this.eachLayer(function(layer) {
            if (layer.setLatLng) {
                layer.setLatLng(latlng);
            }
        });
        return this;
    },
    getLatLng: function(latlng) {
        return this._latlng;
    },
    toGeoJSON: function() {
        var featureCollection = {
            type: "FeatureCollection",
            features: []
        };
        var eachLayerFunction = function(featureCollection) {
            return function(layer) {
                featureCollection.features.push(L.Util.pointToGeoJSON.call(layer));
            };
        };
        this.eachLayer(eachLayerFunction(featureCollection));
        return featureCollection;
    }
});

L.BarMarker = L.Path.extend({
    initialize: function(centerLatLng, options) {
        L.Path.prototype.initialize.call(this, options);
        this._latlng = centerLatLng;
    },
    options: {
        fill: true,
        width: 2,
        maxHeight: 10,
        position: {
            x: 0,
            y: 0
        },
        weight: 1,
        color: "#000",
        opacity: 1,
        gradient: true,
        dropShadow: false,
        lineCap: "square",
        lineJoin: "miter"
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
    },
    getBounds: function() {
        var map = this._map, point = map.project(this._latlng), halfWidth = this.options.width / 2, swPoint = new L.Point(point.x - halfWidth, point.y), nePoint = new L.Point(point.x + halfWidth, point.y - this.options.maxHeight), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        this._path.setAttribute("shape-rendering", "crispEdges");
        return new L.SVGPathBuilder(this._points).build();
    },
    _getPoints: function() {
        var points = [];
        var startX = this._point.x + this.options.position.x;
        var startY = this._point.y + this.options.position.y;
        var halfWidth = this.options.width / 2;
        var sePoint, nePoint, nwPoint, swPoint;
        var height = this.options.value / this.options.maxValue * this.options.maxHeight;
        sePoint = new L.Point(startX + halfWidth, startY);
        nePoint = new L.Point(startX + halfWidth, startY - height);
        nwPoint = new L.Point(startX - halfWidth, startY - height);
        swPoint = new L.Point(startX - halfWidth, startY);
        points = [ sePoint, nePoint, nwPoint, swPoint ];
        return points;
    }
});

L.barMarker = function(centerLatLng, options) {
    return new L.BarMarker(centerLatLng, options);
};

L.ChartMarker = L.FeatureGroup.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        this._layers = {};
        this._latlng = centerLatLng;
        this._loadComponents();
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    getLatLng: function() {
        return this._latlng;
    },
    _loadComponents: function() {},
    _highlight: function(options) {
        if (options.weight) {
            options.weight *= 2;
        }
        return options;
    },
    _unhighlight: function(options) {
        if (options.weight) {
            options.weight /= 2;
        }
        return options;
    },
    _bindMouseEvents: function(chartElement) {
        var self = this;
        var tooltipOptions = this.options.tooltipOptions;
        chartElement.on("mouseover", function(e) {
            var currentOptions = this.options;
            var key = currentOptions.key;
            var value = currentOptions.value;
            var layerPoint = e.layerPoint;
            var x = layerPoint.x - this._point.x;
            var y = layerPoint.y - this._point.y;
            var iconSize = currentOptions.iconSize;
            var newX = x;
            var newY = y;
            var newPoint;
            var offset = 5;
            newX = x < 0 ? iconSize.x - x + offset : -x - offset;
            newY = y < 0 ? iconSize.y - y + offset : -y - offset;
            newPoint = new L.Point(newX, newY);
            var legendOptions = {};
            var displayText = currentOptions.displayText ? currentOptions.displayText(value) : value;
            legendOptions[key] = {
                name: currentOptions.displayName,
                value: displayText
            };
            var icon = new L.LegendIcon(legendOptions, currentOptions, {
                className: "leaflet-div-icon",
                iconSize: tooltipOptions ? tooltipOptions.iconSize : iconSize,
                iconAnchor: newPoint
            });
            currentOptions.marker = new L.Marker(self._latlng, {
                icon: icon
            });
            currentOptions = self._highlight(currentOptions);
            this.initialize(self._latlng, currentOptions);
            this.redraw();
            this.setStyle(currentOptions);
            self.addLayer(currentOptions.marker);
        });
        chartElement.on("mouseout", function(e) {
            var currentOptions = this.options;
            currentOptions = self._unhighlight(currentOptions);
            this.initialize(self._latlng, currentOptions);
            this.redraw();
            this.setStyle(currentOptions);
            self.removeLayer(currentOptions.marker);
        });
    },
    bindPopup: function(content, options) {
        this.eachLayer(function(layer) {
            layer.bindPopup(content, options);
        });
    },
    openPopup: function(latlng) {
        for (var i in this._layers) {
            var layer = this._layers[i];
            latlng = latlng || this._latlng;
            layer.openPopup(latlng);
            break;
        }
    },
    closePopup: function() {
        for (var i in this._layers) {
            var layer = this._layers[i];
            latlng = latlng || this._latlng;
            layer.closePopup();
            break;
        }
    },
    redraw: function() {
        this.clearLayers();
        this._loadComponents();
    },
    toGeoJSON: function() {
        return L.Util.pointToGeoJSON.call(this);
    }
});

L.BarChartMarker = L.ChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        position: {
            x: 0,
            y: 0
        },
        width: 10,
        offset: 0,
        iconSize: new L.Point(50, 40)
    },
    _loadComponents: function() {
        var value, minValue, maxValue;
        var bar;
        var options = this.options;
        var x;
        var y;
        var keys = Object.keys(this.options.data);
        var count = keys.length;
        var width = this.options.width;
        var offset = this.options.offset || 0;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        x = -(width * count + offset * (count - 1)) / 2 + width / 2;
        y = 0;
        for (var key in data) {
            value = data[key];
            chartOption = chartOptions[key];
            minValue = chartOption.minValue || 0;
            maxValue = chartOption.maxValue || 100;
            options.fillColor = chartOption.fillColor || this.options.fillColor;
            options.value = value;
            options.minValue = minValue;
            options.maxValue = maxValue;
            options.position = {
                x: x,
                y: y
            };
            options.width = width;
            options.maxHeight = chartOption.maxHeight || 10;
            options.key = key;
            options.value = value;
            options.displayName = chartOption.displayName;
            options.opacity = this.options.opacity || 1;
            options.fillOpacity = this.options.fillOpacity || .7;
            options.weight = this.options.weight || 1;
            options.color = chartOption.color || this.options.color;
            options.displayText = chartOption.displayText;
            bar = new L.BarMarker(this._latlng, options);
            this._bindMouseEvents(bar);
            this.addLayer(bar);
            x += width + offset;
        }
    }
});

L.RadialBarMarker = L.Path.extend({
    initialize: function(centerLatLng, options) {
        L.Path.prototype.initialize.call(this, options);
        this._latlng = centerLatLng;
    },
    options: {
        fill: true,
        radius: 10,
        rotation: 0,
        numberOfSides: 30,
        position: {
            x: 0,
            y: 0
        },
        gradient: true,
        dropShadow: false
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        return this.redraw();
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
    },
    getBounds: function() {
        var map = this._map, radiusX = this.options.radiusX || this.options.radius, radiusY = this.options.radiusY || this.options.radius, deltaX = radiusX * Math.cos(Math.PI / 4), deltaY = radiusY * Math.sin(Math.PI / 4), point = map.project(this._latlng), swPoint = new L.Point(point.x - deltaX, point.y + deltaY), nePoint = new L.Point(point.x + deltaX, point.y - deltaY), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        var angle = this.options.endAngle - this.options.startAngle;
        var largeArc = angle >= 180 ? "1" : "0";
        var radiusX = this.options.radiusX || this.options.radius;
        var radiusY = this.options.radiusY || this.options.radius;
        var path = "M" + this._points[0].x.toFixed(2) + "," + this._points[0].y.toFixed(2) + "A" + radiusX.toFixed(2) + "," + radiusY.toFixed(2) + " 0 " + largeArc + ",1 " + this._points[1].x.toFixed(2) + "," + this._points[1].y.toFixed(2) + "L";
        if (this._innerPoints) {
            path = path + this._innerPoints[0].x.toFixed(2) + "," + this._innerPoints[0].y.toFixed(2);
            path = path + "A" + (radiusX - this.options.barThickness).toFixed(2) + "," + (radiusY - this.options.barThickness).toFixed(2) + " 0 " + largeArc + ",0 " + this._innerPoints[1].x.toFixed(2) + "," + this._innerPoints[1].y.toFixed(2) + "z";
        } else {
            path = path + this._point.x.toFixed(2) + "," + this._point.y.toFixed(2) + "z";
        }
        if (L.Browser.vml) {
            path = Core.SVG.path(path);
        }
        this._path.setAttribute("shape-rendering", "geometricPrecision");
        return path;
    },
    _getPoints: function() {
        var angleDelta = this.options.endAngle - this.options.startAngle;
        var degrees = this.options.endAngle + this.options.rotation;
        var angle = this.options.startAngle + this.options.rotation;
        var points = [];
        var radiusX = "radiusX" in this.options ? this.options.radiusX : this.options.radius;
        var radiusY = "radiusY" in this.options ? this.options.radiusY : this.options.radius;
        var toRad = function(number) {
            return number * L.LatLng.DEG_TO_RAD;
        };
        if (angleDelta === 360) {
            degrees = degrees - .1;
        }
        var startRadians = toRad(angle);
        var endRadians = toRad(degrees);
        points.push(this._getPoint(startRadians, radiusX, radiusY));
        points.push(this._getPoint(endRadians, radiusX, radiusY));
        if (this.options.barThickness) {
            this._innerPoints = [];
            this._innerPoints.push(this._getPoint(endRadians, radiusX - this.options.barThickness, radiusY - this.options.barThickness));
            this._innerPoints.push(this._getPoint(startRadians, radiusX - this.options.barThickness, radiusY - this.options.barThickness));
        }
        return points;
    },
    _getPoint: function(angle, radiusX, radiusY) {
        return new L.Point(this._point.x + this.options.position.x + radiusX * Math.cos(angle), this._point.y + this.options.position.y + radiusY * Math.sin(angle));
    }
});

L.radialBarMarker = function(centerLatLng, options) {
    return new L.RadialBarMarker(centerLatLng, options);
};

L.PieChartMarker = L.ChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        radius: 10,
        rotation: 0,
        numberOfSides: 50,
        mouseOverExaggeration: 1.2,
        maxDegrees: 360,
        iconSize: new L.Point(50, 40)
    },
    _highlight: function(options) {
        var oldRadiusX = options.radiusX;
        var oldRadiusY = options.radiusY;
        var oldBarThickness = options.barThickness;
        options.oldBarThickness = oldBarThickness;
        options.oldRadiusX = oldRadiusX;
        options.oldRadiusY = oldRadiusY;
        options.radiusX *= options.mouseOverExaggeration;
        options.radiusY *= options.mouseOverExaggeration;
        options.barThickness = options.radiusX - oldRadiusX + oldBarThickness;
        return options;
    },
    _unhighlight: function(options) {
        options.radiusX = options.oldRadiusX;
        options.radiusY = options.oldRadiusY;
        options.barThickness = options.oldBarThickness;
        return options;
    },
    _loadComponents: function() {
        var value;
        var sum = 0;
        var angle = 0;
        var percentage = 0;
        var maxDegrees = this.options.maxDegrees || 360;
        var lastAngle = this.options.rotation;
        var bar;
        var options = this.options;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        var key;
        var getValue = function(data, key) {
            var value = 0;
            if (data[key]) {
                value = parseFloat(data[key]);
            }
            return value;
        };
        for (key in data) {
            value = getValue(data, key);
            sum += value;
        }
        if (sum > 0) {
            for (key in data) {
                value = parseFloat(data[key]);
                chartOption = chartOptions[key];
                percentage = value / sum;
                angle = percentage * maxDegrees;
                options.startAngle = lastAngle;
                options.endAngle = lastAngle + angle;
                options.fillColor = chartOption.fillColor;
                options.color = chartOption.color || "#000";
                options.radiusX = this.options.radiusX || this.options.radius;
                options.radiusY = this.options.radiusY || this.options.radius;
                options.rotation = 0;
                options.key = key;
                options.value = value;
                options.displayName = chartOption.displayName;
                options.displayText = chartOption.displayText;
                bar = new L.RadialBarMarker(this._latlng, options);
                this._bindMouseEvents(bar);
                lastAngle = options.endAngle;
                this.addLayer(bar);
            }
        }
    }
});

L.pieChartMarker = function(centerLatLng, options) {
    return new L.PieChartMarker(centerLatLng, options);
};

L.CoxcombChartMarker = L.PieChartMarker.extend({
    statics: {
        SIZE_MODE_RADIUS: "radius",
        SIZE_MODE_AREA: "area"
    }
});

L.CoxcombChartMarker = L.CoxcombChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.PieChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        radius: 10,
        rotation: 0,
        numberOfSides: 50,
        mouseOverExaggeration: 1.2,
        maxDegrees: 360,
        iconSize: new L.Point(50, 40),
        sizeMode: L.CoxcombChartMarker.SIZE_MODE_AREA
    },
    _loadComponents: function() {
        var value, minValue, maxValue;
        var angle = 0;
        var maxDegrees = this.options.maxDegrees || 360;
        var lastAngle = this.options.rotation;
        var bar;
        var options = this.options;
        var radiusX = "radiusX" in this.options ? this.options.radiusX : this.options.radius;
        var radiusY = "radiusY" in this.options ? this.options.radiusY : this.options.radius;
        var keys = Object.keys(this.options.data);
        var count = keys.length;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        angle = maxDegrees / count;
        for (var key in data) {
            value = parseFloat(data[key]);
            chartOption = chartOptions[key];
            var minValue = chartOption.minValue || 0;
            var maxValue = chartOption.maxValue;
            if (this.options.sizeMode === L.CoxcombChartMarker.SIZE_MODE_RADIUS) {
                var evalFunctionX = new L.LinearFunction(new L.Point(minValue, 0), new L.Point(maxValue, radiusX));
                var evalFunctionY = new L.LinearFunction(new L.Point(minValue, 0), new L.Point(maxValue, radiusY));
                options.radiusX = evalFunctionX.evaluate(value);
                options.radiusY = evalFunctionY.evaluate(value);
            } else {
                var radius = Math.max(radiusX, radiusY);
                var maxArea = Math.PI * Math.pow(radius, 2) / count;
                var evalFunctionArea = new L.LinearFunction(new L.Point(minValue, 0), new L.Point(maxValue, maxArea), {
                    postProcess: function(value) {
                        return Math.sqrt(count * value / Math.PI);
                    }
                });
                options.radiusX = evalFunctionArea.evaluate(value);
                options.radiusY = options.radiusX;
            }
            options.startAngle = lastAngle;
            options.endAngle = lastAngle + angle;
            options.fillColor = chartOption.fillColor;
            options.color = chartOption.color || "#000";
            options.rotation = 0;
            options.key = key;
            options.value = value;
            options.displayName = chartOption.displayName;
            options.displayText = chartOption.displayText;
            bar = new L.RadialBarMarker(this._latlng, options);
            this._bindMouseEvents(bar);
            lastAngle = options.endAngle;
            this.addLayer(bar);
        }
    }
});

L.coxcombChartMarker = function(centerLatLng, options) {
    return new L.CoxcombChartMarker(centerLatLng, options);
};

L.RadialBarChartMarker = L.ChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        radius: 10,
        rotation: 0,
        numberOfSides: 30,
        offset: 2,
        barThickness: 5,
        maxDegrees: 360,
        iconSize: new L.Point(50, 40)
    },
    _loadComponents: function() {
        var value, minValue, maxValue;
        var angle = this.options.rotation;
        var maxDegrees = this.options.maxDegrees || 360;
        var bar;
        var options = this.options;
        var lastRadiusX = this.options.radiusX || this.options.radius;
        var lastRadiusY = this.options.radiusY || this.options.radius;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        var barThickness = this.options.barThickness || 4;
        var offset = this.options.offset || 2;
        for (var key in data) {
            value = parseFloat(data[key]);
            chartOption = chartOptions[key];
            minValue = chartOption.minValue || 0;
            maxValue = chartOption.maxValue || 100;
            var angleFunction = new L.LinearFunction(new L.Point(minValue, 0), new L.Point(maxValue, maxDegrees));
            angle = angleFunction.evaluate(value);
            options.startAngle = this.options.rotation;
            options.endAngle = this.options.rotation + angle;
            options.fillColor = chartOption.fillColor;
            options.radiusX = lastRadiusX;
            options.radiusY = lastRadiusY;
            options.barThickness = barThickness;
            options.rotation = 0;
            options.key = key;
            options.value = value;
            options.displayName = chartOption.displayName;
            options.displayText = chartOption.displayText;
            options.weight = this.options.weight || 1;
            bar = new L.RadialBarMarker(this._latlng, options);
            this._bindMouseEvents(bar);
            this.addLayer(bar);
            lastRadiusX += barThickness + offset;
            lastRadiusY += barThickness + offset;
        }
    }
});

L.radialBarChartMarker = function(centerLatLng, options) {
    return new L.RadialBarChartMarker(centerLatLng, options);
};

L.StackedRegularPolygonMarker = L.ChartMarker.extend({
    options: {
        iconSize: new L.Point(50, 40)
    },
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    _loadComponents: function() {
        var value;
        var lastRadiusX = 0;
        var lastRadiusY = 0;
        var bar;
        var options = this.options;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        var key;
        var bars = [];
        for (key in data) {
            value = parseFloat(data[key]);
            chartOption = chartOptions[key];
            minValue = chartOption.minValue || 0;
            maxValue = chartOption.maxValue || 100;
            minRadius = chartOption.minRadius || 0;
            maxRadius = chartOption.maxRadius || 10;
            options.fillColor = chartOption.fillColor || this.options.fillColor;
            options.value = value;
            options.minValue = minValue;
            options.maxValue = maxValue;
            var evalFunction = new L.LinearFunction(new L.Point(minValue, minRadius), new L.Point(maxValue, maxRadius));
            var barThickness = evalFunction.evaluate(value);
            options.radiusX = lastRadiusX + barThickness;
            options.radiusY = lastRadiusY + barThickness;
            options.innerRadiusX = lastRadiusX;
            options.innerRadiusY = lastRadiusY;
            options.key = key;
            options.displayName = chartOption.displayName;
            options.opacity = this.options.opacity || 1;
            options.fillOpacity = this.options.fillOpacity || .7;
            options.weight = this.options.weight || 1;
            options.color = chartOption.color || this.options.color;
            options.displayText = chartOption.displayText;
            bar = new L.RegularPolygonMarker(this._latlng, options);
            this._bindMouseEvents(bar);
            lastRadiusX = options.radiusX;
            lastRadiusY = options.radiusY;
            if (this.options.drawReverse) {
                bars.push(bar);
            } else {
                this.addLayer(bar);
            }
        }
        if (this.options.drawReverse) {
            var item = bars.pop();
            while (item) {
                this.addLayer(item);
                item = bars.pop();
            }
        }
    }
});

L.RadialMeterMarker = L.ChartMarker.extend({
    initialize: function(centerLatLng, options) {
        L.Util.setOptions(this, options);
        L.ChartMarker.prototype.initialize.call(this, centerLatLng, options);
    },
    options: {
        weight: 1,
        opacity: 1,
        color: "#000",
        fill: true,
        radius: 10,
        rotation: 180,
        numberOfSides: 30,
        offset: 2,
        barThickness: 5,
        maxDegrees: 180,
        iconSize: new L.Point(50, 40),
        backgroundStyle: {
            fill: true,
            fillColor: "#707070",
            fillOpacity: .2,
            opacity: .8,
            color: "#505050"
        }
    },
    _loadComponents: function() {
        var value, minValue, maxValue;
        var startAngle = this.options.rotation;
        var maxDegrees = this.options.maxDegrees || 360;
        var bar;
        var options = this.options;
        var radiusX = this.options.radiusX || this.options.radius;
        var radiusY = this.options.radiusY || this.options.radius;
        var data = this.options.data;
        var chartOptions = this.options.chartOptions;
        var chartOption;
        var barThickness = this.options.barThickness || 4;
        var lastAngle = startAngle;
        var numSegments = this.options.numSegments || 10;
        var angleDelta = maxDegrees / numSegments;
        var displayOptions;
        for (var key in data) {
            value = parseFloat(data[key]);
            chartOption = chartOptions[key];
            displayOptions = this.options.displayOptions ? this.options.displayOptions[key] : {};
            minValue = chartOption.minValue || 0;
            maxValue = chartOption.maxValue || 100;
            var range = maxValue - minValue;
            var angle = maxDegrees / range * (value - minValue);
            var endAngle = startAngle + angle;
            var maxAngle = startAngle + maxDegrees;
            var evalFunction = new L.LinearFunction(new L.Point(startAngle, minValue), new L.Point(maxAngle, maxValue));
            while (lastAngle < endAngle) {
                options.startAngle = lastAngle;
                var delta = Math.min(angleDelta, endAngle - lastAngle);
                options.endAngle = lastAngle + delta;
                options.fillColor = chartOption.fillColor;
                options.radiusX = radiusX;
                options.radiusY = radiusY;
                options.barThickness = barThickness;
                options.rotation = 0;
                options.key = key;
                options.value = value;
                options.displayName = chartOption.displayName;
                options.displayText = chartOption.displayText;
                var evalValue = evalFunction.evaluate(lastAngle + delta);
                for (var displayKey in displayOptions) {
                    options[displayKey] = displayOptions[displayKey].evaluate ? displayOptions[displayKey].evaluate(evalValue) : displayOptions[displayKey];
                }
                bar = new L.RadialBarMarker(this._latlng, options);
                this._bindMouseEvents(bar);
                this.addLayer(bar);
                lastAngle += delta;
            }
            if (this.options.backgroundStyle) {
                if (lastAngle < maxAngle) {
                    var delta = maxAngle - lastAngle;
                    options.endAngle = lastAngle + delta;
                    options.radiusX = radiusX;
                    options.radiusY = radiusY;
                    options.barThickness = barThickness;
                    options.rotation = 0;
                    options.key = key;
                    options.value = value;
                    options.displayName = chartOption.displayName;
                    options.displayText = chartOption.displayText;
                    options.fillColor = null;
                    options.fill = false;
                    options.gradient = false;
                    for (var property in this.options.backgroundStyle) {
                        options[property] = this.options.backgroundStyle[property];
                    }
                    var evalValue = evalFunction.evaluate(lastAngle + delta);
                    bar = new L.RadialBarMarker(this._latlng, options);
                    this.addLayer(bar);
                }
            }
        }
    }
});

L.LocationModes = {
    LATLNG: function(record, index) {
        var getLocation = function(latitudeField, longitudeField) {
            var latitude = L.Util.getFieldValue(record, latitudeField);
            var longitude = L.Util.getFieldValue(record, longitudeField);
            var location = null;
            if (latitude && longitude) {
                var latlng = new L.LatLng(latitude, longitude);
                location = {
                    location: latlng,
                    text: [ latlng.lat.toFixed(3), latlng.lng.toFixed(3) ].join(", "),
                    center: latlng
                };
            }
            return location;
        };
        var location = getLocation(this.options.latitudeField, this.options.longitudeField);
        if (!location && this.options.fallbackLocationFields) {
            var index = 0;
            var fallbackLocationFields;
            while (!location && index < this.options.fallbackLocationFields.length) {
                fallbackLocationFields = this.options.fallbackLocationFields[index];
                location = getLocation(fallbackLocationFields.latitudeField, fallbackLocationFields.longitudeField);
                index++;
            }
        }
        return location;
    },
    GEOHASH: function(record, index) {
        var geohash = this.options.geohashField ? L.Util.getFieldValue(record, this.options.geohashField) : index;
        var locationInfo = decodeGeoHash(geohash);
        var bounds;
        if (locationInfo.latitude[2] && locationInfo.longitude[2]) {
            bounds = new L.LatLngBounds(new L.LatLng(locationInfo.latitude[0], locationInfo.longitude[0]), new L.LatLng(locationInfo.latitude[1], locationInfo.longitude[1]));
        }
        return {
            location: bounds,
            text: geohash,
            center: bounds.getCenter()
        };
    },
    GWCOUNTRY: function(record, index) {
        var code = this.options.codeField ? L.Util.getFieldValue(record, this.options.codeField) : index;
        var geoJSON;
        var centroid;
        var gwNoLookup = L.gwNoLookup || {};
        var countries = L.countries || {};
        var countryCentroids = L.countryCentroids || {};
        var originalCode = code.toUpperCase();
        code = originalCode;
        var gwNo = originalCode in gwNoLookup;
        if (gwNo) {
            code = gwNoLookup[originalCode] || code;
        }
        if (code) {
            geoJSON = countries[code];
            centroid = countryCentroids[code];
        } else {
            console.log("Code not found: " + originalCode);
        }
        var geoJSONLayer = new L.GeoJSON(geoJSON);
        return {
            location: geoJSONLayer,
            text: L.GeometryUtils.getName(geoJSON) || code,
            center: centroid
        };
    },
    COUNTRY: function(record, index) {
        var code = this.options.codeField ? L.Util.getFieldValue(record, this.options.codeField) : index;
        var geoJSON;
        var centroid;
        var codeLookup = L.codeLookup || {};
        var alpha2Lookup = L.alpha2Lookup || {};
        var fips2Lookup = L.fips2Lookup || {};
        var countries = L.countries || {};
        var countryCentroids = L.countryCentroids || {};
        var originalCode = code.toUpperCase();
        code = originalCode;
        if (code.length === 2) {
            code = alpha2Lookup[originalCode] || fips2Lookup[originalCode];
        } else if (code.length === 3) {
            code = codeLookup[originalCode] || code;
        }
        if (code) {
            geoJSON = countries[code];
            centroid = countryCentroids[code];
        } else {
            console.log("Code not found: " + originalCode);
        }
        var geoJSONLayer = new L.GeoJSON(geoJSON);
        return {
            location: geoJSONLayer,
            text: L.GeometryUtils.getName(geoJSON) || code,
            center: centroid
        };
    },
    STATE: function(record, index) {
        var code = this.options.codeField ? L.Util.getFieldValue(record, this.options.codeField) : index;
        var geoJSON;
        var centroid;
        var states = L.states || {};
        var stateCentroids = L.stateCentroids || {};
        var originalCode = code.toUpperCase();
        code = originalCode;
        geoJSON = states[code];
        centroid = stateCentroids[code];
        var geoJSONLayer = new L.GeoJSON(geoJSON);
        return {
            location: geoJSONLayer,
            text: L.GeometryUtils.getName(geoJSON) || code,
            center: centroid
        };
    },
    GEOJSON: function(record, index) {
        var locationField = this.options.geoJSONField;
        var geoJSON = locationField ? L.Util.getFieldValue(record, locationField) : record;
        var location = null;
        if (geoJSON) {
            var me = this;
            var recordToLayer = function(location, record) {
                return me.recordToLayer(location, record);
            };
            location = L.GeometryUtils.getGeoJSONLocation(geoJSON, record, this.options.locationTextField, recordToLayer);
        }
        return location;
    },
    LOOKUP: function(record, index) {
        var code = this.options.codeField ? L.Util.getFieldValue(record, this.options.codeField) : index;
        this._lookupIndex = this._lookupIndex || L.GeometryUtils.indexFeatureCollection(this.options.locationLookup, this.options.locationIndexField || this.options.codeField);
        var geoJSON = this._lookupIndex[code];
        var location = null;
        if (!geoJSON && code.indexOf("0") === 0) {
            geoJSON = this._lookupIndex[code.substring(1)];
        }
        if (geoJSON) {
            var me = this;
            var recordToLayer = function(location, record) {
                return me.recordToLayer(location, record);
            };
            location = L.GeometryUtils.getGeoJSONLocation(geoJSON, record, this.options.locationTextField, recordToLayer);
        }
        return location;
    },
    CUSTOM: function(record, index) {
        var locationField = this.options.codeField;
        var fieldValue = L.Util.getFieldValue(record, locationField);
        var context = {};
        var location;
        context[fieldValue] = record;
        if (this.options.getLocation) {
            var self = this;
            var callback = function(key, location) {
                self.locationToLayer(location, context[key]);
            };
            location = this.options.getLocation(context, locationField, [ fieldValue ], callback);
        }
        return location;
    }
};

L.DataLayer = L.LayerGroup.extend({
    includes: L.Mixin.Events,
    options: {
        recordsField: "features",
        locationMode: L.LocationModes.LATLNG,
        latitudeField: "geometry.coordinates.1",
        longitudeField: "geometry.coordinates.0",
        displayField: null,
        displayOptions: null,
        layerOptions: {
            numberOfSides: 4,
            radius: 10,
            weight: 1,
            color: "#000"
        },
        showLegendTooltips: true,
        tooltipOptions: {
            iconSize: new L.Point(60, 50),
            iconAnchor: new L.Point(-5, 50),
            mouseOverExaggeration: 2
        },
        setHighlight: function(layerStyle) {
            layerStyle.weight = layerStyle.weight || 1;
            layerStyle.fillOpacity = layerStyle.fillOpacity || .5;
            layerStyle.weight *= 2;
            layerStyle.fillOpacity /= 1.5;
            return layerStyle;
        },
        unsetHighlight: function(layerStyle) {
            layerStyle.weight = layerStyle.weight || 1;
            layerStyle.fillOpacity = layerStyle.fillOpacity || .25;
            layerStyle.weight /= 2;
            layerStyle.fillOpacity *= 1.5;
            return layerStyle;
        }
    },
    initialize: function(data, options) {
        L.Util.setOptions(this, options);
        L.LayerGroup.prototype.initialize.call(this, options);
        data = data || {};
        this._includeFunction = this.options.filter || this.options.includeLayer;
        this._markerFunction = this.options.getMarker || this._getMarker;
        this._addChildLayers();
        this.addData(data);
    },
    _addChildLayers: function() {
        this._boundaryLayer = new L.LayerGroup();
        this.addLayer(this._boundaryLayer);
        this._trackLayer = new L.LayerGroup();
        this.addLayer(this._trackLayer);
    },
    _zoomFunction: function(e) {
        var map = this._map;
        var self = this;
        var zoom = map.getZoom();
        if (this.options.maxZoom && zoom > this.options.maxZoom) {
            this.hiddenLayers = [];
            this.eachLayer(function(layer) {
                self.hiddenLayers.push(layer);
                map.removeLayer(layer);
            });
        } else if (this.hiddenLayers) {
            while (this.hiddenLayers.length > 0) {
                var layer = this.hiddenLayers.pop();
                map.addLayer(layer);
                if (this.options.backgroundLayer && layer.bringToBack) {
                    layer.bringToBack();
                }
            }
            this.hiddenLayers = null;
        }
    },
    onAdd: function(map) {
        L.LayerGroup.prototype.onAdd.call(this, map);
        map.on("zoomend", this._zoomFunction, this);
    },
    onRemove: function(map) {
        L.LayerGroup.prototype.onRemove.call(this, map);
        map.off("zoomend", this._zoomFunction, this);
    },
    bringToBack: function() {
        this.invoke("bringToBack");
        if (this._trackLayer) {
            this._trackLayer.invoke("bringToBack");
        }
        if (this._boundaryLayer) {
            this._boundaryLayer.invoke("bringToBack");
        }
    },
    bringToFront: function() {
        if (this._boundaryLayer) {
            this._boundaryLayer.invoke("bringToFront");
        }
        if (this._trackLayer) {
            this._trackLayer.invoke("bringToFront");
        }
        this.invoke("bringToFront");
    },
    getBounds: function() {
        var bounds;
        this.eachLayer(function(layer) {
            if (layer.getBounds) {
                if (!bounds) {
                    bounds = layer.getBounds();
                } else {
                    bounds.extend(layer.getBounds());
                }
            }
        });
        return bounds;
    },
    _getLocation: function(record, index) {
        return this.options.locationMode.call(this, record, index);
    },
    _processLocation: function(location) {
        var processedLocation = location.center;
        return processedLocation;
    },
    _styleBoundary: function(layer, options, record) {
        if (layer.setStyle) {
            var style;
            if (this.options.boundaryStyle instanceof Function) {
                style = this.options.boundaryStyle.call(this, record, layer);
            }
            style = style || this.options.boundaryStyle || L.extend({}, options, {
                fillOpacity: .2,
                clickable: false
            });
            layer.setStyle(style);
        }
        return layer;
    },
    _addBoundary: function(location, options, record) {
        var layer = location.location;
        var boundaryLayer;
        if (this.options.includeBoundary) {
            if (layer instanceof L.LatLngBounds) {
                layer = new L.Rectangle(layer);
            }
            layer = this._styleBoundary(layer, options, record);
            this._boundaryLayer.addLayer(layer);
            boundaryLayer = layer;
        }
        return boundaryLayer;
    },
    _getLayer: function(location, options, record) {
        var boundaryLayer = this._addBoundary(location, options, record);
        location = this._processLocation(location);
        var markerLayer;
        if (location) {
            markerLayer = this._markerFunction.call(this, location, options, record);
            markerLayer.boundaryLayer = boundaryLayer;
        }
        return markerLayer;
    },
    _getMarker: function(location, options, record) {
        var marker;
        if (location) {
            if (options.numberOfSides >= 30 && !(options.innerRadius || options.innerRadiusX && options.innerRadiusY)) {
                marker = new L.CircleMarker(location, options);
            } else {
                marker = new L.RegularPolygonMarker(location, options);
            }
        }
        return marker;
    },
    _preProcessRecords: function(records) {
        return records;
    },
    _shouldLoadRecord: function(record) {
        return this._includeFunction ? this._includeFunction.call(this, record) : true;
    },
    _loadRecords: function(records) {
        var location;
        records = this._preProcessRecords(records);
        for (var recordIndex in records) {
            if (records.hasOwnProperty(recordIndex)) {
                var record = records[recordIndex];
                record = this.options.deriveProperties ? this.options.deriveProperties(record) : record;
                var includeLayer = this._shouldLoadRecord(record);
                if (includeLayer) {
                    location = this._getLocation(record, recordIndex);
                    this.locationToLayer(location, record);
                }
            }
        }
    },
    _preloadLocations: function(records) {
        var locationField = this.options.codeField;
        var locationValues = [];
        var indexedRecords = {};
        for (var recordIndex in records) {
            if (records.hasOwnProperty(recordIndex)) {
                var record = records[recordIndex];
                var fieldValue = L.Util.getFieldValue(record, locationField);
                indexedRecords[fieldValue] = record;
                locationValues.push(fieldValue);
            }
        }
        if (this.options.getLocation) {
            var self = this;
            var callback = function(key, location) {
                self.locationToLayer(location, indexedRecords[key]);
            };
            this.options.getLocation(indexedRecords, locationField, locationValues, callback);
        }
    },
    setDisplayOptions: function(displayOptions) {
        this.options.displayOptions = displayOptions;
        this.reloadData();
        return this;
    },
    setDisplayOption: function(key, options) {
        this.options.displayOptions = this.options.displayOptions || {};
        if (key in this.options.displayOptions) {
            var existingOption = this.options.displayOptions[key];
            this.options.displayOptions[key] = L.extend({}, existingOption, options);
        } else {
            this.options.displayOptions[key] = options;
        }
        this.reloadData();
        return this;
    },
    setFilter: function(filterFunction) {
        this.options.filter = filterFunction;
        this.reloadData();
        return this;
    },
    setData: function(data) {
        this._data = data;
        this.reloadData();
    },
    reloadData: function() {
        if (!this._layerIndex) {
            this.clearLayers();
            this._addChildLayers();
        }
        if (this._data) {
            this.addData(this._data);
        }
        this.fire("legendChanged", this);
        return this;
    },
    addData: function(data) {
        var records = this.options.recordsField !== null && this.options.recordsField.length > 0 ? L.Util.getFieldValue(data, this.options.recordsField) : data;
        if (this.options.getIndexKey && !this._layerIndex) {
            this._layerIndex = {};
            this._boundaryIndex = {};
        }
        if (this.options.locationMode === L.LocationModes.CUSTOM && this.options.preload) {
            this._preloadLocations(records);
        } else {
            this._loadRecords(records);
        }
        this._data = data;
    },
    locationToLayer: function(location, record) {
        var layer;
        layer = this.recordToLayer(location, record);
        if (layer) {
            this.addLayer(layer);
        }
    },
    _bindMouseEvents: function(layer, layerOptions, legendDetails) {
        var self = this;
        var options = this.options;
        var setHighlight = options.setHighlight;
        var unsetHighlight = options.unsetHighlight;
        var tooltipOptions = options.tooltipOptions;
        var highlight = function(e) {
            var target = e.target;
            var layerOptions = this.options || target.options;
            var icon = new L.LegendIcon(legendDetails, layerOptions, {
                className: tooltipOptions.className || "leaflet-div-icon",
                iconSize: tooltipOptions.iconSize,
                iconAnchor: tooltipOptions.iconAnchor
            });
            var latlng = e.latlng || e.target._latlng;
            var tooltip = new L.Marker(latlng, {
                icon: icon
            });
            self.addLayer(tooltip);
            if (self.tooltip) {
                self.removeLayer(self.tooltip);
                self.tooltip = null;
            }
            self.tooltip = tooltip;
            if (setHighlight) {
                layerOptions = setHighlight(layerOptions);
            }
            if (target.setStyle) {
                target.setStyle(layerOptions);
            }
            target.isHighlighted = true;
        };
        var move = function(e) {
            if (self.tooltip) {
                self.tooltip.setLatLng(e.latlng);
            }
        };
        var unhighlight = function(e) {
            if (!e.target.isHighlighted) {
                return;
            }
            e.target.isHighlighted = false;
            if (self.tooltip) {
                self.removeLayer(self.tooltip);
                self.tooltip = null;
            }
            var target = e.target;
            var layerOptions = this.options || target.options;
            if (unsetHighlight) {
                layerOptions = unsetHighlight(layerOptions);
            }
            if (target.setStyle) {
                target.setStyle(layerOptions);
            }
        };
        var bindLayerEvents = function(layer) {
            layer.off("mouseover");
            layer.off("mouseout");
            layer.off("mousemove");
            layer.on({
                mouseover: highlight,
                mouseout: unhighlight,
                mousemove: move
            });
        };
        var bindEvents = function(layer) {
            if (layer.eachLayer) {
                layer.eachLayer(function(subLayer) {
                    bindEvents(subLayer);
                });
            } else {
                bindLayerEvents(layer);
            }
        };
        bindEvents(layer);
    },
    _getDynamicOptions: function(record) {
        var layerOptions = L.Util.extend({}, this.options.layerOptions);
        var displayOptions = this.options.displayOptions;
        var legendDetails = {};
        if (displayOptions) {
            for (var property in displayOptions) {
                var propertyOptions = displayOptions[property];
                var fieldValue = L.Util.getFieldValue(record, property);
                var valueFunction;
                var displayText = propertyOptions.displayText ? propertyOptions.displayText(fieldValue) : fieldValue;
                legendDetails[property] = {
                    name: propertyOptions.displayName,
                    value: displayText
                };
                if (propertyOptions.styles) {
                    layerOptions = L.Util.extend(layerOptions, propertyOptions.styles[fieldValue]);
                    propertyOptions.styles[fieldValue] = layerOptions;
                } else {
                    for (var layerProperty in propertyOptions) {
                        valueFunction = propertyOptions[layerProperty];
                        layerOptions[layerProperty] = valueFunction.evaluate ? valueFunction.evaluate(fieldValue) : valueFunction.call ? valueFunction.call(this, fieldValue) : valueFunction;
                    }
                }
            }
        }
        return {
            layerOptions: layerOptions,
            legendDetails: legendDetails
        };
    },
    _getIndexedLayer: function(index, location, layerOptions, record) {
        if (this.options.getIndexKey) {
            var indexKey = this.options.getIndexKey.call(this, location, record);
            if (indexKey in index) {
                layer = index[indexKey];
                var updateFunction = function(layer) {
                    if (layerOptions.radius && layer instanceof L.CircleMarker) {
                        layer.setRadius(layerOptions.radius);
                    }
                    layer.setStyle(layerOptions);
                    if (layer.setLatLng && layer.getLatLng() !== location.center) {
                        layer.setLatLng(location.center);
                    } else {
                        layer.redraw();
                    }
                };
                L.Util.updateLayer(layer, updateFunction);
                if (layer.boundaryLayer) {
                    layer.boundaryLayer = this._styleBoundary(layer.boundaryLayer, layerOptions, record);
                }
            } else {
                layer = this._getLayer(location, layerOptions, record);
                index[indexKey] = layer;
            }
            if (this.options.getTrack) {
                var shouldAdd = !layer.trackLayer;
                layer.trackLayer = this.options.getTrack.call(this, layer, location, layer.trackLayer);
                if (shouldAdd) {
                    this._trackLayer.addLayer(layer.trackLayer);
                }
            }
        } else {
            layer = this._getLayer(location, layerOptions, record);
        }
        return layer;
    },
    recordToLayer: function(location, record) {
        var layerOptions = L.Util.extend({}, this.options.layerOptions);
        var layer;
        var legendDetails = {};
        var includeLayer = true;
        var me = this;
        if (this._includeFunction) {
            includeLayer = this._includeFunction.call(this, record);
        }
        if (includeLayer) {
            var dynamicOptions = this._getDynamicOptions(record);
            layerOptions = dynamicOptions.layerOptions;
            legendDetails = dynamicOptions.legendDetails;
            if (location && layerOptions) {
                layerOptions.title = location.text;
                layer = this._getIndexedLayer(this._layerIndex, location, layerOptions, record);
                if (layer) {
                    if (this.options.showLegendTooltips) {
                        this._bindMouseEvents(layer, layerOptions, legendDetails);
                    }
                    if (this.options.onEachRecord) {
                        this.options.onEachRecord.call(this, layer, record, location, this);
                    }
                }
            }
        }
        return layer;
    },
    getLegend: function(legendOptions) {
        return this.options.getLegend ? this.options.getLegend.call(this, legendOptions) : this._getLegend(legendOptions);
    },
    _getLegendElement: function(params) {
        var displayMin;
        var displayMax;
        var i = document.createElement("i");
        var displayProperties = params.displayProperties;
        var layerOptions = params.layerOptions;
        var ignoreProperties = params.ignoreProperties;
        var displayTextFunction = params.displayTextFunction;
        var index = params.index;
        var numSegments = params.numSegments;
        var segmentWidth = params.segmentWidth;
        var minValue = params.minValue;
        var maxValue = params.maxValue;
        L.StyleConverter.applySVGStyle(i, layerOptions);
        for (var property in displayProperties) {
            if (ignoreProperties.indexOf(property) === -1) {
                valueFunction = displayProperties[property];
                if (valueFunction && (valueFunction.getBounds || displayProperties.minValue && displayProperties.maxValue)) {
                    var bounds = valueFunction.getBounds ? valueFunction.getBounds() : null;
                    var minX = bounds ? bounds[0].x : displayProperties.minValue;
                    var maxX = bounds ? bounds[1].x : displayProperties.maxValue;
                    var binFunction = new L.LinearFunction(new L.Point(0, minX), new L.Point(numSegments, maxX));
                    displayMin = minX;
                    displayMax = maxX;
                    if (displayTextFunction) {
                        displayMin = displayTextFunction(minX);
                        displayMax = displayTextFunction(maxX);
                    }
                    if (index === 0) {
                        minValue.innerHTML = displayMin;
                        maxValue.innerHTML = displayMax;
                    }
                    var segmentSize = (maxX - minX) / numSegments;
                    var x = binFunction.evaluate(index);
                    var nextX = binFunction.evaluate(index + 1);
                    var value = valueFunction.evaluate ? valueFunction.evaluate(x) : valueFunction(x);
                    var nextValue = valueFunction.evaluate ? valueFunction.evaluate(nextX) : valueFunction(nextX);
                    L.StyleConverter.setCSSProperty(i, property, value);
                    if (property === "fillColor") {
                        if (params.gradient) {
                            i.style.cssText += "background-image:linear-gradient(left , " + value + " 0%, " + nextValue + " 100%);" + "background-image:-ms-linear-gradient(left , " + value + " 0%, " + nextValue + " 100%);" + "background-image:-moz-linear-gradient(left , " + value + " 0%, " + nextValue + " 100%);" + "background-image:-webkit-linear-gradient(left , " + value + " 0%, " + nextValue + " 100%);";
                        } else {
                            i.style.cssText += "background-color:" + nextValue + ";";
                        }
                    }
                    if (property === "color") {
                        i.style.cssText += "border-top-color:" + value + ";" + "border-bottom-color:" + nextValue + ";" + "border-left-color:" + value + ";" + "border-right-color:" + nextValue + ";";
                    }
                    if (property === "weight") {
                        i.style.cssText += "border-top-width:" + value + ";" + "border-bottom-width:" + nextValue + ";" + "border-left-width:" + value + ";" + "border-right-width:" + nextValue + ";";
                    }
                    var min = segmentSize * index + minX;
                    var max = min + segmentSize;
                    if (displayTextFunction && valueFunction) {
                        min = displayTextFunction(min);
                        max = displayTextFunction(max);
                    }
                    i.setAttribute("title", min + " - " + max);
                }
            }
        }
        i.style.width = segmentWidth + "px";
        return i;
    },
    _getLegend: function(legendOptions) {
        legendOptions = legendOptions || this.options.legendOptions || {};
        var className = legendOptions.className;
        var container = document.createElement("div");
        var legendElement = L.DomUtil.create("div", "legend", container);
        var numSegments = legendOptions.numSegments || 10;
        var legendWidth = legendOptions.width || 100;
        var layerOptions = this.options.layerOptions || {};
        var weight = layerOptions.weight || 0;
        var segmentWidth = legendWidth / numSegments - 2 * weight;
        var displayText;
        var displayOptions = this.options.displayOptions || {};
        if (className) {
            L.DomUtil.addClass(legendElement, className);
        }
        if (legendOptions.title) {
            L.DomUtil.create("legend", "", legendElement).innerHTML = legendOptions.title;
        }
        var defaultFunction = function(value) {
            return value;
        };
        for (var field in displayOptions) {
            var displayProperties = displayOptions[field];
            if (!displayProperties.excludeFromLegend) {
                var displayName = displayProperties.displayName || field;
                displayText = displayProperties.displayText;
                var displayTextFunction = displayText ? displayText : defaultFunction;
                var styles = displayProperties.styles;
                L.DomUtil.create("div", "legend-title", legendElement).innerHTML = displayName;
                if (styles) {
                    legendElement.innerHTML += new L.CategoryLegend(styles).generate();
                } else {
                    var legendItems = L.DomUtil.create("div", "data-layer-legend");
                    var minValue = L.DomUtil.create("div", "min-value", legendItems);
                    var scaleBars = L.DomUtil.create("div", "scale-bars", legendItems);
                    var maxValue = L.DomUtil.create("div", "max-value", legendItems);
                    var ignoreProperties = [ "displayName", "displayText", "minValue", "maxValue" ];
                    for (var index = 0; index < numSegments; ++index) {
                        var legendParams = {
                            displayProperties: displayProperties,
                            layerOptions: layerOptions,
                            ignoreProperties: ignoreProperties,
                            displayTextFunction: displayTextFunction,
                            index: index,
                            numSegments: numSegments,
                            segmentWidth: segmentWidth,
                            minValue: minValue,
                            maxValue: maxValue,
                            gradient: legendOptions.gradient
                        };
                        var element = this._getLegendElement(legendParams);
                        scaleBars.appendChild(element);
                    }
                    legendElement.appendChild(legendItems);
                }
            }
        }
        return container.innerHTML;
    }
});

L.dataLayer = function(data, options) {
    return new L.DataLayer(data, options);
};

L.MapMarkerDataLayer = L.DataLayer.extend({
    _getMarker: function(latLng, layerOptions, record) {
        return new L.MapMarker(latLng, layerOptions);
    }
});

L.mapMarkerDataLayer = function(data, options) {
    return new L.MapMarkerDataLayer(data, options);
};

L.MarkerDataLayer = L.DataLayer.extend({
    initialize: function(data, options) {
        this._markerMap = {};
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    options: {
        recordsField: "features",
        locationMode: L.LocationModes.LATLNG,
        latitudeField: "latitude",
        longitudeField: "longitude",
        layerOptions: {
            icon: null
        },
        showLegendTooltips: false
    },
    _getMarker: function(latLng, layerOptions, record) {
        if (this.options.setIcon) {
            layerOptions.icon = this.options.setIcon.call(this, record, layerOptions);
        }
        return new L.Marker(latLng, layerOptions);
    },
    _getLegendElement: function(params) {},
    _getLegend: function(options) {
        return "<span>No legend available</span>";
    }
});

L.markerDataLayer = function(data, options) {
    return new L.MarkerDataLayer(data, options);
};

L.PanoramioLayer = L.MarkerDataLayer.extend({
    statics: {
        UPLOAD_DATE_FORMAT: "DD MMM YYYY",
        SIZE_BY_DATE: "date",
        SIZE_BY_POPULARITY: "popularity",
        SIZE_BY_NONE: "none",
        SIZES: {
            square: [ 60, 60 ],
            mini_square: [ 32, 32 ]
        },
        NUM_PHOTOS: 50
    }
});

L.PanoramioLayer = L.PanoramioLayer.extend({
    initialize: function(options) {
        L.MarkerDataLayer.prototype.initialize.call(this, {}, options);
        this._from = 0;
        this._to = L.PanoramioLayer.NUM_PHOTOS;
        this._calls = [];
    },
    options: {
        recordsField: "photos",
        latitudeField: "latitude",
        longitudeField: "longitude",
        locationMode: L.LocationModes.LATLNG,
        showLegendTooltips: false,
        sizeBy: L.PanoramioLayer.SIZE_BY_DATE,
        layerOptions: {
            opacity: 1
        },
        onEachRecord: function(layer, record) {
            var photoUrl = record["photo_file_url"];
            var title = record["photo_title"];
            var me = this;
            var width = record["width"];
            var height = record["height"];
            var offset = 2e4;
            layer.on("click", function(e) {
                var container = document.createElement("div");
                var content = L.DomUtil.create("div", "", container);
                var photo = L.DomUtil.create("img", "photo", content);
                photo.setAttribute("onload", "this.style.opacity=1;");
                photo.setAttribute("src", photoUrl);
                photo.style.width = width + "px";
                var photoInfo = L.DomUtil.create("div", "photo-info", content);
                photoInfo.style.width = width - 20 + "px";
                photoInfo.innerHTML = "<span>" + title + "</span>" + '<a class="photo-link" target="_blank" href="' + record["photo_url"] + '">' + '<img src="http://www.panoramio.com/img/glass/components/logo_bar/panoramio.png" style="height: 14px;"/>' + "</a>";
                var authorLink = L.DomUtil.create("a", "author-link", content);
                authorLink.setAttribute("target", "_blank");
                authorLink.setAttribute("href", record["owner_url"]);
                authorLink.innerHTML = "by " + record["owner_name"];
                var icon = new L.DivIcon({
                    className: "photo-details",
                    html: container.innerHTML,
                    iconAnchor: [ width / 2, height / 2 ]
                });
                var marker = new L.Marker(e.target._latlng, {
                    icon: icon,
                    zIndexOffset: offset
                });
                marker.on("click", function(e) {
                    me.removeLayer(e.target);
                });
                layer.viewedImage = marker;
                me.viewedImage = marker;
                me.addLayer(marker);
            });
            if (this.options.onEachPhoto) {
                this.options.onEachPhoto.call(this, layer, record);
            }
        },
        setIcon: function(record, options) {
            var title = L.Util.getFieldValue(record, "photo_title");
            var size = null;
            if (this._sizeFunction) {
                size = this._sizeFunction.evaluate(record.index);
            }
            var iconSize = size ? new L.Point(size, size) : L.PanoramioLayer.SIZES[this.options.size];
            var url = record["photo_file_url"].replace("/medium/", "/" + this.options.size + "/");
            var icon = new L.DivIcon({
                iconSize: iconSize,
                className: "",
                html: '<img class="photo" onload="this.style.opacity=1" title="' + title + '" src="' + url + '"/>'
            });
            return icon;
        },
        updateInterval: 3e5,
        size: "square",
        attributionText: 'Photos provided by <a href="http://www.panoramio.com"><img src="http://www.panoramio.com/img/glass/components/logo_bar/panoramio.png" style="height: 10px;"/></a>.  Photos provided by <a href="http://www.panoramio.com"><img src="http://www.panoramio.com/img/glass/components/logo_bar/panoramio.png" style="height: 10px;"/></a> are under the copyright of their owners',
        refreshEvents: "moveend",
        photoSet: "public"
    },
    includes: L.Mixin.Events,
    onAdd: function(map) {
        L.DataLayer.prototype.onAdd.call(this, map);
        if (map.attributionControl) {
            map.attributionControl.addAttribution(this.options.attributionText);
        }
        var me = this;
        var resetFunction = function(e) {
            me._from = 0;
            me._to = L.PanoramioLayer.NUM_PHOTOS;
            me.fire("requestingPhotos");
            if (me._call) {
                clearTimeout(me._call);
            }
            var request = function() {
                me.requestPhotos();
            };
            me._call = setTimeout(request, 1e3);
        };
        this.requestPhotos();
        this._interval = setInterval(resetFunction, this.options.updateInterval);
        this._resetFunction = resetFunction;
        map.on(this.options.refreshEvents, resetFunction);
    },
    onRemove: function(map) {
        L.DataLayer.prototype.onRemove.call(this, map);
        if (map.attributionControl) {
            map.attributionControl.removeAttribution(this.options.attributionText);
        }
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
        map.off(this.options.refreshEvents, this._resetFunction);
    },
    calculateSizeByDate: function(data) {
        var photos = data.photos;
        var timestamps = [];
        for (var i = 0; i < photos.length; ++i) {
            var photo = photos[i];
            var timestamp = moment(photo["upload_date"], L.PanoramioLayer.UPLOAD_DATE_FORMAT);
            timestamps.push(timestamp);
            photos[i].index = timestamp;
        }
        timestamps.sort(function(t1, t2) {
            return t1 - t2;
        });
        var size = L.PanoramioLayer.SIZES[this.options.size][0];
        this._sizeFunction = new L.LinearFunction([ timestamps[0], size / 2 ], [ timestamps[timestamps.length - 1], size ]);
        return data;
    },
    calculateSizeByPopularity: function(data) {
        var photos = data.photos;
        for (var i = 0; i < photos.length; ++i) {
            photos[i].index = i;
        }
        var size = L.PanoramioLayer.SIZES[this.options.size][0];
        this._sizeFunction = new L.LinearFunction([ 0, size / 2 ], [ photos.length, size ]);
        return data;
    },
    next: function() {
        this._from = this._to;
        this._to = this._from + L.PanoramioLayer.NUM_PHOTOS;
        this.requestPhotos();
    },
    previous: function() {
        this._to = this._from;
        this._from = this._from - L.PanoramioLayer.NUM_PHOTOS;
        this.requestPhotos();
    },
    requestJsonp: function(url, data, callback) {
        var self = this, key = "function" + new Date().getTime(), params = [];
        data.callback = "window.LeafletDvfJsonpCallbacks." + key;
        for (property in data) {
            if (data.hasOwnProperty(property)) {
                params.push(property + "=" + encodeURIComponent(data[property]));
            }
        }
        url += (url.indexOf("?") > 0 ? "&" : "?") + params.join("&");
        if (typeof window.LeafletDvfJsonpCallbacks === "undefined") {
            window.LeafletDvfJsonpCallbacks = {};
        }
        window.LeafletDvfJsonpCallbacks[key] = function(data) {
            callback.call(self, data);
            delete window.LeafletDvfJsonpCallbacks[key];
        };
        if (this.jsonpScript) {
            document.head.removeChild(this.jsonpScript);
            this.jsonpScript = null;
        }
        this.jsonpScript = document.createElement("script");
        this.jsonpScript.setAttribute("type", "text/javascript");
        this.jsonpScript.setAttribute("async", "true");
        this.jsonpScript.setAttribute("src", url);
        document.head.appendChild(this.jsonpScript);
        return {
            abort: function() {
                if (key in window.LeafletDvfJsonpCallbacks) {
                    window.LeafletDvfJsonpCallbacks[key] = function() {
                        delete window.LeafletDvfJsonpCallbacks[key];
                    };
                }
            }
        };
    },
    requestPhotos: function() {
        var me = this;
        var bounds = this._map.getBounds();
        var southWest = bounds.getSouthWest();
        var northEast = bounds.getNorthEast();
        while (me._calls.length > 0) {
            me._calls.pop().abort();
        }
        var request = this.requestJsonp("http://www.panoramio.com/map/get_panoramas.php", {
            set: this.options.photoSet,
            from: me._from,
            to: me._to,
            minx: southWest.lng,
            miny: southWest.lat,
            maxx: northEast.lng,
            maxy: northEast.lat,
            size: "medium",
            mapfilter: "true"
        }, function(data) {
            me._count = data.count;
            if (moment && me.options.sizeBy === L.PanoramioLayer.SIZE_BY_DATE) {
                data = me.calculateSizeByDate(data);
            } else if (me.options.sizeBy === L.PanoramioLayer.SIZE_BY_POPULARITY) {
                data = me.calculateSizeByPopularity(data);
            }
            me.fire("photosAvailable", data);
            me.clearLayers();
            me.addData(data);
        });
        me._calls.push(request);
    }
});

L.panoramioLayer = function(options) {
    return new L.PanoramioLayer(options);
};

L.GeohashDataLayer = L.DataLayer.extend({
    initialize: function(data, options) {
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    options: {
        recordsField: "features",
        locationMode: L.LocationModes.GEOHASH,
        geohashField: "geohash",
        displayField: null,
        displayOptions: null,
        layerOptions: {
            weight: 1,
            color: "#000"
        },
        getIndexKey: function(location, record) {
            return location.text;
        }
    },
    _getLayer: function(geohash, layerOptions, record) {
        return new L.Rectangle(geohash.location, layerOptions);
    }
});

L.geohashDataLayer = function(data, options) {
    return new L.GeohashDataLayer(data, options);
};

L.ChoroplethDataLayer = L.DataLayer.extend({
    initialize: function(data, options) {
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    options: {
        recordsField: "features",
        locationMode: L.LocationModes.COUNTRY,
        codeField: "ISO",
        displayField: null,
        displayOptions: null,
        layerOptions: {
            weight: 1,
            color: "#000"
        },
        maxZoom: 16,
        backgroundLayer: true
    },
    _getLayer: function(location, layerOptions, record) {
        if (location.location instanceof L.LatLng) {
            location.location = this._markerFunction.call(this, location.location, layerOptions, record);
        }
        if (location.location.setStyle) {
            layerOptions.gradient = location.location instanceof L.Polyline ? false : layerOptions.gradient;
            location.location.setStyle(layerOptions);
        }
        return location.location;
    }
});

L.choroplethDataLayer = function(data, options) {
    return new L.ChoroplethDataLayer(data, options);
};

L.ChartDataLayer = L.DataLayer.extend({
    options: {
        showLegendTooltips: false
    },
    initialize: function(data, options) {
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    _getLayer: function(latLng, layerOptions, record) {
        var boundaryLayer = this._addBoundary(latLng, layerOptions, record);
        latLng = this._processLocation(latLng);
        var chartOptions = this.options.chartOptions;
        var tooltipOptions = this.options.tooltipOptions;
        var options = {};
        options = layerOptions;
        options.data = {};
        options.chartOptions = chartOptions;
        for (var key in this.options.chartOptions) {
            options.data[key] = this.options.getFieldValue ? this.options.getFieldValue.call(this, record, key) : L.Util.getFieldValue(record, key);
        }
        for (var key in tooltipOptions) {
            options[key] = tooltipOptions[key];
        }
        var marker;
        if (latLng) {
            marker = this._getMarker(latLng, options);
            marker.boundaryLayer = boundaryLayer;
        }
        return marker;
    },
    _getMarker: function(latLng, options) {},
    _getLegend: function(legendOptions) {
        var dataLayerLegend = L.DataLayer.prototype._getLegend.call(this, legendOptions);
        var legend = new L.CategoryLegend(this.options.chartOptions);
        legendOptions = legendOptions || this.options.legendOptions;
        return legend.generate(legendOptions);
    }
});

L.BarChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.BarChartMarker(latLng, options);
    }
});

L.barChartDataLayer = function(data, options) {
    return new L.BarChartDataLayer(data, options);
};

L.RadialBarChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.RadialBarChartMarker(latLng, options);
    }
});

L.radialBarChartDataLayer = function(data, options) {
    return new L.RadialBarChartDataLayer(data, options);
};

L.PieChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.PieChartMarker(latLng, options);
    }
});

L.pieChartDataLayer = function(data, options) {
    return new L.PieChartDataLayer(data, options);
};

L.CoxcombChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.CoxcombChartMarker(latLng, options);
    }
});

L.coxcombChartDataLayer = function(data, options) {
    return new L.CoxcombChartDataLayer(data, options);
};

L.StackedRegularPolygonDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.StackedRegularPolygonMarker(latLng, options);
    }
});

L.stackedRegularPolygonDataLayer = function(data, options) {
    return new L.StackedRegularPolygonDataLayer(data, options);
};

L.StackedPieChartDataLayer = L.ChartDataLayer.extend({
    initialize: function(data, options) {
        L.ChartDataLayer.prototype.initialize.call(this, data, options);
    },
    _getMarker: function(latLng, options) {
        return new L.StackedPieChartMarker(latLng, options);
    }
});

L.stackedPieChartDataLayer = function(data, options) {
    return new L.StackedPieChartDataLayer(data, options);
};

L.RadialMeterMarkerDataLayer = L.DataLayer.extend({
    options: {
        showLegendTooltips: false
    },
    initialize: function(data, options) {
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    _getLayer: function(latLng, layerOptions, record) {
        this._addBoundary(latLng, layerOptions);
        latLng = this._processLocation(latLng);
        var chartOptions = this.options.chartOptions;
        var tooltipOptions = this.options.tooltipOptions;
        var displayOptions = this.options.displayOptions;
        var options = {};
        options = layerOptions;
        options.data = {};
        options.chartOptions = chartOptions;
        options.displayOptions = displayOptions;
        for (var key in this.options.chartOptions) {
            options.data[key] = L.Util.getFieldValue(record, key);
        }
        for (var key in tooltipOptions) {
            options[key] = tooltipOptions[key];
        }
        var marker;
        if (latLng) {
            marker = this._getMarker(latLng, options);
        }
        return marker;
    },
    _getMarker: function(latLng, options) {
        return new L.RadialMeterMarker(latLng, options);
    }
});

L.radialMeterMarkerDataLayer = function(data, options) {
    return new L.RadialMeterMarkerDataLayer(data, options);
};

L.CalloutLine = L.Path.extend({
    statics: {
        LINESTYLE: {
            ARC: "arc",
            ANGLE: "angle",
            STRAIGHT: "straight"
        },
        DIRECTION: {
            NE: "ne",
            NW: "nw",
            SE: "se",
            SW: "sw"
        }
    }
});

L.CalloutLine = L.CalloutLine.extend({
    initialize: function(latlng, options) {
        L.Util.setOptions(this, options);
        L.Path.prototype.initialize.call(this, options);
        this._latlng = latlng;
    },
    options: {
        size: new L.Point(60, 30),
        position: new L.Point(0, 0),
        color: "#FFFFFF",
        opacity: 1,
        weight: 2,
        fillColor: "#000000",
        fill: false,
        gradient: false,
        dropShadow: false,
        direction: L.CalloutLine.DIRECTION.NE,
        lineStyle: L.CalloutLine.LINESTYLE.ANGLE,
        lineCap: "butt",
        lineJoin: "miter",
        arrow: false
    },
    projectLatlngs: function() {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._points = this._getPoints();
    },
    getEndPoint: function() {
        this.projectLatlngs();
        return this._points[this._points.length - 1];
    },
    _getPathAngle: function() {
        return new L.SVGPathBuilder(this._points, [], {
            closePath: false
        }).build(6);
    },
    _getPathArc: function() {
        var direction = (this.options.direction || L.CalloutLine.DIRECTION.NE).toLowerCase();
        var yDirection = direction[0];
        var yMultiplier = yDirection === "n" ? -1 : 1;
        var point1 = this._points[0];
        var point2 = this._points[this._points.length - 1];
        var parts = [ "M", point1.x, ",", point1.y, " Q", point1.x, ",", point1.y + yMultiplier * this.options.size.y, " ", point2.x, ",", point2.y ];
        return parts.join(" ");
    },
    _getPoints: function() {
        var x = this._point.x + this.options.position.x;
        var y = this._point.y + this.options.position.y;
        var width = this.options.size.x;
        var height = this.options.size.y;
        var direction = (this.options.direction || L.CalloutLine.DIRECTION.NE).toLowerCase();
        var points = [];
        var xDirection = direction[1];
        var yDirection = direction[0];
        var xMultiplier = xDirection === "w" ? -1 : 1;
        var yMultiplier = yDirection === "n" ? -1 : 1;
        points.push(new L.Point(x, y));
        var yEnd = y + yMultiplier * height;
        var halfWidth = width / 2;
        var angle = Math.atan(height / halfWidth);
        if (this.options.lineStyle === L.CalloutLine.LINESTYLE.ARC) {
            angle = Math.atan(Math.pow(height, 2) / halfWidth);
        } else if (this.options.lineStyle === L.CalloutLine.LINESTYLE.STRAIGHT) {
            angle = Math.atan(height / width);
        }
        this._angle = angle;
        if (this.options.lineStyle !== L.CalloutLine.LINESTYLE.STRAIGHT) {
            var elbowPoint = new L.Point(x + xMultiplier * halfWidth, yEnd);
            points.push(elbowPoint);
        }
        var endPoint = new L.Point(x + xMultiplier * width, yEnd);
        points.push(endPoint);
        return points;
    },
    getBounds: function() {
        var map = this._map, point = map.project(this._latlng), swPoint = new L.Point(point.x + this.options.position.x, point.y + this.options.position.y), nePoint = new L.Point(swPoint.x + this.options.size.x, swPoint.y - this.options.size.y), sw = map.unproject(swPoint), ne = map.unproject(nePoint);
        return new L.LatLngBounds(sw, ne);
    },
    setLatLng: function(latlng) {
        this._latlng = latlng;
        this.redraw();
    },
    getLatLng: function() {
        return this._latlng;
    },
    getPathString: function() {
        this._path.setAttribute("shape-rendering", "geometricPrecision");
        var lineStyle = this.options.lineStyle || L.CalloutLine.LINESTYLE.ANGLE;
        var path = "";
        if (lineStyle === L.CalloutLine.LINESTYLE.ANGLE || lineStyle === L.CalloutLine.LINESTYLE.STRAIGHT) {
            path += this._getPathAngle();
        } else {
            path += this._getPathArc();
        }
        return path;
    }
});

L.calloutLine = function(latlng, options) {
    return new L.CalloutLine(latlng, options);
};

L.Callout = L.LayerGroup.extend({
    options: {
        color: "#FFFFFF",
        fillColor: "#FFFFFF"
    },
    initialize: function(latlng, options) {
        L.Util.setOptions(this, options);
        L.LayerGroup.prototype.initialize.call(this, options);
        this._latlng = latlng;
    },
    onAdd: function(map) {
        L.LayerGroup.prototype.onAdd.call(this, map);
        this.addLayers();
    },
    onRemove: function(map) {
        L.LayerGroup.prototype.onRemove.call(this, map);
        this.clearLayers();
    },
    addArrow: function(angle, direction, position) {
        if (this.options.arrow) {
            var angle = L.LatLng.RAD_TO_DEG * angle;
            var numberOfSides = this.options.numberOfSides || 3;
            var radius = this.options.radius || 6;
            var startRotation = 180 / numberOfSides;
            var offsets = {
                se: startRotation + angle,
                sw: 180 + startRotation - angle,
                nw: 180 + startRotation + angle,
                ne: startRotation - angle
            };
            var rotation = offsets[direction];
            var arrow = new L.RegularPolygonMarker(this._latlng, {
                position: position,
                numberOfSides: numberOfSides,
                rotation: rotation,
                fillColor: this.options.fillColor,
                color: this.options.color,
                gradient: this.options.gradient,
                weight: this.options.weight,
                opacity: this.options.opacity,
                fillOpacity: this.options.fillOpacity,
                radius: radius,
                lineCap: "butt",
                lineJoin: "miter"
            });
            this.addLayer(arrow);
        }
    },
    addLine: function() {
        var lineOptions = {};
        for (var key in this.options) {
            if (key !== "icon") {
                lineOptions[key] = this.options[key];
            }
        }
        var calloutLine = new L.CalloutLine(this._latlng, lineOptions);
        this.addLayer(calloutLine);
        return calloutLine;
    },
    addIcon: function(direction, position) {
        var size = this.options.size;
        var icon = this.options.icon;
        var iconSize = icon.options.iconSize;
        var yDirection = direction[0];
        var xDirection = direction[1];
        var xAnchor = xDirection === "w" ? iconSize.x + size.x - position.x : -1 * (size.x + position.x);
        var yAnchor = yDirection === "n" ? iconSize.y / 2 + size.y - position.y : -1 * (-iconSize.y / 2 + size.y + position.y);
        icon.options.iconAnchor = new L.Point(xAnchor, yAnchor);
        var iconMarker = new L.Marker(this._latlng, {
            icon: icon
        });
        this.addLayer(iconMarker);
    },
    addLayers: function() {
        var direction = (this.options.direction || "ne").toLowerCase();
        var position = this.options.position || new L.Point(0, 0);
        var calloutLine;
        calloutLine = this.addLine();
        this.addIcon(direction, position);
        this.addArrow(calloutLine._angle, direction, position);
    }
});

L.callout = function(latlng, options) {
    return new L.Callout(latlng, options);
};

L.FlowLine = L.DataLayer.extend({
    statics: {
        LINE_FUNCTION: function(latlng1, latlng2, options) {
            return new L.Polyline([ latlng1, latlng2 ], options);
        },
        LINE_FUNCTION_INTERPOLATED: function(latlng1, latlng2, options) {
            var point1 = this._map.latlngToLayerPoint(latlng1);
            var point2 = this._map.latlngToLayerPoint(latlng2);
            var lineFunction = new L.LinearFunction(point1, point2);
            var numPoints = Math.ceil(point1.distanceTo(point2) / options.interpolationOptions.segmentLength);
            var points = lineFunction.samplePoints(numPoints);
        }
    }
});

L.FlowLine = L.FlowLine.extend({
    initialize: function(data, options) {
        L.Util.setOptions(this, options);
        L.DataLayer.prototype.initialize.call(this, data, options);
    },
    options: {
        getLine: L.FlowLine.LINE_FUNCTION
    },
    onEachSegment: function(record1, record2, line) {
        var deltas = {};
        if (this.options.timeField) {
            var timeValue1 = L.Util.getFieldValue(record1, this.options.timeField);
            var timeValue2 = L.Util.getFieldValue(record2, this.options.timeField);
            var format = this.options.timeFormat;
            var moment1 = format ? moment(timeValue1, format) : moment(timeValue1);
            var moment2 = format ? moment(timeValue2, format) : moment(timeValue2);
            var deltaTime = moment2.valueOf() - moment1.valueOf();
            deltas.time = deltaTime;
        }
        for (var key in this.options.displayOptions) {
            var value1 = L.Util.getFieldValue(record1, key);
            var value2 = L.Util.getFieldValue(record2, key);
            var change = value2 - value1;
            var percentChange = change / value1 * 100;
            deltas[key] = {
                from: value1,
                to: value2,
                change: change,
                percentChange: percentChange
            };
            if (deltas.time) {
                deltas[key].changeOverTime = change / deltas.time;
            }
        }
        var latlngs = line.getLatLngs();
        var distance = latlngs[0].distanceTo(latlngs[1]);
        var velocity;
        if (deltas.time) {
            velocity = distance / (deltas.time * 1e3);
        }
        if (this.options.onEachSegment) {
            this.options.onEachSegment.call(this, record1, record2, line, deltas, distance, velocity);
        }
    },
    _loadRecords: function(records) {
        var markers = [];
        this._lastRecord = null;
        for (var recordIndex in records) {
            if (records.hasOwnProperty(recordIndex)) {
                var record = records[recordIndex];
                markers = this._addRecord(record, recordIndex, markers);
            }
        }
        while (markers.length > 0) {
            this.addLayer(markers.pop());
        }
    },
    addRecord: function(record) {
        this._addRecord(record);
        return this;
    },
    _addRecord: function(record, recordIndex, markers) {
        var location = this._getLocation(record, recordIndex);
        var options = this.options.layerOptions;
        if (location) {
            var marker = this._getLayer(location, options, record);
            var line;
            var includeLayer = true;
            if (this.options.includeLayer) {
                includeLayer = this.options.includeLayer(record);
            }
            if (this._lastRecord && includeLayer) {
                var options = this._getDynamicOptions(this._lastRecord);
                line = this.options.getLine.call(this, this._lastMarker.getLatLng(), marker.getLatLng(), options.layerOptions);
                this.addLayer(line);
                this.onEachSegment(this._lastRecord, record, line);
            }
            if (includeLayer) {
                this._lastRecord = record;
                this._lastMarker = marker;
            }
        }
        return markers;
    }
});

L.flowLine = function(data, options) {
    return new L.FlowLine(data, options);
};

L.ArcedFlowLine = L.FlowLine.extend({
    options: {
        getLine: function(latlng1, latlng2, options) {
            return new L.ArcedPolyline([ latlng1, latlng2 ], options);
        }
    },
    initialize: function(data, options) {
        L.FlowLine.prototype.initialize.call(this, data, options);
    }
});

L.arcedFlowLine = function(data, options) {
    return new L.ArcedFlowLine(data, options);
};

L.ArcedPolyline = L.Path.extend({
    includes: TextFunctions,
    initialize: function(latlngs, options) {
        L.Path.prototype.initialize.call(this, options);
        this._latlngs = latlngs;
    },
    options: {
        distanceToHeight: new L.LinearFunction([ 0, 5 ], [ 1e3, 200 ]),
        color: "#FFFFFF",
        opacity: 1,
        weight: 1,
        fillColor: "#000000",
        fill: false,
        gradient: false,
        dropShadow: false,
        optimizeSpeed: false
    },
    projectLatlngs: function() {
        this._points = [];
        for (var i = 0; i < this._latlngs.length; ++i) {
            this._points.push(this._map.latLngToLayerPoint(this._latlngs[i]));
        }
    },
    getBounds: function() {
        var bounds = new L.LatLngBounds();
        for (var i = 0; i < this._latlngs.length; ++i) {
            bounds.extend(this._latlngs[i]);
        }
        return bounds;
    },
    setLatLngs: function(latlngs) {
        this._latlngs = latlngs;
        this.redraw();
    },
    getLatLngs: function() {
        return this._latlngs;
    },
    drawSegment: function(point1, point2) {
        var distance = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        var heightOffset = this.options.distanceToHeight.evaluate(distance);
        var parts = [ "M", point1.x, ",", point1.y, " C", point1.x, ",", point1.y - heightOffset, " ", point2.x, ",", point2.y - heightOffset, " ", point2.x, ",", point2.y ];
        return parts.join(" ");
    },
    getPathString: function() {
        if (this.options.optimizeSpeed) {
            this._path.setAttribute("shape-rendering", "optimizeSpeed");
        }
        var parts = [];
        for (var i = 0; i < this._points.length - 1; ++i) {
            parts.push(this.drawSegment(this._points[i], this._points[i + 1]));
        }
        return parts.join("");
    }
});

L.arcedPolyline = function(latlngs, options) {
    return new L.ArcedPolyline(latlngs, options);
};

L.Control.Legend = L.Control.extend({
    options: {
        position: "bottomright",
        autoAdd: true
    },
    onAdd: function(map) {
        var className = "leaflet-control-legend", container = L.DomUtil.create("div", className);
        var self = this;
        if (this.options.autoAdd) {
            map.on("layeradd", function(e) {
                var layer = e.layer;
                self.addLayer(layer);
            });
            map.on("layerremove", function(e) {
                var layer = e.layer;
                self.removeLayer(layer);
            });
        }
        this.toggleSize = L.bind(this.toggleSize, this);
        L.DomEvent.addListener(container, "mouseover", this.toggleSize).addListener(container, "mouseout", this.toggleSize).addListener(container, "touchstart", this.toggleSize).addListener(container, "touchend", this.toggleSize).addListener(container, "click", L.DomEvent.stopPropagation).addListener(container, "click", L.DomEvent.preventDefault);
        return container;
    },
    clear: function() {
        this._container.innerHTML = "";
    },
    toggleSize: function() {
        if (L.DomUtil.hasClass(this._container, "larger")) {
            L.DomUtil.removeClass(this._container, "larger");
        } else {
            L.DomUtil.addClass(this._container, "larger");
        }
    },
    redrawLayer: function(layer) {
        this.removeLayer(layer);
        this.addLayer(layer);
    },
    addLayer: function(layer) {
        var id = L.Util.stamp(layer);
        var me = this;
        if (layer.getLegend) {
            this.addLegend(id, layer.getLegend());
            layer.on("legendChanged", function() {
                me.redrawLayer(layer);
            });
        }
    },
    removeLayer: function(layer) {
        var id = L.Util.stamp(layer);
        if (layer.getLegend) {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
            layer.off("legendChanged");
        }
    },
    addLegend: function(id, html) {
        var container = this._container, legend = document.getElementById(id);
        if (!legend) {
            legend = L.DomUtil.create("div", "", container);
            legend.id = id;
        }
        legend.innerHTML = html;
    }
});

L.control.legend = function(options) {
    return new L.Control.Legend(options);
};;/*
RainbowVis-JS 
Released under Eclipse Public License - v 1.0
*/

function Rainbow()
{
	"use strict";
	var gradients = null;
	var minNum = 0;
	var maxNum = 100;
	var colours = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
	setColours(colours);
	
	function setColours (spectrum) 
	{
		if (spectrum.length < 2) {
			throw new Error('Rainbow must have two or more colours.');
		} else {
			var increment = (maxNum - minNum)/(spectrum.length - 1);
			var firstGradient = new ColourGradient();
			firstGradient.setGradient(spectrum[0], spectrum[1]);
			firstGradient.setNumberRange(minNum, minNum + increment);
			gradients = [ firstGradient ];
			
			for (var i = 1; i < spectrum.length - 1; i++) {
				var colourGradient = new ColourGradient();
				colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
				colourGradient.setNumberRange(minNum + increment * i, minNum + increment * (i + 1)); 
				gradients[i] = colourGradient; 
			}

			colours = spectrum;
		}
	}

	this.setSpectrum = function () 
	{
		setColours(arguments);
		return this;
	}

	this.setSpectrumByArray = function (array)
	{
		setColours(array);
		return this;
	}

	this.colourAt = function (number)
	{
		if (isNaN(number)) {
			throw new TypeError(number + ' is not a number');
		} else if (gradients.length === 1) {
			return gradients[0].colourAt(number);
		} else {
			var segment = (maxNum - minNum)/(gradients.length);
			var index = Math.min(Math.floor((Math.max(number, minNum) - minNum)/segment), gradients.length - 1);
			return gradients[index].colourAt(number);
		}
	}

	this.colorAt = this.colourAt;

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
			setColours(colours);
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
		return this;
	}
}

function ColourGradient() 
{
	"use strict";
	var startColour = 'ff0000';
	var endColour = '0000ff';
	var minNum = 0;
	var maxNum = 100;

	this.setGradient = function (colourStart, colourEnd)
	{
		startColour = getHexColour(colourStart);
		endColour = getHexColour(colourEnd);
	}

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
	}

	this.colourAt = function (number)
	{
		return calcHex(number, startColour.substring(0,2), endColour.substring(0,2)) 
			+ calcHex(number, startColour.substring(2,4), endColour.substring(2,4)) 
			+ calcHex(number, startColour.substring(4,6), endColour.substring(4,6));
	}
	
	function calcHex(number, channelStart_Base16, channelEnd_Base16)
	{
		var num = number;
		if (num < minNum) {
			num = minNum;
		}
		if (num > maxNum) {
			num = maxNum;
		} 
		var numRange = maxNum - minNum;
		var cStart_Base10 = parseInt(channelStart_Base16, 16);
		var cEnd_Base10 = parseInt(channelEnd_Base16, 16); 
		var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
		var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
		return formatHex(c_Base10.toString(16));
	}

	function formatHex(hex) 
	{
		if (hex.length === 1) {
			return '0' + hex;
		} else {
			return hex;
		}
	} 
	
	function isHexColour(string)
	{
		var regex = /^#?[0-9a-fA-F]{6}$/i;
		return regex.test(string);
	}

	function getHexColour(string)
	{
		if (isHexColour(string)) {
			return string.substring(string.length - 6, string.length);
		} else {
			var name = string.toLowerCase();
			if (colourNames.hasOwnProperty(name)) {
				return colourNames[name];
			}
			throw new Error(string + ' is not a valid colour.');
		}
	}
	
	// Extended list of CSS colornames s taken from
	// http://www.w3.org/TR/css3-color/#svg-color
	var colourNames = {
		aliceblue: "F0F8FF",
		antiquewhite: "FAEBD7",
		aqua: "00FFFF",
		aquamarine: "7FFFD4",
		azure: "F0FFFF",
		beige: "F5F5DC",
		bisque: "FFE4C4",
		black: "000000",
		blanchedalmond: "FFEBCD",
		blue: "0000FF",
		blueviolet: "8A2BE2",
		brown: "A52A2A",
		burlywood: "DEB887",
		cadetblue: "5F9EA0",
		chartreuse: "7FFF00",
		chocolate: "D2691E",
		coral: "FF7F50",
		cornflowerblue: "6495ED",
		cornsilk: "FFF8DC",
		crimson: "DC143C",
		cyan: "00FFFF",
		darkblue: "00008B",
		darkcyan: "008B8B",
		darkgoldenrod: "B8860B",
		darkgray: "A9A9A9",
		darkgreen: "006400",
		darkgrey: "A9A9A9",
		darkkhaki: "BDB76B",
		darkmagenta: "8B008B",
		darkolivegreen: "556B2F",
		darkorange: "FF8C00",
		darkorchid: "9932CC",
		darkred: "8B0000",
		darksalmon: "E9967A",
		darkseagreen: "8FBC8F",
		darkslateblue: "483D8B",
		darkslategray: "2F4F4F",
		darkslategrey: "2F4F4F",
		darkturquoise: "00CED1",
		darkviolet: "9400D3",
		deeppink: "FF1493",
		deepskyblue: "00BFFF",
		dimgray: "696969",
		dimgrey: "696969",
		dodgerblue: "1E90FF",
		firebrick: "B22222",
		floralwhite: "FFFAF0",
		forestgreen: "228B22",
		fuchsia: "FF00FF",
		gainsboro: "DCDCDC",
		ghostwhite: "F8F8FF",
		gold: "FFD700",
		goldenrod: "DAA520",
		gray: "808080",
		green: "008000",
		greenyellow: "ADFF2F",
		grey: "808080",
		honeydew: "F0FFF0",
		hotpink: "FF69B4",
		indianred: "CD5C5C",
		indigo: "4B0082",
		ivory: "FFFFF0",
		khaki: "F0E68C",
		lavender: "E6E6FA",
		lavenderblush: "FFF0F5",
		lawngreen: "7CFC00",
		lemonchiffon: "FFFACD",
		lightblue: "ADD8E6",
		lightcoral: "F08080",
		lightcyan: "E0FFFF",
		lightgoldenrodyellow: "FAFAD2",
		lightgray: "D3D3D3",
		lightgreen: "90EE90",
		lightgrey: "D3D3D3",
		lightpink: "FFB6C1",
		lightsalmon: "FFA07A",
		lightseagreen: "20B2AA",
		lightskyblue: "87CEFA",
		lightslategray: "778899",
		lightslategrey: "778899",
		lightsteelblue: "B0C4DE",
		lightyellow: "FFFFE0",
		lime: "00FF00",
		limegreen: "32CD32",
		linen: "FAF0E6",
		magenta: "FF00FF",
		maroon: "800000",
		mediumaquamarine: "66CDAA",
		mediumblue: "0000CD",
		mediumorchid: "BA55D3",
		mediumpurple: "9370DB",
		mediumseagreen: "3CB371",
		mediumslateblue: "7B68EE",
		mediumspringgreen: "00FA9A",
		mediumturquoise: "48D1CC",
		mediumvioletred: "C71585",
		midnightblue: "191970",
		mintcream: "F5FFFA",
		mistyrose: "FFE4E1",
		moccasin: "FFE4B5",
		navajowhite: "FFDEAD",
		navy: "000080",
		oldlace: "FDF5E6",
		olive: "808000",
		olivedrab: "6B8E23",
		orange: "FFA500",
		orangered: "FF4500",
		orchid: "DA70D6",
		palegoldenrod: "EEE8AA",
		palegreen: "98FB98",
		paleturquoise: "AFEEEE",
		palevioletred: "DB7093",
		papayawhip: "FFEFD5",
		peachpuff: "FFDAB9",
		peru: "CD853F",
		pink: "FFC0CB",
		plum: "DDA0DD",
		powderblue: "B0E0E6",
		purple: "800080",
		red: "FF0000",
		rosybrown: "BC8F8F",
		royalblue: "4169E1",
		saddlebrown: "8B4513",
		salmon: "FA8072",
		sandybrown: "F4A460",
		seagreen: "2E8B57",
		seashell: "FFF5EE",
		sienna: "A0522D",
		silver: "C0C0C0",
		skyblue: "87CEEB",
		slateblue: "6A5ACD",
		slategray: "708090",
		slategrey: "708090",
		snow: "FFFAFA",
		springgreen: "00FF7F",
		steelblue: "4682B4",
		tan: "D2B48C",
		teal: "008080",
		thistle: "D8BFD8",
		tomato: "FF6347",
		turquoise: "40E0D0",
		violet: "EE82EE",
		wheat: "F5DEB3",
		white: "FFFFFF",
		whitesmoke: "F5F5F5",
		yellow: "FFFF00",
		yellowgreen: "9ACD32"
	}
}

;/*! shepherd 0.7.0 */
!function(t,e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e(require,exports,module):t.Tether=e()}(this,function(){return function(){var t,e,i,o,n,s,r,h,l,a,p,u,f,c,d,g,m,v={}.hasOwnProperty,b=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1},y=[].slice;null==this.Tether&&(this.Tether={modules:[]}),p=function(t){var e,i,o,n,s;if(i=getComputedStyle(t).position,"fixed"===i)return t;for(o=void 0,e=t;e=e.parentNode;){try{n=getComputedStyle(e)}catch(r){}if(null==n)return e;if(/(auto|scroll)/.test(n.overflow+n["overflow-y"]+n["overflow-x"])&&("absolute"!==i||"relative"===(s=n.position)||"absolute"===s||"fixed"===s))return e}return document.body},d=function(){var t;return t=0,function(){return t++}}(),m={},l=function(t){var e,o,s,r,h;if(s=t._tetherZeroElement,null==s&&(s=t.createElement("div"),s.setAttribute("data-tether-id",d()),n(s.style,{top:0,left:0,position:"absolute"}),t.body.appendChild(s),t._tetherZeroElement=s),e=s.getAttribute("data-tether-id"),null==m[e]){m[e]={},h=s.getBoundingClientRect();for(o in h)r=h[o],m[e][o]=r;i(function(){return m[e]=void 0})}return m[e]},f=null,r=function(t){var e,i,o,n,s,r,h;t===document?(i=document,t=document.documentElement):i=t.ownerDocument,o=i.documentElement,e={},h=t.getBoundingClientRect();for(n in h)r=h[n],e[n]=r;return s=l(i),e.top-=s.top,e.left-=s.left,null==e.width&&(e.width=document.body.scrollWidth-e.left-e.right),null==e.height&&(e.height=document.body.scrollHeight-e.top-e.bottom),e.top=e.top-o.clientTop,e.left=e.left-o.clientLeft,e.right=i.body.clientWidth-e.width-e.left,e.bottom=i.body.clientHeight-e.height-e.top,e},h=function(t){return t.offsetParent||document.documentElement},a=function(){var t,e,i,o,s;return t=document.createElement("div"),t.style.width="100%",t.style.height="200px",e=document.createElement("div"),n(e.style,{position:"absolute",top:0,left:0,pointerEvents:"none",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),e.appendChild(t),document.body.appendChild(e),o=t.offsetWidth,e.style.overflow="scroll",s=t.offsetWidth,o===s&&(s=e.clientWidth),document.body.removeChild(e),i=o-s,{width:i,height:i}},n=function(t){var e,i,o,n,s,r,h;for(null==t&&(t={}),e=[],Array.prototype.push.apply(e,arguments),h=e.slice(1),s=0,r=h.length;r>s;s++)if(o=h[s])for(i in o)v.call(o,i)&&(n=o[i],t[i]=n);return t},c=function(t,e){var i,o,n,s,r;if(null!=t.classList){for(s=e.split(" "),r=[],o=0,n=s.length;n>o;o++)i=s[o],i.trim()&&r.push(t.classList.remove(i));return r}return t.className=t.className.replace(new RegExp("(^| )"+e.split(" ").join("|")+"( |$)","gi")," ")},e=function(t,e){var i,o,n,s,r;if(null!=t.classList){for(s=e.split(" "),r=[],o=0,n=s.length;n>o;o++)i=s[o],i.trim()&&r.push(t.classList.add(i));return r}return c(t,e),t.className+=" "+e},u=function(t,e){return null!=t.classList?t.classList.contains(e):new RegExp("(^| )"+e+"( |$)","gi").test(t.className)},g=function(t,i,o){var n,s,r,h,l,a;for(s=0,h=o.length;h>s;s++)n=o[s],b.call(i,n)<0&&u(t,n)&&c(t,n);for(a=[],r=0,l=i.length;l>r;r++)n=i[r],a.push(u(t,n)?void 0:e(t,n));return a},o=[],i=function(t){return o.push(t)},s=function(){var t,e;for(e=[];t=o.pop();)e.push(t());return e},t=function(){function t(){}return t.prototype.on=function(t,e,i,o){var n;return null==o&&(o=!1),null==this.bindings&&(this.bindings={}),null==(n=this.bindings)[t]&&(n[t]=[]),this.bindings[t].push({handler:e,ctx:i,once:o})},t.prototype.once=function(t,e,i){return this.on(t,e,i,!0)},t.prototype.off=function(t,e){var i,o,n;if(null!=(null!=(o=this.bindings)?o[t]:void 0)){if(null==e)return delete this.bindings[t];for(i=0,n=[];i<this.bindings[t].length;)n.push(this.bindings[t][i].handler===e?this.bindings[t].splice(i,1):i++);return n}},t.prototype.trigger=function(){var t,e,i,o,n,s,r,h,l;if(i=arguments[0],t=2<=arguments.length?y.call(arguments,1):[],null!=(r=this.bindings)?r[i]:void 0){for(n=0,l=[];n<this.bindings[i].length;)h=this.bindings[i][n],o=h.handler,e=h.ctx,s=h.once,o.apply(null!=e?e:this,t),l.push(s?this.bindings[i].splice(n,1):n++);return l}},t}(),this.Tether.Utils={getScrollParent:p,getBounds:r,getOffsetParent:h,extend:n,addClass:e,removeClass:c,hasClass:u,updateClasses:g,defer:i,flush:s,uniqueId:d,Evented:t,getScrollBarSize:a}}.call(this),function(){var t,e,i,o,n,s,r,h,l,a,p,u,f,c,d,g,m,v,b,y,w,C,T,O,x,S,E,A,M,L=[].slice,B=function(t,e){return function(){return t.apply(e,arguments)}};if(null==this.Tether)throw new Error("You must include the utils.js file before tether.js");o=this.Tether,M=o.Utils,g=M.getScrollParent,m=M.getSize,c=M.getOuterSize,u=M.getBounds,f=M.getOffsetParent,a=M.extend,n=M.addClass,T=M.removeClass,S=M.updateClasses,l=M.defer,p=M.flush,d=M.getScrollBarSize,E=function(t,e,i){return null==i&&(i=1),t+i>=e&&e>=t-i},x=function(){var t,e,i,o,n;for(t=document.createElement("div"),n=["transform","webkitTransform","OTransform","MozTransform","msTransform"],i=0,o=n.length;o>i;i++)if(e=n[i],void 0!==t.style[e])return e}(),O=[],C=function(){var t,e,i;for(e=0,i=O.length;i>e;e++)t=O[e],t.position(!1);return p()},v=function(){var t;return null!=(t="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance.now():void 0)?t:+new Date},function(){var t,e,i,o,n,s,r,h,l;for(e=null,i=null,o=null,n=function(){if(null!=i&&i>16)return i=Math.min(i-16,250),void(o=setTimeout(n,250));if(!(null!=e&&v()-e<10))return null!=o&&(clearTimeout(o),o=null),e=v(),C(),i=v()-e},h=["resize","scroll","touchmove"],l=[],s=0,r=h.length;r>s;s++)t=h[s],l.push(window.addEventListener(t,n));return l}(),t={center:"center",left:"right",right:"left"},e={middle:"middle",top:"bottom",bottom:"top"},i={top:0,left:0,middle:"50%",center:"50%",bottom:"100%",right:"100%"},h=function(i,o){var n,s;return n=i.left,s=i.top,"auto"===n&&(n=t[o.left]),"auto"===s&&(s=e[o.top]),{left:n,top:s}},r=function(t){var e,o;return{left:null!=(e=i[t.left])?e:t.left,top:null!=(o=i[t.top])?o:t.top}},s=function(){var t,e,i,o,n,s,r;for(e=1<=arguments.length?L.call(arguments,0):[],i={top:0,left:0},n=0,s=e.length;s>n;n++)r=e[n],o=r.top,t=r.left,"string"==typeof o&&(o=parseFloat(o,10)),"string"==typeof t&&(t=parseFloat(t,10)),i.top+=o,i.left+=t;return i},b=function(t,e){return"string"==typeof t.left&&-1!==t.left.indexOf("%")&&(t.left=parseFloat(t.left,10)/100*e.width),"string"==typeof t.top&&-1!==t.top.indexOf("%")&&(t.top=parseFloat(t.top,10)/100*e.height),t},y=w=function(t){var e,i,o;return o=t.split(" "),i=o[0],e=o[1],{top:i,left:e}},A=function(){function t(t){this.position=B(this.position,this);var e,i,n,s,r;for(O.push(this),this.history=[],this.setOptions(t,!1),s=o.modules,i=0,n=s.length;n>i;i++)e=s[i],null!=(r=e.initialize)&&r.call(this);this.position()}return t.modules=[],t.prototype.getClass=function(t){var e,i;return(null!=(e=this.options.classes)?e[t]:void 0)?this.options.classes[t]:(null!=(i=this.options.classes)?i[t]:void 0)!==!1?this.options.classPrefix?""+this.options.classPrefix+"-"+t:t:""},t.prototype.setOptions=function(t,e){var i,o,s,r,h,l;for(this.options=t,null==e&&(e=!0),i={offset:"0 0",targetOffset:"0 0",targetAttachment:"auto auto",classPrefix:"tether"},this.options=a(i,this.options),h=this.options,this.element=h.element,this.target=h.target,this.targetModifier=h.targetModifier,"viewport"===this.target?(this.target=document.body,this.targetModifier="visible"):"scroll-handle"===this.target&&(this.target=document.body,this.targetModifier="scroll-handle"),l=["element","target"],s=0,r=l.length;r>s;s++){if(o=l[s],null==this[o])throw new Error("Tether Error: Both element and target must be defined");null!=this[o].jquery?this[o]=this[o][0]:"string"==typeof this[o]&&(this[o]=document.querySelector(this[o]))}if(n(this.element,this.getClass("element")),n(this.target,this.getClass("target")),!this.options.attachment)throw new Error("Tether Error: You must provide an attachment");return this.targetAttachment=y(this.options.targetAttachment),this.attachment=y(this.options.attachment),this.offset=w(this.options.offset),this.targetOffset=w(this.options.targetOffset),null!=this.scrollParent&&this.disable(),this.scrollParent="scroll-handle"===this.targetModifier?this.target:g(this.target),this.options.enabled!==!1?this.enable(e):void 0},t.prototype.getTargetBounds=function(){var t,e,i,o,n,s,r,h,l;if(null==this.targetModifier)return u(this.target);switch(this.targetModifier){case"visible":return this.target===document.body?{top:pageYOffset,left:pageXOffset,height:innerHeight,width:innerWidth}:(t=u(this.target),n={height:t.height,width:t.width,top:t.top,left:t.left},n.height=Math.min(n.height,t.height-(pageYOffset-t.top)),n.height=Math.min(n.height,t.height-(t.top+t.height-(pageYOffset+innerHeight))),n.height=Math.min(innerHeight,n.height),n.height-=2,n.width=Math.min(n.width,t.width-(pageXOffset-t.left)),n.width=Math.min(n.width,t.width-(t.left+t.width-(pageXOffset+innerWidth))),n.width=Math.min(innerWidth,n.width),n.width-=2,n.top<pageYOffset&&(n.top=pageYOffset),n.left<pageXOffset&&(n.left=pageXOffset),n);case"scroll-handle":return l=this.target,l===document.body?(l=document.documentElement,t={left:pageXOffset,top:pageYOffset,height:innerHeight,width:innerWidth}):t=u(l),h=getComputedStyle(l),i=l.scrollWidth>l.clientWidth||"scroll"===[h.overflow,h.overflowX]||this.target!==document.body,s=0,i&&(s=15),o=t.height-parseFloat(h.borderTopWidth)-parseFloat(h.borderBottomWidth)-s,n={width:15,height:.975*o*(o/l.scrollHeight),left:t.left+t.width-parseFloat(h.borderLeftWidth)-15},e=0,408>o&&this.target===document.body&&(e=-11e-5*Math.pow(o,2)-.00727*o+22.58),this.target!==document.body&&(n.height=Math.max(n.height,24)),r=this.target.scrollTop/(l.scrollHeight-o),n.top=r*(o-n.height-e)+t.top+parseFloat(h.borderTopWidth),this.target===document.body&&(n.height=Math.max(n.height,24)),n}},t.prototype.clearCache=function(){return this._cache={}},t.prototype.cache=function(t,e){return null==this._cache&&(this._cache={}),null==this._cache[t]&&(this._cache[t]=e.call(this)),this._cache[t]},t.prototype.enable=function(t){return null==t&&(t=!0),n(this.target,this.getClass("enabled")),n(this.element,this.getClass("enabled")),this.enabled=!0,this.scrollParent!==document&&this.scrollParent.addEventListener("scroll",this.position),t?this.position():void 0},t.prototype.disable=function(){return T(this.target,this.getClass("enabled")),T(this.element,this.getClass("enabled")),this.enabled=!1,null!=this.scrollParent?this.scrollParent.removeEventListener("scroll",this.position):void 0},t.prototype.destroy=function(){var t,e,i,o,n;for(this.disable(),n=[],t=i=0,o=O.length;o>i;t=++i){if(e=O[t],e===this){O.splice(t,1);break}n.push(void 0)}return n},t.prototype.updateAttachClasses=function(t,e){var i,o,n,s,r,h,a,p,u,f=this;for(null==t&&(t=this.attachment),null==e&&(e=this.targetAttachment),s=["left","top","bottom","right","middle","center"],(null!=(u=this._addAttachClasses)?u.length:void 0)&&this._addAttachClasses.splice(0,this._addAttachClasses.length),i=null!=this._addAttachClasses?this._addAttachClasses:this._addAttachClasses=[],t.top&&i.push(""+this.getClass("element-attached")+"-"+t.top),t.left&&i.push(""+this.getClass("element-attached")+"-"+t.left),e.top&&i.push(""+this.getClass("target-attached")+"-"+e.top),e.left&&i.push(""+this.getClass("target-attached")+"-"+e.left),o=[],r=0,a=s.length;a>r;r++)n=s[r],o.push(""+this.getClass("element-attached")+"-"+n);for(h=0,p=s.length;p>h;h++)n=s[h],o.push(""+this.getClass("target-attached")+"-"+n);return l(function(){return null!=f._addAttachClasses?(S(f.element,f._addAttachClasses,o),S(f.target,f._addAttachClasses,o),f._addAttachClasses=void 0):void 0})},t.prototype.position=function(t){var e,i,n,l,a,c,g,m,v,y,w,C,T,O,x,S,E,A,M,L,B,W,_,P,z,H,F,k,N,Y,X,j,q,U,I,R=this;if(null==t&&(t=!0),this.enabled){for(this.clearCache(),L=h(this.targetAttachment,this.attachment),this.updateAttachClasses(this.attachment,L),e=this.cache("element-bounds",function(){return u(R.element)}),z=e.width,n=e.height,0===z&&0===n&&null!=this.lastSize?(Y=this.lastSize,z=Y.width,n=Y.height):this.lastSize={width:z,height:n},_=W=this.cache("target-bounds",function(){return R.getTargetBounds()}),v=b(r(this.attachment),{width:z,height:n}),B=b(r(L),_),a=b(this.offset,{width:z,height:n}),c=b(this.targetOffset,_),v=s(v,a),B=s(B,c),l=W.left+B.left-v.left,P=W.top+B.top-v.top,X=o.modules,H=0,k=X.length;k>H;H++)if(g=X[H],x=g.position.call(this,{left:l,top:P,targetAttachment:L,targetPos:W,attachment:this.attachment,elementPos:e,offset:v,targetOffset:B,manualOffset:a,manualTargetOffset:c,scrollbarSize:A}),null!=x&&"object"==typeof x){if(x===!1)return!1;P=x.top,l=x.left}if(m={page:{top:P,left:l},viewport:{top:P-pageYOffset,bottom:pageYOffset-P-n+innerHeight,left:l-pageXOffset,right:pageXOffset-l-z+innerWidth}},document.body.scrollWidth>window.innerWidth&&(A=this.cache("scrollbar-size",d),m.viewport.bottom-=A.height),document.body.scrollHeight>window.innerHeight&&(A=this.cache("scrollbar-size",d),m.viewport.right-=A.width),(""!==(j=document.body.style.position)&&"static"!==j||""!==(q=document.body.parentElement.style.position)&&"static"!==q)&&(m.page.bottom=document.body.scrollHeight-P-n,m.page.right=document.body.scrollWidth-l-z),(null!=(U=this.options.optimizations)?U.moveElement:void 0)!==!1&&null==this.targetModifier){for(w=this.cache("target-offsetparent",function(){return f(R.target)}),O=this.cache("target-offsetparent-bounds",function(){return u(w)}),T=getComputedStyle(w),i=getComputedStyle(this.element),C=O,y={},I=["Top","Left","Bottom","Right"],F=0,N=I.length;N>F;F++)M=I[F],y[M.toLowerCase()]=parseFloat(T["border"+M+"Width"]);O.right=document.body.scrollWidth-O.left-C.width+y.right,O.bottom=document.body.scrollHeight-O.top-C.height+y.bottom,m.page.top>=O.top+y.top&&m.page.bottom>=O.bottom&&m.page.left>=O.left+y.left&&m.page.right>=O.right&&(E=w.scrollTop,S=w.scrollLeft,m.offset={top:m.page.top-O.top+E-y.top,left:m.page.left-O.left+S-y.left})}return this.move(m),this.history.unshift(m),this.history.length>3&&this.history.pop(),t&&p(),!0}},t.prototype.move=function(t){var e,i,o,n,s,r,h,p,u,c,d,g,m,v,b,y,w,C=this;if(null!=this.element.parentNode){p={};for(c in t){p[c]={};for(n in t[c]){for(o=!1,y=this.history,v=0,b=y.length;b>v;v++)if(h=y[v],!E(null!=(w=h[c])?w[n]:void 0,t[c][n])){o=!0;break}o||(p[c][n]=!0)}}e={top:"",left:"",right:"",bottom:""},u=function(t,i){var o,n,s;return(null!=(s=C.options.optimizations)?s.gpu:void 0)===!1?(t.top?e.top=""+i.top+"px":e.bottom=""+i.bottom+"px",t.left?e.left=""+i.left+"px":e.right=""+i.right+"px"):(t.top?(e.top=0,n=i.top):(e.bottom=0,n=-i.bottom),t.left?(e.left=0,o=i.left):(e.right=0,o=-i.right),e[x]="translateX("+Math.round(o)+"px) translateY("+Math.round(n)+"px)","msTransform"!==x?e[x]+=" translateZ(0)":void 0)},s=!1,(p.page.top||p.page.bottom)&&(p.page.left||p.page.right)?(e.position="absolute",u(p.page,t.page)):(p.viewport.top||p.viewport.bottom)&&(p.viewport.left||p.viewport.right)?(e.position="fixed",u(p.viewport,t.viewport)):null!=p.offset&&p.offset.top&&p.offset.left?(e.position="absolute",r=this.cache("target-offsetparent",function(){return f(C.target)}),f(this.element)!==r&&l(function(){return C.element.parentNode.removeChild(C.element),r.appendChild(C.element)}),u(p.offset,t.offset),s=!0):(e.position="absolute",u({top:!0,left:!0},t.page)),s||"BODY"===this.element.parentNode.tagName||(this.element.parentNode.removeChild(this.element),document.body.appendChild(this.element)),m={},g=!1;for(n in e)d=e[n],i=this.element.style[n],""===i||""===d||"top"!==n&&"left"!==n&&"bottom"!==n&&"right"!==n||(i=parseFloat(i),d=parseFloat(d)),i!==d&&(g=!0,m[n]=e[n]);return g?l(function(){return a(C.element.style,m)}):void 0}},t}(),o.position=C,this.Tether=a(A,o)}.call(this),function(){var t,e,i,o,n,s,r,h,l,a,p=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1};a=this.Tether.Utils,r=a.getOuterSize,s=a.getBounds,h=a.getSize,o=a.extend,l=a.updateClasses,i=a.defer,e={left:"right",right:"left",top:"bottom",bottom:"top",middle:"middle"},t=["left","top","right","bottom"],n=function(e,i){var o,n,r,h,l,a,p;if("scrollParent"===i?i=e.scrollParent:"window"===i&&(i=[pageXOffset,pageYOffset,innerWidth+pageXOffset,innerHeight+pageYOffset]),i===document&&(i=i.documentElement),null!=i.nodeType)for(n=h=s(i),l=getComputedStyle(i),i=[n.left,n.top,h.width+n.left,h.height+n.top],o=a=0,p=t.length;p>a;o=++a)r=t[o],r=r[0].toUpperCase()+r.substr(1),"Top"===r||"Left"===r?i[o]+=parseFloat(l["border"+r+"Width"]):i[o]-=parseFloat(l["border"+r+"Width"]);return i},this.Tether.modules.push({position:function(e){var r,h,a,u,f,c,d,g,m,v,b,y,w,C,T,O,x,S,E,A,M,L,B,W,_,P,z,H,F,k,N,Y,X,j,q,U,I,R,D,Z,$,V,G,J,K,Q,te,ee=this;if(P=e.top,b=e.left,M=e.targetAttachment,!this.options.constraints)return!0;for(S=function(e){var i,o,n,s;for(ee.removeClass(e),s=[],o=0,n=t.length;n>o;o++)i=t[o],s.push(ee.removeClass(""+e+"-"+i));return s},Z=this.cache("element-bounds",function(){return s(ee.element)}),v=Z.height,z=Z.width,0===z&&0===v&&null!=this.lastSize&&($=this.lastSize,z=$.width,v=$.height),B=this.cache("target-bounds",function(){return ee.getTargetBounds()}),L=B.height,W=B.width,A={},m={},h=[this.getClass("pinned"),this.getClass("out-of-bounds")],V=this.options.constraints,H=0,Y=V.length;Y>H;H++)g=V[H],g.outOfBoundsClass&&h.push(g.outOfBoundsClass),g.pinnedClass&&h.push(g.pinnedClass);for(F=0,X=h.length;X>F;F++)for(d=h[F],G=["left","top","right","bottom"],k=0,j=G.length;j>k;k++)E=G[k],h.push(""+d+"-"+E);for(r=[],A=o({},M),m=o({},this.attachment),J=this.options.constraints,N=0,q=J.length;q>N;N++){if(g=J[N],_=g.to,a=g.attachment,T=g.pin,null==a&&(a=""),p.call(a," ")>=0?(K=a.split(" "),c=K[0],f=K[1]):f=c=a,u=n(this,_),("target"===c||"both"===c)&&(P<u[1]&&"top"===A.top&&(P+=L,A.top="bottom"),P+v>u[3]&&"bottom"===A.top&&(P-=L,A.top="top")),"together"===c&&(P<u[1]&&"top"===A.top&&("bottom"===m.top?(P+=L,A.top="bottom",P+=v,m.top="top"):"top"===m.top&&(P+=L,A.top="bottom",P-=v,m.top="bottom")),P+v>u[3]&&"bottom"===A.top&&("top"===m.top?(P-=L,A.top="top",P-=v,m.top="bottom"):"bottom"===m.top&&(P-=L,A.top="top",P+=v,m.top="top")),"middle"===A.top&&(P+v>u[3]&&"top"===m.top?(P-=v,m.top="bottom"):P<u[1]&&"bottom"===m.top&&(P+=v,m.top="top"))),("target"===f||"both"===f)&&(b<u[0]&&"left"===A.left&&(b+=W,A.left="right"),b+z>u[2]&&"right"===A.left&&(b-=W,A.left="left")),"together"===f&&(b<u[0]&&"left"===A.left?"right"===m.left?(b+=W,A.left="right",b+=z,m.left="left"):"left"===m.left&&(b+=W,A.left="right",b-=z,m.left="right"):b+z>u[2]&&"right"===A.left?"left"===m.left?(b-=W,A.left="left",b-=z,m.left="right"):"right"===m.left&&(b-=W,A.left="left",b+=z,m.left="left"):"center"===A.left&&(b+z>u[2]&&"left"===m.left?(b-=z,m.left="right"):b<u[0]&&"right"===m.left&&(b+=z,m.left="left"))),("element"===c||"both"===c)&&(P<u[1]&&"bottom"===m.top&&(P+=v,m.top="top"),P+v>u[3]&&"top"===m.top&&(P-=v,m.top="bottom")),("element"===f||"both"===f)&&(b<u[0]&&"right"===m.left&&(b+=z,m.left="left"),b+z>u[2]&&"left"===m.left&&(b-=z,m.left="right")),"string"==typeof T?T=function(){var t,e,i,o;for(i=T.split(","),o=[],e=0,t=i.length;t>e;e++)C=i[e],o.push(C.trim());return o}():T===!0&&(T=["top","left","right","bottom"]),T||(T=[]),O=[],y=[],P<u[1]&&(p.call(T,"top")>=0?(P=u[1],O.push("top")):y.push("top")),P+v>u[3]&&(p.call(T,"bottom")>=0?(P=u[3]-v,O.push("bottom")):y.push("bottom")),b<u[0]&&(p.call(T,"left")>=0?(b=u[0],O.push("left")):y.push("left")),b+z>u[2]&&(p.call(T,"right")>=0?(b=u[2]-z,O.push("right")):y.push("right")),O.length)for(x=null!=(Q=this.options.pinnedClass)?Q:this.getClass("pinned"),r.push(x),R=0,U=O.length;U>R;R++)E=O[R],r.push(""+x+"-"+E);if(y.length)for(w=null!=(te=this.options.outOfBoundsClass)?te:this.getClass("out-of-bounds"),r.push(w),D=0,I=y.length;I>D;D++)E=y[D],r.push(""+w+"-"+E);(p.call(O,"left")>=0||p.call(O,"right")>=0)&&(m.left=A.left=!1),(p.call(O,"top")>=0||p.call(O,"bottom")>=0)&&(m.top=A.top=!1),(A.top!==M.top||A.left!==M.left||m.top!==this.attachment.top||m.left!==this.attachment.left)&&this.updateAttachClasses(m,A)}return i(function(){return l(ee.target,r,h),l(ee.element,r,h)}),{top:P,left:b}}})}.call(this),function(){var t,e,i,o;o=this.Tether.Utils,e=o.getBounds,i=o.updateClasses,t=o.defer,this.Tether.modules.push({position:function(o){var n,s,r,h,l,a,p,u,f,c,d,g,m,v,b,y,w,C,T,O,x,S,E,A,M,L=this;if(d=o.top,a=o.left,x=this.cache("element-bounds",function(){return e(L.element)}),l=x.height,g=x.width,c=this.getTargetBounds(),h=d+l,p=a+g,n=[],d<=c.bottom&&h>=c.top)for(S=["left","right"],m=0,w=S.length;w>m;m++)u=S[m],((E=c[u])===a||E===p)&&n.push(u);if(a<=c.right&&p>=c.left)for(A=["top","bottom"],v=0,C=A.length;C>v;v++)u=A[v],((M=c[u])===d||M===h)&&n.push(u);for(r=[],s=[],f=["left","top","right","bottom"],r.push(this.getClass("abutted")),b=0,T=f.length;T>b;b++)u=f[b],r.push(""+this.getClass("abutted")+"-"+u);for(n.length&&s.push(this.getClass("abutted")),y=0,O=n.length;O>y;y++)u=n[y],s.push(""+this.getClass("abutted")+"-"+u);return t(function(){return i(L.target,s,r),i(L.element,s,r)}),!0}})}.call(this),function(){this.Tether.modules.push({position:function(t){var e,i,o,n,s,r,h;return r=t.top,e=t.left,this.options.shift?(i=function(t){return"function"==typeof t?t.call(this,{top:r,left:e}):t},o=i(this.options.shift),"string"==typeof o?(o=o.split(" "),o[1]||(o[1]=o[0]),s=o[0],n=o[1],s=parseFloat(s,10),n=parseFloat(n,10)):(h=[o.top,o.left],s=h[0],n=h[1]),r+=s,e+=n,{top:r,left:e}):void 0}})}.call(this),this.Tether}),function(){var t,e,i,o,n,s,r,h,l,a,p,u,f,c,d,g=function(t,e){return function(){return t.apply(e,arguments)}},m={}.hasOwnProperty,v=function(t,e){function i(){this.constructor=t}for(var o in e)m.call(e,o)&&(t[o]=e[o]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t};d=Tether.Utils,h=d.extend,f=d.removeClass,s=d.addClass,a=d.hasClass,e=d.Evented,l=d.getBounds,c=d.uniqueId,i=new e,t={top:"bottom center",left:"middle right",right:"middle left",bottom:"top center",center:"middle center"},r=function(t){var e;return e=document.createElement("div"),e.innerHTML=t,e.children[0]},p=function(t,e){var i,o,n,s,r,h;return i=null!=(o=null!=(n=null!=(s=null!=(r=null!=(h=t.matches)?h:t.matchesSelector)?r:t.msMatchesSelector)?s:t.webkitMatchesSelector)?n:t.mozMatchesSelector)?o:t.oMatchesSelector,i.call(t,e)},u=function(t,e){var i,o,n,s,r,h;if(null==t)return t;if("object"==typeof t)return t;for(s=t.split(" "),s.length>e.length&&(s[0]=s.slice(0,+(s.length-e.length)+1||9e9).join(" "),s.splice(1,s.length-e.length)),o={},i=r=0,h=e.length;h>r;i=++r)n=e[i],o[n]=s[i];return o},o=function(e){function i(t,e){this.tour=t,this.destroy=g(this.destroy,this),this.scrollTo=g(this.scrollTo,this),this.complete=g(this.complete,this),this.cancel=g(this.cancel,this),this.isOpen=g(this.isOpen,this),this.hide=g(this.hide,this),this.show=g(this.show,this),this.setOptions(e)}return v(i,e),i.prototype.setOptions=function(t){var e,i,o,n;if(this.options=null!=t?t:{},this.destroy(),this.id=this.options.id||this.id||"step-"+c(),this.options.when){n=this.options.when;for(e in n)i=n[e],this.on(e,i,this)}return null!=(o=this.options).buttons?(o=this.options).buttons:o.buttons=[{text:"Next",action:this.tour.next}]},i.prototype.getTour=function(){return this.tour},i.prototype.bindAdvance=function(){var t,e,i,o,n=this;return o=u(this.options.advanceOn,["selector","event"]),t=o.event,i=o.selector,e=function(t){if(n.isOpen())if(null!=i){if(p(t.target,i))return n.tour.next()}else if(n.el&&t.target===n.el)return n.tour.next()},document.body.addEventListener(t,e),this.on("destroy",function(){return document.body.removeEventListener(t,e)})},i.prototype.getAttachTo=function(){var t;if(t=u(this.options.attachTo,["element","on"]),null==t&&(t={}),"string"==typeof t.element&&(t.element=document.querySelector(t.element),null==t.element))throw new Error("Shepherd step's attachTo was not found in the page");return t},i.prototype.setupTether=function(){var e,i,o;if("undefined"==typeof Tether||null===Tether)throw new Error("Using the attachment feature of Shepherd requires the Tether library");return i=this.getAttachTo(),e=t[i.on||"right"],null==i.element&&(i.element="viewport",e="middle center"),o={classPrefix:"shepherd",element:this.el,constraints:[{to:"window",pin:!0,attachment:"together"}],target:i.element,offset:i.offset||"0 0",attachment:e},this.tether=new Tether(h(o,this.options.tetherOptions))},i.prototype.show=function(){var t=this;return this.trigger("before-show"),null==this.el&&this.render(),s(this.el,"shepherd-open"),document.body.setAttribute("data-shepherd-step",this.id),this.setupTether(),this.options.scrollTo&&setTimeout(function(){return t.scrollTo()}),this.trigger("show")},i.prototype.hide=function(){var t;return this.trigger("before-hide"),f(this.el,"shepherd-open"),document.body.removeAttribute("data-shepherd-step"),null!=(t=this.tether)&&t.destroy(),this.tether=null,this.trigger("hide")},i.prototype.isOpen=function(){return a(this.el,"shepherd-open")},i.prototype.cancel=function(){return this.tour.cancel(),this.trigger("cancel")},i.prototype.complete=function(){return this.tour.complete(),this.trigger("complete")},i.prototype.scrollTo=function(){var t;return t=this.getAttachTo().element,null!=this.options.scrollToHandler?this.options.scrollToHandler(t):null!=t?t.scrollIntoView():void 0},i.prototype.destroy=function(){var t;return null!=this.el&&(document.body.removeChild(this.el),delete this.el),null!=(t=this.tether)&&t.destroy(),this.tether=null,this.trigger("destroy")},i.prototype.render=function(){var t,e,i,o,n,s,h,l,a,p,u,f,c,d,g,m,v;if(null!=this.el&&this.destroy(),this.el=r("<div class='shepherd-step "+(null!=(g=this.options.classes)?g:"")+"' data-id='"+this.id+"'></div>"),o=document.createElement("div"),o.className="shepherd-content",this.el.appendChild(o),s=document.createElement("header"),o.appendChild(s),null!=this.options.title&&(s.innerHTML+="<h3 class='shepherd-title'>"+this.options.title+"</h3>",this.el.className+=" shepherd-has-title"),this.options.showCancelLink&&(h=r("<a href class='shepherd-cancel-link'>✕</a>"),s.appendChild(h),this.el.className+=" shepherd-has-cancel-link",this.bindCancelLink(h)),null!=this.options.text){if(p=r("<div class='shepherd-text'></div>"),a=this.options.text,"function"==typeof a&&(a=this.options.text.call(this,p)),a instanceof HTMLElement)p.appendChild(a);else for("string"==typeof a&&(a=[a]),u=0,c=a.length;c>u;u++)l=a[u],p.innerHTML+="<p>"+l+"</p>";o.appendChild(p)}if(n=document.createElement("footer"),this.options.buttons){for(e=r("<ul class='shepherd-buttons'></ul>"),m=this.options.buttons,f=0,d=m.length;d>f;f++)i=m[f],t=r("<li><a class='shepherd-button "+(null!=(v=i.classes)?v:"")+"'>"+i.text+"</a>"),e.appendChild(t),this.bindButtonEvents(i,t.querySelector("a"));n.appendChild(e)}return o.appendChild(n),document.body.appendChild(this.el),this.setupTether(),this.options.advanceOn?this.bindAdvance():void 0},i.prototype.bindCancelLink=function(t){var e=this;return t.addEventListener("click",function(t){return t.preventDefault(),e.cancel()})},i.prototype.bindButtonEvents=function(t,e){var i,o,n,s,r=this;null==t.events&&(t.events={}),null!=t.action&&(t.events.click=t.action),s=t.events;for(i in s)o=s[i],"string"==typeof o&&(n=o,o=function(){return r.tour.show(n)}),e.addEventListener(i,o);return this.on("destroy",function(){var n,s;n=t.events,s=[];for(i in n)o=n[i],s.push(e.removeEventListener(i,o));return s})},i}(e),n=function(t){function e(t){var e,o,n,s,r,h,l=this;for(this.options=null!=t?t:{},this.hide=g(this.hide,this),this.complete=g(this.complete,this),this.cancel=g(this.cancel,this),this.back=g(this.back,this),this.next=g(this.next,this),this.steps=null!=(r=this.options.steps)?r:[],h=["complete","cancel","hide","start","show","active","inactive"],o=function(t){return l.on(t,function(e){return null==e&&(e={}),e.tour=l,i.trigger(t,e)})},n=0,s=h.length;s>n;n++)e=h[n],o(e)}return v(e,t),e.prototype.addStep=function(t,e){var i;return null==e&&(e=t),e instanceof o?e.tour=this:(("string"==(i=typeof t)||"number"===i)&&(e.id=t.toString()),e=h({},this.options.defaults,e),e=new o(this,e)),this.steps.push(e),this},e.prototype.getById=function(t){var e,i,o,n;for(n=this.steps,i=0,o=n.length;o>i;i++)if(e=n[i],e.id===t)return e},e.prototype.getCurrentStep=function(){return this.currentStep},e.prototype.next=function(){var t;return t=this.steps.indexOf(this.currentStep),t===this.steps.length-1?(this.hide(t),this.trigger("complete"),this.done()):this.show(t+1)},e.prototype.back=function(){var t;return t=this.steps.indexOf(this.currentStep),this.show(t-1)},e.prototype.cancel=function(){var t;return null!=(t=this.currentStep)&&t.hide(),this.trigger("cancel"),this.done()},e.prototype.complete=function(){var t;return null!=(t=this.currentStep)&&t.hide(),this.trigger("complete"),this.done()},e.prototype.hide=function(){var t;return null!=(t=this.currentStep)&&t.hide(),this.trigger("hide"),this.done()},e.prototype.done=function(){return i.activeTour=null,f(document.body,"shepherd-active"),this.trigger("inactive",{tour:this})},e.prototype.show=function(t){var e;return null==t&&(t=0),this.currentStep?this.currentStep.hide():(s(document.body,"shepherd-active"),this.trigger("active",{tour:this})),i.activeTour=this,e="string"==typeof t?this.getById(t):this.steps[t],e?(this.trigger("show",{step:e,previous:this.currentStep}),this.currentStep=e,e.show()):void 0},e.prototype.start=function(){return this.trigger("start"),this.currentStep=null,this.next()},e}(e),h(i,{Tour:n,Step:o,Evented:e}),window.Shepherd=i}.call(this);;
/*
 TO DO
  - Move GeoModel code to separate file
  - Separate out code into better named methods
  - Fix tooltips not rendering
  - Test popup w/ Elasticsearch
 */

(function() {
  var GeoCollection, GeoModel, Query;

  GeoModel = L.GeoModel = Backbone.Model.extend({
    keepId: false,
    set: function(key, val, options) {
      var _attrs, args, attrs, geometry;
      args = void 0;
      attrs = void 0;
      _attrs = void 0;
      geometry = void 0;
      args = arguments;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      }
      if (attrs && attrs['type'] && attrs['type'] === 'Feature') {
        _attrs = _.clone(attrs['properties']) || {};
        geometry = _.clone(attrs['geometry']) || null;
        if (geometry) {
          geometry.coordinates = geometry['coordinates'].slice();
        }
        _attrs['geometry'] = geometry;
        if (attrs[this.idAttribute]) {
          _attrs[this.idAttribute] = attrs[this.idAttribute];
        }
        args = [_attrs, options];
      }
      return Backbone.Model.prototype.set.apply(this, args);
    },
    toJSON: function(options) {
      var attrs, geometry, json, props;
      attrs = void 0;
      props = void 0;
      geometry = void 0;
      options = options || {};
      attrs = _.clone(this.attributes);
      props = _.omit(attrs, 'geometry');
      if (options.cid) {
        props.cid = this.cid;
      }
      geometry = _.clone(attrs['geometry']) || null;
      if (geometry) {
        geometry.coordinates = geometry['coordinates'].slice();
      }
      json = {
        type: 'Feature',
        geometry: geometry,
        properties: props
      };
      if (this.keepId) {
        json[this.idAttribute] = this.id;
      }
      return json;
    }
  });

  GeoCollection = L.GeoCollection = Backbone.Collection.extend({
    model: GeoModel,
    reset: function(models, options) {
      if (models && !_.isArray(models) && models.features) {
        models = models.features;
      }
      return Backbone.Collection.prototype.reset.apply(this, [models, options]);
    },
    toJSON: function(options) {
      var features;
      features = Backbone.Collection.prototype.toJSON.apply(this, arguments);
      return {
        type: 'FeatureCollection',
        features: features
      };
    }
  });

  Query = Backbone.Model.extend({
    defaults: {
      ap: "",
      ep: "",
      overall_risk: 'Search or right click anywhere on the map to learn more about a region.'
    },
    url: '/get_queries/'
  });

  $(function() {
    var DataTourView, FloatLayout, HeaderView, LegendView, MapView, QueryView, WelcomeView, app, layers, layout;
    app = window.app = window.app || {};
    layers = app.layers = [];
    app.getPattern = function(type, d) {
      var pattern;
      if (type === 'ep') {
        if (d === null) {
          return false;
        }
        pattern = 'dots ';
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
    app.getColor = function(type, d) {
      var rainbow;
      if (type === 'ap') {
        rainbow = new Rainbow;
        rainbow.setSpectrum('#94FFDB', '#0003FF');
        rainbow.setNumberRange(0, 12);
        return '#' + rainbow.colourAt(d);
      }
    };
    app.createSpinner = function(element) {
      var opts, target;
      opts = {
        lines: 11,
        length: 4,
        width: 2,
        radius: 7,
        corners: 0.9,
        rotate: 0,
        direction: 1,
        color: "#000",
        speed: 1,
        trail: 60,
        shadow: false,
        hwaccel: false,
        className: "spinner",
        zIndex: 2e9,
        top: "50%",
        left: "50%"
      };
      target = $(element)[0];
      return window.spinner = new Spinner(opts).spin(target);
    };
    Backbone.Layout.configure({
      manage: true
    });
    app.AvgPrecipCollection = GeoCollection.extend({
      url: 'static/ap/noaa_avg_precip.geojson'
    });
    app.ExtPrecipCollection = GeoCollection.extend({
      url: 'static/ep/noaa_ex_precip.geojson'
    });
    HeaderView = app.HeaderView = Backbone.View.extend({
      template: "#headerTemplate",
      getAddress: function(address) {
        var g;
        g = new google.maps.Geocoder();
        return g.geocode({
          address: address
        }, function(results, status) {
          var latLng;
          latLng = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
          return app.layout.views['map'].setAddress(latLng, 15);
        });
      },
      events: {
        "submit #search": function(e) {
          var address;
          e.preventDefault();
          address = $(e.target).find('.search-input').val();
          return this.getAddress(address);
        },
        "click #tourLink": function(e) {
          var dataTour, dataView;
          e.preventDefault();
          dataTour = new DataTourView();
          dataView = this.insertView('#dataTour', dataTour);
          return dataView.render();
        }
      }
    });
    DataTourView = app.DataTourView = Backbone.View.extend({
      initialize: function() {
        if (window.tour) {
          window.tour.complete();
        }
        return window.tour = this.tour = new Shepherd.Tour({
          defaults: {
            classes: 'shepherd-theme-arrows',
            scrollTo: true
          }
        });
      },
      resetMapAfterTour: function() {
        if ($('.active')) {
          $('.active').removeClass('active').promise().done(function() {
            return $('.legend-wrapper').addClass('invisible');
          });
        }
        app.map.setZoom(6);
        app.map.addLayer(floods, 1);
        $('#floods-switch').prop('checked', true);
        app.map.addLayer(ap, 2);
        $('#apLayer-switch').prop('checked', true);
        app.map.addLayer(ep, 3);
        $('#epLayer-switch').prop('checked', true);
        return tour.complete();
      },
      resetMapData: function() {
        var j, layer, len, ref;
        if ($('.active')) {
          $('.active').removeClass('active').promise().done(function() {
            return $('.legend-wrapper').addClass('invisible');
          });
        }
        ref = [window.ap, window.ep, window.floods];
        for (j = 0, len = ref.length; j < len; j++) {
          layer = ref[j];
          app.map.removeLayer(layer);
        }
        $('#floods-switch').prop('checked', false);
        $('#apLayer-switch').prop('checked', false);
        return $('#epLayer-switch').prop('checked', false);
      },
      afterRender: function() {
        app.map.setZoom(6);
        this.resetMapData();
        $('#welcomeModal').modal('hide');
        $('#legend-toggle').trigger('click');
        $('#apLayer-switch').trigger('click');
        this.tour.addStep('ap-step', {
          title: 'Annual Precipitation',
          text: 'The Annual Precipitation layer shows how total rain and snowfall each year is projected to grow by the 2040-2070 period. More annual precipitation means more water going into rivers, lakes and snowbanks, a key risk factor for bigger floods. These projections come from the National Oceanic and Atmospheric Administration (2014).',
          attachTo: '#apToggle top',
          buttons: [
            {
              text: 'Next',
              action: function() {
                $('#epLayer-switch').trigger('click');
                return tour.next();
              }
            }
          ]
        });
        this.tour.addStep('ep-step', {
          title: 'Storm Frequency',
          text: 'The Storm Frequency layer shows how days with heavy rain or snow (over 1 inch per day) are projected to come more often by the 2040-2070 period. More storm frequency means more rapid surges of water into rivers and lakes, a key risk factor for more frequent flooding. These projections also come from the National Oceanic and Atmospheric Administration (2014).',
          attachTo: '#stormsToggle top',
          buttons: [
            {
              text: 'Next',
              action: function() {
                $('#floods-switch').trigger('click');
                return tour.next();
              }
            }
          ]
        });
        this.tour.addStep('flood-step', {
          title: 'Flood Zones',
          text: 'The Flood Zones show the areas that already are at major risk for flooding, based on where floods have historically reached. If floods become larger and more frequent, many neighboring areas to these historical flood zones are likely to start experience flooding. This information comes from the Federal Emergency Management Administration (2014).',
          attachTo: '#floodZonesToggle top',
          buttons: [
            {
              text: 'Next',
              action: tour.next
            }
          ]
        });
        this.tour.addStep('search-step', {
          title: 'Search',
          text: 'Use the search bar to see the risks for a specific location. Try using the search bar now to find a location you care about in the Midwest.',
          attachTo: '.search-input bottom',
          buttons: [
            {
              text: 'Next',
              action: function() {
                return setTimeout(function() {
                  return tour.next();
                }, 450);
              }
            }
          ]
        });
        this.tour.addStep('query-step', {
          title: 'Inspect',
          text: 'Right click anywhere on the map to see the numbers for that specific place, or take a tour of some communities at high risk for worsened flooding.',
          attachTo: '#query left',
          buttons: [
            {
              text: 'Take a Tour',
              action: function() {
                var latlng, marker;
                latlng = [44.519, -88.019];
                app.map.setView(latlng, 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng).addTo(app.map);
                return tour.next();
              }
            }, {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        this.tour.addStep('map-lambeau', {
          title: 'Green Bay, WI',
          text: 'The home of the Packers has a large neighborhood of paper plants and homes at high risk of worsened flooding, with storm days increasing nearly 40% and annual precipitation rising 10% in the next few decades.',
          attachTo: '#legend-toggle top',
          buttons: [
            {
              text: 'Continue',
              action: function() {
                var latlng, marker;
                latlng = [43.1397, -89.3375];
                app.map.setView(latlng, 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng).addTo(app.map);
                return tour.next();
              }
            }, {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        this.tour.addStep('map-dane', {
          title: 'Madison, WI Airport',
          text: 'Airports are often built on flat areas near rivers, placing them at serious risk of flooding, like Madison’s main airport, serving 1.6 million passengers per year.',
          attachTo: '#legend-toggle top',
          buttons: [
            {
              text: 'Continue',
              action: function() {
                var latlng, marker;
                latlng = [42.732072157891224, -84.50576305389404];
                app.map.setView([42.73591782230738, -84.48997020721437], 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng).addTo(app.map);
                return tour.next();
              }
            }, {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        this.tour.addStep('map-lansing', {
          title: 'Lansing, MI',
          text: 'A large stretch of downtown businesses and homes are at risk of worsened flooding, as well as part of the Michigan State campus.',
          attachTo: '#legend-toggle top',
          buttons: [
            {
              text: 'Continue',
              action: function() {
                var latlng, marker;
                latlng = [41.726, -90.310];
                app.map.setView([41.7348457153312, -90.310], 13);
                if (app.map.marker) {
                  app.map.removeLayer(app.map.marker);
                }
                marker = app.map.marker = L.marker(latlng).addTo(app.map);
                return tour.next();
              }
            }, {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        this.tour.addStep('map-quadcities', {
          title: 'Quad Cities Nuclear Generating Station',
          text: 'Power plants, including nuclear plants like the one here, are frequently built on riverbanks to use water for cooling. Larger, more frequent future floods could place these power plants and their communities at risk.',
          attachTo: '#legend-toggle top',
          buttons: [
            {
              text: 'Stop Tour',
              action: this.resetMapAfterTour
            }
          ]
        });
        return this.tour.start();
      }
    });
    WelcomeView = app.WelcomeView = Backbone.View.extend({
      template: "#welcomeTemplate",
      events: {
        'click #startDataTour': function(e) {
          var dataTour, dataView;
          e.preventDefault();
          dataTour = new DataTourView();
          dataView = this.insertView('#dataTour', dataTour);
          return dataView.render();
        },
        'shown.bs.modal #welcomeModal': function(e) {
          return this.reposition();
        },
        'click #closeModal': function(e) {
          app.map.addLayer(floods, 1);
          $('#floods-switch').prop('checked', true);
          app.map.addLayer(ap, 2);
          $('#apLayer-switch').prop('checked', true);
          app.map.addLayer(ep, 3);
          return $('#epLayer-switch').prop('checked', true);
        }
      },
      initialize: function(e) {
        var self;
        self = this;
        return $(window).on('resize', function(e) {
          return self.reposition();
        });
      },
      afterRender: function() {
        return $('#welcomeModal').modal({
          backdrop: 'static',
          keyboard: true
        }, 'show');
      },
      reposition: function() {
        var dialog, modal;
        modal = this.$el;
        dialog = modal.find('.modal-dialog');
        modal.css('display', 'block');
        return dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
      }
    });
    MapView = app.MapView = Backbone.View.extend({
      template: "#mapTemplate",
      el: false,
      setEvents: function() {
        var self;
        self = this;
        app.map.on('contextmenu', function(e) {
          var latLng;
          console.log(e);
          if (!$('.legend-wrapper').hasClass('active')) {
            $('#legend-toggle').trigger('click');
          }
          latLng = [e.latlng.lat, e.latlng.lng];
          return app.layout.views['map'].setAddress(latLng, app.map.getZoom());
        });
        app.map.on('zoomstart', function(e) {
          return self.previousZoom = app.map.getZoom();
        });
        return app.map.on('zoomend', function(e) {
          var map;
          map = app.map;
          if (map.getZoom() < this.previousZoom && this.previousZoom === 15) {
            return map.removeLayer(window.marker);
          }
        });
      },
      addLayer: function(layer, zIndex) {
        return layer.setZIndex(zIndex).addTo(app.map);
      },
      setAddress: function(latlng, zoom) {
        var lnglat;
        app.map.setView(latlng, zoom);
        lnglat = [latlng[1], latlng[0]];
        return app.layout.views['#legend'].views['#query'].getQuery(lnglat);
      },
      makeGeoJSONLayer: function(data, type) {
        var layer, self;
        self = this;
        if (type === 'ap') {
          layer = app.layers['apLayer'] = L.geoJson(data, {
            renderer: app.map.renderer,
            style: function(feature, layer) {
              return {
                className: 'ap',
                color: app.getColor("ap", feature.properties.DN)
              };
            }
          });
        } else if (type === 'ep') {
          layer = app.layers['epLayer'] = L.geoJson(data, {
            renderer: app.map.renderer,
            style: function(feature, layer) {
              return {
                className: app.getPattern("ep", feature.properties.DN) + " ep"
              };
            },
            filter: function(feature, layer) {
              if (feature.properties.DN === null) {
                return false;
              } else {
                return true;
              }
            }
          });
        } else {
          layer = app.layers[type] = L.geoJson(data, {
            renderer: app.map.renderer,
            style: function(feature, layer) {
              return {
                className: "no-data-yet"
              };
            }
          });
        }
        return layer;
      },
      renderTemplate: function() {
        var ap, base, baseURL, bounds, canada, center, ep, floods, labels, labelsURL, map, mexico, northEast, southWest, usNoData;
        baseURL = '//{s}.tiles.mapbox.com/v3/floatmap.2ce887fe/{z}/{x}/{y}.png';
        labelsURL = '//{s}.tiles.mapbox.com/v3/floatmap.2b5f6c80/{z}/{x}/{y}.png';
        if (!app.map) {
          southWest = L.latLng(35.85343961959182, -96.1083984375);
          northEast = L.latLng(51.12057809796008, -79.40917968750001);
          center = L.latLng(44.2205730390537, -88);
          bounds = L.latLngBounds(southWest, northEast);
          map = app.map = new L.Map('map', {
            maxBounds: bounds,
            minZoom: 5,
            maxZoom: 15,
            zoom: 6,
            center: center,
            attributionControl: false
          });
        }
        map.renderer = L.svg({
          pane: 'tilePane'
        }).addTo(map);
        base = window.base = app.layers['base'] = L.tileLayer(baseURL, {
          pane: 'tilePane'
        });
        floods = window.floods = app.layers['floods'] = L.tileLayer('/static/nfhl_tiles/{z}/{x}/{y}.png', {
          pane: 'tilePane',
          errorTileUrl: 'http://i.imgur.com/aZejCgY.png'
        });
        labels = window.labels = app.layers['labels'] = L.tileLayer(labelsURL, {
          pane: 'tilePane'
        });
        ap = window.ap = this.makeGeoJSONLayer(window.apData, 'ap');
        ep = window.ep = this.makeGeoJSONLayer(window.epData, 'ep');
        usNoData = window.usNoData = this.makeGeoJSONLayer(window.usNoDataData, 'usNoData');
        canada = window.canada = this.makeGeoJSONLayer(window.canadaData, 'usNoData');
        mexico = window.mexico = this.makeGeoJSONLayer(window.mexicoData, 'usNoData');
        this.addLayer(base, 0);
        if ($.cookie('welcomed')) {
          this.addLayer(floods, 2);
          this.addLayer(ap, 3);
          this.addLayer(ep, 4);
        }
        this.addLayer(labels, 5);
        this.addLayer(usNoData, 6);
        this.addLayer(canada, 6);
        this.addLayer(mexico, 6);
        map.addControl(L.control.zoom({
          position: "bottomleft"
        }));
        return this.setEvents();
      }
    });
    QueryView = app.QueryView = Backbone.View.extend({
      template: "#queryTemplate",
      initialize: function() {
        this.model = new Query();
        return this.listenTo(this.model, "change", this.render);
      },
      serialize: function() {
        return {
          query: this.model.attributes
        };
      },
      getQuery: function(lnglat) {
        var self;
        self = this;
        return this.model.fetch({
          data: {
            lng: lnglat[0],
            lat: lnglat[1]
          },
          type: 'POST',
          success: function(model, response) {
            return setTimeout(function() {
              if (!$('.legend-wrapper').hasClass('active')) {
                $('#legend-toggle').trigger('click');
              }
              if ($('#query').hasClass('hidden')) {
                $('#query').removeClass('hidden');
                return $('#query').addClass('active');
              }
            }, 100);
          }
        });
      }
    });
    LegendView = app.LegendView = Backbone.View.extend({
      template: "#legendTemplate",
      events: {
        "click #legend": function(e) {
          return e.stopPropagation();
        },
        "click #legend-toggle": function(e) {
          if ($('.legend-wrapper').hasClass('active')) {
            $('.legend-wrapper').addClass('invisible');
            return setTimeout(function() {
              return $('.legend-wrapper, #legend-toggle').removeClass('active');
            }, 1);
          } else {
            $('.legend-wrapper, #legend-toggle').addClass('active');
            return setTimeout(function() {
              return $('.legend-wrapper').removeClass('invisible');
            }, 150);
          }
        },
        "click .switch-container": function(e) {
          var current_ap, current_ep, layer, map, name;
          e.stopPropagation();
          map = app.map;
          name = $(e.currentTarget).find('.ios-switch').data('layer');
          layer = app.layers[name];
          current_ap = app.layers['apLayer'];
          current_ep = app.layers['epLayer'];
          if ($(e.currentTarget).find('.ios-switch').is(':checked')) {
            if (layer === current_ap) {
              if (map.hasLayer(current_ep)) {
                map.removeLayer(current_ap);
                map.removeLayer(current_ep);
                map.addLayer(window.ap, 2);
                return map.addLayer(window.ep, 3);
              } else {
                return map.addLayer(window.ap, 2);
              }
            } else if (layer === current_ep) {
              return map.addLayer(window.ep);
            } else {
              return map.addLayer(layer);
            }
          } else {
            if (map.hasLayer(layer)) {
              return map.removeLayer(layer);
            }
          }
        }
      },
      views: {
        '#query': new QueryView()
      },
      afterRender: function() {
        var apGrades, div, i, j, labels, len, self, switches;
        self = this;
        apGrades = _.range(0, 13, 1);
        labels = [];
        switches = document.querySelectorAll('input[type="checkbox"].ios-switch');
        for (j = 0, len = switches.length; j < len; j++) {
          i = switches[j];
          div = document.createElement('div');
          div.className = 'switch';
          i.parentNode.insertBefore(div, i.nextSibling);
        }
        self.$el.find(".apRange").append("<div class='ap-values'></div>");
        $(apGrades).each(function(index) {
          var apValue, textNode;
          apValue = $("<div><i style=\"background:" + app.getColor("ap", this) + "\"></i></div>");
          if (index % 4 === 0) {
            textNode = "<span>+" + this + "%</span>";
            apValue.append(textNode);
          }
          return self.$el.find(".ap-values").append(apValue);
        });
        self.$el.find(".apRange").append("<div class='ap-arrow'></div>");
        self.$el.find(".apRange").append("<span class='ap-text'>Increasing Average Precipitation</span>");
        self.$el.appendTo(layout.$el.find('#legend'));
        if ($.cookie('welcomed')) {
          $('#floods-switch').prop('checked', true);
          $('#apLayer-switch').prop('checked', true);
          $('#epLayer-switch').prop('checked', true);
        }
        return $("[data-toggle=tooltip]").tooltip({
          placement: 'left'
        });
      }
    });
    FloatLayout = app.FloatLayout = Backbone.Layout.extend({
      template: "#floatLayout",
      initialize: function() {
        var welcome;
        welcome = new WelcomeView();
        if (!$.cookie('welcomed')) {
          this.insertView('#welcome', welcome);
          return $.cookie('welcomed', true);
        }
      },
      views: {
        '#header': new HeaderView(),
        'map': new MapView(),
        '#legend': new LegendView()
      }
    });
    layout = app.layout = new FloatLayout();
    layout.$el.appendTo('#main');
    return layout.render();
  });

}).call(this);

//# sourceMappingURL=main.js.map

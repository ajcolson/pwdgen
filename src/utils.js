/**
 * Hybrid alias for document.querySelector and document.querySelectorAll
 * @param {String} target The CSS selector tag for the element you need.
 * @returns {HTMLBodyElement|Array<HTMLBodyElement>} Returns a single HTMLBodyElement or an Array of HTMLBodyElements.
 */
function $(target) { 
  var elems = document.querySelectorAll(target)
  if ( elems.length == 1 )
    return elems[0]
  if ( elems.length == 0 )
    return false
  return elems
}

/**
 * Shorthand for adding a callback listener for the DOMContentLoaded event.
 * @param {Function} callback 
 */
$.DOMReady = callback => {
  document.addEventListener("DOMContentLoaded", callback)
}
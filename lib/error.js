const assign = require('object-assign')

module.exports = error
function error (err) {
  var element = document.createElement('pre')  
  element.textContent = err.message ? err.message : err
  document.body.appendChild(element)
  assign(element.style, {
    position: 'fixed',
    width: '100%',
    'z-index': '100000',
    height: '100%',
    top: '0',
    left: '0',
    padding: '20px',
    'box-sizing': 'border-box',
    'word-wrap': 'break-word',
    'font-size': '16px',
    margin: '0',
    background: '#fff', // or ffefef ?
    color: '#ff0000'
  })
}
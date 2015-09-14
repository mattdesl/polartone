const domify = require('domify')
const insertCSS = require('insert-css')
const once = require('once')
const fonts = require('google-fonts')

const css = `
.error {
  position: fixed;
  position: fixed;
  width: 100%;
  z-index: 100000;
  height: 100%;
  top: 0;
  left: 0;
  padding: 20px;
  box-sizing: border-box;
  word-wrap: break-word;
  font-size: 16px;
  margin: 0;
  font: 14px 'Open Sans', sans-serif;
  /*background: #fff;*/
}

a {
  text-decoration: none;
  color: #0066FF;
}
a:hover, a:visited, a:active {
  text-decoration: underline;
}
`

module.exports = once(error)
function error (err) {
  const template = `
    <div class="error">${err}
    See <a href="https://github.com/mattdesl/spins">here</a>
    for screen shots and source.
    </div>
  `
  fonts.add({ 'Open Sans': [300, 600] })
  insertCSS(css)
  
  const element = domify(template)
  document.body.appendChild(element)
}
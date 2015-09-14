const Analyser = require('web-audio-analyser')
const createCamera = require('perspective-camera')
const createLoop = require('raf-loop')
const getContext = require('get-canvas-context')
const lerp = require('lerp')
const defined = require('defined')
const fit = require('canvas-fit')

const presets = require('./presets')
const soundcloud = require('soundcloud-badge')

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
const context = getContext('2d')
const canvas = context.canvas
document.body.appendChild(canvas)
document.body.style.overflow = 'hidden'

const loop = createLoop()
let oldDiv, oldAudio
loadTrack()
printOptions()

global.load = loadTrack
function loadTrack (opt) {
  if (oldAudio) oldAudio.pause()
  if (oldDiv) oldDiv.parentNode.removeChild(oldDiv)
  loop.stop()
  loop.removeAllListeners('tick')

  if (!opt) {
    opt = presets[Math.floor(Math.random() * presets.length)]
  } else if (typeof opt === 'string') {
    opt = { url: opt }
  }

  soundcloud({
    client_id: 'b95f61a90da961736c03f659c03cb0cc',
    song: opt.url,
    dark: true,
    getFonts: true
  }, (err, src, json, div) => {
    if (err) throw err
    oldDiv = div
    startAudio(src, opt)
  })
}

function startAudio (src, opt) {
  const audio = new Audio()
  audio.crossOrigin = 'Anonymous'
  audio.loop = true
  // audio.setAttribute('muted', '')
  audio.addEventListener('canplay', () => {
    if (opt.seek) audio.currentTime = opt.seek
    renderTrack(audio, opt)
    audio.play()
  })
  audio.src = src
  oldAudio = audio
}

function renderTrack (audio, opt) {
  const node = Analyser(audio, audioContext, { audible: true, stereo: false })

  const shape = [ window.innerWidth, window.innerHeight ]
  const dpr = window.devicePixelRatio

  // scale and fit to screen
  fit(canvas, window, dpr)()

  let time = 0

  const camera = createCamera({
    fov: Math.PI / 4,
    near: 0.01,
    far: 100,
    viewport: [0, 0, ...shape]
  })

  const duration = audio.duration
  const cursor = [ 0, 0, 0 ]
  const positions = []
  const positionMax = defined(opt.capacity, 1000)
  const dist = defined(opt.distance, 0.25)
  const ySize = defined(opt.extent, 0.5)

  loop.on('tick', render).start()

  function render (dt) {
    time += dt / 1000
    const dur = time / duration
    if (dur > 1) return loop.stop()

    const audioData = node.waveform()
    const bufferLength = audioData.length

    // set up our camera
    // with WebGL (persistent lines) could be
    // interesting to fly through it in 3d
    camera.identity()
    camera.translate(opt.position || [ 0, 3.5, 0 ])
    camera.lookAt([ 0, 0, 0 ])
    camera.update()

    context.save()
    context.scale(dpr, dpr)

    // for a motion trail effect
    // const [width, height] = shape
    // context.fillStyle = 'rgba(255,255,255,0.0001)'
    // context.fillRect(0, 0, width, height)

    let radius = 1 - dur
    const startAngle = time
    const alpha = opt.alpha || 0.25
    context.strokeStyle = 'rgba(0, 0, 0, ' + alpha + ')'
    context.lineWidth = 0.1
    context.lineJoin = 'round'
    context.beginPath()
    for (let i = positions.length - 1; i >= 0; i--) {
      var pos = positions[i]
      context.lineTo(pos[0], pos[1])
    }
    context.stroke()
    context.restore()

    for (let i = 0; i < bufferLength; i++) {
      const alpha = i / (bufferLength - 1)
      const angle = lerp(startAngle + dist, startAngle, alpha)
      cursor[0] = Math.cos(angle) * radius
      cursor[2] = Math.sin(angle) * radius

      const amplitude = (audioData[i] / 128.0)
      const waveY = (amplitude * ySize / 2)

      const adjusted = [cursor[0], cursor[1] + waveY, cursor[2]]
      const [x, y] = camera.project(adjusted)
      if (positions.length > positionMax) {
        positions.shift()
      }
      positions.push([x, y])
    }
  }
}

function printOptions () {
  console.log(`%censō-audio`, `font-weight: bold; padding: 3px; background: #ededed;`)
  console.log(`To change tracks and settings:

  load()    // loads a random track
  load(url) // loads a SoundCloud url
  load(opt) // loads with full options
  
  options:
    url        the URL to load
    capacity   number of line segments per tick
    distance   radial distance along circle to draw each tick
    position   camera [x, y, z]
    extent     amount to extend away from line center
    alpha      line opacity
`)
}

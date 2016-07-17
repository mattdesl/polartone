# polartone 

###### <sup>formerly *spins*</sup>

Audio visualizer, rendering waveforms in polar coordinates. Uses WebAudio and Canvas2D. Electron and [hihat](https://github.com/Jam3/hihat) is used to generate high-resolution prints, see below.

## Online Demo

The demo uses WebAudio, and only works in latest Chrome and FireFox.

http://mattdesl.github.io/polartone/

## Screenshots

<img src="http://i.imgur.com/ErtIEYn.png" width="49%" />
<img src="http://i.imgur.com/XY4MQnH.png" width="49%" />

## Running from Source

To run the web demo from source:

```sh
git clone https://github.com/mattdesl/polartone.git
cd polartone
npm install

# start localhost:9966
npm run start

# or run build process
npm run build
```

Tested on node 0.12.7 and npm 2.1.8.

## High-Resolution Prints

To generate high-resolution prints, [hihat](https://github.com/Jam3/hihat) (Electron + Browserify + Node) is used to write the `<canvas>` element to disk.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/polartone/blob/master/LICENSE.md) for details.

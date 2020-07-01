/* globals -- list all the symbols we use here so Glitch doesn't complain!
p5, midiToFreq, frameRate, colorMode, HSB, noLoop, loop, redraw,
angleMode, DEGREES, cos, sin, atan2, TAU, min, max, shuffle, dist, floor, ceil, 
createCanvas, resizeCanvas, windowWidth, windowHeight, textWidth, 
clear, line, width, height, point, mouseX, mouseY, ellipse, rect, noStroke,
fullscreen, background, stroke, color, fill, text, noFill, keyCode, textSize, 
push, pop, translate, rotate, frameCount, 
clip, range, randrange, midpoint, randelem, randreal, 
apl, mod, argmin, transpose, uniquify, renorm, spinpick, sortby, digs, commafy, 
fracify, getQueryParam, rage, blink, tallyhue, 
*/

new p5() // including this lets you use p5's globals everywhere

const hyperchunk = 1e5 // chunk to use when in hyperspeed
const infoht = 26 // how many pixels high the info lines at the bottom are

// Number Of Attractors
const noa = parseInt(getQueryParam('noa', randrange(3, 12)))
// NOt Choose: how many attractors around the last one to exclude
const cac = parseInt(getQueryParam('cac', randrange(0,noa-2)))
// PArtial Teleport: how far from current pt to attractor to jump
const pat = parseInt(getQueryParam('pat', randrange(1,11)))/12
// How many points to plot at once (more = faster, up to a point)
let chunk = parseInt(getQueryParam('chunk', hyperchunk))

rage(`?noa=${noa}&cac=${cac}&pat=${Math.round(pat*12)}&chunk=${chunk}`, false)

// (cool settings moved to the README)

let x, y // coordinates
let grid = [] // keeping track of every pixel we've been at
let tot = 0 // total number of steps/treads/points we've made so far
let maxp = 0 // max points plotted (aka tally) on any pixel
let xcom // x-value of the center of mass
let ycom // y-value of the center of mass
let att = [] // list of attractors (points to move to move towards)
let la = 0 // index of last attractor chosen
let osc // oscillator, for playing sound
let sound = false
let tini // start time
let totline = '' // info line at bottom showing total points plotted
let maxline = '' // info line at bottom showing max tally on any pixel

// Initialize the grid (or could use p5's built-in pixelDensity or something)
function initgrid() {
  for (let i = 0; i < width; i++) {
    let cols = []
    for (let j = 0; j < height; j++) cols[j] = 0
    grid[i] = cols
  }
}

function reset() {
  x = xcom = floor(width/2)  //+ .5
  y = ycom = floor(height/2) //+ .5
  tot = 0
  initgrid()
  clear()
  background('Black')
  stroke('Black'); fill('BlueViolet')
  att.map(p => { ellipse(p[0], p[1], 20) })
  stroke('Black'); fill('White')
  textSize(15)
  text(
    `The Chaos Game! by Daniel Reeves and Cantor Soule-Reeves\n\n` +
    `Screen is ${width} pixels wide by ${height} pixels high\n` +
    `There are ${noa} attractors, excluding ${cac}, ` +
      `with partial teleport ${fracify(pat)}\n` +
    `The faint gray line traces the center of mass\n` +
    'Press...\n' +
    '  s for sound + slow speed\n' +
    '  h for hyperspeed\n' + 
    '  r to refresh the page with random parameters\n' +
    '  n to refresh everything but number of attractors\n' +
    '  p to refresh everything but the partial teleport',
    5, 15)
  
  // rainbow bar from x=5 to x=422+5
  noStroke()
  for (let i = 0; i <= 422; i++) {
    fill(blink(i/422), 1, 1)
    rect(5+i, 20, 1, 17)
  }
  //for (let i = 0; i <= 422; i++) {
  //  fill(i/422, 1, 1)
  //  rect(5+i, 214, 2, 17)
  //}
}

// Coordinate transform so we can think of the origin as being at the center of 
// the canvas and the edges at -1 to +1 and convert to where the upper left 
// corner is (0,0) and the bottom right is (n-1,n-1)
function coort(x, y) {
  const n = min(width, height)
  const dx = max(0, width - height)
  const dy = max(0, height - width - (2*infoht+5))
  return [n/2 * (1+x) + dx, 
          n/2 * (1-y) + dy]
}

// Convert from polar to cartesian, with r=1 and the given theta, using pixel 
// coordinates per coort()
function cart(theta) { return coort(Math.cos(theta), Math.sin(theta)) }

// Generate a list of points spread out on a big circle
function genattractors(n) {
  //return [coort(1,1), coort(-1,1), coort(-1,-1), coort(1,-1), coort(0,0)]
  if      (n===3)  return [coort(-1,-1), coort(1,-1), coort(0, Math.sqrt(3)-1)] 
  else if (n===4)  return [coort(1,1), coort(-1,1), coort(-1,-1), coort(1,-1)]
  else if (n%2==0) return range(n).map(i => cart(i*TAU/n))
  else             return range(n).map(i => cart(i/n*TAU + (1/4-1/n)*TAU))
}

// Plot a point at (x,y) and shift the color from blue to pink the more times
// that a point is plotted there; also plot the center of mass in white
function plotxy(x, y) {
  grid[x][y] += 1
  const n = grid[x][y]
  if (n > maxp) maxp = n
  stroke(tallyhue(n, maxp), 1, 1)
  tot += 1
  xcom = (tot-1)/tot*xcom + x/tot // update the center of mass
  ycom = (tot-1)/tot*ycom + y/tot
  point(x, y)
  //ellipse(x,y, 5)
  stroke(1, 0, .3)
  point(xcom, ycom) // plot the center of mass in (faint) white
  //ellipse(xcom, ycom, 100, 100)
}

function chaos() {
  const ch = ceil(cac/2)
  const a = mod(randrange(la+ch, la+ch+noa-1-cac), noa)
  la = a
  const p = midpoint([x,y], att[la], pat).map(floor)
  x = p[0]
  y = p[1]
  //apl((x,y)=>ellipse(x,y,1+grid[cur[0]][cur[1]]), cur)
  plotxy(x,y)
}

function playrandnote() {
  // 41 is about the lowest we can hear
  // 129 the highest daddy (age 42) can hear
  // 134 is the highest faire (age 10) and cantor (age 8) can hear
  osc.freq(midiToFreq(randrange(50, 110)))
}

// Re-plot all the points in the grid, recomputing the colors
function regen(alg=1) {
  console.log('start regenerating')
  let minp = maxp
  let n
  let f = {} // f[i] initially gives the number of pixels with tally i
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      n = grid[i][j]
      if (n>0) {  // if this pixel has tally 0 then just ignore it
        if (f[n]===undefined) { f[n] = 1 } else { f[n]++ } 
        if (n<minp) minp = n    
      }
    }
  }
  console.log('(got minp & histogram thing)')
  let sum = 0
  Object.keys(f).forEach(i => {
    sum += Math.log(f[i])
    f[i] = sum
  })
  // now f[i] gives the cumulative number of pixels with tally <= i
  console.log(`
minp = ${minp}
maxp = ${maxp}
sum = ${sum}
f[maxp] = ${f[maxp]}`)
//${JSON.stringify(Object.keys(f))}`)
  const a = f[minp]
  Object.keys(f).forEach(i => {
    f[i] = (f[i]-a)/(sum-a)
  })
  // now f[minp] is 0 and f[maxp] is 1
  console.log(`f[minp] = ${f[minp]} (should be 0)\n` +
              `f[maxp] = ${f[maxp]} (should be 1)`)
  for (let i = 0; i < width; i++)
    for (let j = 0; j < height; j++) {
      n = grid[i][j]
      if (n > 0) {
        if (alg===1) {
          stroke(blink((n-minp)/(maxp-minp)), 1, 1)
        } else if (alg===2) {
          stroke(blink(f[n]), 1, 1)
        } else {
          stroke('White')
        }
        if (n > 0) point(i,j)  
      }
  }
  console.log('done regenerating')
}


// -----------------------------------------------------------------------------
// Special p5.js functions -----------------------------------------------------
// -----------------------------------------------------------------------------

function draw() {
  if (sound) playrandnote()
  for (let i = 0; i < chunk; i++) chaos();
  
  textSize(30); noStroke(); fill('Black')
  rect(0, height-infoht*2-3, textWidth(maxline)+3, infoht+2)
  rect(0, height-infoht,     textWidth(totline)+3, infoht+2)
  maxline = `max  ${commafy(maxp)}`
  totline = `total: ${commafy(tot)}`
  stroke('Black'); fill('White')
  text(maxline, 3, height - infoht - 3*2)
  text(totline, 3, height-3)  
  stroke('Black'); fill(tallyhue(maxp%1000, 1000), 1, 1)
  text(':', 60, height - infoht - 3*2)
  stroke('Yellow'); fill('Yellow') // for drawing with the mouse
  if (tot % 1e7 === 0) {
    console.log(`${Math.round(1e7/((Date.now()-tini)/1000))} points per second`)
    tini = Date.now()
  }
}

function setup() {
  //angleMode(DEGREES) // use degrees instead of radians
  createCanvas(windowWidth, windowHeight) // fill the window
  console.log(`Screen is ${width}x${height} pixels`)
  osc = new p5.Oscillator()
  frameRate(30) // 60 fps is about the most it can do
  colorMode(HSB, 1)
  att = genattractors(noa)
  reset()
  tini = Date.now()
}

function mouseDragged() {
  ellipse(mouseX, mouseY, width/128, height/128)
  return false // prevent default (not sure what that means)
}

function keyPressed() {
  console.log(`Key pressed! keyCode=${keyCode}`)
  if (keyCode === 83) { // s
    chunk = 1
    if (!sound) { sound = true; osc.start() }
    console.log(`Sound ${sound}`)
  } else if (keyCode === 72) { // h
    chunk = hyperchunk
    if (sound) { sound = false; osc.stop() }
  } else if (keyCode === 82) { // r
    rage('/')
  } else if (keyCode == 78) { // n
    const newcac = randrange(0, noa-2)
    const newpat = randrange(1,11)
    rage(`/?noa=${noa}&cac=${newcac}&pat=${newpat}&chunk=${chunk}`)
  } else if (keyCode === 67) { // c
    console.log('cooooookies')
  } else if (keyCode === 80) { // p
    const newnoa = randrange(3,12)
    const newcac = randrange(0, newnoa-2)
    const newpat = Math.round(pat*12) // same pat, but just need the numerator
    rage(`/?noa=${newnoa}&cac=${newcac}&pat=${newpat}&chunk=${chunk}`)
  } else if (keyCode === 49 || keyCode === 71) { // 1
    regen(1)
  } else if (keyCode === 50) { // 2
    regen(2)
  } else if (keyCode === 51) { // 3
    regen(3)
  }
  return false
}

// -----------------------------------------------------------------------------
// Bad ideas go below
// -----------------------------------------------------------------------------

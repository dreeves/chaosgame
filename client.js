/* globals -- list all the symbols we use here so Glitch doesn't complain!
p5, frameRate, colorMode, HSB, noLoop, loop, redraw,
cos, sin, atan2, TAU, sqrt, min, max, shuffle, floor, ceil, round, log, abs,
createCanvas, resizeCanvas, windowWidth, windowHeight, textWidth, 
clear, line, width, height, point, mouseX, mouseY, ellipse, rect, noStroke,
fullscreen, background, stroke, color, fill, text, noFill, keyCode, textSize, 
push, pop, translate, frameCount, 
clip, range, randrange, midpoint, randelem, randreal, 
apl, mod, argmin, transpose, uniquify, renorm, spinpick, sortby, digs, commafy, 
fracify, getQueryParam, rage, blink, tallyhue, 
*/

new p5() // including this lets you use p5's globals everywhere

const infoh = 26 // how many pixels high the info lines at the bottom are

const nom = {
  "sierpinski triangle": [3, 0, 6],
  "chinese checkers":    [6, 3, 6],
  "DUD":                 [],
}

// Number Of Attractors
let noa = parseInt(getQueryParam('noa', randrange(3, 12)))

// Whether to put one of the attractors in the center
const hub = parseInt(getQueryParam('hub', noa===3 ? 0 : randrange(0,1)))

// CAn't Choose: how many attractors around the last one to exclude
const cac = parseInt(getQueryParam('cac', hub===1 ? 0 : randrange(0,noa-2)))

// PArtial Teleport: how far from current pt to attractor to jump
let pat = getQueryParam('pat', randrange(1,11))
if (pat === 'phi' || pat === 'PHI') { pat = 0.6180339887498948 }
else { pat = parseInt(pat)/12 }

// How many points to plot at once (more = faster, up to a point)
let chunk = parseInt(getQueryParam('chunk', 1))

function penc(p) { return fracify(p)==="1/phi" ? "phi" : round(pat*12) }

rage(`?noa=${noa}&hub=${hub}&cac=${cac}&pat=${penc(pat)}`, false)

// (cool settings moved to the README)

let x, y // coordinates
let grid = [] // keeping track of every pixel we've been at
let tot = 0 // total number of steps/treads/points we've made so far
let minp = 0 // min points plotted (aka tally) on any pixel (need regen to know)
let maxp = 0 // max points plotted (aka tally) on any pixel (tracked as we go)
let att = [] // list of attractors (points to move to move towards)
let la = 0 // index of last attractor chosen
let totline = '' // info line at bottom showing total points plotted
let maxline = '' // info line at bottom showing max tally on any pixel
let pause = false // whether to pause plotting (we never stop calculating)
let tah = {} // tally-hue-hash: map each tally to the hue for that tally
let calg = 1 // color algorithm
let rx = 0 // x-coordinate of where regenerating the colors has gotten to
let minx = -1 // the smallest x-value of any plotted point (tally>0)
let maxx = -1 // the largest x-value of any plotted point (tally>0)
let t = Date.now()

function instructions() {
  stroke('Black'); fill('White')
  textSize(15)
  const thecopy = `The Chaos Game! by Daniel Reeves and Cantor Soule-Reeves

Screen is ${width} pixels wide by ${height} pixels high
There are ${noa} attractors, ` +
`${hub===1 ? "w/ a hub, " : "w/o a hub, "} ` +
`excluding ${cac}, with partial teleport ${fracify(pat)}
Press...
  SPACE to pause plotting = WAY faster CALCULATING
  R to refresh the page with random parameters
  N to refresh everything but number of attractors
  H to refresh everything but whether there's a hub
  P to refresh everything but the partial teleport
  G to regenerate colors (or 1/2/3/etc for other color funcs)`

  text(thecopy , 5, 15)
}

function rainbar() {
  noStroke()
  for (let i = 0; i <= 422; i++) {            // rainbow bar from x=5 to x=422+5
    fill(blink(i/422), 1, 1)
    rect(5+i, 20, 1, 17)
  }
}

function rocket(x) {
  noStroke()
  fill('Black')
  rect(360, 115, 100, 55)
  textSize(50)
  if (x) {
    text("🚀🤫", 360, 160) 
  } else {
    text("🖌️", 360, 160)
  }
}

// Coordinate transform so we can think of the origin as being at the center of 
// the canvas and the edges at -1 to +1 and convert to where the upper left 
// corner is (0,0) and the bottom right is (n-1,n-1)
function coort(x, y) {
  const n = min(width, height)
  const dx = max(0, width - height)
  const dy = max(0, height - width - (2*infoh+5))
  return [n/2 * (1+x) + dx, 
          n/2 * (1-y) + dy]
}

// Convert from polar to cartesian, with r=1 and the given theta, using pixel 
// coordinates per coort()
function cart(theta) { return coort(cos(theta), sin(theta)) }

// Generate a list of points spread out on a big circle
function genattractors(n) {
  let a = []
  n -= hub
  if      (n===3)  a = [coort(-1,-1), coort(1,-1), coort(0, sqrt(3)-1)] 
  else if (n===4)  a = [coort(1,1), coort(-1,1), coort(-1,-1), coort(1,-1)]
  else if (n%2==0) a = range(n).map(i => cart(i*TAU/n))
  else             a = range(n).map(i => cart(i/n*TAU + (1/4-1/n)*TAU))
  if (hub===1) a.push(coort(0,0))
  return a
}

// Pick the new point (midpoint between the current point and a randomly chosen
// attractor) and plot it, using a color based on its tally.
function chaos() {
  const ch = ceil(cac/2)
  const a = mod(randrange(la+ch, la+ch+noa-1-cac), noa)
  la = a
  const p = midpoint([x,y], att[la], pat).map(floor)
  x = p[0]
  y = p[1]
  tot += 1
  grid[x][y] += 1
  const t = grid[x][y]
  if (t > maxp) maxp = t
  if (x < minx) minx = x
  if (x > maxx) maxx = x
  if (pause) return
  stroke(tallyhue(t, maxp), 1, 1)
  point(x, y)
}

// Re-compute the colors for all points based on their tallies
function regen() {
  console.log('start regenerating')
  minp = maxp
  let n, i, j
  for (i = 0; i < width; i++) {
    for (j = 0; j < height; j++) {
      n = grid[i][j]
      if (n>0) {  // if this pixel has tally 0 then just ignore it
        if (tah[n]===undefined) { tah[n] = 1 } else { tah[n]++ } 
        if (n<minp) minp = n    
      }
    }
  }
  console.log('calculated tally-hue-hash (tah)')
  let sum = 0
  Object.keys(tah).forEach(i => {
    sum += (calg===2 ? 1 : 
            calg===3 ? log(tah[i]) : 
            calg===4 ? sqrt(tah[i]) :
            calg===5 ? tah[i] :
            calg===6 ? tah[i]**1.5 :
            calg===7 ? tah[i]**2 :
            calg===8 ? tah[i]**3 : 0)
    tah[i] = sum
  })
  const a = tah[minp]
  Object.keys(tah).forEach(i => { tah[i] = (tah[i]-a)/(sum-a) })
  // now tah[minp] is 0 and tah[maxp] is 1
  rx = minx

/*
  for (i = 0; i < width; i++)
    for (j = 0; j < height; j++) {
      n = grid[i][j]
      if (n > 0) {
        if      (alg == 0) { stroke(.3) } 
        else if (alg == 1) { stroke(blink((n-minp)/(maxp-minp)), 1, 1) }
        else if (alg <= 9) { stroke(blink(tah[n]), 1, 1) }
        else               { stroke(blink((alg-8)/(9-8)), 1, 1) }
        if (n > 0) point(i,j)
      }
  }
*/
  console.log('done regenerating')
}

function infoup() {
  textSize(30); noStroke(); fill('Black')
  rect(0, height-infoh*2-3, textWidth(maxline)+3, infoh+2)
  rect(0, height-infoh,     textWidth(totline)+3, infoh+2)
  maxline = `max  ${commafy(maxp)}`
  totline = `total: ${commafy(tot)}`
  stroke('Black'); fill('White')
  text(maxline, 3, height - infoh - 3*2)
  text(totline, 3, height-3)
  stroke('Black'); 
  if (calg===0) { fill(1, 0, .3) } else { fill(tallyhue(calg-1, 8-1), 1, 1) }
  text(':', 60, height - infoh - 3*2)
}

// -----------------------------------------------------------------------------
// Special p5.js functions -----------------------------------------------------
// -----------------------------------------------------------------------------

function draw() {
  infoup()
  if (rx <= maxx) {
    const mu = (maxx+minx)/2
    const dx = abs(rx-mu)
    //console.log(`dx=${dx}, step=${abs(1+(dx-mu)/(-mu)*((maxx-minx)/12-1))}`)
    const rxcap = min(rx + round(1+(dx-mu)/(-mu)*((maxx-minx)/12-1)), maxx)
    console.log(`rx, rxcap, maxx: ${rx}, ${rxcap}, ${maxx}`)
    for (; rx <= rxcap; rx++) {
      let n
      for (let ry = 0; ry < height; ry++) {
        n = grid[rx][ry]
        if (n > 0) {
          noFill()
          stroke(blink(1), 1, 1)
          if      (calg === 0) { stroke(1, 0, .3) } 
          else if (calg === 1) { stroke(blink((n-minp)/(maxp-minp)), 1, 1) }
          else if (calg <= 8)  { stroke(blink(tah[n]), 1, 1) }
          point(rx, ry)
        }
      }
    }
  } else {
    for (let i = 0; i < chunk; i++) chaos()
    const newt = Date.now()
    if (newt-t <  500) chunk *= 2
    if (newt-t > 1500) chunk /= 2
    t = newt 
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight) // fill the window
  console.log(`Screen is ${width}x${height} pixels`)
  frameRate(30) // 60 fps is about the most it can do
  colorMode(HSB, 1)
  att = genattractors(noa)

  // Initialize the grid (or could use p5's built-in pixelDensity or something)
  for (let i = 0; i < width; i++) {
    let cols = []
    for (let j = 0; j < height; j++) cols[j] = 0
    grid[i] = cols
  }
  
  tot = 0
  x = floor(width/2) 
  y = floor(height/2)
  //[x, y] = coort(0, 0)
  rx = width
  minx = width-1
  maxx = 0
  clear()
  background('Black')
  noStroke(); fill('BlueViolet')
  att.map(p => { ellipse(p[0], p[1], 16) })

  instructions()
  rainbar() 
}

function keyPressed() {
  console.log(`Key pressed! keyCode=${keyCode}`)
  if (keyCode === 32) { // space
    pause = !pause     
    rocket(pause)
  } else if (keyCode === 72) { // h
    const newnoa = randrange(hub===0 ? 3 : 4, 12)
    const newcac = hub===1 ? 0 : randrange(0, newnoa-2)
    const newpat = penc(pat)
    rage(`/?noa=${newnoa}&hub=${hub}&cac=${newcac}&pat=${newpat}`)
  } else if (keyCode === 82) { // r
    rage('/')
  } else if (keyCode == 78) { // n
    const newcac = randrange(0, noa-2)
    const newpat = randrange(1,11)
    rage(`/?noa=${noa}&hub=${hub}&cac=${newcac}&pat=${newpat}`)
  } else if (keyCode === 67) { // c
  } else if (keyCode === 80) { // p
    const newnoa = randrange(3,12)
    const newcac = randrange(0, newnoa-2)
    const newpat = penc(pat)
    rage(`/?noa=${newnoa}&hub=${hub}&cac=${newcac}&pat=${newpat}`)
  } else if (keyCode === 71) { // g
    calg = 1
    regen()
  } else if (keyCode >= 48 && keyCode <= 57) { // 0-9
    calg = keyCode-48
    regen()
  }
  return false
}

// -----------------------------------------------------------------------------
// Bad ideas go below
// -----------------------------------------------------------------------------

/* DRAWING WITH THE MOUSE
function mouseDragged() {
  ellipse(mouseX, mouseY, width/128, height/128)
  return false // prevent default (not sure what that means)
}
*/

/* CHANGING SPEED
  } else if (keyCode === 83) { // s
    if      (chunk ===   1) chunk =  10
    else if (chunk ===  10) chunk = 100
    else if (chunk === 1e2) chunk = 1e3
    else if (chunk === 1e3) chunk = 1e4
    else if (chunk === 1e4) chunk = 1e5
    else if (chunk === 1e5) chunk = 1e6
    else if (chunk === 1e6) chunk = 1e7
    else if (chunk === 1e7) chunk = 1
    else chunk = 1
*/

/* SOUND
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/addons/p5.sound.min.js" integrity="sha256-UySade9ZHGHdcdkTGEpftp/ZZbn9HYCe53RkvVFm9sM=" crossorigin="anonymous"></script>

let osc // oscillator, for playing sound

osc = new p5.Oscillator() // do this in setup()

if (!sound) { sound = true; osc.start() }
console.log(`Sound ${sound}`)

if (sound) { sound = false; osc.stop() }

if (sound) playrandnote()

function playrandnote() {
  // 41 is about the lowest we can hear
  // 129 the highest daddy (age 42) can hear
  // 134 is the highest faire (age 10) and cantor (age 8) can hear
  osc.freq(midiToFreq(randrange(50, 110)))
}
*/

/* CENTER OF MASS
let xcom // x-value of the center of mass
let ycom // y-value of the center of mass

xcom = (tot-1)/tot*xcom + x/tot // update the center of mass
ycom = (tot-1)/tot*ycom + y/tot
ellipse(x,y, 5)
stroke(1, 0, .3)
point(xcom, ycom) // plot the center of mass in (faint) white
ellipse(xcom, ycom, 100, 100)
*/

/* CALCULATING HOW MANY POINTS PER SECOND
if (tot % 1e7 === 0) {
  console.log(`${round(1e7/((Date.now()-tini)/1000))} points per second`)
  tini = Date.now()
}
*/

//apl((x,y)=>ellipse(x,y,1+grid[cur[0]][cur[1]]), cur)

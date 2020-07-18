/* globals -- list all the symbols we use here so Glitch doesn't complain!
p5, frameRate, colorMode, HSB, noLoop, loop, redraw,
cos, sin, atan2, TAU, sqrt, min, max, shuffle, floor, ceil, round, log, abs,
createCanvas, resizeCanvas, windowWidth, windowHeight, textWidth, 
clear, line, width, height, point, mouseX, mouseY, ellipse, rect, noStroke,
fullscreen, background, stroke, color, fill, text, noFill, keyCode, textSize, 
push, pop, translate, frameCount, rotate, textAlign, LEFT, RIGHT, TOP, BOTTOM, 
clip, range, randrange, midpoint, randelem, randreal, 
apl, mod, argmin, transpose, uniquify, renorm, spinpick, sortby, digs, commafy, 
fracify, getQueryParam, rage, blink, tallyhue, 
*/

new p5() // including this lets you use p5's globals everywhere

// -----------------------------------------------------------------------------
// Constants, Parameters, and Global Variables
// -----------------------------------------------------------------------------

const nomnom = [
// ["artsy title",       [noa, hub, cac, pat], stars],
["plain ole sierpinski",   [ 3, 0, 0, 1/2 ], 5],
["chinese checkers",       [ 6, 0, 3, 1/2 ], 5],
["ninja star",             [ 6, 0, 2, 1/2 ], 3],
["day of the dead",        [ 5, 0, 1, 1/2 ], 3],
["stained glass window",   [ 6, 0, 0, 1/2 ], 3],
["snowflake",              [ 6, 0, 3, 1/3 ], 3],
["snowsquare",             [ 4, 0, 1, 1/2 ], 3],
["lightning donut",        [12, 0, 6, 1/2 ], 3],
["pentagon star",          [ 5, 0, 3, 1/3 ], 3],
["asterisk",               [ 7, 0, 3, 1/2 ], 3],
["holy pentagon",          [ 5, 0, 0, 1/2 ], 3],
["snowflakey flower",      [ 7, 0, 4, 1/2 ], 3],
["arrows",                 [ 3, 0, 1, 1/3 ], 3],
["jaggly nonagon",         [ 9, 0, 4, 1/2 ], 3],
["lego hands",             [ 7, 0, 1, 2/3 ], 3],
["fluffy well",            [10, 0, 2, 1/2 ], 3],
["stars of david",         [ 6, 0, 0, 7/12], 3],
["coral",                  [ 8, 0, 0, 2/3 ], 3],
["footprints",             [10, 0, 0, 2/3 ], 3],
["sun",                    [ 9, 0, 6, 1/3 ], 3],
["bubbles",                [ 9, 0, 0, 2/3 ], 3],
["pentaflake",             [ 5, 0, 0, 7/12], 3],
["pinwheel squares",       [ 4, 0, 2, 1/4 ], 3],
["fuzzy triangle",         [ 3, 0, 0, 1/4 ], 3],
["warm pentagon",          [ 5, 0, 0, 1/3 ], 3],
["tendrils",               [ 8, 0, 2, 2/3 ], 3],
["figure eights",          [ 8, 0, 0, 7/12], 3],
["table saw",              [ 9, 0, 6, 1/4 ], 3],
["lobster",                [ 7, 0, 3, 5/12], 3],
["spokey",                 [ 5, 0, 2, 1/4 ], 3],
["pentaspoke",             [ 5, 0, 1, 1/3 ], 3],
["hippo",                  [ 3, 0, 1, 1/4 ], 3],
["fire breathing lizards", [ 9, 0, 3, 1/2 ], 3],
["gearflake",              [ 8, 0, 2, 7/12], 3],
["ragdolls",               [12, 0, 3, 2/3 ], 3],  
["molecule",               [ 6, 0, 4, 1/2 ], 2],
["dumbo",                  [11, 0, 2, 8/12], 3], 
["kochflake",              [ 6, 0, 0, 8/12], 3], 
["pentafluff",             [ 6, 1, 0, 6/12], 3], 
["flowerpower/daisychain", [ 8, 1, 0, 8/12], 3], 
["snowflower",             [ 7, 1, 0, 8/12], 3], 
["carpet",                 [ 4, 0, 1, 5/12], 3], 
["wheel",                  [ 9, 1, 0, 8/12], 3], 
["sierpinski dribble",     [ 4, 1, 0, 6/12], 3], 
["colorful?",              [ 7, 0, 0, 6/12], 3], 
["doily",                  [ 8, 1, 0, 7/12], 3], 
["gargoyle totem raven",   [10, 0, 5, 6/12], 3], 
["hexabubbles",            [ 7, 1, 0, 6/12], 3], 
["spaceship?",             [ 4, 0, 1, 5/12], 3], 
["circle flower?",         [10, 1, 0, 8/12], 3], 
["battle turtle",          [ 8, 1, 5, 6/12], 3], 
["quilt square?",          [ 4, 0, 1, 5/12], 3], 
["solid square?",          [ 5, 1, 0, 6/12], 3], 
["swimming turtle?",       [12, 1, 7, 7/12], 3], 
["heart smart?",           [ 8, 1, 1, 7/12], 3], 
]

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

/* VETO PILE
["lego feet",              [12, 0, 2, 3/4 ], 3 ], // horseshoe skates
["DUD",                    [ 4, 1, 2, 3/4 ], 0 ],

*/

const infoh = 26 // how many pixels high the info lines at the bottom are

let noa // Number Of Attractors
let hub // whether to put one of the attractors in the center
let cac // CAn't Choose: how many attractors around the last one to exclude
let pat // PArtial Teleport: how far from current pt to attractor to jump
let x, y // coordinates
let grid = [] // keeping track of every pixel we've been at
let chunk = 1 // how many points to plot at once (more = faster, up to a point)
let tot = 0 // total number of steps/treads/points we've made so far
let minp = 0 // min points plotted (aka tally) on any pixel (need regen to know)
let maxp = 0 // max points plotted (aka tally) on any pixel (tracked as we go)
let att = [] // list of attractors (points to move to move towards)
let la = 0 // index of last attractor chosen
let totline = '' // info line at bottom showing total points plotted
let maxline = '' // info line at bottom showing max tally on any pixel
let ppsline = '' // info line at bottom showing plot speed
let state = 1 // 1 = turtle (plot as we go); 2 = rocket (calculate w/o plotting)
let tah = {} // tally-hue-hash: map each tally to the hue for that tally
let calg = 1 // color algorithm
let rx = 0 // x-coordinate of where regenerating the colors has gotten to
let minx = -1 // the smallest x-value of any plotted point (tally>0)
let maxx = -1 // the largest x-value of any plotted point (tally>0)
let drawt = Date.now() // timestamp that we last refreshed the plot
let pps = 0 // Points plotted per second
let titlehash = {} // maps the rawname to the artsy title
let counthash = {} // maps the rawname to the index in nomnom
let rawname // Name that encodes the parameters like "n3h0c0p6"

// -----------------------------------------------------------------------------
// Managing the parameters and the artsy titles
// -----------------------------------------------------------------------------

// Takes a partial teleport (eg .5) and returns encoding for the URL (eg "6")
function penc(p) { return fracify(p)==="1/phi" ? "PHI" : round(p*12) }

// Inverse of penc: decode pat (eg "1") and return real number (eg 1/12)
function pdec(s) { 
  if (s === 'phi' || s === 'PHI') { return 0.6180339887498948 }
  return parseInt(s)/12
}

function rawnamify(n, h, c, p) { return `n${n}h${h}c${c}p${penc(p)}` }

// Take a rawname like "n3h0c0p6" and return the list of params, [3, 0, 0, 1/2]
function parseraw(s) {
  const m = s.match(/^n(\d+)h(\d+)c(\d+)p(\w+)$/)
  if (m===null) return [2, 0, 0, 1/2]
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), pdec(m[4])]
}

// Pick a random set of parameters and return the rawname
function randraw() {
  // not sure if it makes sense to have cac>0 if hub is 1 but the what the heck
  let n = randrange(3, 12)
  let h = n === 3 ? 0 : randrange(0,1)
  let c = randrange(0, n-2)
  let p = randrange(1, 11)/12
  return rawnamify(n, h, c, p)
}

noa = parseInt(getQueryParam('noa', 3)) // originally randrange(3, 12)
hub = parseInt(getQueryParam('hub', 0)) // was noa==3 ? 0 : randrange(0,1)
cac = parseInt(getQueryParam('cac', 0)) // originally randrage(0, noa-2)
pat = pdec(getQueryParam('pat', 6)) // originally randrange(1, 11)

rage(`?noa=${noa}&hub=${hub}&cac=${cac}&pat=${penc(pat)}`, false)


rawname = rawnamify(noa, hub, cac, pat)

console.log(`${rawname} -- ${noa}, ${hub}, ${cac}, ${pat}`)

let i = 0
nomnom.forEach(x => {
  const [n, h, c, p] = x[1]
  titlehash[rawnamify(n, h, c, p)] = x[0]
  counthash[rawnamify(n, h, c, p)] = i++
})

// -----------------------------------------------------------------------------
// Displaying things on the screen besides the actual fractals
// -----------------------------------------------------------------------------

function instructions() {
  stroke('Black'); fill('White')
  textSize(15)
  const thecopy = `The Chaos Game! by Daniel Reeves and Cantor Soule-Reeves

Screen: ${width} pixels wide by ${height} pixels high
Params: ${noa} attractors, ` +
`${hub===1 ? "w/" : "w/o"} a hub, ` +
`excluding ${cac}, partial teleport ${fracify(pat)}
Press...
  SPACE to toggle hyperspeed   ⟶
  CLICK for new fractal
  G to regenerate colors (or 1/2/3/etc for other color funcs)`
/*
  N to refresh everything but number of attractors
  H to refresh everything but whether there's a hub
  P to refresh everything but the partial teleport
*/
  text(thecopy, 5, 15)
  const baretitle = rawnamify(noa, hub, cac, pat)
  let title = titlehash[baretitle]
  if (title === undefined) title = baretitle
  fill(1, 0, .3); textSize(width <  500 ?  37 :
                           width <  640 ?  65 :
                           width <  800 ?  68 :
                           width < 1000 ?  70 :
                           width < 2000 ? 100 : 
                           width < 3000 ? 150 : 300)
  push()
  textAlign(LEFT, TOP)
  text(`“${title}”`, 5, 160, width-10, height-160)
  pop()
}

function rainbar() {
  noStroke()
  for (let i = 0; i <= 422; i++) {            // rainbow bar from x=5 to x=422+5
    fill(blink(i/422), 1, 1)
    rect(5+i, 20, 1, 17)
  }
}

function rocket() {
  const x = 250
  const yb = 79 // y-value of the box to blank out the old text
  const yt = yb+44 // y-value of the text
  const w = 130
  const h =  50
  noStroke()
  fill('Black')
  rect(x, yb, w, h)
  fill('White')
  textSize(50)
  if (state===1) {
    text("🖌️∴🐢", x, yt)
  } else if (state===2) {
    text("🙈∴🚀", x, yt)
  } else {
    text("⌛∴🥱", x, yt)  // not currently used
  }
}

// -----------------------------------------------------------------------------
// The Math
// -----------------------------------------------------------------------------

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

// Generate a list of points, usually spread out on a big circle
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
  if (state === 2) return
  stroke(tallyhue(t, maxp), 1, 1)
  point(x, y)
}

// -----------------------------------------------------------------------------
// Redrawing the screen
// -----------------------------------------------------------------------------

// Re-compute the colors for all points based on their tallies
function regen() {
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
  let sum = 0
  Object.keys(tah).forEach(i => {
    sum += (calg===2 ? 1 : 
            calg===3 ? log(tah[i]) : 
            calg===4 ? sqrt(tah[i]) :
            calg===5 ? tah[i] :
            calg===6 ? tah[i]**1.5 :
            calg===7 ? tah[i]**2 :
            calg===8 ? tah[i]**3 : 
                       1)
    tah[i] = sum
  })
  const a = tah[minp]
  Object.keys(tah).forEach(i => { tah[i] = (tah[i]-a)/(sum-a) })
  // now tah[minp] is 0 and tah[maxp] is 1
  rx = minx
}

// Refresh the counters at the bottom of the screen
function infoup() {
  textSize(30)
  const maxw = textWidth(maxline)+3
  const totw = textWidth(totline)+3
  textSize(15)
  const ppsw = textWidth(ppsline)+3
  textSize(30); noStroke(); fill('Black')
  
  rect(0, height-infoh*2-3, maxw, infoh+2)
  rect(0, height-infoh,     totw, infoh+2)
  rect(totw, height-infoh+11,  ppsw, infoh+2)
  maxline = `max  ${commafy(maxp)}`
  totline = `total: ${commafy(tot)}`
  ppsline = `   (+${commafy(round(pps))}pps)`
  stroke('Black'); fill('White')
  text(maxline, 3, height - infoh - 3*2)
  text(totline, 3, height-3)
  textSize(15); fill(1, 0, .3)
  text(ppsline, totw, height-3)
  textSize(30)
  stroke('Black')
  if (calg===0) { fill(1, 0, .3) } else { fill(tallyhue(calg-1, 8-1), 1, 1) }
  text(':', 60, height - infoh - 3*2)
}

function restart() {
  //console.log(`${rawname} -> ${counthash[rawname]}`)
  const tmp = counthash[rawname]
  let n, h, c, p
  if (tmp === undefined || tmp+1 >= nomnom.length) {
    let r
    // Warning: this will be an infinite loop if every combination of params
    // is in the nomnom list!
    while(counthash[r = randraw()] !== undefined) {}
    [n, h, c, p] = parseraw(r)
  } else {
    [n, h, c, p] = nomnom[tmp+1][1]
  }
  
  rage(`/?noa=${n}&hub=${h}&cac=${c}&pat=${penc(p)}`)
  //rage('/')
}

// -----------------------------------------------------------------------------
// Special p5.js functions -----------------------------------------------------
// -----------------------------------------------------------------------------

function draw() {
  const newt = Date.now()
  if (rx <= maxx) {
    const mu = (maxx+minx)/2
    const dx = abs(rx-mu)
    //console.log(`dx=${dx}, step=${abs(1+(dx-mu)/(-mu)*((maxx-minx)/12-1))}`)
    const rxcap = min(rx + round(1+(dx-mu)/(-mu)*((maxx-minx)/12-1)), maxx)
    //console.log(`rx, rxcap, maxx: ${rx}, ${rxcap}, ${maxx}`)
    for (; rx <= rxcap; rx++) {
      let n
      for (let ry = 0; ry < height; ry++) {
        n = grid[rx][ry]
        if (n > 0) {
          if      (calg === 0) { stroke(1, 0, .3) } 
          else if (calg === 1) { stroke(blink((n-minp)/(maxp-minp)), 1, 1) }
          else if (calg <= 8)  { stroke(blink(tah[n]), 1, 1) }
          else                 { stroke(1, 0, .1) }
          point(rx, ry)
        }
      }
    }
    pps = 0
  } else {
    for (let i = 0; i < chunk; i++) chaos()
    if (newt-drawt < 1000) chunk = ceil(chunk*1.11)
    if (newt-drawt > 2000) chunk = ceil(chunk*0.5)
    if (newt-drawt > 3000) chunk = 1
    pps = chunk/(newt-drawt)*1000
  }
  infoup() 
  rocket()
  drawt = newt 
}

function setup() {
  createCanvas(windowWidth, windowHeight) // fill the window
  console.log(`Canvas created. Screen is ${width}x${height} pixels`)
  //frameRate(30) // 60 fps is about the most it can do
  colorMode(HSB, 1)
  clear()
  background('Black')
  noStroke(); fill('BlueViolet')

  att = genattractors(noa)
  att.map(p => { ellipse(p[0], p[1], 16) })

  x = floor(width/2) 
  y = floor(height/2)
  //[x, y] = coort(0, 0) // does this work?
  tot = 0
  rx = width
  minx = width-1
  maxx = 0

  // Initialize the grid (or could use p5's built-in pixelDensity or something)
  for (let i = 0; i < width; i++) {
    let cols = []
    for (let j = 0; j < height; j++) cols[j] = 0
    grid[i] = cols
  }
  
  instructions()
  rainbar() 
}

function keyPressed() {
  console.log(`Key pressed! keyCode=${keyCode}`)
  if (keyCode === 32) { // space
    chunk = 1
    state = state === 1 ? 2 : 
            state === 2 ? 1 : 0
  } else if (keyCode === 72) { // h
    const newnoa = randrange(hub===0 ? 3 : 4, 12)
    const newcac = hub===1 ? 0 : randrange(0, newnoa-2)
    const newpat = penc(pat)
    rage(`/?noa=${newnoa}&hub=${hub}&cac=${newcac}&pat=${newpat}`)
  } else if (keyCode === 82) { // r
    restart()
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
    stroke(blink(1), 1, 1) // debugging
    calg = keyCode-48
    regen()
    stroke(blink(1), 1, 1) // debugging
  }
  return false
}

// DRY alert: same as hitting r above
function mouseClicked() {
  restart()
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

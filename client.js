// list all the symbols we use here so Glitch doesn't complain!
/* globals 
p5, frameRate, colorMode, HSB, noLoop, loop, redraw,
cos, sin, atan2, TAU, sqrt, min, max, shuffle, floor, ceil, round, log, abs,
createCanvas, resizeCanvas, windowWidth, windowHeight, textWidth, 
clear, line, width, height, point, mouseX, mouseY, ellipse, rect, noStroke,
fullscreen, background, stroke, color, fill, text, noFill, keyCode, textSize, 
push, pop, translate, frameCount, rotate, textAlign, LEFT, RIGHT, TOP, BOTTOM, 
createButton, cursor,
clip, range, randrange, midpoint, randelem, randreal, 
mod, argmin, transpose, uniquify, renorm, spinpick, sortby, digs, commafy, 
getQueryParam, rage, blink, tallyhue, lerp2
*/

// -----------------------------------------------------------------------------
// Constants, Parameters, and Global Variables
// -----------------------------------------------------------------------------

const VER = "2025.06.25-g"
const PHI = 1.6180339887498948 // AKA the golden ratio
const LN2 = Math.log(2) // the natural log of 2, .693ish
const SP1 = 0.63455 // special constant for special fractal; .635 looks rightish
const SP2 = 0.55 // just testing

const nomnom = [
// ["artsy title",       [noa, hub, cac, pat], stars],
//["pentaperfection",          [ 6, 1, 0, SP1 ], 0], // testing; see also RAMP
//["davidtest",                [ 6, 0, 0, SP2 ], 0], // testing
["plain ole sierpinski",     [ 3, 0, 0, 1/2 ], 5],
["chinese checkers",         [ 6, 0, 3, 6/12], 5],
["ninja star",               [ 6, 0, 2, 6/12], 3],
["day of the dead",          [ 5, 0, 1, 6/12], 3],
["stained glass window",     [ 6, 0, 0, 6/12], 3],
["snowflake",                [ 6, 0, 3, 4/12], 3],
["snowsquare",               [ 4, 0, 1, 6/12], 3],
["lightning donut",          [12, 0, 6, 6/12], 3],
["pentagon star",            [ 5, 0, 3, 4/12], 3],
["asterisk",                 [ 7, 0, 3, 6/12], 3],
["holy pentagon",            [ 5, 0, 0, 6/12], 3],
["snowflakey flower",        [ 7, 0, 4, 6/12], 3],
["arrows",                   [ 3, 0, 1, 4/12], 3],
["jaggly nonagon",           [ 9, 0, 4, 6/12], 3],
["lego hands",               [ 7, 0, 1, 8/12], 3],
["fluffy well",              [10, 0, 2, 6/12], 3],
["stars of david",           [ 6, 0, 0, 7/12], 3],
["coral",                    [ 8, 0, 0, 8/12], 3],
["footprints",               [10, 0, 0, 8/12], 3],
["sun",                      [ 9, 0, 6, 4/12], 3],
["bubbles",                  [ 9, 0, 0, 8/12], 3],
["pentaflake",               [ 5, 0, 0,PHI-1], 3], 
["flowerpower",              [ 8, 1, 0,  LN2], 3],
["pinwheel squares",         [ 4, 0, 2, 3/12], 3],
["fuzzy triangle",           [ 3, 0, 0, 3/12], 3],
["warm pentagon",            [ 5, 0, 0, 4/12], 3],
["tendrils",                 [ 8, 0, 2, 8/12], 3],
["figure eights",            [ 8, 0, 0, 7/12], 3],
["table saw",                [ 9, 0, 6, 3/12], 3],
["lobster",                  [ 7, 0, 3, 5/12], 3],
["stump",                    [ 5, 0, 2, 3/12], 3],
["pentaspoke",               [ 5, 0, 1, 4/12], 3],
["illuminati",               [ 3, 0, 1, 3/12], 3],
["fire breathing lizards",   [ 9, 0, 3, 6/12], 3],
["gearflake",                [ 8, 0, 2, 7/12], 3],
["ragdolls",                 [12, 0, 3, 8/12], 3],  
["molecule",                 [ 6, 0, 4, 6/12], 2],
["dumbo",                    [11, 0, 2, 8/12], 3], 
["kochflake",                [ 6, 0, 0, 8/12], 3], 
["pentalace",                [ 6, 1, 0, 6/12], 3], 
["snowflower",               [ 7, 1, 0, 8/12], 3],
["wheel",                    [ 9, 1, 0, 8/12], 3], 
["sierpinski dribble",       [ 4, 1, 0, 6/12], 3], 
["red star donut",           [ 7, 0, 0, 6/12], 3], 
["doily",                    [ 8, 1, 0, 7/12], 3], 
["gargoyles",                [10, 0, 5, 6/12], 3], 
["hexabubbles",              [ 7, 1, 0, 6/12], 3],  
["flircle",                  [10, 1, 0, 8/12], 3], 
["battle turtle",            [ 8, 1, 5, 6/12], 3], 
["quilt square",             [ 4, 0, 1, 5/12], 3], 
["lightning square",         [ 5, 1, 0, 6/12], 3],  
["heart smart",              [ 8, 1, 1, 7/12], 3],
["buff domo",                [ 8, 0, 1, 7/12], 3],
["icey flower",              [11, 0, 8, 5/12], 3],
["spaceship",                [ 5, 1, 3, 3/12], 3],
["nona-gone crazy",          [10, 1, 0, 6/12], 3],
["monkeys",                  [ 9, 0, 1, 7/12], 3],
["simon the spaceturtle",    [10, 1, 3, 7/12], 3],
["millennium falcon",        [10, 1, 5, 6/12], 3],
["pentasplosion",            [ 6, 1, 0, 8/12], 3],
["pentaperfection",          [ 6, 1, 0, SP1 ], 0],
["pentapentapenta",          [ 5, 0, 2, 4/12], 3],
["disco square",             [ 5, 1, 0, 5/12], 3],
["scoobydoo van",            [ 8, 0, 2, 5/12], 3],
["3-legged owl-frog",        [12, 1, 9, 5/12], 3],
["infinite gambit",          [ 5, 1, 1, 6/12], 3],
["vornado",                  [ 4, 0, 2, 4/12], 3],
["giraffes round the world", [10, 1, 1, 6/12], 3],
["squarrows",                [ 5, 1, 1, 5/12], 3],
]

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

/* VETO PILE
["lego feet",              [12, 0, 2,  3/4 ], 3 ], // horseshoe skates
["DUD",                    [ 4, 1, 2,  3/4 ], 0 ],
["DUD",                    [ 3, 0, 0, 11/12], 0 ],
["swimming turtle?",       [12, 1, 7, 7/12], 3],
*/

const INFOH = 26        // how many pixels high the info lines at the bottom are

const TOPx = 5          // x-value of the pen/turtle/rocket box
const TOPyb = 78        // y-value of the box to blank out the old text
const TOPyt = TOPyb+44  // y-value of the pen/turtle/rocket text
const TOPw = 145        // pixel width of that box (130 works on desktop)
const TOPh =  54        // pixel height of that box (50 works on desktop)

const RBBx = 5          // rainbow bar aka rainbar
const RBBy = 20
const RBBw = 422
const RBBh = 17

const RAMP = 1.005 // multiplier for ramping up chunk size, traditionally 1.11
const SMOO = 1e-4 // smoothing factor alpha for exp moving avg (1 = no smoothin)

let noa // Number Of Attractors
let hub // whether to put one of the attractors in the center
let cac // CAn't Choose: how many attractors around the last one to exclude
let pat // PArtial Teleport: how far from current pt to attractor to jump
let x, y // coordinates
let grid = [] // keeping track of every pixel we've been at
let chunk = 1 // how many points to plot at once (more = faster, up to a point)
let chunkt = 0 // how long in seconds to complete a chunk
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
let start = Date.now() // timestamp that we started plotting
let drawt = start // timestamp that we last refreshed the plot
let pps = 0 // points plotted per second
let titlehash = {} // maps the rawname to the artsy title
let counthash = {} // maps the rawname to the index in nomnom
let rawname // name that encodes the parameters like "n3h0c0p6"
let dimg = 1 // exponentially-weighted moving average of image diffs


// -----------------------------------------------------------------------------
// Managing the parameters and the artsy titles
// -----------------------------------------------------------------------------

// Take a real number and return how to display it as a fraction.
// Currently only works if it's some n/12 where n is 0 thru 12.
function fracify(x) {
  if (Math.abs(x- 0/12) < 1e-12) return "0"
  if (Math.abs(x- 1/12) < 1e-12) return "1/12"
  if (Math.abs(x- 2/12) < 1e-12) return "1/6"
  if (Math.abs(x- 3/12) < 1e-12) return "1/4"
  if (Math.abs(x- 4/12) < 1e-12) return "1/3"
  if (Math.abs(x- 5/12) < 1e-12) return "5/12"
  if (Math.abs(x- 6/12) < 1e-12) return "1/2"
  if (Math.abs(x- 7/12) < 1e-12) return "7/12"
  if (Math.abs(x- 8/12) < 1e-12) return "2/3"
  if (Math.abs(x- 9/12) < 1e-12) return "3/4"
  if (Math.abs(x-10/12) < 1e-12) return "5/6"
  if (Math.abs(x-11/12) < 1e-12) return "11/12"
  if (Math.abs(x-12/12) < 1e-12) return "1"
  if (Math.abs(x-1/PHI) < 1e-12) return "1/phi"
  if (Math.abs(x-  LN2) < 1e-12) return "log2"
  if (Math.abs(x- .692) < 1e-12) return ".692"
  if (Math.abs(x-  SP1) < 1e-12) return ".6ish"
  if (Math.abs(x-  SP2) < 1e-12) return ".6ish?"
  return "???"
}

// Takes a partial teleport (eg .5) and returns encoding for the URL (eg "6")
function penc(p) {
  const x = fracify(p)
  return x==="1/phi"  ? "PH1" :
         x==="log2"   ? "LN2" : 
         x===".692"   ? "P69" :
         x===".6ish"  ? "SP1" : 
         x===".6ish?" ? "SP2" : Math.round(p*12) 
}

// Inverse of penc: decode pat (eg "1") and return real number (eg 1/12)
function pdec(s) { 
  if (s === 'ph1' || s === 'PH1') { return 0.6180339887498948 } // PHI-1
  if (s === 'ln2' || s === 'LN2') { return Math.log(2) } // LN2
  if (s === 'p69' || s === 'P69') { return 0.692 } // not used, I don't think
  if (s === 'sp1' || s === 'SP1') { return SP1 }
  if (s === 'sp2' || s === 'SP2') { return SP2 }
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
  // not sure if it makes sense to have cac>0 if hub is 1 but what the heck
  let n = randrange(3, 12)               // noa
  let h = n === 3 ? 0 : randrange(0,1)   // hub
  let c = randrange(0, n-2)              // cac
  let p = randrange(3, 10)/12             // pat
  return rawnamify(n, h, c, p)
}


noa = parseInt(getQueryParam('noa',      nomnom[0][1][0]))
hub = parseInt(getQueryParam('hub',      nomnom[0][1][1]))
cac = parseInt(getQueryParam('cac',      nomnom[0][1][2]))
pat = pdec(    getQueryParam('pat', penc(nomnom[0][1][3])))

rage(`/chaosgame?noa=${noa}&hub=${hub}&cac=${cac}&pat=${penc(pat)}`, false)


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
  const thecopy = `The Chaos Game! by Daniel Reeves and Cantor Soule-Reeves

Drawing with math   ${" ".repeat(35)}   (${width}x${height} pixels)
${noa} attractors, ` +
`${hub===1 ? "w/" : "w/o"} a hub, ` +
`excluding ${cac}, partial teleport ${fracify(pat)}`
  stroke('Black'); fill('White'); textSize(15); text(thecopy, 5, 15)
  fill(1, 0, .3); textSize(9); text(VER, width-60, 10)
  const baretitle = rawnamify(noa, hub, cac, pat)
  let title = titlehash[baretitle]
  if (title === undefined) title = `untitled ${baretitle}`
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
  for (let i = 0; i <= RBBw; i++) {           // rainbow bar from x=5 to x=422+5
    fill(blink(i/RBBw), 1, 1)
    rect(RBBx+i, RBBy, 1, RBBh)
  }
}

// Display whether we're hyperspeed or turtlespeed
function rocketurt() {
  noStroke()
  fill('Black')
  rect(TOPx, TOPyb, TOPw, TOPh)
  fill('White')
  textSize(48)
  if      (state===1) { text("🖌️∴🐢", TOPx, TOPyt) } 
  else if (state===2) { text("🖌️∴🚀", TOPx, TOPyt)
                        text("🚫",    TOPx, TOPyt) } // draw it on top of the 🖌️
  else                { text("⌛∴🥱", TOPx, TOPyt) } // not currently used
}

function pgraph() {
  const now = Date.now() - start
  const rollt = 60 // number of seconds till roll back to left of screen
  fill(1, 0, .06); // last arg of .3 makes it the same gray as the title

  // plot dimg vs time
  ellipse(lerp2(now % (rollt*1000), 0,rollt*1000, 0,width),
          lerp2(dimg, 0,1, height-60*0,247*0+height/2),
          3,3) // radius of the circles aka thickness of the line
  
  // plot points per second vs time
  //ellipse(lerp2(now % (rollt*1000), 0,rollt*1000, 0,width),
  //        lerp2(pps, 0,14e6, height-60,0),
  //        3,3) // radius of the circles aka thickness of the line
  
  // plot points per second vs chunk size
  //ellipse(lerp2(chunk, 0,(state==1 ? 150000 : 2e6), 0,width),
  //        lerp2(pps,   0,(state==1 ? 1.2e6 : 14e6), height-60,0),
  //        3,3) // radius of the circles aka thickness of the line


  // plot seconds per chunk vs time
  //ellipse(lerp2(now % (rollt*1000), 0,rollt*1000, 0,width),
  //        lerp2(chunkt, 0,1000, height-60,0),
  //        1,1) // radius of the circles aka thickness of the line

  // plot chunk size vs time
  //ellipse(lerp2(now % (rollt*1000), 0,rollt*1000, 0,width),
  //        lerp2(chunk, 0,2e6, height-60,0),
  //        6,6) // radius of the circles aka thickness of the line
}

// Show number with reasonable number of decimal places
function shn(x) {
  const m = x >= 100 ? 1 : x >= 10 ? 10 : 100
  return commafy(Math.round(x*m)/m)
}

// Refresh the counters at the bottom of the screen
function infoup() {
  textSize(30)
  const maxw = textWidth(maxline)+3
  const totw = textWidth(totline)+3
  textSize(15)
  const ppsw = textWidth(ppsline)+3
  textSize(30); noStroke(); fill('Black')
  
  rect(0, height-INFOH*2-3, maxw, INFOH+2)
  rect(0, height-INFOH,     totw, INFOH+2)
  rect(totw, height-INFOH+11,  ppsw, INFOH+2)
  maxline = `max  ${commafy(maxp)}`
  totline = `total: ${commafy(tot)}`
  ppsline = `   (${shn(chunk)}p / ${shn(chunkt/1000)}s = ${shn(pps)}pps)`
  stroke('Black'); fill('White')
  text(maxline, 3, height - INFOH - 3*2)
  text(totline, 3, height-3)
  textSize(15); fill(1, 0, .3)
  text(ppsline, totw, height-3)
  textSize(30)
  stroke('Black')
  if (calg===0) { fill(1, 0, .3) } else { fill(tallyhue(calg-1, 8-1), 1, 1) }
  text(':', 60, height - INFOH - 3*2)
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
  const dy = max(0, height - width - (2*INFOH+5))
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
// Lesson learned the hard way: Don't call restart() inside this function.
function chaos() {
  const ch = ceil(cac/2)
  const a = mod(randrange(la+ch, la+ch+noa-1-cac), noa)
  la = a
  const p = midpoint([x,y], att[la], pat).map(floor)
  x = p[0]
  y = p[1]
  tot += 1
  grid[x][y]++
  const t = grid[x][y]
  
  if (t > maxp) maxp = t
  if (x < minx) minx = x
  if (x > maxx) maxx = x
  
  // compute the metric for how much the image is changing with this plotted pt
  const m = lerp2((t+1)/t, 1,2, 0,1)
  //const m = lerp2(log((t+1)/t), 0,LN2, 0,1)
  
  // compute the exponentially-weighted moving average (EMA) of that metric
  //dimg = (1-SMOO)*dimg + SMOO*m      // more intuitive version of EMA
  dimg += SMOO*(m-dimg)                // slightly more efficient version of EMA
    
  if (state === 2) return // don't actually do plotting in hyperspeed mode
  stroke(tallyhue(t, maxp), 1, 1)
  point(x, y)
}

// -----------------------------------------------------------------------------
// Redrawing the screen
// -----------------------------------------------------------------------------

// Re-compute the colors for all points based on their tallies
function regen(level) {
  calg = level
  minp = maxp // like initializing minp to infinity
  let n, i, j
  for (i = 0; i < width; i++) {
    for (j = 0; j < height; j++) {
      n = grid[i][j]
      if (n>0) {  // if this pixel has tally 0 then just ignore it
        if (tah[n]===undefined) { tah[n] = 0 } else { tah[n]++ } 
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
  //const a = tah[minp]
  //Object.keys(tah).forEach(i => { tah[i] = (tah[i]-a)/(sum-a) })
  Object.keys(tah).forEach(i => { tah[i] = lerp2(tah[i], tah[minp],sum, 0,1)})
  // now tah[minp] is 0 and tah[maxp] is 1
  rx = minx
}

// Reload the page with the next or previous fractal
function restart(dir=1) {
  //console.log(`${rawname} -> ${counthash[rawname]}`)
  const num = counthash[rawname] // number in the list of the current fractal
  let n, h, c, p
  if (num === undefined || num+dir >= nomnom.length || num+dir < 0) {
    //let r
    // Warning: this will be an infinite loop if every combination of params
    // is in the nomnom list! Cuz we're just trying random param settings till
    // we find something not already in the list.
    //while(counthash[r = randraw()] !== undefined) {}
    // Ok, it's weird and unexpected if picking random parameters NEVER results
    // in a named fractal. So I guess just pick the random parameters and if
    // they happen to be a named fractal again, so be it.
    [n, h, c, p] = parseraw(randraw())
  } else {
    [n, h, c, p] = nomnom[num+dir][1]
  }
  
  rage(`/chaosgame?noa=${n}&hub=${h}&cac=${c}&pat=${penc(p)}`)
  //rage('/chaosgame') // or originally this was just rage('/') on Glitch
}

// -----------------------------------------------------------------------------
// Special p5.js functions -----------------------------------------------------
// -----------------------------------------------------------------------------

function draw() {
  if      (mouseX > TOPx  && mouseX < TOPx+TOPw && 
           mouseY > TOPyb && mouseY < TOPyb+TOPh)   cursor('pointer')
  else if (mouseX > RBBx  && mouseX < RBBx+RBBw && 
           mouseY > RBBy  && mouseY < RBBy+RBBh)    cursor('pointer')
  else cursor('default')

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
    const bound = Math.trunc(chunk) // do this outside the following loop
    for (let i = 0; i < bound; i++) chaos()
    pps = bound/chunkt*1000
    // Dynamically adjust the chunk size so it takes 150-200ms to plot a chunk
    if (chunkt < 150) chunk *= RAMP
    if (chunkt > 200) chunk = max(1, chunk*0.5)
    // The following is a safety valve in case it starts taking forever to 
    // generate a chunk; we immediately drop the chunk size back to 1.
    // But I think the main way this happens is if you tab away from the browser
    // so maybe that's annoying?
    //if (chunkt > 3000) chunk = 1
  }
  infoup() 
  rocketurt()
  pgraph()
  
  const now = Date.now()
  chunkt = now - drawt
  drawt = now         // remember current timestamp for when we next loop around
}

// This thing courtesy ChatGPT
function styleButton(button) {
  button.style('background-color', '#333'); // Dark gray background
  button.style('color', 'white'); // White text
  button.style('padding', '10px');
  button.style('border', 'none');
  button.style('border-radius', '5px');
  button.style('font-size', '18px');
  button.style('cursor', 'pointer'); // Pointer cursor on hover
  button.style('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.5)'); // Subtle shadow
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

  const tmp = 35
  
  let slowerButton = createButton('🌿')
  slowerButton.position(225-tmp, 84)
  styleButton(slowerButton)
  slowerButton.mousePressed(() => chunk = max(1, chunk / 2))

  let fasterButton = createButton('⚡')
  fasterButton.position(275-tmp, 84)
  styleButton(fasterButton)
  fasterButton.mousePressed(() => chunk *= 2)

  let backButton = createButton('◀️') // originally ↩️
  backButton.position(370-40, 84)
  styleButton(backButton)
  backButton.mousePressed(() => restart(-1))

  let fwdButton = createButton('▶️')
  fwdButton.position(420-40, 84)
  styleButton(fwdButton)
  fwdButton.mousePressed(() => restart(+1))
}

function toggleHyper() {
  chunk = 1 // this might be an annoying slowdown unless RAMP is high enough
  state = state === 1 ? 2 : 
          state === 2 ? 1 : 0  
}

function keyPressed() {
  console.log(`Key pressed! keyCode=${keyCode}`)
  if (keyCode === 191) { // ? or /
    alert(`
• Click the 🖌️∴🐢/🚀 to toggle hyperspeed where the screen doesn't refresh
• Click the rainbow (or press 1-9) to force-regenerate when in hyperspeed
• Click the 🌿/⚡ to change speed (not too much or you'll hang the browser)
• Click ◀️/▶️ for prev/next fractal (or press R or click anywhere for next)
• Or use the arrows or angle brackets or J/L or +/- for finer-grained speed control
• (N to change everything but number of attractors)
• (H to change everything but whether there's a hub)
• (P to change everything but the partial teleport)
`)
  } else if (keyCode === 32) { // space
    toggleHyper()
  } else if (keyCode === 82) { // r
    restart()
  } else if (keyCode == 78) { // n: randomize cac and pat
    const newcac = randrange(0, noa-2)
    const newpat = randrange(1,11)
    rage(`/chaosgame?noa=${noa}&hub=${hub}&cac=${newcac}&pat=${newpat}`)
  } else if (keyCode === 67) { // c
  } else if (keyCode === 71) { // g
    regen(1)
  } else if (keyCode >= 48 && keyCode <= 57) { // 0-9
    //stroke(blink(1), 1, 1) // debugging
    regen(keyCode-48)
    //stroke(blink(1), 1, 1) // debugging
  } else if (keyCode === 72) { // h: randomize all but hub?
    const newnoa = randrange(hub===0 ? 3 : 4, 12)
    const newcac = hub===1 ? 0 : randrange(0, newnoa-2)
    const newpat = penc(pat)
    rage(`/chaosgame?noa=${newnoa}&hub=${hub}&cac=${newcac}&pat=${newpat}`)
  } else if (keyCode === 80) { // p: randomize all but hub
    const newnoa = randrange(3,12)
    const newcac = randrange(0, newnoa-2)
    const newpat = penc(pat)
    rage(`/chaosgame?noa=${newnoa}&hub=${hub}&cac=${newcac}&pat=${newpat}`)
  } else if (keyCode === 37) { // left arrow (cantor's preference)
    chunk = max(1, chunk - .01)
  } else if (keyCode === 39) { // right arrow
    chunk += .01
  } else if (keyCode === 188) { // left angle bracket < 
    chunk = max(1, chunk / 1.01)
  } else if (keyCode === 190) { // right angle bracket >
    chunk *= 1.01
  } else if (keyCode === 74) { // j
    chunk = max(1, chunk / 1.1)
  } else if (keyCode === 76) { // l
    chunk *= 1.1
  } else if (keyCode === 189 || keyCode === 173) { // minus
    chunk = max(1, chunk / 2)
  } else if (keyCode === 187 || keyCode === 61) { // plus
    chunk *= 2
  }
  return false
}

function mouseClicked() {
  if (document.elementFromPoint(mouseX, mouseY).tagName === 'BUTTON')
    return // do nothing if a button was clicked; those're dealt with separately
  
  if        (mouseX > TOPx  && mouseX < TOPx+TOPw && 
             mouseY > TOPyb && mouseY < TOPyb+TOPh) { 
    toggleHyper() 
  } else if (mouseX > RBBx  && mouseX < RBBx+RBBw && 
             mouseY > RBBx  && mouseY < RBBy+RBBh) {
    regen(floor(lerp2(mouseX, RBBx, RBBx+RBBw, 1, 9)))
  } else {
    restart(+1)
  }  
}

// Every so often we decide whether to just move on to the next fractal.
// This is silly but I wanted to get it on autopilot for the whisperframe.
const AUTOFRESH = 3600*1000
setInterval(maybeRestart, 3600*1000) // eg to check every hour: 3600*1000ms
function maybeRestart() {
  //if (dimg <= 1e-6) restart(+1)  // when the image is stable enough?
  if (Date.now() > start + AUTOFRESH) restart(+1) // if it's been however long
}


// -----------------------------------------------------------------------------
// Bad ideas go below
// -----------------------------------------------------------------------------

// if (counthash[rawname] === 0) restart(+1) // only go forward at first
// else restart(mouseX<width/2 ? -1 : 1) // click left half of screen to go back

/*
function checkButtonState(button) {
  if (false) {
    button.style('background-color', '#cccccc'); // Gray color
    button.style('color', '#666666'); // Dark gray text
    button.attribute('disabled', ''); // Disable the button
  } else {
    button.style('background-color', '#4CAF50'); // Active color
    button.style('color', 'white'); // Active text color
    button.removeAttribute('disabled'); // Enable the button
  }
}
*/

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

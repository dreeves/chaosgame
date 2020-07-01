// -----------------------------------------------------------------------------

// Rage = refresh page. Give the part of the URL starting with the first slash.
// If the second parameter is false then it just changes the URL w/o reloading.
function rage(url, reload=true) {
  window.history.pushState({}, null, url)
  if (reload) location.reload()
}

// Return the value for the given key in the querystring, defaulting to def if
// there is no such key.
function getQueryParam(key, def=false) {
  let v = def
  window.location.search.substring(1).split("&").some(function(s) {
    const pair = s.split("=")
    if (pair[0] === key) { v = pair[1]; return true }
    return false
  })
  return v
}

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
  return "???"
}

// Number of digits in a number n
function digs(n) { return ("" + n).length }

// Take a number (as a number or a string) x and add the commas
function commafy(x) {
  x = typeof x == 'string' ? x.trim() : x.toString()  // stringify the input
  if (x.length <= 3) return x
  return commafy(x.substring(0, x.length-3)) + ',' + x.substring(x.length-3)
}

// Blink (blue-to-pink) returns a hue number -- blue if x is 0 up to pink if 1
function blink(x) { return mod(-.83*x+.67, 1) }

// Take the tally for a pixel and the max tally for any pixel, and return its
// hue number (0 to 1).
function tallyhue(n, maxp) { return blink(n/maxp) }

// Make mod work the mathy way for negative numbers
function mod(x, m) { return (x % m + m) % m }

// Apply a function f to a list of arguments l, eg, apl(f, [1,2]) => f(1,2)
function apl(f, l) { return f.apply(null, l) }

// Random integer from 1 to n inclusive
function randint(n) { return Math.floor(Math.random()*n)+1 }

// Random integer from a to b inclusive
function randrange(a, b) { return randint(b-a+1)+a-1 }

// Return a random element of the list l
function randelem(l) {
  return l[Math.floor(Math.random()*l.length)]
}

// Random real number from a to b
function randreal(a, b) {
  return a + (b-a)*Math.random()
}

// Clip x to be between a and b
function clip(x, a, b) { return Math.min(b, (Math.max(a, x))) }

// This seems like a dumb way to make a range function but it might be the best 
// way without resorting to loops
function range(n) {
  return Array(n).fill(0).map((x,i)=>i)
}

// Return the point halfway (or x of the way) betw points a & b in the 2-D plane
function midpoint(a, b, x=0.5) {
  return [((1-x) * a[0] + x * b[0]), 
          ((1-x) * a[1] + x * b[1])]
}
  
// Linearly interpolate to return u when x=a and v when x=b
function lscale(x, a, b, u, v) { return (b*u - a*v + (v-u)*x)/(b-a) }

// Return the element x of l for which f(x) is minimal
function argmin(l, f) {
  var mini = 0
  var minval = f(l[0])
  var val
  for (var i = 1; i < l.length; i++) {
    val = f(l[i])
    if (val < minval) { minval = val; mini = i }
  }
  return l[mini]
}

// Return a new list that sorts the elements, x, of l by f(x)
function sortby(l, f) {
  var newlist = l.map(i=>i)
  return newlist.sort((a,b)=>f(a)>f(b))
}

// Transpose a 2-D array
function transpose(a) {
  return Object.keys(a[0]).map(c => a.map(r => r[c]))
}

// Return a version of array a with duplicates removed
function uniquify(a) { return [...new Set(a)] }

// Renormalize a list of weights to sum to 1
function renorm(w) {
  var tot = w.reduce((a,b)=>a+b)
  return w.map(x=>x/tot)
}

// Return a list of the cumulative sums of l. Eg, [1,2,3] -> [1,3,6]
function accum(l) {
  var s = 0
  return l.map(x => { s += x; return s })
}

// Takes a probability p and list of weights w and returns the index (0-based)
// of the appropriate weight
function spinner(p, w) {
  var cum = accum(renorm(w))
  for (var i = 0; i < w.length; i++) { if (p < cum[i]) return i }
  return 0
}

// Randomly return an element of the list l, weighted by w.
// Eg, spinpick(["a","b","c"], [1,2,1]) returns "a" w/ p=.25, "b" w/ p=.5 etc
function spinpick(l, w) { return l[spinner(Math.random(), w)] }

// -----------------------------------------------------------------------------

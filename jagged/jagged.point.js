function rotate(t, a, n) {
  var e = t[0],
    i = t[1],
    r = a[0],
    d = a[1],
    h = e + (r - e) * Math.cos(n) - (d - i) * Math.sin(n),
    o = i + (r - e) * Math.sin(n) + (d - i) * Math.cos(n);
  return [h, o]
}

function createJaggedPoints(t, a, n, e) {
  var i = !1;
  if (t[0] > a[0]) {
    var r = t;
    t = a, a = r, i = !0
  }
  var d = t[0],
    h = t[1],
    o = a[0],
    s = a[1],
    g = [t],
    u = s - h,
    c = o - d,
    p = -Math.atan(u / c),
    l = Math.sqrt(Math.pow(o - d, 2) + Math.pow(s - h, 2));
  e || (e = .05 * l);
  for (var v = rotate(t, a, p), w = v[0], m = v[1], f = d; f < w - e;) {
    var P = Math.min(f + e + Math.random() * e, w - e),
      M = n * (Math.random() - .5) + h;
    g.push([P, M]), f = P
  }
  g.push([w, m]);
  var k = g.map(function (n, e) {
    return 0 === e ? t : e === g.length - 1 ? a : rotate(t, n, -p)
  });
  return i ? k.reverse() : k
}

/*function transitionLine(t, a) {
  var n = t.node().getTotalLength();
  t.attr("stroke-dasharray", "0,100000").transition().duration(n / (a / 1e3)).ease(d3.easeQuadOut).attrTween("stroke-dasharray", function () {
    var t = this.getTotalLength();
    return d3.interpolateString("0," + t, t + "," + t)
  }).on("end", function () {
    d3.select(this).attr("stroke-dasharray", "none")
  })
}*/

function drawJaggedPath(t, a, n, e, i, r) {
  console.log(t, a, n, e, i, r);
  var d = createJaggedPoints(t, a, n, e);
  console.log(d);
  svg.append("path").datum(d).attr("d", d3.line().curve(r ? d3.curveBasis : d3.curveLinear)).call(function (t) {
    //return transitionLine(t, i)
  })
}

function drawPoints() {
  for (var t = [], a = arguments.length; a--;) t[a] = arguments[a];
  var n = svg.selectAll("circle").data(t);
  n.merge(n.enter().append("circle").attr("r", 3)).attr("cx", function (t) {
    return t[0]
  }).attr("cy", function (t) {
    return t[1]
  }), n.exit().remove()
}

function drawBaseline(t, a) {
  svg.append("path").datum([t, a]).classed("baseline", !0).attr("d", d3.line())
}

function randomPoint() {
  return [Math.round(Math.random() * plotAreaWidth), Math.round(Math.random() * plotAreaHeight)]
}

function update(t, a, n, e, i, r) {
  svg.selectAll("path").remove();
  var d = randomPoint(),
    h = randomPoint();
  i ? drawPoints(d, h) : drawPoints(), r && drawBaseline(d, h), drawJaggedPath(d, h, t, a, n, e)
}

function JaggedLines() {
  this.maxPeakHeight = 80, this.minPeakDistance = 15, this.pathSpeed = 400, this.curved = !1, this.showEndPoints = !0, this.showBaseline = !0, this.makeNewLine = function () {
    update(Math.round(this.maxPeakHeight), Math.round(this.minPeakDistance), this.pathSpeed, this.curved, this.showEndPoints, this.showBaseline)
  }
}
var width = 700,
  height = 500,
  padding = 50,
  plotAreaWidth = width - 2 * padding,
  plotAreaHeight = height - 2 * padding,
  svg = d3.select("#main-svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + padding + " " + padding + ")");
window.onload = function () {
  function t() {
    a.makeNewLine()
  }
  var a = new JaggedLines,
    n = new dat.GUI;
  n.add(a, "maxPeakHeight", 10, 100).onFinishChange(t), n.add(a, "minPeakDistance", 0, 50).onFinishChange(t), n.add(a, "pathSpeed", 100, 1e3).onFinishChange(t), n.add(a, "curved").onFinishChange(t), n.add(a, "showEndPoints").onFinishChange(t), n.add(a, "showBaseline").onFinishChange(t), n.add(a, "makeNewLine"), a.makeNewLine()
};
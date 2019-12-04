//http://bl.ocks.org/codybuell/fc2426aedabef2d69873

var w = screen.width - 90;
var h = screen.height - 130;
var x = (w / 2);
var y = (h / 2);
var delta = 270;
var step = 0.5;
var center_r = 10;
var streamer_r = 4;
var streamers = [];
var cur_orbit = 2 * center_r;
var arc_width = 8;

for (i = 0; i < 25; i++) {
    streamers.push({R: cur_orbit, r: streamer_r, d: delta, s: 1, i: i});
    cur_orbit += center_r;
}

var svg = d3.select('body').insert("svg")
    .attr("width", w)
    .attr("height", h);

svg.append("circle")
    .attr("r", center_r)
    .attr("cx", x)
    .attr("cy", y)
    .attr("id", "sun");

var container = svg.append("g")
    .attr("id", "orbit_container")
    .attr("transform", "translate(" + x + "," + y + ")");

var arc = d3.arc();

container.selectAll("g.planet").data(streamers).enter().append("g")
    .attr("class", "planet_cluster").each(function (d, i) {
    d3.select(this).append("circle").attr("class", "orbit")
        .attr("r", d.R).attr("id", "orbit_" + d.i);
    d3.select(this).append("circle").attr("r", d.r).attr("cx", d.R)
        .attr("cy", 0).attr("class", "planet").attr("id", "planet_" + d.i);

    var a = svg.append("path")
        .datum({
            startAngle: 0,
            endAngle: 0,
            innerRadius: d.R - (arc_width / 2),
            outerRadius: d.R + (arc_width / 2)
        })
        .attr("class", "arc")
        .attr("d", arc)
        .attr("transform", "translate(" + x + "," + y + ")");
    a.transition().duration(20000).attrTween("d", arcTween(2 * Math.PI));
})
    .attr("transform", "rotate(" + delta + ")");

function arcTween(newAngle) {
    return function (d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);
        return function (t) {
            d.endAngle = interpolate(t);
            return arc(d);
        };
    };
}

/*
setInterval(function(){
    svg.selectAll(".planet_cluster")
        .attr("transform", function(d) {
            d.d += step * d.s;
            return "rotate(" + d.d + ")";
        });
}, 40);
*/

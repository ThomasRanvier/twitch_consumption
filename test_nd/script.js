//http://bl.ocks.org/codybuell/fc2426aedabef2d69873

var w = screen.width - 90;
var h = screen.height - 130;
var x = (w / 2);
var y = (h / 2);
var delta = 270;
var step = 0.5;
var center_r = 50;
var streamer_r = 4
var streamers = [];
var cur_orbit = center_r;
var inter_orbit = 0.5
var arc_width = 2.5;
var streamer_n = 100;
var sun_margin = 15;
var testol = Math.PI/16

for (i = 0; i < streamer_n; i++) {
    var width = arc_width*tweaked_sigmoid((streamer_n-i)/streamer_n)
	cur_orbit+= width/2
    streamers.push({R: cur_orbit + sun_margin + i*inter_orbit, w: width, d: delta, s: 1, sa : Math.random()*Math.PI*2, i: i});
    cur_orbit+= width/2
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
    // d3.select(this).append("circle").attr("r", d.r).attr("cx", d.R)
    //     .attr("cy", 0).attr("class", "planet").attr("id", "planet_" + d.i);

    var a = svg.append("path")
        .datum({
            startAngle: d.sa,
            endAngle: d.sa + testol * Math.PI,
            innerRadius: d.R - (d.w / 2) ,
            outerRadius: d.R + (d.w / 2)
        })
        // .attr("class", "arc")
        .attr("d", arc)
        .attr("transform", "translate(" + x + "," + y + ")")
		.style("fill", "#"+String(Math.floor(Math.random()*255).toString(16))+String(Math.floor(Math.random()*255).toString(16))+String(Math.floor(Math.random()*255).toString(16)));
    // a.transition().ease(d3.easeLinear).attrTween("d", arcTween(2*Math.PI));
})
    // .attr("transform", "rotate(" + delta + ")");

function arcTween(newAngle) {
    return function (d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);
        return function (t) {
            d.endAngle = interpolate(t);
            return arc(d);
        };
    };
}


setInterval(function(){
    svg.selectAll(".planet_cluster")
        .attr("transform", function(d) {
            d.d += step * d.s;
            return "rotate(" + d.d + ")";
        });
}, 40);

function tweaked_sigmoid(t) {
    // console.log(t, (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2)
    // return (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2;
    return 1
}
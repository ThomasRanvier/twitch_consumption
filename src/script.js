//http://bl.ocks.org/codybuell/fc2426aedabef2d69873

var w = screen.width - 90;
var h = screen.height - 130;
var x = (w / 2);
var y = (h / 2);
var step = 0.5;
var center_r = 50;
var streamer_r = 4
var arcs = [];
var cur_orbit = center_r;
var inter_orbit = 5
var arc_width = 4;
var streamer_n = 100;
var sun_margin = 5;

var axis_overlength = 30

d3.json('../data/data.json').then(function(raw_data){

    console.log(raw_data)
    var arc_id = 0
    var streamer_id = 0
    for (var streamer in raw_data){
        for(var k in raw_data[streamer]['streams']['data_stamp']){
            // print(raw_data[streamer]['streams'])
            console.log(streamer)
            arcs.push({
                    R: cur_orbit + sun_margin + streamer_id*inter_orbit,
                    w: arc_width,
                    s: 1, 
                    start_angle : raw_data[streamer]['streams']['data_stamp'][k]['angle_start'],
                    end_angle : raw_data[streamer]['streams']['data_stamp'][k]['angle_end'],
                    color : raw_data[streamer]['infos']['color'],
                    image : raw_data[streamer]['infos']['pp'],
                    i: arc_id,
                    si: streamer_id
                });
            arc_id++
        }
        streamer_id++

    }



    var svg = d3.select('body').insert("svg")
        .attr("width", w)
        .attr("height", h);


    var y_offset = center_r + sun_margin/2
    var axis_length = (y_offset + streamer_id*inter_orbit) + axis_overlength

    //AXIS
    for(var i=0; i<20; i++){
    var lines = svg.append("line")
        .attr("x1", x)
        .attr("y1", y - y_offset)
        .attr("x2", x)
        .attr("y2", y - axis_length)
        .attr("class", "axis")
        .attr("transform", "rotate("+i*18.6+","+x+","+y+")");
    }

    var container = svg.append("g")
        .attr("id", "orbit_container")
        .attr("transform", "translate(" + x + "," + y + ")");

    var arc = d3.arc();
    streamer_id = 0

    container.selectAll("g.planet").data(arcs).enter().append("g")
        .attr("class", "planet_cluster").each(function (d, i) {
            //corriger ici, il crée une orbit pour chaque arc alors qu'il faut pour chaque streamer
            if(streamer_id <= d.si){
                d3.select(this).append("circle").attr("class", "orbit")
                .attr("r", d.R).attr("id", "orbit_" + d.i);
                streamer_id=d.si+1
            }

            var a = svg.append("path")
                .datum({
                    startAngle: d.start_angle,
                    endAngle: d.end_angle,
                    innerRadius: d.R - (d.w / 2) ,
                    outerRadius: d.R + (d.w / 2)
                })
                // .attr("class", "arc")
                .attr("d", arc)
                .attr("transform", "translate(" + x + "," + y + ")")
                .on("mouseenter", function() {
                    console.log(d.img)
                    d3.select("#sun_img")
                    .transition()
                    .attr("xlink:href",  d.image)
                    .duration(50)
                    .ease(d3.easeSinInOut);
                })
    //            .style("fill", d.color);
            // a.transition().ease(d3.easeLinear).attrTween("d", arcTween(2*Math.PI));
        })
        // .attr("transform", "rotate(" + delta + ")");



    //SUN
    var sun = svg.append("circle")
        .attr("r", center_r)
        .attr("cx", x)
        .attr("cy", y)
        .attr("id", "sun")
        .on("mouseenter", function() {
            d3.select("#sun")
            .transition()
            .attr("r", center_r+5)
            .duration(50)
            .ease(d3.easeSinInOut);

            d3.select("#sun_img")
            .transition()
            .attr("x", x - center_r*1.25/2)
            .attr("y", y - center_r*1.25/2)
            .attr("height", center_r*1.25)
            .attr("width", center_r*1.25)
            .duration(50)
            .ease(d3.easeSinInOut);
        })
        .on("mouseout", function() {
            d3.select("#sun")
            .transition()
            .attr("r", center_r)
            .duration(50)
            .ease(d3.easeSinInOut);

            d3.select("#sun_img")
            .transition()
            .attr("x", x - center_r*1.2/2)
            .attr("y", y - center_r*1.2/2)
            .attr("height", center_r*1.2)
            .attr("width", center_r*1.2)
            .duration(50)
            .ease(d3.easeSinInOut);
        });

    
    var images = svg.append("svg:image")
        .attr("xlink:href",  "./img/twitch_logo.png")
        .attr("id", "sun_img")
        .attr("x", x - center_r*1.2/2)
        .attr("y", y - center_r*1.2/2)
        .attr("height", center_r*1.2)
        .attr("width", center_r*1.2)
        .on("mouseenter", function() {
            d3.select("#sun")
            .transition()
            .attr("r", center_r+5)
            .duration(50)
            .ease(d3.easeSinInOut);

            d3.select("#sun_img")
            .transition()
            .attr("x", x - center_r*1.25/2)
            .attr("y", y - center_r*1.25/2)
            .attr("height", center_r*1.25)
            .attr("width", center_r*1.25)
            .duration(50)
            .ease(d3.easeSinInOut);
        })
        .on("mouseout", function() {
            d3.select("#sun")
            .transition()
            .attr("r", center_r)
            .duration(50)
            .ease(d3.easeSinInOut);

            d3.select("#sun_img")
            .transition()
            .attr("x", x - center_r*1.2/2)
            .attr("y", y - center_r*1.2/2)
            .attr("height", center_r*1.2)
            .attr("width", center_r*1.2)
            .duration(50)
            .ease(d3.easeSinInOut);
        });

    function arcTween(newAngle) {
        return function (d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);
            return function (t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        };
    }

})

function tweaked_sigmoid(t) {
    // console.log(t, (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2)
    // return (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2;
    return 1
}

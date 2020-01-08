//LAYOUT /////////////////////////////////////////////////////////////////////////////////////////////////
var w = window.innerWidth
var h = window.innerHeight

var middle_edge_x = w/1.6
var corner_edge_y = h/2.5

var main_chart_x = (w / 3.2);
var main_chart_y = (h / 2);

var step = 0.5;
var sun_r = 80;
var arc_width = 10;
var inter_orbit = 11;
var sun_margin = 8;

var axis_overlength = 30


var svg = d3.select('#chart-area').insert('svg')
            .attr("width", w)
            .attr("height", h);

// function resize() {
//     w = window.innerWidth
//     h = window.innerHeight
//     d3.select('#chart-area svg')
//     .attr('width', w)
//     .attr('height', h);

    
//     var middle_edge_x = w/1.6
//     var corner_edge_y = h/2.5

//     var main_chart_x = (w / 3.2);
//     var main_chart_y = (h / 2);

//     var step = 0.5;
//     var sun_r = 80;
//     var arcs = [];
//     var arc_width = 10;
//     var inter_orbit = 11;
//     var sun_margin = 8;

//     var axis_overlength = 30
    
// }

// window.onresize = resize;


var arcs = [];
d3.json('../data/data.json').then(function(raw_data){

    console.log(raw_data)
    var arc_id = 0
    var streamer_id = 0
    for (var streamer in raw_data){
        for(var k in raw_data[streamer]['streams']['data_stamp']){
            // console.log(streamer)
            arcs.push({
                    R: sun_r + sun_margin + streamer_id*inter_orbit,
                    w: arc_width,
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

    //LAYOUT EDGES ////////////////////////////////////////////////////////////////////////////////////////
    svg.append("line")
        .attr("x1", middle_edge_x)
        .attr("y1", 0)
        .attr("x2", middle_edge_x)
        .attr("y2", h)
        .attr("class", "edge")

    svg.append("line")
        .attr("x1", middle_edge_x)
        .attr("y1", corner_edge_y)
        .attr("x2", w)
        .attr("y2", corner_edge_y)
        .attr("class", "edge")


    //MAIN CHART  ////////////////////////////////////////////////////////////////////////////////////////
    //AXIS ///////////////////////////////////////////////////////////////////////////////////////////////
    var y_offset = sun_r + sun_margin/2
    var axis_length = (y_offset + streamer_id*inter_orbit) + axis_overlength

    for(var i=0; i<20; i++){
    var lines = svg.append("line")
        .attr("x1", main_chart_x)
        .attr("y1", main_chart_y - y_offset)
        .attr("x2", main_chart_x)
        .attr("y2", main_chart_y - axis_length)
        .attr("class", "axis")
        .attr("transform", "rotate("+i*18.6+","+main_chart_x+","+main_chart_y+")");
    }

    //ARCS & ORBITS //////////////////////////////////////////////////////////////////////////////////////
    var container = svg.append("g")
        .attr("id", "orbit_container")
        .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")");

    var arc = d3.arc();
    streamer_id = 0

    container.selectAll("g.arc").data(arcs).enter().append("g")
        .attr("class", "planet_cluster").each(function (d, i) {
            if(streamer_id <= d.si){
                d3.select(this).append("circle").attr("class", "orbit")
                .attr("r", d.R).attr("id", "orbit_" + d.i);
                streamer_id=d.si+1
            }

            var a = svg.append("path")
                .datum({
                    startAngle: d.start_angle,
                    endAngle: d.end_angle,
                    innerRadius: d.R - (d.w / 2),
                    outerRadius: d.R + (d.w / 2)
                })
                .attr("d", arc)
                .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")")
                .on("mouseenter", function() {
                    console.log(d.img)
                    d3.select("#sun_img")
                    .transition()
                    .attr("xlink:href",  d.image)
                    .duration(50)
                    .ease(d3.easeSinInOut);
                })
            //.style("fill", d.color);
            // a.transition().ease(d3.easeLinear).attrTween("d", arcTween(2*Math.PI));
        })
        // .attr("transform", "rotate(" + delta + ")");



    //SUN ////////////////////////////////////////////////////////////////////////////////////////////////
    var sun = svg.append("circle")
        .attr("r", sun_r)
        .attr("cx", main_chart_x)
        .attr("cy", main_chart_y)
        .attr("id", "sun")
        .on("mouseenter", function() {
            d3.select("#sun")
            .transition()
            .attr("r", sun_r+5)
            .duration(50)
            .ease(d3.easeSinInOut);

            d3.select("#sun_img")
            .transition()
            .attr("x", main_chart_x - sun_r*1.25/2)
            .attr("y", main_chart_y - sun_r*1.25/2)
            .attr("height", sun_r*1.25)
            .attr("width", sun_r*1.25)
            .duration(50)
            .ease(d3.easeSinInOut);
        })
        .on("mouseout", function() {
            d3.select("#sun")
            .transition()
            .attr("r", sun_r)
            .duration(50)
            .ease(d3.easeSinInOut);

            d3.select("#sun_img")
            .transition()
            .attr("x", main_chart_x - sun_r*1.2/2)
            .attr("y", main_chart_y - sun_r*1.2/2)
            .attr("height", sun_r*1.2)
            .attr("width", sun_r*1.2)
            .duration(50)
            .ease(d3.easeSinInOut);
        });

    
    var image = svg.append("svg:image")
        .attr("xlink:href",  "./img/twitch_logo.png")
        .attr("id", "sun_img")
        .attr("x", main_chart_x - sun_r*1.2/2)
        .attr("y", main_chart_y - sun_r*1.2/2)
        .attr("height", sun_r*1.2)
        .attr("width", sun_r*1.2)
        .on("mouseenter", function() {
            d3.select("#sun")
            .transition()
            .attr("r", sun_r+5)
            .duration(50)
            .ease(d3.easeSinInOut);

            d3.select("#sun_img")
            .transition()
            .attr("x", main_chart_x - sun_r*1.25/2)
            .attr("y", main_chart_y - sun_r*1.25/2)
            .attr("height", sun_r*1.25)
            .attr("width", sun_r*1.25)
            .duration(50)
            .ease(d3.easeSinInOut);
        })
        .on("mouseout", function() {
            d3.select("#sun")
            .transition()
            .attr("r", sun_r)
            .duration(50)
            .ease(d3.easeSinInOut);

            d3.select("#sun_img")
            .transition()
            .attr("x", main_chart_x - sun_r*1.2/2)
            .attr("y", main_chart_y - sun_r*1.2/2)
            .attr("height", sun_r*1.2)
            .attr("width", sun_r*1.2)
            .duration(50)
            .ease(d3.easeSinInOut);
        });

    // function arcTween(newAngle) {
    //     return function (d) {
    //         var interpolate = d3.interpolate(d.endAngle, newAngle);
    //         return function (t) {
    //             d.endAngle = interpolate(t);
    //             return arc(d);
    //         };
    //     };
    // }

    //STREAMER INFOS ////////////////////////////////////////////////////////////////////////////////////////////////

        //todo

    //TOTAL VIEWS CHART ////////////////////////////////////////////////////////////////////////////////////////////////
    d3.json('../data/total_views.json').then(function(raw_view_data){
        console.log(raw_view_data)
    })

})



// function tweaked_sigmoid(t) {
//     // console.log(t, (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2)
//     // return (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2;
//     return 1
// }

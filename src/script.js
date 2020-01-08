//LAYOUT /////////////////////////////////////////////////////////////////////////////////////////////////
var w = window.innerWidth
var h = window.innerHeight

var middle_edge_x = w/1.6
var corner_edge_y = h/2.5

var main_chart_x = (w / 3.2);
var main_chart_y = (h / 2);

var step = 0.5;
var sun_r = 80;
var arc_width = 9;
var inter_orbit = arc_width+2;
var sun_margin = 10;

var axis_overlength = 5


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

    var min_global = 1575241200 // 1/12/2019 à 23:00:00
    var max_global = 1575846000
    var stamp_step = 86400 //1 day
    var scale = (max_global-min_global)
    var day_flat_angles={}
    var day_list=["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
    var axis_area_colors = []

    for(var i = 0; i<8; i++){
        day_flat_angles[day_list[i]]=(((min_global+stamp_step*i)-min_global)/scale)
    }
    console.log(day_flat_angles)

    var y_offset = sun_r + sun_margin - arc_width/2
    var axis_length = (y_offset + streamer_id*inter_orbit) + axis_overlength
    var label_width = 25
    var label_margin = 4
    for(var i = 0; i<7; i++){
        // console.log(d3.schemePastel1)
        var axis_area = svg.append("path")
            .datum({
                startAngle: day_flat_angles[day_list[i]]*Math.PI*2,
                endAngle: day_flat_angles[day_list[i+1]]*Math.PI*2,
                innerRadius: y_offset,
                outerRadius: axis_length
            })
            .attr("d", d3.arc())
            .attr("id", "axis_area_"+day_list[i])
            .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")")
            .attr("class", "axis-area")
            .style("fill", d3.schemePastel2[i]);
        
        var day_label_arc = svg.append("path")
            .datum({
                startAngle: day_flat_angles[day_list[i]]*Math.PI*2,
                endAngle: day_flat_angles[day_list[i+1]]*Math.PI*2,
                innerRadius: axis_length + label_margin,
                outerRadius: axis_length + label_margin + label_width
            })
            .attr("d", d3.arc())
            .attr("id", "day_label_arc_"+day_list[i])
            .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")")
            .attr("class", "axis-area")
            .style("opacity", 0.5)
            .style("fill", d3.schemePastel2[i])

            .on("mouseenter", function() {
                d3.select(this)
                .transition()
                .duration(50)
                .attr('d', d3.arc()
                    .outerRadius(axis_length + label_margin + label_width + 10)
                )
                .ease(d3.easeSinInOut);
            })

            .on("mouseout", function() {
                d3.select(this)
                .transition()
                .duration(50)
                .attr('d', d3.arc()
                    .outerRadius(axis_length + label_margin + label_width)
                )
                .ease(d3.easeSinInOut);
            })


        var axis_lines = svg.append("line")
            .attr("x1", main_chart_x)
            .attr("y1", main_chart_y - y_offset)
            .attr("x2", main_chart_x)
            .attr("y2", main_chart_y - axis_length - label_margin - label_width - 20)
            .attr("class", "axis")
            .attr("transform", "rotate("+day_flat_angles[day_list[i]]*360+","+main_chart_x+","+main_chart_y+")");
          
        
        // var day_label = svg.append("line")
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
                    innerRadius: d.R-(d.w / 2),
                    outerRadius: d.R+(d.w / 2)
                })
                .attr("d", arc)
                .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")")
                .attr("class", "arc")
                .on("mouseenter", function() {
                    d3.select("#sun_img")
                    .transition()
                    .attr("xlink:href",  d.image)
                    .duration(50)
                    .ease(d3.easeSinInOut);

                    d3.select(this)
                    .transition()
                    .duration(50)
                    .attr('d', d3.arc()
                        .startAngle(d.start_angle-8/d.R)
                        .endAngle(d.end_angle+8/d.R)
                        .innerRadius(d.R-(d.w / 2)-4)
                        .outerRadius(d.R+(d.w / 2)+4)
                    )
                    .ease(d3.easeSinInOut);
                    
                    this.parentElement.appendChild(this)

                })

                .on("mouseout", function() {
                    d3.select("#sun_img")
                    .transition()
                    .attr("xlink:href",  "./img/twitch_logo.png")
                    .duration(50)
                    .ease(d3.easeSinInOut);
                    
                    d3.select(this)
                    .transition()
                    .duration(50)
                    .attr('d', d3.arc()
                        .startAngle(d.start_angle)
                        .endAngle(d.end_angle)
                        .innerRadius(d.R-(d.w / 2))
                        .outerRadius(d.R+(d.w / 2))
                    )
                    .ease(d3.easeSinInOut);

                })
            
                function arcTween(newAngle) {
                    return function (d) {
                        var interpolate = d3.interpolate(d.endAngle, newAngle);
                        return function (t) {
                            d.endAngle = interpolate(t);
                            return arc(d);
                        };
                    };
                }
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

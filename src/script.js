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
d3.json('https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/data.json').then(function(raw_data){
    
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
    d3.csv("https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/total_views.csv").then(function(data){
        // set the dimensions and margins of the graph
        var margin = {top: 60, right: 230, bottom: 50, left: 50},
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        var xstart = middle_edge_x + 50
        
        //////////
        // GENERAL //
        //////////
        
        // List of groups = header of the csv files
        var keys = data.columns.slice(1)
        
        // color palette
        var color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeSet2);
        
        //stack the data?
        var stackedData = d3.stack()
        .keys(keys)
        (data)
        
        
        //////////
        // AXIS //
        //////////
        
        // Add X axis
        var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return new Date(d.time * 1000); }))
        .range([xstart, xstart + width]);
        var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))
        
        // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", xstart + width)
        .attr("y", height+40 )
        .text("Time (time)");
        
        // Add Y axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", xstart)
        .attr("y", -20 )
        .text("Nombre de viewer")
        .attr("text-anchor", "start")
        
        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, 100000])
        .range([ height, 0 ]);
        var yAxis = svg.append("g")
        .attr("transform", "translate(" + (xstart) + ",0)")
        .attr("x", xstart)
        .call(d3.axisLeft(y).ticks(5))
        
        
        
        //////////
        // BRUSHING AND CHART //
        //////////
        
        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", xstart)
        .attr("y", 0);
        
        // Add brushing
        var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
        .extent( [ [xstart,0], [xstart + width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
        
        // Create the scatter variable: where both the circles and the brush take place
        var areaChart = svg.append('g')
        .attr("clip-path", "url(#clip)")
        
        // Area generator
        var area = d3.area()
        .x(function(d) { return x(new Date(d.data.time * 1000)); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
        console.log(stackedData)
        // Show the areas
        areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", function(d) { return "myArea " + d.key })
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)
        
        
        // Add the brushing
        areaChart
        .append("g")
        .attr("class", "brush")
        .call(brush)
        //   .on('mousemove', function(d) {
        //     var mousePos = d3.mouse(this);
        //     tooltip.classed('hidden', false)
        //     .attr('style', 'left:' + (mousePos[0] + 15) +
        //     'px; top:' + (mousePos[1] - 35) + 'px')
        //     console.log(d)
        //   })
        //   .on('mouseout', function() {
        //     tooltip.classed('hidden', true);
        //   });
        
        var idleTimeout
        function idled() { idleTimeout = null; }
        
        // A function that update the chart for given boundaries
        function updateChart() {
            
            extent = d3.event.selection
            
            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if(!extent){
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain(d3.extent(data, function(d) { return new Date(d.time * 1000); }))
            }else{
                x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
                areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }
            
            // Update axis and area position
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
            areaChart
            .selectAll("path")
            .transition().duration(1000)
            .attr("d", area)
        }
        
        
        var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
        
        tooltip.append("mylayers")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);
        
        tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
    })
})



// function tweaked_sigmoid(t) {
//     // console.log(t, (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2)
//     // return (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2;
//     return 1
// }

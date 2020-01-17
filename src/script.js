//LAYOUT /////////////////////////////////////////////////////////////////////////////////////////////////

var origin_x = 0
var origin_y = 60

var w = window.innerWidth
var h = window.innerHeight



console.log(w,h)

var middle_edge_x = w/1.56 + origin_x
var corner_edge_y = h/3 + origin_y
var info_margin = w/200;
var totv_chart_margin = w/50

var main_chart_x = (w / 3.2) + origin_x
var main_chart_y = (h / 2.15) + origin_y

// var step = 0.5;
var sun_r = w/27;
var arc_width = w/210;
var inter_orbit = arc_width*1.2;
var sun_margin = w/230;

var axis_overlength = 0

totv_width = w - middle_edge_x - totv_chart_margin*3
totv_height = corner_edge_y - totv_chart_margin*1.5

var totv_x_offset = totv_width/14
var totv_x = middle_edge_x + totv_chart_margin

var info_img_size = w/11

var info_name_x = middle_edge_x + info_img_size/2 + info_margin + w/17
var info_name_y = corner_edge_y + info_img_size/2 + info_margin*2
var info_tip_x = middle_edge_x + info_margin + w/60
var info_tip_y = corner_edge_y + info_img_size + h/6
var info_stream_tip_x = info_tip_x
var info_stream_tip_y = corner_edge_y + info_margin + info_img_size + w/50



var svg = d3.select('#chart-area').insert('svg')
.attr("width", w)
.attr("height", h);

//MODAL AND TITLE BAR/////////////////////////////////////////////////////////////////////////////////////////////////

var home_icon_width = 40
var home_icon_margin = 10

var c_cat = -1

svg.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", w)
.attr("height", origin_y)
.attr("id", "title_bar")
.attr("class", "twitch-sun")

var info_title = svg.append("text")
.attr("x", home_icon_width + home_icon_margin*2)
.attr("y", origin_y*3/4)
.attr("id", "title")
.attr("class", "title")
.text( function () { return "Consommation Twitch"; })

$("#descrModal").modal()
svg.append("image")
    .attr('x', home_icon_margin)
    .attr('y', home_icon_margin)
    .attr('width', home_icon_width)
    .attr('height', home_icon_width)
    .attr("xlink:href", "https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/src/home.png")
    .on("click", function() {
        $("#descrModal").modal()

    })
//CHECKBOXES  /////////////////////////////////////////////////////////////////////////////////////////////////

var first_box_offset = 10
var box_margin = 12

var box_width = w / 10
var box_height = h / 35
var box_origin_x = origin_x + box_margin //middle_edge_x - box_width - (w / 60)
var text_offset_x = box_width / 20
var text_offset_y = box_height / 1.4
var categories = ['Tous', 'Ponctuel', 'Régulier', 'WebTVs']

var i = 1
categories.forEach(function(cat) {
    var y = origin_y + ((i-1) * box_height) + (((i - 1) * h) / 150) + box_margin
    svg.append('rect')
        .attr("rx", 2)
        .attr("ry", 2)
        .attr('x', box_origin_x + (i==1?0:first_box_offset))
        .attr('y', y)
        .attr('d', i)
        .attr('width', box_width  + (i==1?first_box_offset:0))
        .attr('height', box_height)
        .attr("id", "check-box-" + i)
        .attr("class", (i==1?"check-box-selected":"check-box"))
        .on("click", function() {
            id = d3.select(this).attr("id")
            for (ii = 1; ii <= 4; ii++) {
                if ('check-box-' + ii == id) {
                    d3.select("#check-box-" + ii)
                        .transition()
                        .duration(50)
                        .attr("class", "check-box-selected")
                        .ease(d3.easeSinInOut);
                    d3.select("#check-text-" + ii)
                        .transition()
                        .duration(50)
                        .attr("class", "check-text-selected")
                        .ease(d3.easeSinInOut);
                } else {
                    d3.select("#check-box-" + ii)
                        .transition()
                        .duration(50)
                        .attr("class", "check-box")
                        .ease(d3.easeSinInOut);
                        d3.select("#check-text-" + ii)
                        .transition()
                        .duration(50)
                        .attr("class", "check-text")
                        .ease(d3.easeSinInOut);
                }
            }
            var cat = parseInt(id[id.length - 1]) - 2
            c_cat = cat
            d3.selectAll(".arc").moveToFront()
            if (c_cat != -1) {
              d3.selectAll(".arc")
              .filter(function (d) {
                return d.cat != c_cat;
              })
              .moveToBack()
            }
        })
        .on("mouseenter", function ()  {
            id = d3.select(this).attr('id')
            ii = id.split('-')[2]
            d3.select(this)
                .transition()
                .duration(50)
                .attr('x', box_origin_x - 2 + (ii==1?0:first_box_offset))
                .attr('y', y - 2)
                .attr('width', box_width + 4 + (ii==1?first_box_offset:0))
                .attr('height', box_height + 4)
                .style('stroke-width', '2')
                .ease(d3.easeSinInOut);
        })
        .on("mouseout", function ()  {
            id = d3.select(this).attr('id')
            ii = id.split('-')[2]
            d3.select(this)
                .transition()
                .duration(50)
                .attr('x', box_origin_x + (ii==1?0:first_box_offset))
                .attr('y', y)
                .attr('width', box_width + (ii==1?first_box_offset:0))
                .attr('height', box_height)
                .style('stroke-width', '1')
                .ease(d3.easeSinInOut);
        })
    svg.append('text')
        .attr('x', box_origin_x + text_offset_x + (i==1?0:first_box_offset))
        .attr('y', y + text_offset_y)
        .attr("id", "check-text-" + i)
        .attr('class', (i==1?'check-text-selected':'check-text'))
        .text(cat)
        .on("click", function() {
            id = d3.select(this).attr("id")
            for (ii = 1; ii <= 4; ii++) {
                if ('check-text-' + ii == id) {
                    d3.select("#check-box-" + ii)
                        .transition()
                        .duration(50)
                        .attr("class", "check-box-selected")
                        .ease(d3.easeSinInOut);
                    d3.select("#check-text-" + ii)
                        .transition()
                        .duration(50)
                        .attr("class", "check-text-selected")
                        .ease(d3.easeSinInOut);
                } else {
                    d3.select("#check-box-" + ii)
                        .transition()
                        .duration(50)
                        .attr("class", "check-box")
                        .ease(d3.easeSinInOut);
                    d3.select("#check-text-" + ii)
                        .transition()
                        .duration(50)
                        .attr("class", "check-text")
                        .ease(d3.easeSinInOut);
                }
            }
            var cat = parseInt(id[id.length - 1]) - 2
            c_cat = cat
            d3.selectAll(".arc").moveToFront()
            if (c_cat != -1) {
              d3.selectAll(".arc")
              .filter(function (d) {
                return d.cat != c_cat;
              })
              .moveToBack()
            }
        })
        .on("mouseenter", function ()  {
            id = d3.select(this).attr('id')
            ii = id.split('-')[2]
            d3.select('#check-box-' + ii)
                .transition()
                .duration(50)
                .attr('x', box_origin_x - 2 + (ii==1?0:first_box_offset))
                .attr('y', y - 2)
                .attr('width', box_width + 4 + (ii==1?first_box_offset:0))
                .attr('height', box_height + 4)
                .style('stroke-width', '2')
                .ease(d3.easeSinInOut);
        })
        .on("mouseout", function ()  {
            id = d3.select(this).attr('id')
            ii = id.split('-')[2]
            d3.select('#check-box-' + ii)
                .transition()
                .duration(50)
                .attr('x', box_origin_x - 2 + (ii==1?0:first_box_offset))
                .attr('y', y - 2)
                .attr('width', box_width + (ii==1?first_box_offset:0))
                .attr('height', box_height)
                .style('stroke-width', '1')
                .ease(d3.easeSinInOut);
        })
    i += 1
});


// function resize() {

//     w = window.innerWidth
//     h = window.innerHeight
//     console.log(w,h)
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

var logo = "https://thomasranvier.github.io/twitch_consumption/src/img/twitch_logo.png"
var selected_day = -1
var c_streamer = -1
var arcs = [];
d3.csv("https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/total_views.csv").then(function(data){
d3.json('https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/data.json').then(function(raw_data){
var colors = {};

var arc_id = 0
var streamer_id = 0
for (var streamer in raw_data){
    colors[streamer] = raw_data[streamer]['infos']['color']
    for(var k in raw_data[streamer]['streams']['data_stamp']){
        // console.log(streamer)
        arcs.push({
            R: sun_r + sun_margin + streamer_id*inter_orbit,
            w: arc_width,
            start_angle : raw_data[streamer]['streams']['data_stamp'][k]['angle_start'],
            end_angle : raw_data[streamer]['streams']['data_stamp'][k]['angle_end'],
            image : raw_data[streamer]['infos']['pp'],
            tps : raw_data[streamer]['infos']['total_time'],
            avg_v : raw_data[streamer]['infos']['viewers_avg'],
            max_v : raw_data[streamer]['infos']['viewers_max'],
            nb_streams : raw_data[streamer]['infos']['nb_streams'],
            i: arc_id,
            si: streamer_id,
            s: streamer,
            color : d3.interpolateRainbow(raw_data[streamer]['infos']['color']),
            cat : raw_data[streamer]['infos']['cat']
        });
        arc_id++
    }
    streamer_id++
    
}

//MAIN CHART  ////////////////////////////////////////////////////////////////////////////////////////
//AXIS ///////////////////////////////////////////////////////////////////////////////////////////////

var min_global = 1575241200 // 1/12/2019 à 23:00:00
var max_global = 1575846000
var stamp_step = 86400 //1 day
var scale = (max_global-min_global)
var day_flat_angles={}
var hour_flat_angles={}
var day_list=["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
var hour_list=["00h00", "03h00", "06h00", "09h00", "12h00", "15h00", "18h00", "21h00"]
var axis_area_colors = []

makeCircularTimeline()

function makeCircularTimeline(){

for(var i = 0; i<9; i++){
    hour_flat_angles[hour_list[i]]=Math.PI*2 / 8 * i
}

for(var i = 0; i<8; i++){
    day_flat_angles[day_list[i]]=(((min_global+stamp_step*i)-min_global)/scale)
}

var y_offset = sun_r + sun_margin - arc_width/2
var axis_length = (y_offset + streamer_id*inter_orbit) + axis_overlength
var label_width = 15 + w/200
var label_margin = 2 + w/1000

for(var i = 0; i<7; i++){
    // console.log(d3.schemePastel1)
    var axis_area = svg.append("path")
    .datum({
        startAngle: day_flat_angles[day_list[i]]*Math.PI*2,
        endAngle: day_flat_angles[day_list[i+1]]*Math.PI*2,
        innerRadius: y_offset,
        outerRadius: axis_length,
        id:i
        
    })
    .attr("d", d3.arc())
    .attr("id", "axis_area_"+day_list[i])
    .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")")
    .attr("class", "axis-area")
    .style("fill", d3.schemePastel2[i]);
    
    // console.log( "startAngle: "+day_flat_angles[day_list[i]]*Math.PI*2, "endAngle: "+day_flat_angles[day_list[i+1]]*Math.PI*2)
    
    var day_label_arc = svg.append("path")
    .datum({
        startAngle: day_flat_angles[day_list[i]]*Math.PI*2,
        endAngle: day_flat_angles[day_list[i+1]]*Math.PI*2,
        innerRadius: axis_length + label_margin,
        outerRadius: axis_length + label_margin + label_width,
        id:i
    })
    .attr("d", d3.arc())
    .attr("id", "day_label_arc_"+day_list[i])
    .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")")
    .attr("class", "axis-area")
    .style("opacity", 0.5)
    .style("fill", d3.schemePastel2[i])
    
    .on("mouseenter", function (d)  {
        d3.select("#day_label_arc_"+day_list[d.id])
        .transition()
        .duration(50)
        .attr('d', d3.arc()
        .outerRadius(axis_length + label_margin + label_width*1.6)
        )
        .ease(d3.easeSinInOut);
    })
    
    .on("mouseout", function(d) {
        d3.select("#day_label_arc_"+day_list[d.id])
        .transition()
        .duration(50)
        .attr('d', d3.arc()
        .outerRadius(axis_length + label_margin + label_width)
        )
        .ease(d3.easeSinInOut);
    })

    .on("click", function(d) {
      if(selected_day == -1) {
        selected_day = d.id
        logo = "https://thomasranvier.github.io/twitch_consumption/src/img/back_arrow.png"
        d3.select("#sun_img")
        .attr("xlink:href",  logo)
        d3.selectAll(".arc")
        .filter(function (d) {
          return ((d.endAngle - (selected_day * Math.PI*2 / 7)) * 7 < 0 || (d.startAngle - (selected_day * Math.PI*2 / 7)) * 7 > 2 * Math.PI);
        })
        .remove()
        d3.selectAll(".dayText").remove()
        for (var i in day_list) {
          d3.selectAll("#day_label_arc_"+day_list[i]).remove()
        }
        d3.selectAll(".axis-area").transition().duration(500).style("fill", d3.schemePastel2[selected_day])
        d3.select("#axis_area_" + day_list[selected_day]).style("opacity", 1)
        d3.selectAll(".axis").remove()
        // expect the one that is hovered
        d3.selectAll(".arc")
        .transition()
        .duration(500)
        .attr('d', d3.arc()
        .startAngle(
          function(d) {
            return Math.max(0, (d.startAngle - (selected_day * 2*Math.PI / 7)) * 7)
          }
        )
        .endAngle(
          function(d) {
            return Math.min(2*Math.PI, (d.endAngle - (selected_day * 2*Math.PI / 7)) * 7)
          }
        )
        )
        .ease(d3.easeSinInOut);
        for (var i in day_list) {
          d3.select("#totv_bg_" + i).transition().duration(500).style('fill', d3.schemePastel2[selected_day])
        }
        for (var i=0 ; i<8; i++){
          var day_label_arc = svg.append("path")
          .datum({
              startAngle: hour_flat_angles[hour_list[i]],
              endAngle: hour_flat_angles[hour_list[i+1]],
              innerRadius: axis_length + label_margin,
              outerRadius: axis_length + label_margin + label_width,
              id:i
          })
          .attr("d", d3.arc())
          .attr("id", "day_label_arc_"+hour_list[i])
          .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")")
          .attr("class", "axis-area")
          .style("opacity", 0.5)
          .style("fill", d3.schemePastel2[selected_day])
        }
        for (var i = 0; i< 8; i++)
          var axis_lines = svg.append("line")
          .attr("x1", main_chart_x)
          .attr("y1", main_chart_y - y_offset)
          .attr("x2", main_chart_x)
          .attr("y2", main_chart_y - axis_length - label_margin - label_width - 20)
          .attr("id", hour_list[i])
          .attr("class", "axis")
          .attr("transform", "rotate("+360 / 8 * i +","+main_chart_x+","+main_chart_y+")");
          d3.selectAll(".arc").moveToFront()
          if (c_cat != -1) {
            d3.selectAll(".arc")
            .filter(function (d) {
              return d.cat != c_cat;
            })
            .moveToBack()
          }
          
          svg.append("text")
          .attr("text-anchor", "end")
          .attr("id", "day_title")
          .attr("x", totv_x - 420)
          .attr("y", origin_y + totv_chart_margin + 10)
          .text(day_list[selected_day] + " " + (selected_day+2).toString() + " décembre")
          .attr("text-anchor", "start") 
          .style("fill", d3.schemeSet2[selected_day])
          .style("font-size", "34px")

      
          svg.selectAll(".hourText")
          .data(hour_list)
          .enter().append("text")
          .attr("class", "hourText")
          .attr("x", 10)   //Move the text from the start angle of the arc
          .attr("dy", 18) //Move the text down
          .append("textPath").data(hour_list)
          .attr("xlink:href",function(d,i){return "#day_label_arc_"+d;})
          .text(function(d, i){return d})
          updateChart([totv_x + selected_day * totv_width / 7, totv_x + (selected_day + 1) * totv_width / 7])
        }
      c_streamer = -1
      noHighlight()
    })
    
    
    var axis_lines = svg.append("line")
    .attr("x1", main_chart_x)
    .attr("y1", main_chart_y - y_offset)
    .attr("x2", main_chart_x)
    .attr("y2", main_chart_y - axis_length - label_margin - label_width - 20)
    .attr("class", "axis")
    .attr("transform", "rotate("+day_flat_angles[day_list[i]]*360+","+main_chart_x+","+main_chart_y+")");
  }
    
    // var day_label = svg.append("line")

//Append the day names to each slice
svg.selectAll(".dayText")
.data(day_list)
.enter().append("text")
.attr("class", "dayText")
.attr("x", 10)   //Move the text from the start angle of the arc
.attr("dy", 18) //Move the text down
.append("textPath").data(day_list)
.style("fill",(d,i) => d3.schemeSet2[i])
.attr("xlink:href",function(d,i){return "#day_label_arc_"+d;})
.text(function(d, i){return d+" "+(i+2)+" Décembre"})

.on("mouseenter", function (d,i)  {
    d3.select("#day_label_arc_"+day_list[i])
    .transition()
    .duration(50)
    .attr('d', d3.arc()
    .outerRadius(axis_length + label_margin + label_width*1.6)
    )
    .ease(d3.easeSinInOut);
    
    // console.log(d3.selectAll(".arc"))
})

.on("mouseout", function(d,i) {
    d3.select("#day_label_arc_"+day_list[i])
    .transition()
    .duration(50)
    .attr('d', d3.arc()
    .outerRadius(axis_length + label_margin + label_width)
    )
    .ease(d3.easeSinInOut);
})
.on("click", function(d) {
  if(selected_day == -1) {
    selected_day = day_list.indexOf(d)
    logo = "https://thomasranvier.github.io/twitch_consumption/src/img/back_arrow.png"
    d3.select("#sun_img")
    .attr("xlink:href",  logo)
    d3.selectAll(".arc")
    .filter(function (d) {
      return ((d.endAngle - (selected_day * Math.PI*2 / 7)) * 7 < 0 || (d.startAngle - (selected_day * Math.PI*2 / 7)) * 7 > 2 * Math.PI);
    })
    .remove()
    d3.selectAll(".dayText").remove()
    for (var i in day_list) {
      d3.selectAll("#day_label_arc_"+day_list[i]).remove()
    }
    d3.selectAll(".axis-area").transition().duration(500).style("fill", d3.schemePastel2[selected_day])
    d3.select("#axis_area_" + day_list[selected_day]).style("opacity", 1)
    d3.selectAll(".axis").remove()
    
    d3.selectAll(".arc")
    .transition()
    .duration(500)
    .attr('d', d3.arc()
    .startAngle(
      function(d) {
        return Math.max(0, (d.startAngle - (selected_day * 2*Math.PI / 7)) * 7)
      }
    )
    .endAngle(
      function(d) {
        return Math.min(2*Math.PI, (d.endAngle - (selected_day * 2*Math.PI / 7)) * 7)
      }
    )
    )
    .ease(d3.easeSinInOut);
    for (var i in day_list) {
      d3.select("#totv_bg_" + i).transition().duration(500).style('fill', d3.schemePastel2[selected_day])
    }
    for (var i=0 ; i<8; i++){
      var day_label_arc = svg.append("path")
      .datum({
          startAngle: hour_flat_angles[hour_list[i]],
          endAngle: hour_flat_angles[hour_list[i+1]],
          innerRadius: axis_length + label_margin,
          outerRadius: axis_length + label_margin + label_width,
          id:i
      })
      .attr("d", d3.arc())
      .attr("id", "day_label_arc_"+hour_list[i])
      .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")")
      .attr("class", "axis-area")
      .style("opacity", 0.5)
      .style("fill", d3.schemePastel2[selected_day])
  }
  
    for (var i = 0; i< 8; i++)
    var axis_lines = svg.append("line")
    .attr("x1", main_chart_x)
    .attr("y1", main_chart_y - y_offset)
    .attr("x2", main_chart_x)
    .attr("y2", main_chart_y - axis_length - label_margin - label_width - 20)
    .attr("id", hour_list[i])
    .attr("class", "axis")
    .attr("transform", "rotate("+360 / 8 * i +","+main_chart_x+","+main_chart_y+")");
    d3.selectAll(".arc").moveToFront()
    if (c_cat != -1) {
      d3.selectAll(".arc")
      .filter(function (d) {
        return d.cat != c_cat;
      })
      .moveToBack()
    }
          
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("id", "day_title")
    .attr("x", totv_x - 420)
    .attr("y", origin_y + totv_chart_margin + 10)
    .text(day_list[selected_day] + " " + (selected_day+2).toString() + " décembre")
    .attr("text-anchor", "start") 
    .style("fill", d3.schemeSet2[selected_day])
    .style("font-size", "34px")

    svg.selectAll(".hourText")
    .data(hour_list)
    .enter().append("text")
    .attr("class", "hourText")
    .attr("x", 10)   //Move the text from the start angle of the arc
    .attr("dy", 18) //Move the text down
    .append("textPath").data(hour_list)
    .attr("xlink:href",function(d,i){return "#day_label_arc_"+d;})
    .text(function(d, i){return d})
    updateChart([totv_x + selected_day * totv_width / 7, totv_x + (selected_day + 1) * totv_width / 7])
  }
  c_streamer = -1
  noHighlight()
})

d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {  
  return this.each(function() { 
      var firstChild = this.parentNode.firstChild; 
      if (firstChild) { 
          this.parentNode.insertBefore(this, firstChild); 
      } 
  });
};
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
    var cropped_start_angle = Math.min(Math.PI*2, Math.max(0, d.start_angle))
    var cropped_end_angle = Math.min(Math.PI*2, Math.max(0, d.end_angle))
    
    // console.log( d3.interpolateRainbow(Math.Random))
    var a = svg.append("path")
    .datum({
        startAngle: cropped_start_angle,
        endAngle: cropped_end_angle,
        innerRadius: d.R-(d.w / 2),
        outerRadius: d.R+(d.w / 2),
        cat: d.cat
    })
    .attr("d", arc)
    .attr("transform", "translate(" + main_chart_x + "," + main_chart_y + ")")
    .attr("class", "arc "+ d.s)
    .style("fill", d.color)
    
    .on("mouseenter", function() {
        d3.select("#sun_img")
        .transition()
        .attr("xlink:href",  d.image)
        .duration(50)
        .ease(d3.easeSinInOut);
        if (selected_day == -1){
          d3.select(this)
          .transition()
          .duration(50)
          .attr('d', d3.arc()
          .startAngle(cropped_start_angle-8/d.R)
          .endAngle(cropped_end_angle+8/d.R)
          .innerRadius(d.R-(d.w / 2)-4)
          .outerRadius(d.R+(d.w / 2)+4)
          )
          .ease(d3.easeSinInOut);
        }
        else {
          d3.select(this)
          .transition()
          .duration(50)
          .attr('d', d3.arc()
          .startAngle(Math.max(0, (cropped_start_angle - (selected_day * 2*Math.PI / 7)) * 7)-8/d.R)
          .endAngle(Math.min(2* Math.PI, (cropped_end_angle - (selected_day * 2*Math.PI / 7)) * 7)+8/d.R)
          .innerRadius(d.R-(d.w / 2)-4)
          .outerRadius(d.R+(d.w / 2)+4)
          )
          .ease(d3.easeSinInOut);
        }
        
        this.parentElement.appendChild(this)
        
        highlight(d.s)
    })
    
    .on("mouseout", function() {
        d3.select("#sun_img")
        .transition()
        .attr("xlink:href",  logo)
        .duration(50)
        .ease(d3.easeSinInOut);
        
        if (selected_day == -1){
          d3.select(this)
          .transition()
          .duration(50)
          .attr('d', d3.arc()
          .startAngle(cropped_start_angle)
          .endAngle(cropped_end_angle)
          .innerRadius(d.R-(d.w / 2))
          .outerRadius(d.R+(d.w / 2))
          )
          .ease(d3.easeSinInOut);
        } 
        else {
          d3.select(this)
          .transition()
          .duration(50)
          .attr('d', d3.arc()
          .startAngle(Math.max(0, (cropped_start_angle - (selected_day * 2*Math.PI / 7)) * 7))
          .endAngle(Math.min(2* Math.PI, (cropped_end_angle - (selected_day * 2*Math.PI / 7)) * 7))
          .innerRadius(d.R-(d.w / 2))
          .outerRadius(d.R+(d.w / 2))
          )
          .ease(d3.easeSinInOut);
        }
        
        noHighlight(d.s)
        
    })
    .on("mousedown", function() {
      if (selected_day == -1){
        d3.select(this)
        .transition()
        .duration(10)
        .attr('d', d3.arc()
        .startAngle(cropped_start_angle-4/d.R)
        .endAngle(cropped_end_angle+4/d.R)
        .innerRadius(d.R-(d.w / 2)-2)
        .outerRadius(d.R+(d.w / 2)+2)
        )
      }
      else {
        d3.select(this)
        .transition()
        .duration(10)
        .attr('d', d3.arc()
        .startAngle(Math.max(0, (cropped_start_angle - (selected_day * 2*Math.PI / 7)) * 7)-4/d.R)
        .endAngle(Math.min(2* Math.PI, (cropped_end_angle - (selected_day * 2*Math.PI / 7)) * 7)+4/d.R)
        .innerRadius(d.R-(d.w / 2)-2)
        .outerRadius(d.R+(d.w / 2)+2)
        )
      }
    })
    
    .on("mouseup", function() {
      if (selected_day == -1){
        d3.select(this)
        .transition()
        .duration(10)
        .attr('d', d3.arc()
        .startAngle(cropped_start_angle-8/d.R)
        .endAngle(cropped_end_angle+8/d.R)
        .innerRadius(d.R-(d.w / 2)-4)
        .outerRadius(d.R+(d.w / 2)+4)
        )
      }
      else {
        d3.select(this)
        .transition()
        .duration(10)
        .attr('d', d3.arc()
        .startAngle(Math.max(0, (cropped_start_angle - (selected_day * 2*Math.PI / 7)) * 7)-8/d.R)
        .endAngle(Math.min(2* Math.PI, (cropped_end_angle - (selected_day * 2*Math.PI / 7)) * 7)+8/d.R)
        .innerRadius(d.R-(d.w / 2)-4)
        .outerRadius(d.R+(d.w / 2)+4)
        )
      }
    })
    
    .on("click", function() {
        drawBarChart(d.s, info_stream_tip_x + w/50, info_stream_tip_y+(w*4/60), w - (info_stream_tip_x + w/50 + info_margin*10), h -(info_stream_tip_y+(w*4/60) + info_margin*5))
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
.attr("class", "twitch-sun")
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
})

.on("mousedown", function() {
    d3.select("#sun")
    .transition()
    .attr("r", sun_r)
    .duration(10)
    .ease(d3.easeSinInOut);
    
    d3.select("#sun_img")
    .transition()
    .attr("x", main_chart_x - sun_r*1.225/2)
    .attr("y", main_chart_y - sun_r*1.225/2)
    .attr("height", sun_r*1.225)
    .attr("width", sun_r*1.225)
    .duration(10)
    .ease(d3.easeSinInOut);
})

.on("mouseup", function() {
    d3.select("#sun")
    .transition()
    .attr("r", sun_r+5)
    .duration(10)
    .ease(d3.easeSinInOut);
    
    d3.select("#sun_img")
    .transition()
    .attr("x", main_chart_x - sun_r*1.25/2)
    .attr("y", main_chart_y - sun_r*1.25/2)
    .attr("height", sun_r*1.25)
    .attr("width", sun_r*1.25)
    .duration(10)
    .ease(d3.easeSinInOut);
})

.on("click", function() {
  if (selected_day == -1) {
    d3.select("#info_img")
    .transition()
    .attr("xlink:href",  "https://thomasranvier.github.io/twitch_consumption/src/img/twitch_logo.png")
    .duration(200)
    .ease(d3.easeSinInOut);
    
    d3.select("#info_img_circle")
    .transition()
    .duration(200)
    .style("fill", "#6441A4")
    .ease(d3.easeSinInOut);
    
    d3.select("#info_box")
    .transition()
    .duration(200)
    .style("stroke", "#6441A4")
    .style("fill", "#6441A415")
    .ease(d3.easeSinInOut);
    
    d3.select("#info_title")
    .transition()
    .duration(200)
    .text("")
    .style("fill", "#6441A4")
    .ease(d3.easeSinInOut);
    
    d3.select("#info_tps")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);
    
    d3.select("#info_max_v")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);
    
    d3.select("#info_avg_v")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);
    
    d3.select("#info_nb_streams")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);
    
    d3.select("#info_tip")
    .transition()
    .duration(200)
    .text("Cliquez sur l'un des arcs pour avoir des")
    .ease(d3.easeSinInOut);
    
    d3.select("#info_tip_2")
    .transition()
    .duration(200)
    .text("informations sur le streamer concerné")
    .ease(d3.easeSinInOut);

    svg.selectAll(".bar").remove();
    svg.select("a").remove();
  }
  else {
    svg.selectAll(".arc").remove()
    svg.selectAll("#sun_img").remove()
    d3.selectAll("#sun").remove()
    d3.selectAll(".dayText").remove()
    d3.selectAll(".axis-area").remove()
    d3.selectAll("#day_title").remove()
    logo = "https://thomasranvier.github.io/twitch_consumption/src/img/twitch_logo.png"
    makeCircularTimeline();
    if (c_cat != -1) {
      d3.selectAll(".arc")
      .filter(function (d) {
        return d.cat != c_cat;
      })
      .moveToBack()
    }
    updateChart([])
    for (var i in day_list) {
        d3.select("#totv_bg_" + i).transition().duration(500).style('fill', d3.schemePastel2[i])
    }
    selected_day = -1
    logo = "https://thomasranvier.github.io/twitch_consumption/src/img/twitch_logo.png"
    if (c_streamer != -1)
      drawBarChart(c_streamer, middle_edge_x + 70, info_tip_y + 10, w - 100 - (middle_edge_x + 70), h - 100   - (info_tip_y - 30))
  }
  d3.select("#sun_img")
  .attr("xlink:href",  logo)
  d3.select("#sun")
  .attr("xlink:href",  logo)
  if (c_streamer != -1) {
    console.log(c_streamer)
    highlight(c_streamer)
  }
  else {
    noHighlight()
  }
});





var sun_image = svg.append("svg:image")
.attr("xlink:href",  logo)
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
})

.on("mousedown", function() {
    d3.select("#sun")
    .transition()
    .attr("r", sun_r)
    .duration(10)
    .ease(d3.easeSinInOut);
    
    d3.select("#sun_img")
    .transition()
    .attr("x", main_chart_x - sun_r*1.225/2)
    .attr("y", main_chart_y - sun_r*1.225/2)
    .attr("height", sun_r*1.225)
    .attr("width", sun_r*1.225)
    .duration(10)
    .ease(d3.easeSinInOut);
})

.on("mouseup", function() {
    d3.select("#sun")
    .transition()
    .attr("r", sun_r+5)
    .duration(10)
    .ease(d3.easeSinInOut);
    
    d3.select("#sun_img")
    .transition()
    .attr("x", main_chart_x - sun_r*1.25/2)
    .attr("y", main_chart_y - sun_r*1.25/2)
    .attr("height", sun_r*1.25)
    .attr("width", sun_r*1.25)
    .duration(10)
    .ease(d3.easeSinInOut);
})

.on("click", function(d) {
  if (selected_day == -1) {
    d3.select("#info_img")
    .transition()
    .attr("xlink:href",  "https://thomasranvier.github.io/twitch_consumption/src/img/twitch_logo.png")
    .duration(200)
    .ease(d3.easeSinInOut);
    
    d3.select("#info_img_circle")
    .transition()
    .duration(200)
    .style("fill", "#6441A4")
    .ease(d3.easeSinInOut);
    
    d3.select("#info_box")
    .transition()
    .duration(200)
    .style("stroke", "#6441A4")
    .style("fill", "#6441A415")
    .ease(d3.easeSinInOut);
    
    d3.select("#info_title")
    .transition()
    .duration(200)
    .text("")
    .style("fill", "#6441A4")
    .ease(d3.easeSinInOut);
    
    d3.select("#info_tps")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);
    
    d3.select("#info_max_v")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);
    
    d3.select("#info_avg_v")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);
    
    d3.select("#info_nb_streams")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);
    
    d3.select("#info_tip")
    .transition()
    .duration(200)
    .text("Cliquez sur l'un des arcs pour avoir des")
    .ease(d3.easeSinInOut);

    d3.select("#info_tip_2")
    .transition()
    .duration(200)
    .text("informations sur le streamer concerné")
    .ease(d3.easeSinInOut);

    // var info_tip = svg.append("text")
    // .attr("x", info_tip_x + info_img_size)
    // .attr("y", corner_edge_y + info_margin + info_img_size/2 - + (2+w/300))
    // .attr("id", "info_tip")
    // .attr("class", "info-text-h4")
    // .style("font-size",0.2+w/2500+"em")
    // .text("Cliquez sur l'un des arcs pour avoir des")

    // info_tip


  }
  else {
    svg.selectAll(".arc").remove()
    svg.selectAll("#sun_img").remove()
    d3.selectAll("#sun").remove()
    d3.selectAll(".dayText").remove()
    d3.selectAll(".axis-area").remove()
    d3.selectAll("#day_title").remove()
    logo = "https://thomasranvier.github.io/twitch_consumption/src/img/twitch_logo.png"
    makeCircularTimeline();
    if (c_cat != -1) {
      d3.selectAll(".arc")
      .filter(function (d) {
        return d.cat != c_cat;
      })
      .moveToBack()
    }
    updateChart([])
    for (var i in day_list) {
        d3.select("#totv_bg_" + i).transition().duration(500).style('fill', d3.schemePastel2[i])
    }
    selected_day = -1
    logo = "https://thomasranvier.github.io/twitch_consumption/src/img/twitch_logo.png"
    if (c_streamer != -1)
      drawBarChart(c_streamer, middle_edge_x + 70, info_tip_y + 10, w - 100 - (middle_edge_x + 70), h - 100   - (info_tip_y - 30))
  } 
  d3.select("#sun_img")
  .attr("xlink:href",  logo)
  d3.select("#sun")
  .attr("xlink:href",  logo)
  if (c_streamer != -1) {
    highlight(c_streamer)
  }
  else {
    noHighlight()
  }
    svg.selectAll(".bar").remove();
    svg.select("a").remove();
});
}


//STREAMER INFOS ////////////////////////////////////////////////////////////////////////////////////////////////


//LAYOUT EDGES ////////////////////////////////////////////////////////////////////////////////////////
svg.append("rect")
.attr("x", middle_edge_x)
.attr("y", corner_edge_y)
.attr("rx", 8)
.attr("ry", 8)
.attr("width", w-3*info_margin-middle_edge_x)
.attr("height", h-3*info_margin-corner_edge_y)
.attr("id", "info_box")
.attr("class", "info-box")

var info_image_circle = svg.append("rect")
// .attr("r", info_img_size/2)
// .attr("cx", middle_edge_x + info_img_size/2 + info_margin)
// .attr("cy", corner_edge_y + info_img_size/2 + info_margin)



.attr("x", middle_edge_x + info_margin)
.attr("y", corner_edge_y + info_margin)
.attr("rx", 8)
.attr("ry", 8)
.attr("width", info_img_size)
.attr("height", info_img_size)
.attr("id", "info_img_circle")
.attr("class", "twitch-sun")

var info_image = svg.append("svg:image")
.attr("xlink:href",  "https://thomasranvier.github.io/twitch_consumption/src/img/twitch_logo.png")
.attr("id", "info_img")
.attr("x", middle_edge_x + info_margin + info_img_size*0.1)
.attr("y", corner_edge_y + info_margin + info_img_size*0.1)
.attr("height", info_img_size*0.8)
.attr("width", info_img_size*0.8)


var info_title = svg.append("text")
.attr("x", info_name_x)
.attr("y", info_name_y)
.attr("id", "info_title")
.attr("class", "info-text-h1")
.text("")

var info_tip = svg.append("text")
.attr("x", info_tip_x + info_img_size)
.attr("y", corner_edge_y + info_margin + info_img_size/2 - + (2+w/300))
.attr("id", "info_tip")
.attr("class", "info-text-h4")
.style("font-size",0.2+w/2500+"em")
.text("Cliquez sur l'un des arcs pour avoir des")

var info_tip_2 = svg.append("text")
.attr("x", info_tip_x + info_img_size)
.attr("y", corner_edge_y + info_margin + info_img_size/2 + (2+w/300))
.attr("id", "info_tip_2")
.attr("class", "info-text-h4")
.style("font-size",0.2+w/2500+"em")
.text("informations sur le streamer concerné")


var info_tps = svg.append("text")
.attr("x", info_stream_tip_x)
.attr("y", info_stream_tip_y)
.attr("id", "info_tps")
.attr("class", "info-text-h3")
.style("font-size",0.2+w/1800+"em")
.text( function (d) { return ""; })

var info_max_v = svg.append("text")
.attr("x", info_stream_tip_x)
.attr("y", info_stream_tip_y+(w/60))
.attr("id", "info_max_v")
.attr("class", "info-text-h3")
.style("font-size",0.2+w/1800+"em")
.text( function () { return ""; })

var info_avg_v = svg.append("text")
.attr("x", info_stream_tip_x)
.attr("y", info_stream_tip_y+(w*2/60))
.attr("id", "info_avg_v")
.attr("class", "info-text-h3")
.style("font-size",0.2+w/1800+"em")
.text( function () { return ""; })

var info_nb_streams = svg.append("text")
.attr("x", info_stream_tip_x)
.attr("y", info_stream_tip_y+(w*3/60))
.attr("id", "info_nb_streams")
.attr("class", "info-text-h3")
.style("font-size",0.2+w/1800+"em")
.text( function () { return ""; })

// function tweaked_sigmoid(t) {
//     // console.log(t, (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2)
//     // return (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2;
//     return 1
// }


//TOTAL VIEWS CHART ////////////////////////////////////////////////////////////////////////////////////////////////
// set the dimensions and margins of the graph
const div2 = d3.select("body").append("div")
.attr("class", "tooltip")         
.style("opacity", 30)
.style("background",'#FFFFFF');

var totv_width = w - middle_edge_x - totv_chart_margin*2.5
var totv_height = corner_edge_y - totv_chart_margin*1.5

var totv_x_offset = totv_width/14
var totv_x = middle_edge_x + totv_chart_margin


//////////
// GENERAL //
//////////

// List of groups = header of the csv files
var keys = data.columns.slice(1)

// color palette
var color = d3.scaleOrdinal()
.domain(keys)
.range(d3.schemeSet2);

// console.log(keys, i)

var stackedData = d3.stack()
.keys(keys)
(data)


//////////
// AXIS //
//////////


// Add X axis

var x = d3.scaleTime()
.domain(d3.extent(data, function(d) { return new Date(d.time * 1000) }))
.range([totv_x, totv_x + totv_width]);
var xAxis = svg.append("g")
.attr("transform", "translate("+(totv_x_offset-4)+", " + totv_height + ")")
.attr("class", "totv-axis")
.call(d3.axisBottom(x).ticks(5).tickSize(0))
.call(g => g.select(".domain").remove())


// Add X axis label:
// svg.append("text")
// .attr("text-anchor", "end")
// .attr("x", totv_x + totv_width)
// .attr("y", totv_height+40 )
// .text("Date");

// Add Y axis
var y = d3.scaleLinear()
.domain([0, 100000])
.range([ totv_height, origin_y + totv_chart_margin ]);
var yAxis = svg.append("g")
.attr("transform", "translate(" + (totv_x-4) + ",0)")
.attr("x", totv_x)
// .attr("class", "axis")
.call(d3.axisLeft(y).ticks(5))



//////////
// BRUSHING AND CHART //
//////////

// Add a clipPath: everything out of this area won't be drawn.
var clip = svg.append("defs").append("svg:clipPath")
.attr("id", "clip")
.append("svg:rect")
.attr("width", totv_width )
.attr("height", totv_height )
.attr("x", totv_x)
.attr("y", origin_y + totv_chart_margin);

// Add brushing
var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
.extent( [ [totv_x,0], [totv_x + totv_width,totv_height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
.on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

// Create the scatter variable: where both the circles and the brush take place
var areaChart = svg.append('g')
.attr("clip-path", "url(#clip)")


// Area generator
var area = d3.area()
.x(function(d) { return x(new Date(d.data.time * 1000)); })
.y0(function(d) { return y(d[0]); })
.y1(function(d) { return y(d[1]); })
// Show the areas
for(var i=0; i<7; i++){
    areaChart.append("rect")
    .attr("x", totv_x+i*(totv_width/7))
    .attr("y", totv_chart_margin)
    .attr("width", (totv_width/7))
    .attr("height", totv_height-totv_chart_margin)
    .attr("id", "totv_bg_"+i)
    .style("fill", d3.schemePastel2[i])
}

// areaChart
// .append("g")
// .attr("class", "brush")
// .call(brush)

areaChart
.selectAll("mylayers")
.data(stackedData)
.enter()
.append("path")
.attr("class", function(d) { return "myArea " + d.key })
.style("fill", function(d) { 
    return d3.interpolateRainbow(colors[d.key]); 
})
.on('mousemove', function(d) { 
    div2.transition()        
    .duration(200)      
    .style("opacity", .9);
    div2.html(d.key)
    .style("left", (d3.event.pageX + 10) + "px")     
    .style("top", (d3.event.pageY - 50) + "px");
    highlight(d.key)
})
.on("mouseout", function(d) {
    div2.transition()
    .duration(500)
    .style("opacity", 0);
    noHighlight(d.key)
})
.on('click', function(d) {
    drawBarChart(d.key, middle_edge_x + 70, info_tip_y + 10, w - 100 - (middle_edge_x + 70), h - 100   - (info_tip_y - 30))
  
})
.attr("d", area)

// // Add Y axis label:
svg.append("rect")
.attr("x", totv_x)
.attr("width", 210)
.attr("y", origin_y + totv_chart_margin)
.attr("height", 25)
.style("fill", "#000000")
.style("opacity", 0.5)

svg.append("text")
.attr("text-anchor", "end")
.attr("x", totv_x + 5)
.attr("y", origin_y + totv_chart_margin + 20)
.text("Nombre de viewers cumulés")
.attr("text-anchor", "start") 
.style("fill", "#ffffff")

// A function that update the chart for given boundaries

function updateChart(extent) {
    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(extent.length == 0){
        x.domain(d3.extent(data, function(d) { return new Date(d.time * 1000); }))
    }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
    }
    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(10)).attr("transform", "translate(0 " + totv_height.toString() + ")")
    areaChart
    .selectAll("path")
    .transition().duration(1000)
    .attr("d", area)
}

var highlight = function(s){
    // reduce opacity of all groups
    d3.selectAll(".myArea").style("opacity", .1)
    // expect the one that is hovered
    d3.selectAll(".arc").style("opacity" , 0.1)
    d3.selectAll("." + s).style("opacity" , 1)
}

// And when it is not hovered anymore
var noHighlight = function(d){
    d3.selectAll(".myArea").style("opacity", 1)
    if(c_streamer == -1)
      d3.selectAll(".arc").style("opacity" , 1)
    else {
      d3.selectAll(".arc").style("opacity" , 0.3)
      d3.selectAll("." + c_streamer).style("opacity" , 1)
    }
}

const div = d3.select("body").append("div")
.attr("class", "tooltip")         
.style("opacity", 30)
.style("background",'#FFFFFF');

function drawBarChart(streamer, posx, posy, width, height) {

    
    // On demande à D3JS de charger notre fichier
    d3.json("https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/data.json").then(function(data) {
    d3.json("https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/time.json").then(function(dates) {
    let image = data[streamer]['infos']['pp']
    let tps = data[streamer]['infos']['total_time']
    let avg_v = data[streamer]['infos']['viewers_avg']
    let max_v = data[streamer]['infos']['viewers_max']
    let nb_streams = data[streamer]['infos']['nb_streams']
    let color = d3.interpolateRainbow(colors[streamer])
    let sid = streamer

    c_streamer = streamer
    
    d3.select("#info_img")
    .transition()
    .attr("xlink:href",  image)
    .duration(200)
    .ease(d3.easeSinInOut);
    
    d3.select("#info_img_circle")
    .transition()
    .duration(200)
    .style("fill", color)
    .ease(d3.easeSinInOut);
    
    d3.select("#info_box")
    .transition()
    .duration(200)
    .style("stroke", color)
    .style("fill", color.slice(0,3) + "a" + color.slice(3,color.length-1) + ",0.12)")
    .ease(d3.easeSinInOut);
    
    d3.select("#info_title")
    .transition()
    .duration(200)
    .text( function () { return streamer; })
    .style("fill", color)
    .ease(d3.easeSinInOut);
    
    
    d3.select("#info_tip")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);

    d3.select("#info_tip_2")
    .transition()
    .duration(200)
    .text( function () { return ""; })
    .ease(d3.easeSinInOut);
    
    d3.select("#info_tps")
    .transition()
    .duration(200)
    .text( function () { return "Temps de stream sur la semaine : " + tps; })
    .style("fill", color)
    .ease(d3.easeSinInOut);
    
    d3.select("#info_max_v")
    .transition()
    .duration(200)
    .text( function () { return "Nombre maximum de viewers simultanés : " + max_v; })
    .style("fill", color)
    .ease(d3.easeSinInOut);
    
    d3.select("#info_avg_v")
    .transition()
    .duration(200)
    .text( function () { return "Nombre moyen de viewers simultanés : " + Math.round(avg_v); })
    .style("fill", color)
    .ease(d3.easeSinInOut);
    
    d3.select("#info_nb_streams")
    .transition()
    .duration(200)
    .text( function () { return "Nombre de streams lancés cette semaine : " + nb_streams; })
    .style("fill", color)
    .ease(d3.easeSinInOut);
    
    svg.selectAll(".bar").remove();
    svg.select("a").remove();
    
    data = data[sid]['streams']['viewers']
    dates = Object.keys(dates)
    v = []
    var i=0
    for (i = 0 ; i < data.length; i++) {
        v[i] = []
        v[i][0] = dates[i]
        v[i][1] = data[i]
    }
    var nb = data.length / 7
    const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
    const y = d3.scaleLinear()
    .range([height, 0]);
    x.domain(v.map(function(d) { return d[0]; }));
    y.domain([0, d3.max(v, function(d) { return d[1]; })]);
    
    // Ajout de l'axe X au SVG
    // Déplacement de l'axe horizontal et du futur texte (via la fonction translate) au bas du SVG
    // Selection des noeuds text, positionnement puis rotation
    // svg.append("g")
    //     .attr("transform", "translate(0," + 500 + ")")
    //     .call(d3.axisBottom(x).tickSize(0))
    //     .selectAll("text")	
    //         .style("text-anchor", "end")
    //         .attr("dx", "-.8em")
    //         .attr("dy", ".15em")
    //         .attr("transform", "rotate(-65)");
    
    // Ajout de l'axe Y au SVG avec 6 éléments de légende en utilisant la fonction ticks (sinon D3JS en place autant qu'il peut).
    svg.append("a")
    .call(d3.axisLeft(y).ticks(6))
    .attr("transform", "translate(" + posx + "," + posy + ")")
    
    var i = 0
    var j = 0
    // Ajout des bars en utilisant les données de notre fichier data.tsv
    // La largeur de la barre est déterminée par la fonction x
    // La hauteur par la fonction y en tenant compte de la population
    // La gestion des events de la souris pour le popup
    svg.selectAll(".bar")
    .data(v)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d[0]) + posx; })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d[1]) + posy; })
    .attr("height", function(d) { return height - y(d[1]); })
    .style("fill", function(d) { 
        j++; 
        if (j > (i + 1) * nb)
        i++;
        return d3.schemeSet2[i]; })					
        .on("mouseover", function(d) {
            div.transition()        
            .duration(200)      
            .style("opacity", .9);
            div.html("Viewers : " + d[1] + "<br> Heure : " + d[0])
            .style("left", (d3.event.pageX + 10) + "px")     
            .style("top", (d3.event.pageY - 50) + "px")
            .style('pointer-events', 'none');
        })
        .on("mouseout", function(d) {
            div.transition()
            .duration(500)
            .style("opacity", 0);
        });
    });
})
}

})
})

// function tweaked_sigmoid(t) {
//     // console.log(t, (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2)
//     // return (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2;
//     return 1
// }
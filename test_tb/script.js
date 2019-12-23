function dateStrToInt(rep){
    let split = rep.split('_');
    let hr = Number(split[0]);
    console.log(split);
    console.log(hr);
    let min = 60 * hr;
    console.log(min);
    min = min + Number(split[1]);
    console.log(min);
    let sec = 60 * min + Number(split[2]);
    console.log(sec);
    return sec;
}

var timelineData = [{start:3600,end:23*3600,lane:0}];

var timeline = d3.timeline()
  .size([1000,300])
  .padding(5)
  .extent([0,24*60*60])
  .maxBandHeight(20);

d3.json('http://thomasranvier.github.io/twitch_consumption/test_tb/data/data.json').then(data => {
    Object.keys(data).map( (k,i) => {
        let lstSrc = data[k];
        let lst = [];
        lstSrc.map((e,idx) => {
            if(e.start.startsWith('2019_12_01') && e.end.startsWith('2019_12_01')){
                e.streamer = i;
                lst.push(e);
            }
        })
        if(lst.length === 0){
            console.log('rien');
            delete data[k];
        } else {
            data[k] = lst;
        }
    });
    let i = 1;
    Object.keys(data).map(key => {
        data[key].map(stream => {
            let start = dateStrToInt(stream.start.split('-')[1]);
            let end = dateStrToInt(stream.end.split('-')[1]);
            timelineData.push({s: stream.start, e: stream.end, start, end, lane: i++});
        })
    })
  var arc = d3.arc();

  timelineBands = timeline(timelineData);

  angleScale = d3.scaleLinear().domain([0,1000]).range([0,(2 * Math.PI)]);

  timelineBands.forEach(function (d) {
    d.startAngle = angleScale(d.start);
    d.endAngle = angleScale(d.end);
    d.y = d.y + 50;

  });

  console.log(timelineBands);

  d3.select("svg").selectAll("path")
  .data(timelineBands)
  .enter()
  .append("path")
  .attr("transform", "translate(500,250)")
  .style("fill-opacity", 0)
  .attr("d", function (d) {return arc.innerRadius(10).outerRadius(d.dy + 10)(d)})

  var size = timelineBands.length;

  d3.selectAll("path")
  .transition()
  .duration(400)
  .attr("d", function (d) {return arc.innerRadius(d.y).outerRadius(d.y + d.dy)(d)})
  .attr("x", function (d) {return d.start})
  .attr("y", function (d) {return d.y})
  .attr("height", function (d) {return d.dy})
  .attr("width", function (d) {return d.end - d.start})
  .style("fill", "#b0909d")
  .style("fill-opacity", function (d, i) {return Math.max(0.05, 1 - ((size - i) * .01))});

});
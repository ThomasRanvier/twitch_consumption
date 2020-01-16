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
var inter_orbit = 4
var arc_width = 4;
var streamer_n = 100;
var sun_margin = 15

// d3.csv("https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/transformed_data/2019_11_27-10_45_29.csv").then(function(d) {

//         console.log(d);

// })
d3.csv("https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/transformed_data/2019_11_27-10_45_29.csv").then(function(data) {
let total = 0;
for (let i = 1; i < d.columns.length; ++i) total += data.columns[i] = +data.columns[i];
data.total = total;


width = 975
height = width
innerRadius = 180
outerRadius = Math.min(width, height) * 0.67
// .sort((a, b) => b.total - a.total)

var svg = d3.select('body').insert("svg")
.attr("width", w)
.attr("height", h);

svg.append("circle")
.attr("r", center_r)
.attr("cx", x)
.attr("cy", y)
.attr("id", "sun");



// data = d3.csvParse("https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/transformed_data/2019_11_27-10_45_29.csv").then(function(d){
//     let total = 0;
//     for (let i = 1; i < columns.length; ++i) total += d[columns[i]] = +d[columns[i]];
//     d.total = total;
//     return d;
// }).sort((a, b) => b.total - a.total)

arc = d3.arc()
.innerRadius(d => y(d[0]))
.outerRadius(d => y(d[1]))
.startAngle(d => x(d.data.State))
.endAngle(d => x(d.data.State) + x.bandwidth())
.padAngle(0.01)
.padRadius(innerRadius)

x = d3.scaleBand()
.domain(data.map(d => d.State))
.range([0, 2 * Math.PI])
.align(0)

y = function() {
        // This scale maintains area proportionality of radial bars!
        const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)])
        .range([innerRadius * innerRadius, outerRadius * outerRadius]);
        return Object.assign(d => Math.sqrt(y(d)), y);
}

z = d3.scaleOrdinal()
.domain(data.columns.slice(1))
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

xAxis = g => g
.attr("text-anchor", "middle")
.call(g => g.selectAll("g")
.data(data)
.enter().append("g")
.attr("transform", d => `
rotate(${((x(d.State) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
translate(${innerRadius},0)
`)
.call(g => g.append("line")
.attr("x2", -5)
.attr("stroke", "#000"))
.call(g => g.append("text")
.attr("transform", d => (x(d.State) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
? "rotate(90) translate(0,16)"
: "rotate(-90) translate(0,-9)")
.text(d => d.State)))


yAxis = g => g
.attr("text-anchor", "end")
.call(g => g.append("text")
.attr("x", -6)
.attr("y", d => -y(y.ticks(10).pop()))
.attr("dy", "-1em")
.text("Population"))
.call(g => g.selectAll("g")
.data(y.ticks(10).slice(1))
.join("g")
.attr("fill", "none")
.call(g => g.append("circle")
.attr("stroke", "#000")
.attr("stroke-opacity", 0.5)
.attr("r", y))
.call(g => g.append("text")
.attr("x", -6)
.attr("y", d => -y(d))
.attr("dy", "0.35em")
.attr("stroke", "#fff")
.attr("stroke-width", 5)
.text(y.tickFormat(10, "s"))
.clone(true)
.attr("fill", "#000")
.attr("stroke", "none")))


legend = g => g.append("g")
.selectAll("g")
.data(data.columns.slice(1).reverse())
.join("g")
.attr("transform", (d, i) => `translate(-40,${(i - (data.columns.length - 1) / 2) * 20})`)
.call(g => g.append("rect")
.attr("width", 18)
.attr("height", 18)
.attr("fill", z))
.call(g => g.append("text")
.attr("x", 24)
.attr("y", 9)
.attr("dy", "0.35em")
.text(d => d))


svg.append("g")
.selectAll("g")
.data(d3.stack().keys(data.columns.slice(1))(data))
.join("g")
.attr("fill", d => z(d.key))
.selectAll("path")
.data(d => d)
.join("path")
.attr("d", arc);

svg.append("g")
.call(xAxis);

svg.append("g")
.call(yAxis);

svg.append("g")
.call(legend);

function tweaked_sigmoid(t) {
        console.log(t, (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2)
        return (1/(1+Math.exp(-4*(2*t-1))))*0.6 +0.2;
}
});
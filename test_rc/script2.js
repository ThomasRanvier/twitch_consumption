    
    width = 975
    height = width
    innerRadius = 180
    outerRadius = Math.min(width, height) * 0.67
    
    

  d3.csv("https://raw.githubusercontent.com/ThomasRanvier/twitch_consumption/master/data/transformed_data/2019_11_27-10_45_29.csv").then(function(data) {
       
    
    const svg = d3.select("body")
    .attr("viewBox", `${-width / 2} ${-height * 0.69} ${width} ${height}`)
    .style("width", "100%")
    .style("height", "auto")
    .style("font", "10px sans-serif");
    
    console.log(data.map(d => d.name))
      
    
    
    arc = d3.arc()
    .innerRadius(d => y(d[0]))
    .outerRadius(d => y(d[1]))
    .startAngle(d => x(d.data.name))
    .endAngle(d => x(d.data.name) + x.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)

    x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, 2 * Math.PI])
    .align(0)
    
    
    // This scale maintains area proportionality of radial bars!
    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.viewer_count)])
    .range([innerRadius, outerRadius]);
    
    z = d3.scaleOrdinal()
    .domain(data.columns.slice(1))
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
    
    xAxis = g => g
    .attr("text-anchor", "middle")
    .call(g => g.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", d => `
    rotate(${((x(d.name) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
    translate(${innerRadius},0)
    `)
    .call(g => g.append("line")
    .attr("x2", -5)
    .attr("stroke", "#000"))
    .call(g => g.append("text")
    .attr("transform", d => (x(d.name) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
    ? "rotate(90) translate(0,16)"
    : "rotate(-90) translate(0,-9)")
    .text(d => d.name)))
    
    yAxis = g => g
    .attr("text-anchor", "end")
    .call(g => g.append("text")
    .attr("x", -6)
    .attr("y", d => -y(y.ticks(10).pop()))
    .attr("dy", "-1em")
    .text("Nombre de viewers"))
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
    .data(d3.stack().keys("id")(data))
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

})

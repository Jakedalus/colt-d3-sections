const width = 500;
const height = 500;
const padding = 30;

const yScale = d3
	.scaleLinear()
	.domain(d3.extent(regionData, d => d.subscribersPer100))
	.range([ height - padding, padding ]);

const xScale = d3
	.scaleLinear()
	.domain(d3.extent(regionData, d => d.adultLiteracyRate))
	.range([ padding, width - padding ]);

const radiusScale = d3
	.scaleLinear()
	.domain(d3.extent(regionData, d => d.urbanPopulationRate))
	.range([ 2, 40 ]);

const colorScale = d3
	.scaleLinear()
	.domain(d3.extent(regionData, d => d.extremePovertyRate))
	.range([ 'blue', 'red' ]);

const scatterplot = d3
	.select('svg')
	.attr('width', width)
	.attr('height', height);

scatterplot
	.selectAll('circle')
	.data(regionData)
	.enter()
	.append('circle')
	.attr('cx', d => xScale(d.adultLiteracyRate))
	.attr('cy', d => yScale(d.subscribersPer100))
	.attr('r', d => radiusScale(d.urbanPopulationRate))
	.attr('fill', d => colorScale(d.extremePovertyRate));

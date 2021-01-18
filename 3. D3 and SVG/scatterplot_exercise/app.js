const width = 600;
const height = 600;
const padding = 70;

// only show data that has all variables we're looking at
function mustHaveKeys(obj) {
	var keys = [
		'subscribersPer100',
		'adultLiteracyRate',
		'urbanPopulationRate',
		'extremePovertyRate'
	];

	for (let key of keys) {
		if (obj[key] === null) return false;
	}

	return true;
}

const data = regionData.filter(mustHaveKeys);

console.log('data.length', data.length);
console.log('regionData.length', regionData.length);

const yScale = d3
	.scaleLinear()
	.domain(d3.extent(data, d => d.subscribersPer100))
	.range([ height - padding, padding ]);

const xScale = d3
	.scaleLinear()
	.domain(d3.extent(data, d => d.adultLiteracyRate))
	.range([ padding, width - padding ]);

const yAxis = d3
	.axisLeft(yScale)
	.tickSize(-width + 2 * padding)
	.tickSizeOuter(0);

const xAxis = d3
	.axisBottom(xScale)
	.tickSize(-width + 2 * padding)
	.tickSizeOuter(0);

const radiusScale = d3
	.scaleLinear()
	.domain(d3.extent(data, d => d.urbanPopulationRate))
	.range([ 2, 40 ]);

const colorScale = d3
	.scaleLinear()
	.domain(d3.extent(data, d => d.extremePovertyRate))
	.range([ 'blue', 'red' ]);

const scatterplot = d3
	.select('svg')
	.attr('width', width)
	.attr('height', height);

scatterplot
	.append('g')
	.attr('transform', `translate(0, ${height - padding})`)
	.call(xAxis);

scatterplot
	.append('g')
	.attr('transform', `translate(${padding}, 0)`)
	.call(yAxis);

scatterplot
	.selectAll('circle')
	.data(data)
	.enter()
	.append('circle')
	.attr('cx', d => xScale(d.adultLiteracyRate))
	.attr('cy', d => yScale(d.subscribersPer100))
	.attr('r', d => radiusScale(d.urbanPopulationRate))
	.attr('fill', d => colorScale(d.extremePovertyRate));

scatterplot
	.append('text')
	.attr('x', width / 2)
	.attr('y', padding / 2)
	.attr('font-size', '1.5em')
	.style('text-anchor', 'middle')
	.text('Cellular Subscriptions vs. Literacy Rate');

scatterplot
	.append('text')
	.attr('x', width / 2)
	.attr('y', height - padding)
	.attr('dy', '1.5em')
	.style('text-anchor', 'middle')
	.text('Literacy Rate, Aged 15 and Up');

scatterplot
	.append('text')
	.attr('transform', 'rotate(-90)')
	.attr('x', -height / 2)
	.attr('y', padding)
	.attr('dy', '-1.1em')
	.style('text-anchor', 'middle')
	.text('Celluar Subscriptions per 100 People');

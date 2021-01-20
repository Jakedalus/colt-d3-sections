var width = 800,
	height = 600,
	padding = 50,
	barPadding = 1;

var data = regionData.filter(d => d.medianAge !== null);

var xScale = d3
	.scaleLinear()
	.domain(d3.extent(data, d => d.medianAge))
	.rangeRound([ padding, width - padding ]);

var histogram = d3
	.histogram()
	.domain(xScale.domain())
	.thresholds(xScale.ticks())
	.value(d => d.medianAge);

var bins = histogram(data);

console.log('bins', bins);

var yScale = d3
	.scaleLinear()
	.domain([ 0, d3.max(bins, d => d.length) ])
	.range([ height - padding, padding ]);

var bars = d3
	.select('svg')
	.attr('width', width)
	.attr('height', height)
	.selectAll('.bar')
	.data(bins)
	.enter()
	.append('g')
	.classed('bar', true);

console.log('bars', bars);

bars
	.append('rect')
	.attr('x', (d, i) => {
		// console.log('d', d);
		// console.log('d.x0', d.x0);
		return xScale(d.x0);
	})
	.attr('y', d => yScale(d.length))
	.attr('height', d => height - yScale(d.length))
	.attr(
		'width',
		d => xScale(d.x1) - xScale(d.x0) - barPadding
	)
	.attr('fill', 'blue');

bars
	.append('g')
	.attr(
		'transform',
		'translate(0,' + (height - padding) + ')'
	)
	.classed('x-axis', true);

bars
	.append('g')
	.attr('transform', 'translate(' + padding + ', 0)')
	.classed('y-axis', true);

bars
	.append('text')
	.attr('x', width / 2)
	.attr('y', height - 10)
	.style('text-anchor', 'middle')
	.text('Median Age');

bars
	.append('text')
	.attr('transform', 'rotate(-90)')
	.attr('x', -height / 2)
	.attr('y', 15)
	.style('text-anchor', 'middle')
	.text('Frequency');

d3
	.select('input')
	.property('min', 3)
	.property('max', 30)
	.property('value', 15)
	.on('input', () => {
		var numBins = +d3.event.target.value;
		// console.log('numBins', numBins);
		var histogram = d3
			.histogram()
			.domain(xScale.domain())
			.thresholds(xScale.ticks(numBins))
			.value(d => d.medianAge);

		var bins = histogram(data);

		var yScale = d3
			.scaleLinear()
			.domain([ 0, d3.max(bins, d => d.length) ])
			.range([ height, 0 ]);

		var bars = d3
			.select('svg')
			.attr('width', width)
			.attr('height', height)
			.selectAll('.bar')
			.data(bins)
			.enter()
			.append('g')
			.classed('bar', true);

		bars
			.append('rect')
			.attr('x', (d, i) => {
				// console.log('d', d);
				// console.log('d.x0', d.x0);
				return xScale(d.x0);
			})
			.attr('y', d => yScale(d.length))
			.attr('height', d => height - yScale(d.length))
			.attr(
				'width',
				d => xScale(d.x1) - xScale(d.x0) - barPadding
			)
			.attr('fill', 'blue');
	});

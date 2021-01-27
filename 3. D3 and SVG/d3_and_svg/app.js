var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);

console.log('minYear, maxYear', minYear, maxYear);

var width = 600,
	height = 600,
	numBars = 12,
	barPadding = 10,
	barWidth = width / numBars - barPadding,
	maxBirths = d3.max(birthData, d => d.births);

var yScale = d3
	.scaleLinear()
	.domain([ 0, maxBirths ])
	.range([ height, 0 ]);

console.log('yScale', yScale);

d3
	.select('input')
	.property('min', minYear)
	.property('max', maxYear)
	.property('value', minYear);

d3
	.select('svg')
	.attr('width', width)
	.attr('height', height)
	.selectAll('rect')
	.data(birthData.filter(d => d.year === minYear))
	.enter()
	.append('rect')
	.attr('width', barWidth)
	.attr('height', d => {
		console.log('height', height);
		console.log('d', d);
		console.log('d.births', d.births);
		console.log('yScale(d.births)', yScale(d.births));
		console.log(
			'height - yScale(d.births)',
			height - yScale(d.births)
		);
		return height - yScale(d.births);
	})
	.attr('y', d => yScale(d.births))
	.attr('x', (d, i) => (barWidth + barPadding) * i)
	.attr('fill', 'purple');

d3.select('input').on('input', () => {
	var year = +d3.event.target.value;

	d3
		.selectAll('rect')
		.data(birthData.filter(d => d.year === year))
		.transition()
		.attr('height', d => {
			console.log('height', height);
			console.log('d', d);
			console.log('d.births', d.births);
			console.log('yScale(d.births)', yScale(d.births));
			console.log(
				'height - yScale(d.births)',
				height - yScale(d.births)
			);
			return height - yScale(d.births);
		})
		.attr('y', d => yScale(d.births));
});

const width = 600,
	height = 600;

const minYear = d3.min(birthData, d => d.year);
const maxYear = d3.max(birthData, d => d.year);

// const months = [];
// for (let d of birthData) {
// 	if (!months.includes(d.month)) {
// 		months.push(d.month);
// 	}
// }

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

console.log('d3.schemeCategory20', d3.schemeCategory20);

const colorScale = d3
	.scaleOrdinal()
	.domain(months)
	.range(d3.schemeCategory20);

d3
	.select('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')
	.attr(
		'transform',
		`translate(${width / 2}, ${height / 2})`
	)
	.classed('chart', true);

d3
	.select('input')
	.property('min', minYear)
	.property('max', maxYear)
	.property('value', minYear)
	.on('input', () => {
		makePieChart(+d3.event.target.value);
	});

makePieChart(minYear);

function makePieChart(year) {
	const yearData = birthData.filter(d => d.year === year);

	const arcs = d3
		.pie()
		.sort((a, b) => {
			months.indexOf(a.month) - months.indexOf(b.month);
		})
		.value(d => d.births)(yearData);

	const path = d3
		.arc()
		.outerRadius(width / 2 - 10)
		.innerRadius(width / 4);

	console.log('arcs, path', arcs, path);

	const update = d3
		.select('.chart')
		.selectAll('.arc')
		.data(arcs);

	update.exit().remove();

	update
		.enter()
		.append('path')
		.classed('arc', true)
		.merge(update)
		.attr('fill', d => {
			// console.log('d', d);
			return colorScale(d.data.month);
		})
		.attr('d', path);
}

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
console.log('d3.schemeSet3', d3.schemeSet3);

const colorScale = d3
	.scaleOrdinal()
	.domain(months)
	.range(d3.schemeSet3);

const quarterColorScale = d3
	.scaleOrdinal()
	.domain([ 'first', 'second', 'third', 'fourth' ])
	.range([ 'blue', 'green', 'red', 'orange' ]);
// .range(d3.schemeCategory10);

d3
	.select('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')
	.attr(
		'transform',
		`translate(${width / 2}, ${height / 2})`
	)
	.classed('inner-chart', true);

d3
	.select('svg')
	.append('g')
	.attr(
		'transform',
		`translate(${width / 2}, ${height / 2})`
	)
	.classed('outer-chart', true);

d3
	.select('input')
	.property('min', minYear)
	.property('max', maxYear)
	.property('value', minYear)
	.on('input', () => {
		makePieOuterChart(+d3.event.target.value);
		makePieInnerChart(+d3.event.target.value);
	});

makePieOuterChart(minYear);
makePieInnerChart(minYear);

function makePieOuterChart(year) {
	const yearData = birthData.filter(d => d.year === year);

	const outerArcs = d3
		.pie()
		.sort((a, b) => {
			months.indexOf(a.month) - months.indexOf(b.month);
		})
		.value(d => d.births)(yearData);

	const outerPath = d3
		.arc()
		.outerRadius(width / 2 - 10)
		.innerRadius(width / 4);

	console.log('outerArcs, outerPath', outerArcs, outerPath);

	const update = d3
		.select('.outer-chart')
		.selectAll('.arc')
		.data(outerArcs);

	// update.exit().remove();

	update
		.enter()
		.append('path')
		.classed('arc', true)
		.merge(update)
		.attr('fill', d => {
			// console.log('d', d);
			return colorScale(d.data.month);
		})
		.attr('d', outerPath);
}

function makePieInnerChart(year) {
	const yearData = birthData.filter(d => d.year === year);

	const innerArcs = d3
		.pie()
		.sort((a, b) => {
			months.indexOf(a.quarter) - months.indexOf(b.quarter);
		})
		.value(d => d.births);

	const innerPath = d3
		.arc()
		.outerRadius(width / 4)
		.innerRadius(0);

	console.log('innerArcs, innerPath', innerArcs, innerPath);

	function findQuarter(month) {
		switch (month) {
			case 'January':
			case 'February':
			case 'March':
				return 'first';

			case 'April':
			case 'May':
			case 'June':
				return 'second';

			case 'July':
			case 'August':
			case 'September':
				return 'third';

			case 'October':
			case 'November':
			case 'December':
				return 'fourth';
		}
	}

	const update = d3
		.select('.inner-chart')
		.selectAll('.arc')
		.data(innerArcs(getDataByQuarter(yearData)));

	update.exit().remove();

	update
		.enter()
		.append('path')
		.classed('arc', true)
		.merge(update)
		.attr('fill', d => {
			// console.log('d', d);
			return quarterColorScale(d.data.quarter);
		})
		.attr('d', innerPath);
}

function getDataByQuarter(data) {
	const quarterTallies = [ 0, 1, 2, 3 ].map(n => ({
		quarter : n,
		births  : 0
	}));

	for (let d of data) {
		const quarter = Math.floor(months.indexOf(d.month) / 3);
		quarterTallies[quarter].births += d.births;
	}

	return quarterTallies;
}

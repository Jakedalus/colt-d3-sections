var width = 600,
	height = 400,
	barPadding = 10;

var svg = d3
	.select('svg')
	.attr('width', width)
	.attr('height', height);

d3.select('#reset').on('click', function() {
	d3.selectAll('.letter').remove();

	d3.select('#phrase').text('');

	d3.select('#count').text('');
});

d3.select('form').on('submit', function() {
	d3.event.preventDefault();
	var input = d3.select('input');
	var text = input.property('value');
	var data = getFrequencies(text);
	var barWidth = width / data.length - barPadding;

	var letters = svg
		.selectAll('.letter')
		.data(getFrequencies(text), function(d) {
			return d.character;
		});

	console.log(
		'letters.enter().nodes().length',
		letters.enter().nodes().length
	);

	letters.classed('new', false).exit().remove();

	var lettersEnter = letters
		.enter()
		.append('g')
		.classed('letter', true)
		.classed('new', true);

	lettersEnter.append('rect');
	lettersEnter.append('text');

	lettersEnter
		.merge(letters)
		.select('rect')
		.attr('height', function(d) {
			console.log('height:', d.count * 20);
			return d.count * 20;
		})
		.attr('width', barWidth)
		.attr('y', d => {
			console.log('y:', height - d.count * 20);
			return height - d.count * 20;
		})
		.attr('x', (d, i) => {
			console.log(
				'x: (barWidth + barPadding) * i',
				(barWidth + barPadding) * i
			);
			return (barWidth + barPadding) * i;
		});

	lettersEnter
		.merge(letters)
		.select('text')
		.attr('x', (d, i) => {
			return (barWidth + barPadding) * i + barWidth / 2;
		})
		.attr('text-anchor', 'middle')
		.attr('y', d => {
			return height - d.count * 20 - 10;
		})
		.text(d => d.character);

	d3.select('#phrase').text('Analysis of: ' + text);

	d3
		.select('#count')
		.text(
			'(New characters: ' +
				letters.enter().nodes().length +
				')'
		);

	input.property('value', '');
});

function getFrequencies(str) {
	var sorted = str.split('').sort();
	var data = [];
	for (var i = 0; i < sorted.length; i++) {
		var last = data[data.length - 1];
		if (last && last.character === sorted[i]) last.count++;
		else data.push({ character: sorted[i], count: 1 });
	}
	return data;
}

// preview feature

function addNote(fontColor) {
	if (fontColor) {
		d3.event.preventDefault();
		var input = d3.select('input');
		d3
			.select('#notes')
			.append('p')
			.classed('note', true)
			.style('color', fontColor)
			.text(input.property('value'));
	} else {
		d3.event.preventDefault();
		var input = d3.select('input');
		d3
			.select('#notes')
			.append('p')
			.classed('note', true)
			.text(input.property('value'));
	}
	input.property('value', '');
	d3.select('#preview').style('display', 'none');
}

d3.select('input').on('input', function() {
	d3.event.preventDefault();
	var input = d3.select('input');
	d3
		.select('#preview')
		.classed('note', true)
		.style('display', 'block')
		.text(input.property('value'));

	// console.log('d3.event', d3.event);
	if (input.property('value') === '') {
		d3.select('#preview').style('display', 'none');
	}
});

d3.select('#new-note').on('submit', function() {
	// d3.event.preventDefault();
	// var input = d3.select('input');
	// d3
	// 	.select('#notes')
	// 	.append('p')
	// 	.classed('note', true)
	// 	.text(input.property('value'));
	// input.property('value', '');

	addNote();
});

d3.select('#remove-all-notes').on('click', function() {
	d3.event.preventDefault();
	d3.select('#notes').selectAll('p').remove();
});

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

d3.select('#im-feeling-lucky').on('click', function() {
	const fontColor = `rgb(${getRandomInt(
		255
	)}, ${getRandomInt(255)}, ${getRandomInt(255)})`;
	console.log('fontColor', fontColor);
	addNote(fontColor);
});

// remove all notes button
// i'm feeling lucky, random styling
// preview feature

d3.select('#new-note').on('submit', function() {
	d3.event.preventDefault();
	var input = d3.select('input');
	d3
		.select('#notes')
		.append('p')
		.classed('note', true)
		.text(input.property('value'));
	input.property('value', '');
});

d3.select('#remove-all-notes').on('click', function() {
	d3.event.preventDefault();
	d3.select('#notes').selectAll('p').remove();
});

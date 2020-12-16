d3.select('h1').on('click', () => console.log('event'));

d3.select('#new-note').on('submit', () => {
	d3.event.preventDefault();

	var input = d3.select('input');
	d3
		.select('#notes')
		.append('p')
		.classed('note', true)
		.text(input.property('value'));
	input.property('value', '');
});

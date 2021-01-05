// jacob andrew christopher carpenter
// francis bacon is a fraud in the foxes's hole with the hens

let letters = [];

const input = d3.select('input');

function countLetters(letters) {
	const tempLettersObj = {};
	for (let letter of letters) {
		// console.log(
		// 	'tempLettersObj[letter] + 1',
		// 	tempLettersObj[letter] + 1
		// );
		tempLettersObj[letter] =
			tempLettersObj[letter] + 1 || 1;
	}

	const tempLettersArr = [];
	for (let letter in tempLettersObj) {
		tempLettersArr.push({
			letter,
			frequency : tempLettersObj[letter]
		});
	}

	return tempLettersArr;
}

d3.select('#reset').on('click', () => {
	d3.selectAll('.letter').remove();
	d3.select('#phrase').text(``);

	d3.select('#count').text(``);
});

d3.select('form').on('submit', () => {
	d3.event.preventDefault();
	letters = input.property('value').split('').sort();

	console.log('letters', letters);

	letters = countLetters(letters);
	console.log('letter freq', letters);

	const letterUpdate = d3
		.select('#letters')
		.selectAll('p')
		.data(letters, d => d.letter);

	letterUpdate.classed('new', false).exit().remove();

	const letterEnter = letterUpdate
		.enter()
		.append('p')
		.classed('new', true)
		.classed('letter', true);

	letterEnter
		.merge(letterUpdate)
		.text(d => d.letter)
		.style('height', d => d.frequency * 20 + 'px')
		.style('width', '20px');

	d3
		.select('#phrase')
		.text(`Analysis of: ${input.property('value')}`);

	d3.select('#count').text(`Characters: ${letters.length}`);
});

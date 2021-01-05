// jacob andrew christopher carpenter
// francis bacon is a fraud in the foxes's hole with the hens

let letters = [];

const input = d3.select('input');

function countLetters(letters) {
	const tempLettersObj = {};
	for (let letter of letters) {
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

d3.select('form').on('submit', () => {
	d3.event.preventDefault();
	letters = input.property('value').split('');

	console.log('letters', letters);

	letters = countLetters(letters);
	console.log('letter freq', letters);

	d3
		.select('#letters')
		.selectAll('p')
		.data(letters)
		.enter()
		.append('p')
		.text(d => d.letter)
		.style('height', d => d.frequency * 20 + 'px')
		.style('width', '20px')
		.classed('letter', true);
});

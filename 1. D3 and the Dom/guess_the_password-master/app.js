var wordCount = 10;
var guessCount = 4;
var password = '';

var start = d3.select('#start');
start.on('click', function() {
	console.log('START');
	toggleClasses(d3.select('#start-screen'), 'hide', 'show');
	toggleClasses(d3.select('#game-screen'), 'hide', 'show');
	startGame();
});

function toggleClasses(element) {
	for (var i = 1; i < arguments.length; i++) {
		console.log('arguments[i]', arguments[i]);
		console.log('element', element);
		const isCurrentClass = element.classed(arguments[i]);
		console.log('isCurrentClass', isCurrentClass);
		element.classed(arguments[i], !isCurrentClass);
	}
}

function startGame() {
	// get random words and append them to the DOM
	var wordList = d3.select('#word-list');
	var randomWords = getRandomValues(words, wordCount);
	randomWords.forEach(function(word) {
		console.log('word', word);
		wordList.append('li').text(word);
	});

	// set a secret password and the guess count display
	password = getRandomValues(randomWords, 1)[0];
	setGuessCount(guessCount);

	// add update listener for clicking on a word
	wordList.on('click', updateGame);
}

function getRandomValues(array, numberOfVals) {
	return shuffle(array).slice(0, numberOfVals);
}

function shuffle(array) {
	var arrayCopy = array.slice();
	for (var idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
		// generate a random index between 0 and idx1 (inclusive)
		var idx2 = Math.floor(Math.random() * (idx1 + 1));

		// swap elements at idx1 and idx2
		var temp = arrayCopy[idx1];
		arrayCopy[idx1] = arrayCopy[idx2];
		arrayCopy[idx2] = temp;
	}
	return arrayCopy;
}

function setGuessCount(newCount) {
	guessCount = newCount;
	d3
		.select('#guesses-remaining')
		.text('Guesses remaining: ' + guessCount + '.');
}

function updateGame() {
	console.log('updateGame, event object', d3.event);
	var e = d3.event;
	if (
		e.target.tagName === 'LI' &&
		!e.target.classList.contains('disabled')
	) {
		// grab guessed word, check it against password, update view
		var guess = e.target.innerText;
		var similarityScore = compareWords(guess, password);
		e.target.classList.add('disabled');
		e.target.innerText =
			e.target.innerText +
			' --> Matching Letters: ' +
			similarityScore;
		setGuessCount(guessCount - 1);

		// check whether the game is over
		var wordList = d3.select('#word-list');
		if (similarityScore === password.length) {
			toggleClasses(d3.select('#winner'), 'hide', 'show');
			wordList.on('click', '');
		} else if (guessCount === 0) {
			toggleClasses(d3.select('#loser'), 'hide', 'show');
			wordList.on('click', '');
		}
	}
}

function compareWords(word1, word2) {
	if (word1.length !== word2.length)
		throw 'Words must have the same length';
	var count = 0;
	for (var i = 0; i < word1.length; i++) {
		if (word1[i] === word2[i]) count++;
	}
	return count;
}

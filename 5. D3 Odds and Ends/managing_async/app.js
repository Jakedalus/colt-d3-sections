d3.json('./countries.json', (error, data) => {
	if (error) throw error;

	// console.log('data', data);

	d3
		.select('body')
		.selectAll('h3')
		.data(data.geonames)
		.enter()
		.append('h3')
		.text(d => d.countryName);
});

d3.csv(
	'./simplemaps-worldcities-basic.csv',
	(row, i, headers) => {
		if (+row.pop < 10000) return;

		return {
			cityName    : row.city,
			countryCode : row.iso2,
			population  : +row.pop
		};
	},
	(error, data) => {
		if (error) throw error;

		console.log('data', data);
	}
);

d3
	.queue()
	.defer(d3.json, './countries.json')
	.defer(
		d3.csv,
		'./simplemaps-worldcities-basic.csv',
		(row, i, headers) => {
			if (+row.pop < 10000) return;

			return {
				cityName    : row.city,
				countryCode : row.iso2,
				population  : +row.pop
			};
		}
	)
	.await((error, countries, cities) => {
		if (error) throw error;

		const data = countries.geonames.map(country => {
			country.cities = cities.filter(
				city => city.countryCode === country.countryCode
			);
			return country;
		});

		const countrySelection = d3
			.select('body')
			.selectAll('div')
			.data(data)
			.enter()
			.append('div');

		countrySelection.append('h3').text(d => d.countryName);

		countrySelection.append('ul').html(d =>
			d.cities
				.map(city => {
					const percentage =
						city.population / d.population * 100;

					return `<li>${city.cityName}: ${percentage.toFixed(
						2
					)}%</li>`;
				})
				.join('')
		);
	});

// d3.json('./countries.json', (error, data) => {
// 	if (error) throw error;

// 	// console.log('data', data);

// 	d3
// 		.select('body')
// 		.selectAll('h3')
// 		.data(data.geonames)
// 		.enter()
// 		.append('h3')
// 		.text(d => d.countryName);
// });

// d3.csv(
// 	'./simplemaps-worldcities-basic.csv',
// 	(error, data) => {
// 		if (error) throw error;

// 		console.log('data', data);
// 	}
// );

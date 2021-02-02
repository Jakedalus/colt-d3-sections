// fetch('https://api.covidtracking.com/v1/us/daily.json')
// 	.then(response => {
// 		console.log('response', response);
// 		return response.json();
// 	})
// 	.then(data => {
// 		console.log('data', data);
// 	});

d3
	.queue()
	.defer(d3.json, './dailyCOVID_states.json')
	.await((error, data) => {
		console.log('data', data);

		const minDate = d3.min(data, d => d.date);
		const maxDate = d3.max(data, d => d.date);

		console.log('minDate, maxDate', minDate, maxDate);

		const dayData = data
			.filter(d => d.date === maxDate)
			.sort((a, b) => a.state > b.state);

		const states = dayData.map(d => d.state).sort();

		console.log('dayData', dayData);
		console.log('states', states);

		const width = 800,
			height = 600,
			barPadding = 10;

		const numBars = dayData.length;

		const barWidth = width / numBars - barPadding;

		const maxDeaths = d3.max(dayData, d => d.death);

		const xScale = d3
			.scaleBand()
			.domain(states)
			.range([ 0, width ]);

		const yScale = d3
			.scaleLinear()
			.domain([ 0, maxDeaths ])
			.range([ height, 0 ]);

		console.log('xScale(AK)', xScale('AK'));
		console.log('xScale(NY)', xScale('NY'));
		console.log('xScale(WA)', xScale('WA'));

		const chart = d3
			.select('svg')
			.attr('width', width)
			.attr('height', height)
			.selectAll('.bar')
			.data(dayData)
			.enter()
			.append('rect')
			.classed('bar', true)
			.attr('width', barWidth)
			.attr('height', d => height - yScale(d.death))
			.attr('x', (d, i) => xScale(d.state))
			.attr('y', d => yScale(d.death));
	});

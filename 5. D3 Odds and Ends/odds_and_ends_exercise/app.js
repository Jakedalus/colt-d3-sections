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

		const width = 900,
			height = 600,
			padding = 30,
			barPadding = 10;

		const numBars = dayData.length;

		const barWidth = width / numBars - barPadding;

		const maxDeaths = d3.max(dayData, d => d.death);

		const xScale = d3
			.scaleBand()
			.domain(states)
			.range([ padding, width - padding ]);

		const yScale = d3
			.scaleLinear()
			.domain([ 0, maxDeaths ])
			.range([ height - padding, padding ]);

		const xAxis = d3.axisBottom(xScale);

		const chart = d3
			.select('svg')
			.attr('width', width)
			.attr('height', height);
		//test
		chart
			.append('g')
			.attr(
				'transform',
				`translate(0, ${height - padding})`
			)
			.call(xAxis)
			.selectAll('text')
			.style('text-anchor', 'end')
			.attr('dx', '-.4em')
			.attr('dy', '.20em')
			.attr('transform', 'rotate(-55)');

		console.log('xScale(AK)', xScale('AK'));
		console.log('xScale(NY)', xScale('NY'));
		console.log('xScale(WA)', xScale('WA'));

		chart
			.selectAll('.bar')
			.data(dayData)
			.enter()
			.append('rect')
			.classed('bar', true)
			.attr('width', barWidth)
			.attr(
				'height',
				d => height - yScale(d.death) - padding
			)
			.attr('x', (d, i) => xScale(d.state) + barPadding / 2)
			.attr('y', d => yScale(d.death));
	});

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

		const states = data
			.filter(d => d.date === maxDate)
			.map(d => d.state)
			.sort();

		console.log('states', states);

		const width = 900,
			height = 600,
			padding = 30,
			barPadding = 10;

		const numBars = states.length;

		const barWidth = width / numBars - barPadding;

		const maxDeaths = d3.max(data, d => d.death);

		console.log('maxDeaths', maxDeaths);

		const xScale = d3
			.scaleBand()
			.domain(states)
			.range([ padding, width - padding ]);

		console.log('xScale(AK)', xScale('AK'));
		console.log('xScale(NY)', xScale('NY'));
		console.log('xScale(WA)', xScale('WA'));

		const yScale = d3
			.scaleLinear()
			.domain([ 0, maxDeaths ])
			.range([ height - padding, padding ]);

		const xAxis = d3.axisBottom(xScale);

		function convertRawDateToTimestamp(rawDate) {
			console.log('rawDate', rawDate);

			console.log(
				'rawDate, substrings',
				rawDate.substring(0, 4),
				rawDate.substring(4, 6) - 1,
				rawDate.substring(6)
			);

			const date = new Date(
				rawDate.substring(0, 4),
				rawDate.substring(4, 6) - 1,
				rawDate.substring(6)
			);

			console.log('date', date);

			return date.getTime();
		}

		function convertTimestampToRawDate(timestamp) {
			console.log('timestamp', timestamp);

			const newDate = new Date(timestamp);

			console.log('new Date(timestamp)', newDate);

			let year = newDate.getFullYear();
			let month = newDate.getMonth() + 1;
			let day = newDate.getDate();

			month = month.toString();
			day = day.toString();

			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;

			const dateString = `${year}${month}${day}`;

			console.log('+dateString', +dateString);

			return +dateString;
		}

		const convertedMinDate = convertRawDateToTimestamp(
			minDate.toString()
		);
		const convertedMaxDate = convertRawDateToTimestamp(
			maxDate.toString()
		);

		console.log('convertedMinDate', convertedMinDate);
		console.log('convertedMaxDate', convertedMaxDate);

		convertTimestampToRawDate(convertedMinDate);
		const START_DATE = convertTimestampToRawDate(
			convertedMaxDate
		);

		console.log('START_DATE', START_DATE);

		drawChart(START_DATE);

		d3
			.select('input')
			.property('min', convertedMinDate)
			.property('max', convertedMaxDate)
			.property('value', convertedMaxDate)
			.on('input', function() {
				const rawTimestamp = +d3.event.target.value;

				const date = convertTimestampToRawDate(
					rawTimestamp
				);

				drawChart(date);
			});

		function drawChart(date) {
			console.log('date', date);

			const dayData = data
				.filter(d => d.date === date)
				.sort((a, b) => a.state > b.state);

			console.log('dayData', dayData);

			const chart = d3
				.select('svg')
				.attr('width', width)
				.attr('height', height);

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

			const update = chart.selectAll('.bar').data(dayData);

			update.exit().remove();

			update
				.enter()
				.append('rect')
				.classed('bar', true)
				.merge(update)
				.transition()
				.attr('width', barWidth)
				.attr(
					'height',
					d => height - yScale(d.death) - padding
				)
				.attr(
					'x',
					(d, i) => xScale(d.state) + barPadding / 2
				)
				.attr('y', d => yScale(d.death));
		}
	});

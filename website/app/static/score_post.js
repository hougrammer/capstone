d3.select("#scoreSubmit")
	.on("click", () => {
		let json = JSON.stringify({
			title: d3.select("#titleInput").property("value"),
			hour: d3.select("#hourInput").property("value"),
			minute: d3.select("#minuteInput").property("value"),
			weekday: d3.select("#weekdayInput").property("value"),
			date: d3.select("#dateInput").property("value")
		});
		console.log(json);
		d3.json('/score_post', {
			method:"POST",
			body: json,
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		.then(json => {console.log(json);});
	});
QUnit.test('Calendar test, various months and parameter values', function(assert) {
	var todayYear = 2017;
	var todayMonth = 0;
	var todayDate = 15;
	var today = new Date(todayYear, todayMonth, todayDate);

	test(2017, 0, 1, 0, 31, 4, {today: today});
	test(2017, 0, 26, 6, 31, 5, {today: today, firstDay: 1});
	test(2017, 1, 29, 3, 28, 4, {today: today});
	test(2017, 1, 30, 2, 28, 5, {today: today, firstDay: 1});
	test(2017, 11, 26, 5, 31, 6, {today: today});
	test(2017, 11, 27, 4, 31, 0, {today: today, firstDay: 1});

	test(2016, 1, 31, 1, 29, 5, {today: today});
	test(2016, 1, 1, 0, 29, 6, {today: today, firstDay: 1});

	test(2017, 0, 1, 0, 31, 4, {today: today, minWeeksCount: 4});
	test(2017, 0, 1, 0, 31, 4, {today: today, minWeeksCount: 5});
	test(2017, 0, 1, 0, 31, 11, {today: today, minWeeksCount: 6});
	test(2017, 0, 25, 7, 31, 11, {today: today, minWeeksCount: 7});
	test(2017, 0, 25, 7, 31, 18, {today: today, minWeeksCount: 8});

	test(2017, 0, 1, 0, 31, 4, {today: today, minWeeksCount: 5, verticalAlign: 'top'});
	test(2017, 0, 1, 0, 31, 11, {today: today, minWeeksCount: 6, verticalAlign: 'top'});
	test(2017, 0, 1, 0, 31, 18, {today: today, minWeeksCount: 7, verticalAlign: 'top'});

	test(2017, 0, 1, 0, 31, 4, {today: today, minWeeksCount: 5, verticalAlign: 'bottom'});
	test(2017, 0, 25, 7, 31, 4, {today: today, minWeeksCount: 6, verticalAlign: 'bottom'});
	test(2017, 0, 18, 14, 31, 4, {today: today, minWeeksCount: 7, verticalAlign: 'bottom'});

	test(2017, 0, 26, 6, 31, 5, {today: today, firstDay: 1, minWeeksCount: 6});
	test(2017, 0, 26, 6, 31, 12, {today: today, firstDay: 1, minWeeksCount: 7});
	test(2017, 0, 19, 13, 31, 12, {today: today, firstDay: 1, minWeeksCount: 8});
	test(2017, 0, 19, 13, 31, 19, {today: today, firstDay: 1, minWeeksCount: 9});

	test(2017, 0, 26, 6, 31, 5, {today: today, firstDay: 1, minWeeksCount: 6, verticalAlign: 'top'});
	test(2017, 0, 26, 6, 31, 12, {today: today, firstDay: 1, minWeeksCount: 7, verticalAlign: 'top'});
	test(2017, 0, 26, 6, 31, 19, {today: today, firstDay: 1, minWeeksCount: 8, verticalAlign: 'top'});

	test(2017, 0, 26, 6, 31, 5, {today: today, firstDay: 1, minWeeksCount: 6, verticalAlign: 'bottom'});
	test(2017, 0, 19, 13, 31, 5, {today: today, firstDay: 1, minWeeksCount: 7, verticalAlign: 'bottom'});
	test(2017, 0, 12, 20, 31, 5, {today: today, firstDay: 1, minWeeksCount: 8, verticalAlign: 'bottom'});

	today.setMonth(todayMonth = 2);
	today.setDate(todayDate = 1);
	test(2017, 2, 26, 3, 31, 1, {today: today});
	test(2017, 2, 27, 2, 31, 2, {today: today, firstDay: 1});

	today.setDate(todayDate = 28);
	test(2017, 2, 26, 3, 31, 1, {today: today});
	test(2017, 2, 27, 2, 31, 2, {today: today, firstDay: 1});

	function test(year, month, startDate, daysPreviousMonth, daysThisMonth, daysNextMonth, options) {
		assert.deepEqual(AbstractCalendar.getCalendar(year, month, options), getCalendar(year, month, startDate, daysPreviousMonth, daysThisMonth, daysNextMonth));
	}

	function getCalendar(year, month, startDate, daysPreviousMonth, daysThisMonth, daysNextMonth) {
		var weeks = [];
		var week = null;
		var date = startDate;
		if (daysPreviousMonth !== 0) {
			month--;
			if (month === -1) {
				month = 11;
				year--;
			}
		}
		for (var i = 1; i <= daysPreviousMonth + daysThisMonth + daysNextMonth; i++) {
			if (week === null || week.days.length === 7) {
				weeks.push(week = {days: []});
			}
			week.days.push({
				year: year,
				month: month,
				date: date,
				isToday: year === todayYear && month === todayMonth && date === todayDate,
				isOtherMonth: !(i > daysPreviousMonth && i <= daysPreviousMonth + daysThisMonth)
			});
			if (i === daysPreviousMonth || i === daysPreviousMonth + daysThisMonth) {
				date = 1;
				month++;
				if (month > 11) {
					month = 0;
					year++;
				}
			} else {
				date++;
			}
		}
		return weeks;
	}
});

QUnit.test('Calendar test, real today date', function(assert) {
	var now = new Date();
	var result = AbstractCalendar.getCalendar(now.getFullYear(), now.getMonth());
	assert.ok(result.length > 3);
	var today = null;
	for (var w = 0; w < result.length; w++) {
		var week = result[w];
		assert.strictEqual(week.days.length, 7);
		for (var d = 0; d < 7; d++) {
			var day = week.days[d];
			if (day.isToday) {
				if (today !== null) {
					assert.ok(false, 'more than 1 today');
				}
				today = day;
			}
		}
	}
	if (today === null) {
		assert.ok(false, 'today not found');
	}
	assert.strictEqual(today.year, now.getFullYear());
	assert.strictEqual(today.month, now.getMonth());
	assert.strictEqual(today.date, now.getDate());
});
/**
 * AbstractCalendarJS
 *
 * @license MIT
 * @author  TS Soft
 * @version 1.0
 */
 
 (function (factory) {
	"use strict";

	// Module definition
	if (typeof define === 'function' && define.amd) {
		define([], factory); // AMD
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(); // Node
	} else {
		window.AbstractCalendar = factory(); // Browser
	}
}(function () {
	"use strict";

	/**
	 * Returns array of weeks
	 *
	 * @param {int} calendarYear - year
	 * @param {int} calendarMonth - month (zero-based)
	 * @param {int} options.firstDay - first day of week
	 * @param {int} options.minWeeksCount - minimum amount of weeks to show (for example, to force the 6-weeks calendar layout)
	 * @param {int} options.verticalAlign - defines where the current month begins if amount of days in it is less than minWeeksCount.
	 *	For example, if current month has only 4 weeks and minWeeksCount is 6, then:
	 *		verticalAlign == 'top' - current month begins from the top week
	 *		verticalAlign == 'middle' - current month begins from the 2rd week
	 *		verticalAlign == 'bottom' - current month begins from the 3rd week
	 * @param {int} options.today - for unit tests
	 */
	function getCalendar(calendarYear, calendarMonth, options) {
		if (isNaN(calendarYear) || !(calendarMonth >= 0 && calendarMonth <= 11)) {
			throw Error('getCalendar incorrect params: year = ' + calendarYear + '; month = ' + calendarMonth);
		}

		options = options || {};

		var firstDay = options.firstDay || 0;
		var minWeeksCount = options.minWeeksCount || 0;
		var verticalAlign = options.verticalAlign || 'middle';
		var today = options.today || new Date();

		var startOfMonth = new Date(calendarYear, calendarMonth);
		var daysCount = daysInMonth(calendarYear, calendarMonth);

		var day = getDay(startOfMonth, firstDay);
		var weeksInMonth = Math.ceil((day + daysCount) / 7);

		var dateIterator = startOfMonth;
		dateIterator.setDate(dateIterator.getDate() - day); // start of week

		if (minWeeksCount) {
			var extraWeeks = minWeeksCount - weeksInMonth;
			if (extraWeeks > 0) {
				var appendWeeks = null;
				if (verticalAlign === 'middle') {
					appendWeeks = Math.floor(extraWeeks / 2);
				} else if (verticalAlign === 'bottom') {
					appendWeeks = extraWeeks;
				}
				if (appendWeeks !== null) {
					dateIterator.setDate(dateIterator.getDate() - appendWeeks * 7);
				}
			}
		}

		var todayYear = today.getFullYear();
		var todayMonth = today.getMonth();
		var todayDate = today.getDate();

		var weeks = [];

		var weeksCount = Math.max(minWeeksCount, weeksInMonth);
		for (var w = 0; w < weeksCount; w++) {
			var week = {
				days: []
			};
			weeks.push(week);
			for (var d = 0; d < 7; d++) {
				var year = dateIterator.getFullYear();
				var month = dateIterator.getMonth();
				var date = dateIterator.getDate();
				week.days.push({
					year: year,
					month: month,
					date: date,
					isToday: year === todayYear && month === todayMonth && date === todayDate,
					isOtherMonth: !(year === calendarYear && month === calendarMonth)
				});
				dateIterator.setDate(dateIterator.getDate() + 1);
			}
		}

		return weeks;
	}

	function daysInMonth(year, month) {
		return new Date(year, month + 1, 0).getDate();
	}

	function getDay(date, firstDay) {
		var day = date.getDay() - firstDay;
		if (day < 0) {
			day += 7;
		}
		return day;
	}

	return {
		getCalendar: getCalendar
	};
}));
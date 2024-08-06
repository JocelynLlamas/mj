/*!
 * Project : simply-countup
 * File : simplyCountup
 * Date : 27/06/2015
 * License : MIT
 * Version : 1.3.2
 * Author : Vincent Loy <vincent.loy1@gmail.com>
 * Contributors : 
 *  - Justin Beasley <JustinB@harvest.org>
 *  - Nathan Smith <NathanS@harvest.org>
 */
/*global window, document*/
(function (exports) {
    'use strict';

    var // functions
        extend,
        createElements,
        createCountdownElt,
        simplyCountup;

    /**
     * Function that merge user parameters with defaults one.
     * @param out
     * @returns {*|{}}
     */
    extend = function (out) {
        var i,
            obj,
            key;
        out = out || {};

        for (i = 1; i < arguments.length; i += 1) {
            obj = arguments[i];

            if (obj) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            extend(out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
        }

        return out;
    };

    /**
     * Function that create a countdown section
     * @param countdown
     * @param parameters
     * @param typeClass
     * @returns {{full: (*|Element), amount: (*|Element), word: (*|Element)}}
     */
    createCountdownElt = function (countdown, parameters, typeClass) {
        var innerSectionTag,
            sectionTag,
            amountTag,
            wordTag;

        sectionTag = document.createElement('div');
        amountTag = document.createElement('span');
        wordTag = document.createElement('span');
        innerSectionTag = document.createElement('div');

        innerSectionTag.appendChild(amountTag);
        innerSectionTag.appendChild(wordTag);
        sectionTag.appendChild(innerSectionTag);

        sectionTag.classList.add(parameters.sectionClass);
        sectionTag.classList.add(typeClass);
        amountTag.classList.add(parameters.amountClass);
        wordTag.classList.add(parameters.wordClass);

        countdown.appendChild(sectionTag);

        return {
            full: sectionTag,
            amount: amountTag,
            word: wordTag
        };
    };

    /**
     * Function that create full countdown DOM elements calling createCountdownElt
     * @param parameters
     * @param countdown
     * @returns {{months: (*|Element), days: (*|Element), hours: (*|Element), minutes: (*|Element), seconds: (*|Element)}}
     */
    createElements = function (parameters, countdown) {
        var spanTag;

        if (!parameters.inline) {
            return {
                months: createCountdownElt(countdown, parameters, 'simply-months-section'),
                days: createCountdownElt(countdown, parameters, 'simply-days-section'),
                hours: createCountdownElt(countdown, parameters, 'simply-hours-section'),
                minutes: createCountdownElt(countdown, parameters, 'simply-minutes-section'),
                seconds: createCountdownElt(countdown, parameters, 'simply-seconds-section')
            };
        }

        spanTag = document.createElement('span');
        spanTag.classList.add(parameters.inlineClass);
        return spanTag;
    };

    /**
     * simplyCountup, create and display the countup.
     * @param elt
     * @param args (parameters)
     */
    simplyCountup = function (elt, args) {
        var parameters = extend({
            startYear: 2024,
            startMonth: 5,
            startDay: 7,
            startHours: 0,
            startMinutes: 0,
            startSeconds: 0,
            words: {
                months: 'month',
                days: 'day',
                hours: 'hour',
                minutes: 'minute',
                seconds: 'second',
                pluralLetter: 's'
            },
            plural: true,
            inline: false,
            enableUtc: true,
            refresh: 1000,
            inlineClass: 'simply-countup-inline',
            sectionClass: 'simply-section',
            amountClass: 'simply-amount',
            wordClass: 'simply-word',
            zeroPad: false
        }, args),
            interval,
            startDate,
            startTmpDate,
            now,
            nowUtc,
            timeElapsed,
            months,
            days,
            hours,
            minutes,
            seconds,
            cd = document.querySelectorAll(elt);

        startTmpDate = new Date(
            parameters.startYear,
            parameters.startMonth - 1,
            parameters.startDay,
            parameters.startHours,
            parameters.startMinutes,
            parameters.startSeconds
        );

        if (parameters.enableUtc) {
            startDate = new Date(
                startTmpDate.getUTCFullYear(),
                startTmpDate.getUTCMonth(),
                startTmpDate.getUTCDate(),
                startTmpDate.getUTCHours(),
                startTmpDate.getUTCMinutes(),
                startTmpDate.getUTCSeconds()
            );
        } else {
            startDate = startTmpDate;
        }

        Array.prototype.forEach.call(cd, function (countup) {
            var fullCountup = createElements(parameters, countup),
                refresh;

            refresh = function () {
                var monthWord, dayWord, hourWord, minuteWord, secondWord;

                now = new Date();
                if (parameters.enableUtc) {
                    nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
                        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                    timeElapsed = nowUtc - startDate;

                } else {
                    timeElapsed = now - startDate;
                }

                if (timeElapsed > 0) {
                    months = Math.floor((now.getFullYear() - startDate.getFullYear()) * 12 + now.getMonth() - startDate.getMonth());

                    let lastMonthDate = new Date(now.getFullYear(), now.getMonth(), startDate.getDate());
                    let daysDifference = (now - lastMonthDate) / (1000 * 60 * 60 * 24);

                    if (daysDifference < 0) {
                        months -= 1;
                        lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, startDate.getDate());
                        daysDifference = (now - lastMonthDate) / (1000 * 60 * 60 * 24);
                    }

                    days = Math.floor(daysDifference);

                    let lastDayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startDate.getHours());
                    let hoursDifference = (now - lastDayDate) / (1000 * 60 * 60);

                    if (hoursDifference < 0) {
                        days -= 1;
                        lastDayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, startDate.getHours());
                        hoursDifference = (now - lastDayDate) / (1000 * 60 * 60);
                    }

                    hours = Math.floor(hoursDifference);

                    let lastHourDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), startDate.getMinutes());
                    let minutesDifference = (now - lastHourDate) / (1000 * 60);

                    if (minutesDifference < 0) {
                        hours -= 1;
                        lastHourDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, startDate.getMinutes());
                        minutesDifference = (now - lastHourDate) / (1000 * 60);
                    }

                    minutes = Math.floor(minutesDifference);

                    let lastMinuteDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), startDate.getSeconds());
                    let secondsDifference = (now - lastMinuteDate) / 1000;

                    if (secondsDifference < 0) {
                        minutes -= 1;
                        lastMinuteDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() - 1, startDate.getSeconds());
                        secondsDifference = (now - lastMinuteDate) / 1000;
                    }

                    seconds = Math.floor(secondsDifference);
                } else {
                    months = 0;
                    days = 0;
                    hours = 0;
                    minutes = 0;
                    seconds = 0;
                }


                if (parameters.plural) {
                    monthWord = months > 1
                        ? parameters.words.months + parameters.words.pluralLetter
                        : parameters.words.months;

                    dayWord = days > 1
                        ? parameters.words.days + parameters.words.pluralLetter
                        : parameters.words.days;

                    hourWord = hours > 1
                        ? parameters.words.hours + parameters.words.pluralLetter
                        : parameters.words.hours;

                    minuteWord = minutes > 1
                        ? parameters.words.minutes + parameters.words.pluralLetter
                        : parameters.words.minutes;

                    secondWord = seconds > 1
                        ? parameters.words.seconds + parameters.words.pluralLetter
                        : parameters.words.seconds;

                } else {
                    monthWord = parameters.words.months;
                    dayWord = parameters.words.days;
                    hourWord = parameters.words.hours;
                    minuteWord = parameters.words.minutes;
                    secondWord = parameters.words.seconds;
                }

                /* display an inline countup into a span tag */
                if (parameters.inline) {
                    countup.innerHTML =
                        months + ' ' + monthWord + ', ' +
                        days + ' ' + dayWord + ', ' +
                        hours + ' ' + hourWord + ', ' +
                        minutes + ' ' + minuteWord + ', ' +
                        seconds + ' ' + secondWord + '.';

                } else {
                    fullCountup.months.amount.textContent = (parameters.zeroPad && months.toString().length < 2 ? '0' : '') + months;
                    fullCountup.months.word.textContent = monthWord;

                    fullCountup.days.amount.textContent = (parameters.zeroPad && days.toString().length < 2 ? '0' : '') + days;
                    fullCountup.days.word.textContent = dayWord;

                    fullCountup.hours.amount.textContent = (parameters.zeroPad && hours.toString().length < 2 ? '0' : '') + hours;
                    fullCountup.hours.word.textContent = hourWord;

                    fullCountup.minutes.amount.textContent = (parameters.zeroPad && minutes.toString().length < 2 ? '0' : '') + minutes;
                    fullCountup.minutes.word.textContent = minuteWord;

                    fullCountup.seconds.amount.textContent = (parameters.zeroPad && seconds.toString().length < 2 ? '0' : '') + seconds;
                    fullCountup.seconds.word.textContent = secondWord;
                }
            };

            // Refresh immediately to prevent a Flash of Unstyled Content
            refresh();
            interval = window.setInterval(refresh, parameters.refresh);
        });
    };

    exports.simplyCountup = simplyCountup;
}(window));

/*global $, jQuery, simplyCountup*/
if (window.jQuery) {
    (function ($, simplyCountup) {
        'use strict';

        function simplyCountupify(el, options) {
            simplyCountup(el, options);
        }

        $.fn.simplyCountup = function (options) {
            return simplyCountupify(this.selector, options);
        };
    }(jQuery, simplyCountup));
}

// Usage example:
simplyCountup('.your-countup-element', {
    startYear: 2024,
    startMonth: 5,
    startDay: 7
});

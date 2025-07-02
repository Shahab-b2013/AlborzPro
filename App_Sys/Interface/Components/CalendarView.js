// JScript File(Amnpardaz Software Co. Copyright 2024 - All Right Reserved)
// Release Ferdos.WebAppDesk 4.2.0.0

var selectedCells = [];

function initCalendar() {

    var today = new Date(); // Get today's date
    var jalaliToday = toJalaali(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
    ); // Convert today's date to Jalali
    // Function to convert selected cell to a unique identifier
    function cellId(year, month, day) {
        return `${year}-${month}-${day}`;
    }
    $(document).ready(function () {

        //#region fill month name and year number of header
        var formattedJalaaliDate = `${jalaliToday.jy}/${("0" + jalaliToday.jm).slice(
            -2
        )}/${("0" + jalaliToday.jd).slice(-2)}`; // Format the Jalaali date as "yyyy/mm/dd"
        document.getElementById("datePicker").value = formattedJalaaliDate; // Set the value of the input field to the formatted Jalaali date
        var monthNames = [
            "فروردین",
            "اردیبهشت",
            "خرداد",
            "تیر",
            "مرداد",
            "شهریور",
            "مهر",
            "آبان",
            "آذر",
            "دی",
            "بهمن",
            "اسفند",
        ]; // Get the Jalali month name
        var monthName = monthNames[jalaliToday.jm - 1]; // define name of each month number
        document.getElementById("currentMonth").textContent = monthName; // Update the content of the element with id "currentMonth"
        document.getElementById("currentYear").textContent = jalaliToday.jy; // Update the content of the element with id "currentYear"
        updateDaysArray(); // Call the updateDaysArray() function to initialize the days array values
        //#endregion

        //#region button navigation months
        // Check the direction and update the icon class accordingly
        //navigate month buttons
        document.getElementById("nextMonth").addEventListener("click", function () {
            // Add event listener to the "ماه بعد" button
            var currentMonthElement = document.getElementById("currentMonth"); // get element currentMonth
            var currentYearElement = document.getElementById("currentYear"); // get element currentYear
            var currentMonthIndex = monthNames.indexOf(currentMonthElement.textContent); // string of month number
            var currentYear = parseInt(currentYearElement.textContent); // convert month number to integer
            if (currentMonthIndex === 11) {
                // If the current month is اسفند, move to فروردین of the next year
                currentMonthElement.textContent = monthNames[0]; // فروردین
                currentYear += 1; // increase the year number to next
            } else {
                currentMonthElement.textContent = monthNames[currentMonthIndex + 1]; // increase the month number to next
            }
            currentYearElement.textContent = currentYear; // values the currentYear number
            updateDaysArray(); // Update the days array
        });
        document.getElementById("prevMonth").addEventListener("click", function () {
            // Add event listener to the "ماه قبل" button
            var currentMonthElement = document.getElementById("currentMonth"); // get element currentMonth
            var currentYearElement = document.getElementById("currentYear"); // get element currentYear
            var currentMonthIndex = monthNames.indexOf(currentMonthElement.textContent); // string of month number
            var currentYear = parseInt(currentYearElement.textContent); // convert month number to integer
            if (currentMonthIndex === 0) {
                // If the current month is فروردین, move to اسفند of the previous year
                currentMonthElement.textContent = monthNames[11]; // اسفند
                currentYear -= 1; // reduce the year number to previous
            } else {
                currentMonthElement.textContent = monthNames[currentMonthIndex - 1]; // reduce the month number to previous
            }
            currentYearElement.textContent = currentYear; // values the currentYear number
            updateDaysArray(); // Update the days array
        });
        //#endregion

        //#region days cell

        // show days of month on a table
        function updateDaysArray() {
            var monthNumber; //get month number to show that on popup event date
            var monthInt; // get month number type integer 
            var currentMonth, currentYear;

            // Check if the popupCalendar already exists
            if ($('.popupCalendar').length > 0) {
                // If popupCalendar exists, get the values from currentMonthTable and currentYearTable
                currentMonth = document.getElementById("currentMonthTable").textContent;
                currentYear = parseInt(document.getElementById("currentYearTable").textContent);
            } else {
                // Otherwise, get the values from currentMonth and currentYear elements
                currentMonth = document.getElementById("currentMonth").textContent;
                currentYear = parseInt(document.getElementById("currentYear").textContent);
            }

            switch (currentMonth) {
                case "فروردین":
                    monthNumber = "01";
                    monthInt = 1;
                    break;
                case "اردیبهشت":
                    monthNumber = "02";
                    monthInt = 2;
                    break;
                case "خرداد":
                    monthNumber = "03";
                    monthInt = 3;
                    break;
                case "تیر":
                    monthNumber = "04";
                    monthInt = 4;
                    break;
                case "مرداد":
                    monthNumber = "05";
                    monthInt = 5;
                    break;
                case "شهریور":
                    monthNumber = "06";
                    monthInt = 6;
                    break;
                case "مهر":
                    monthNumber = "07";
                    monthInt = 7;
                    break;
                case "آبان":
                    monthNumber = "08";
                    monthInt = 8;
                    break;
                case "آذر":
                    monthNumber = "09";
                    monthInt = 9;
                    break;
                case "دی":
                    monthNumber = "10";
                    monthInt = 10;
                    break;
                case "بهمن":
                    monthNumber = "11";
                    monthInt = 11;
                    break;
                case "اسفند":
                    monthNumber = "12";
                    monthInt = 12;
                    break;
            }
            // Function to update the days array based on the selected month and year
            var daysInMonth; // Determine the number of days in the selected month
            var daysInPrevMonth; // Determine the number of days in the previous selected month
            var daysInNextMonth; // Determine the number of days in the next selected month
            var currentMonthIndex = convertMonthNameToNumber(currentMonth) - 1;
            var todayMonthName = monthNames[jalaliToday.jm - 1]; // access to name of month today
            var todayYear = jalaliToday.jy; // access to number of year today
            var todayActionSpan = document.querySelector(".todayAction"); // access to element span today
            var prevCurrentMonth; //value of previous month
            var prevCurrentYear; // value of previous year
            var nextCurrentMonth; // value of next month
            var nextCurrentYear; // value of next year
            switch (currentMonth) {
                //use this switch case fir find previous and next month number and year number by changing month on calendar
                case "فروردین":
                    prevCurrentMonth = 12;
                    prevCurrentYear = currentYear - 1;
                    nextCurrentMonth = 2;
                    nextCurrentYear = currentYear;
                    break;
                case "اردیبهشت":
                    prevCurrentMonth = 1;
                    prevCurrentYear = currentYear;
                    nextCurrentMonth = 3;
                    nextCurrentYear = currentYear;
                    break;
                case "خرداد":
                    prevCurrentMonth = 2;
                    prevCurrentYear = currentYear;
                    nextCurrentMonth = 4;
                    nextCurrentYear = currentYear;
                    break;
                case "تیر":
                    prevCurrentYear = currentYear;
                    prevCurrentMonth = 3;
                    nextCurrentMonth = 5;
                    nextCurrentYear = currentYear;
                    break;
                case "مرداد":
                    prevCurrentYear = currentYear;
                    prevCurrentMonth = 4;
                    nextCurrentMonth = 6;
                    nextCurrentYear = currentYear;
                    break;
                case "شهریور":
                    prevCurrentYear = currentYear;
                    prevCurrentMonth = 5;
                    nextCurrentMonth = 7;
                    nextCurrentYear = currentYear;
                    break;
                case "مهر":
                    prevCurrentYear = currentYear;
                    prevCurrentMonth = 6;
                    nextCurrentMonth = 8;
                    nextCurrentYear = currentYear;
                    break;
                case "آبان":
                    prevCurrentYear = currentYear;
                    prevCurrentMonth = 7;
                    nextCurrentMonth = 9;
                    nextCurrentYear = currentYear;
                    break;
                case "آذر":
                    prevCurrentYear = currentYear;
                    prevCurrentMonth = 8;
                    nextCurrentMonth = 10;
                    nextCurrentYear = currentYear;
                    break;
                case "دی":
                    prevCurrentYear = currentYear;
                    prevCurrentMonth = 9;
                    nextCurrentMonth = 11;
                    nextCurrentYear = currentYear;
                    break;
                case "بهمن":
                    prevCurrentYear = currentYear;
                    prevCurrentMonth = 10;
                    nextCurrentMonth = 12;
                    nextCurrentYear = currentYear;
                    break;
                case "اسفند":
                    prevCurrentYear = currentYear;
                    prevCurrentMonth = 11;
                    nextCurrentMonth = 1;
                    nextCurrentYear = currentYear + 1;
                    break;
            }
            if (currentMonth === todayMonthName && currentYear === todayYear) {
                todayActionSpan.style.visibility = "hidden"; // Hide the span
            } else {
                todayActionSpan.style.visibility = "visible"; // Show the span
            }
            if (prevCurrentMonth < 7) {
                daysInPrevMonth = 31;
            } else if (prevCurrentMonth < 12) {
                daysInPrevMonth = 30;
            } else {
                // Esfand
                if (
                    prevCurrentYear % 33 === 1 ||
                    prevCurrentYear % 33 === 5 ||
                    prevCurrentYear % 33 === 9 ||
                    prevCurrentYear % 33 === 13 ||
                    prevCurrentYear % 33 === 17 ||
                    prevCurrentYear % 33 === 22 ||
                    prevCurrentYear % 33 === 26 ||
                    prevCurrentYear % 33 === 30
                ) {
                    // Kabis year
                    daysInPrevMonth = 30;
                } else {
                    daysInPrevMonth = 29;
                }
            }
            if (nextCurrentMonth < 7) {
                daysInNextMonth = 31;
            } else if (nextCurrentMonth < 12) {
                daysInNextMonth = 30;
            } else {
                // Esfand
                if (
                    nextCurrentYear % 33 === 1 ||
                    nextCurrentYear % 33 === 5 ||
                    nextCurrentYear % 33 === 9 ||
                    nextCurrentYear % 33 === 13 ||
                    nextCurrentYear % 33 === 17 ||
                    nextCurrentYear % 33 === 22 ||
                    nextCurrentYear % 33 === 26 ||
                    nextCurrentYear % 33 === 30
                ) {
                    // Kabis year
                    daysInNextMonth = 30;
                } else {
                    daysInNextMonth = 29;
                }
            }
            if (currentMonthIndex < 6) {
                // Farvardin to Shahrivar: 31 days
                daysInMonth = 31;
            } else if (currentMonthIndex < 11) {
                // Mehr to Bahman: 30 days
                daysInMonth = 30;
            } else {
                // Esfand
                if (
                    currentYear % 33 === 1 ||
                    currentYear % 33 === 5 ||
                    currentYear % 33 === 9 ||
                    currentYear % 33 === 13 ||
                    currentYear % 33 === 17 ||
                    currentYear % 33 === 22 ||
                    currentYear % 33 === 26 ||
                    currentYear % 33 === 30
                ) {
                    // Kabis year
                    daysInMonth = 30;
                } else {
                    daysInMonth = 29;
                }
            }
            var days = []; // Populate the days array with objects containing day number and day of the week
            for (var i = 1; i <= daysInMonth; i++) {
                // Get the day of the week for each day
                var jy = currentYear;
                var jm = currentMonthIndex + 1; // Add 1 to the month index to match the Jalaali month format
                var jd = i;
                var dayOfWeek = getDayOfWeek(jy, jm, jd);
                days.push({ day: i, dayOfWeek: dayOfWeek }); // Push an object containing day number and day of the week to the days array
            }
            var prevDays = []; // Populate the days array with objects containing day number and day of the week of previous month
            for (var p = 1; p <= daysInPrevMonth; p++) {
                var jyp = currentYear;
                var jmp = currentMonthIndex;
                if (jmp === 0) {
                    jmp = 12;
                    jyp -= 1;
                }
                var jdp = p;
                var dayOfWeekP = getDayOfWeek(jyp, jmp, jdp);
                prevDays.push({ pd: p, dayOfWeekP: dayOfWeekP });
            }
            var nextDays = []; // Populate the days array with objects containing day number and day of the week of next month
            for (var n = 1; n <= daysInNextMonth; n++) {
                var jyn = currentYear;
                var jmn = currentMonthIndex + 2;
                if (jmn === 13) {
                    jmn = 1;
                    jyn += 1;
                }
                var jdn = n;
                var dayOfWeekN = getDayOfWeek(jyn, jmn, jdn);
                nextDays.push({ nd: n, dayOfWeekN: dayOfWeekN });
            }
            var firstDayOfWeek = days[0].dayOfWeek; // Determine the offset for the first day of the month
            var startingIndex = (firstDayOfWeek + 1) % 7; // Adjust starting index based on the actual day of the week
            var tableBody = document.querySelector("#targetTable tbody"); // Populate the table with the days
            tableBody.innerHTML = ""; // Clear existing table body
            var row = document.createElement("tr"); // define the row of days on table
            var currentDayOfWeek = -1; // Initialize to an invalid value
            for (var j = 0; j < startingIndex; j++) {
                // Create empty cells for days before the first day of the month
                row.appendChild(document.createElement("td")); // append the td of rows on table
            }
            days.forEach(function (dayObject, index) {
                // use this loop for position of days on calendar
                if ((index + startingIndex) % 7 === 0 && currentDayOfWeek !== 6) {
                    // If it's the first Saturday after another day, start a new row
                    tableBody.appendChild(row); // apend the dats on rows
                    row = document.createElement("tr"); // create tr for rows
                }
                var cell = document.createElement("td"); // define column td to push value
                if (
                    currentYear === jalaliToday.jy &&
                    currentMonthIndex + 1 === jalaliToday.jm &&
                    dayObject.day === jalaliToday.jd
                ) {
                    // use this condition for fine the today
                    var span = document.createElement("span"); // create span element
                    span.textContent = dayObject.day; // set span's text content to the day number
                    cell.appendChild(span); // append span to the cell
                } else {
                    cell.textContent = dayObject.day; // access to td to day number
                    if ($('.popupCalendar').length === 0) {
                        if ((currentYear === jalaliToday.jy && monthInt < jalaliToday.jm) || currentYear < jalaliToday.jy) {
                            cell.classList.add('OffDays');
                        }
                    }

                }
                row.appendChild(cell); // apen the columns
                currentDayOfWeek = dayObject.dayOfWeek; // set the correcttl position for days
            });
            if ((currentDayOfWeek + 7) % 7 !== 5) {
                for (var k = currentDayOfWeek - 7; k != 5; k++) {
                    row.appendChild(document.createElement("td")); // create td to fill all days on week, if the last day not be friday , craeted empty td
                }
            }
            tableBody.appendChild(row);
            // Add an event listener to each td element to show a popup when clicked
            var cells = document.querySelectorAll("#targetTable tbody td"); // Select all td elements in the table body
            // Initialize a counter for empty cells
            let emptyFirstCellCount = 0;
            let emptyLastCellCount = 0;
            // Log the content of the first 7 cells and count empty cells
            for (let i = 0; i < cells.length && i < 7; i++) {
                if (cells[i].textContent.trim() === "") {
                    emptyFirstCellCount++; // showed count of empty cells
                }
            }
            // Log the last emptyFirstCellCount values of prevDays
            var lastPrevDays = prevDays.slice(-emptyFirstCellCount);
            let lastRowCells = document.querySelectorAll(
                "#targetTable tbody tr:last-child td"
            ); // access to last cells empty of calendar
            // Append the values of prevDays to the empty cells at the beginning of the table
            for (let i = 0; i < emptyFirstCellCount; i++) {
                cells[i].textContent = lastPrevDays[i].pd;
                cells[i].classList.add('OffDays');
            }
            // Get the first emptyLastCellCount values of nextDays
            for (let i = 0; i < lastRowCells.length && i < 7; i++) {
                if (lastRowCells[i].textContent.trim() === "") {
                    emptyLastCellCount++; // showed count of empty cells
                }
            }
            let firstNextDays = nextDays.slice(0, emptyLastCellCount);
            // Append the values of firstNextDays to the empty cells in lastRowCells
            let firstNextDaysIndex = 0;
            for (let i = 0; i < lastRowCells.length; i++) {
                if (lastRowCells[i].textContent.trim() === "") {
                    if (firstNextDaysIndex < firstNextDays.length) {
                        lastRowCells[i].textContent = firstNextDays[firstNextDaysIndex].nd; // or any other property you want to display
                        lastRowCells[i].classList.add('OffDays');
                        firstNextDaysIndex++;
                    } else {
                        break; // Exit if there are no more days to fill
                    }
                }
            }
            $('#targetTable td').each(function () {
                if ($(this).text().trim() === '') {
                    $(this).css('display', 'none');
                }
            });
            cells.forEach(function (cell) {
                var $cell = $(cell); // Convert cell to jQuery object
                var selectedClass = 'selectedDay';
                var offDaysClass = 'OffDays';
                var cellValue = parseInt($cell.text().trim());
                selectedCells.forEach(function (date) {
                    var parts = date.split('/');
                    var yyyy = parseInt(parts[0]);
                    var mm = parseInt(parts[1]);
                    var dd = parseInt(parts[2]);
                    // Now use $cell for jQuery methods
                    if ((yyyy === currentYear && mm === monthInt && dd === cellValue) && (!$cell.hasClass(offDaysClass)) && ($('.popupCalendar').length === 0)) {
                        $cell.addClass(selectedClass);
                    }
                });
            });

            $('#targetTable td').on('click', function (event) {
                // Check if the #targetTable is within .popupCalendar
                if ($(this).closest('.popupCalendar').length === 1) {
                    return; // Exit if the table is not within a popupCalendar
                }
                // Define the CSS class
                var selectedClass = 'selectedDay';
                var offDaysClass = 'OffDays';
                var lockDayClass = 'locked-day';
                var cell = $(this);
                // Get the text content of the cell, including text from child elements like <span>
                var cellValue = cell.text().trim();
                // Extract only the numeric part from cellValue
                var numericValue = cellValue.match(/\d+/); // Regular expression to find numeric values
                if (numericValue !== null) { // Check if there is a numeric value
                    if (!$(this).hasClass('OffDays') && !$(this).hasClass('locked-day')) {
                        var dayValue = parseInt(numericValue[0]);
                        var dateString = `${currentYear}/${monthInt}/${dayValue}`;
                        if (event.shiftKey) {
                            // Clear all previous selections
                            var largestDate = getLargestDateForMonth(selectedCells, currentYear, monthInt);
                            selectedCells = []; // Empty the array
                            $('#targetTable td').removeClass(selectedClass);
                            // Parse the largestDate and the current clicked date
                            var partsLargest = largestDate.split('/');
                            var partsClicked = dateString.split('/');
                            var dayLargest = parseInt(partsLargest[2]);
                            var dayClicked = parseInt(partsClicked[2]);

                            // Determine the start and end of the range
                            var start = Math.min(dayLargest, dayClicked);
                            var end = Math.max(dayLargest, dayClicked);

                            // Loop through the range and add all days between to selectedCells
                            for (var day = start; day <= end; day++) {
                                var newDateString = `${currentYear}/${monthInt}/${day}`; // Create the date string
                                selectedCells.push(newDateString); // Add the date to the array
                            }
                            selectedCells.forEach(function (dateStr) {
                                var day = parseInt(dateStr.split('/')[2]);
                                $('#targetTable td').filter(function () {
                                    // Get only the text nodes (the number of the day)
                                    var cellText = $(this).text().trim();
                                    // Check if the day matches and the <td> does not have the 'OffDays' or 'locked-day' classes
                                    return cellText === day.toString() && !$(this).hasClass('OffDays') && !$(this).hasClass('locked-day');
                                }).addClass(selectedClass);
                            });
                        }
                        else {
                            if (cell.hasClass(selectedClass)) {
                                // If the cell is already selected, remove the class and pop the value from selectedCells
                                cell.removeClass(selectedClass);
                                selectedCells = selectedCells.filter(item => item !== dateString);
                            } else {
                                // If the cell is not selected, add the class and push the value to selectedCells
                                cell.addClass(selectedClass);
                                selectedCells.push(dateString);
                            }
                        }

                    }
                }
            });
        }
        //#endregion

        //#region functions

        function getLargestDateForMonth(selectedCells, year, monthInt) {
            // Filter the selectedCells array to only include dates from the given year and month
            var filteredCells = selectedCells.filter(function (date) {
                var parts = date.split('/');
                var yyyy = parseInt(parts[0]);
                var mm = parseInt(parts[1]);
                return yyyy === year && mm === monthInt; // Check if the year and month match
            });

            // Find the largest day in the filtered array
            if (filteredCells.length === 0) return null; // No matching dates found

            var largestDate = filteredCells.reduce(function (maxDate, date) {
                var currentDate = date.split('/');
                var dayValue = parseInt(currentDate[2]); // Get the day value
                var maxDayValue = parseInt(maxDate.split('/')[2]); // Get the max day value
                return dayValue > maxDayValue ? date : maxDate; // Return the larger of the current max or the new date
            });

            // Return the largest date
            return largestDate;
        }

        function getDaysBetween(startDate, endDate) {
            var selectedCells = [];
            var start = new Date(startDate);
            var end = new Date(endDate);

            if (start > end) {
                alert('End date must be after start date.');
                return [];
            }

            // Convert dates to local timezone for consistency
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            // Loop through all dates from start to end
            for (var d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                var yyyy = d.getFullYear();
                var mm = ('0' + (d.getMonth() + 1)).slice(-2); // Ensure month is 2 digits
                var dd = ('0' + d.getDate()).slice(-2); // Ensure day is 2 digits
                var formattedDate = `${yyyy}/${mm}/${dd}`;
                selectedCells.push(formattedDate);
            }

            return selectedCells;
        }

        //#endregion

        //#region today action button
        // Function to set current year and month to today's date
        function setCurrentDate() {
            var monthName = monthNames[jalaliToday.jm - 1]; // get name of today month
            // Update currentYear and currentMonth elements with today's values
            $("#currentYear").text(jalaliToday.jy);
            $("#currentMonth").text(monthName);
            // Update the days array
            updateDaysArray();
        }
        // Event listener for the "today" span element
        $(".todayAction").click(function () {
            setCurrentDate();
        });
        //#endregion

        //#region go button
        $(".go").click(function () {
            // when click on the برو span
            var enteredDate = $("#datePicker").val(); // Get the value of the input field
            var parts = enteredDate.split("/"); // Split the date into parts
            var year = parseInt(parts[0]); // Extract the year
            var monthIndex = parseInt(parts[1]) - 1; // Extract the month and convert to 0-based index
            var day = parseInt(parts[2]); // Extract the day
            // Check if the entered date has three parts (yyyy/mm/dd)
            if (parts.length !== 3) {
                showError();
                return;
            } // if the format of input not be yyyy/mm/dd
            // Check if year, month, and day are integers and within valid ranges
            if (
                isNaN(year) ||
                isNaN(monthIndex) ||
                isNaN(day) ||
                !/^\d+$/.test(parts[0]) ||
                !/^\d+$/.test(parts[1]) ||
                !/^\d+$/.test(parts[2]) ||
                year <= 0 ||
                monthIndex < 0 ||
                monthIndex > 11 ||
                day <= 0 ||
                day > 31
            ) {
                showError();
                return;
            } // the input values included any charaters instead of integer numbers
            var monthNames = [
                "فروردین",
                "اردیبهشت",
                "خرداد",
                "تیر",
                "مرداد",
                "شهریور",
                "مهر",
                "آبان",
                "آذر",
                "دی",
                "بهمن",
                "اسفند",
            ]; // Array of month names
            // Validate the entered date
            if (isValidJalaaliDate(year, monthIndex + 1, day)) {
                // monthIndex is 0-based, so add 1
                document.getElementById("currentYear").textContent = year; // Update the currentYear element
                document.getElementById("currentMonth").textContent =
                    monthNames[monthIndex]; // Update the currentMonth element
                document.querySelector(".errorInput").style.display = "none"; // Clear any existing error message
                updateDaysArray(); // Update the days array
            } else {
                showError(); // if the date not valid on jalaali date
            }
        });
        function showError() {
            document.querySelector(".errorInput").style.display = "block";
        }
        //#endregion

        //#region close and open popups listeners

        // Optional: Add a way to close the popup and overlay when clicking on the overlay
        document.querySelector(".overlay8").addEventListener("click", function () {
            this.style.display = "none";
            document.querySelector(".popupSelectDays").style.display = "none";
        });

        // Optional: Event listener for the close button inside the popup
        $('.popupSelectDays .btnCloseFormSelectDay').on('click', function () {
            // Hide the overlay and popup when the close button is clicked
            $('.overlay8').css('display', 'none');
            $('.popupSelectDays').css('display', 'none');
        });

        // Event listener for the selectCellSpan click
        $('.selectCellSpan').on('click', function () {
            // Show the overlay and popup
            $('.overlay8').css('display', 'block');
            $('.popupSelectDays').css('display', 'flex'); // Using 'flex' since the popup is flexbox-based
        });

        //#endregion

        //#region date picker
        jalaliDatepicker.startWatch({
            minDate: "attr",
            maxDate: "attr",
        }); // showed the date picker and dates of that
        //#endregion

        //#region selectDayForm

        var initialValues = {
            startDate: $('#selectDayStart').val(),
            endDate: $('#selectDayEnd').val(),
            isThursdayChecked: $('#thursdayCheckbox').is(':checked'),
            isFridayChecked: $('#fridayCheckbox').is(':checked')
        };

        function storeInitialValues() {
            initialValues.startDate = $('#selectDayStart').val();
            initialValues.endDate = $('#selectDayEnd').val();
            initialValues.isThursdayChecked = $('#thursdayCheckbox').is(':checked');
            initialValues.isFridayChecked = $('#fridayCheckbox').is(':checked');
        }

        // Set the first day of the current Jalaali year as the default value for selectDayStart
        var firstDayOfJalaaliYear = jalaliToday.jy + '/01/01';
        $('#selectDayStart').val(firstDayOfJalaaliYear);

        var lastDayOfJalaaliYear;
        if (isValidJalaaliDate(jalaliToday.jy, '12', '30')) {
            lastDayOfJalaaliYear = jalaliToday.jy.toString() + "/12/30";
        }
        else {
            lastDayOfJalaaliYear = jalaliToday.jy.toString() + "/12/29";
        }

        $('#selectDayEnd').val(lastDayOfJalaaliYear);

        $('#selectDaySubmit').click(function () {

            selectedCells = [];
            var weekDaySelectedDay = [];
            var checkedSelected = []
            // Get start and end dates
            var startDate = $('#selectDayStart').val();
            var endDate = $('#selectDayEnd').val();

            // Convert dates to format yyyy/mm/dd
            if (startDate && endDate) {
                checkedSelected = getDaysBetween(startDate, endDate);
                // Process each selected cell to determine the day of the week
                weekDaySelectedDay = checkedSelected.map(function (date) {
                    // Assuming date is in yyyy/mm/dd format; modify as necessary
                    var parts = date.split('/'); // Split date into components
                    var year = parseInt(parts[0], 10);
                    var month = parseInt(parts[1], 10);
                    var day = parseInt(parts[2], 10);

                    return getDayOfWeek(year, month, day);
                });
                // Check if checkboxes for Thursday (پنجشنبه) or Friday (جمعه) are checked
                var isThursdayChecked = $('#thursdayCheckbox').is(':checked');
                var isFridayChecked = $('#fridayCheckbox').is(':checked');

                // Loop through the array and filter by day of the week
                for (var i = 0; i < weekDaySelectedDay.length; i++) {
                    if ((isThursdayChecked && weekDaySelectedDay[i] === 4) ||
                        (isFridayChecked && weekDaySelectedDay[i] === 5)) {
                        selectedCells.push(checkedSelected[i]); // Push date if it's Thursday or Friday
                    }
                }
                updateDaysArray();
                $('.overlay8').css('display', 'none');
                $('.popupSelectDays').css('display', 'none');

                // After successful submission, store the new initial values
                storeInitialValues();

            }
        });

        //#endregion
        //#region deletedSelectedDays
        $('.deletedSelectedDays').click(function () {
            let currentMonthSelected = convertMonthNameToNumber($('#currentMonth').text());
            let currentYearSelected = parseInt($('#currentYear').text());
            // Filter the selectedCells array to remove dates with the matching year and month
            selectedCells = selectedCells.filter(date => {
                const [year, month] = date.split('/').map(Number); // Split and convert to numbers
                return !(year === currentYearSelected && month === currentMonthSelected); // Keep only non-matching dates
            });
            // Loop through each cell in the table and remove 'selectedDay' class if it exists
            $('#targetTable tbody tr td').each(function () {
                var cell = $(this);
                if (cell.hasClass('selectedDay')) {
                    cell.removeClass('selectedDay');
                }
            });
        });
        //#endregion

    });
}

//#region convertors

function getDayOfWeek(jy, jm, jd) {
    var jdn = j2d(jy, jm, jd); // Convert the Jalaali date to Julian Day number
    return mod(jdn + 1, 7); // Calculate the day of the week (0 = Saturday, 1 = Sunday, ..., 6 = Friday)
}

function minutesToTime(minutes) {
    var hours = Math.floor(minutes / 60);
    var mins = minutes % 60;
    // Pad single digit minutes with a leading zero
    return (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins;
}

function convertMonthNameToNumber(monthName) {
    switch (monthName) {
        case 'فروردین':
            return 1;
            break;
        case 'اردیبهشت':
            return 2;
            break;
        case 'خرداد':
            return 3;
            break;
        case 'تیر':
            return 4;
            break;
        case 'مرداد':
            return 5;
            break;
        case 'شهریور':
            return 6;
            break;
        case 'مهر':
            return 7;
            break;
        case 'آبان':
            return 8;
            break;
        case 'آذر':
            return 9;
            break;
        case 'دی':
            return 10;
            break;
        case 'بهمن':
            return 11;
            break;
        case 'اسفند':
            return 12;
            break;
    }
}

function monthNumberToLabel(jMonth) {
    switch (jMonth) {
        case 1:
            return 'فروردین';
            break;
        case 2:
            return 'اردیبهشت';
            break;
        case 3:
            return 'خرداد';
            break;
        case 4:
            return 'تیر';
            break;
        case 5:
            return 'مرداد';
            break;
        case 6:
            return 'شهریور';
            break;
        case 7:
            return 'مهر';
            break;
        case 8:
            return 'آبان';
            break;
        case 9:
            return 'آذر';
            break;
        case 10:
            return 'دی';
            break;
        case 11:
            return 'بهمن';
            break;
        case 12:
            return 'اسفند';
            break;
    }
}

function timeToMinutes(time) {
    var parts = time.split(':');
    var hours = parseInt(parts[0], 10);
    var minutes = parseInt(parts[1], 10);
    return (hours * 60) + minutes;
}

//#endregion

//#region performance calendar

var startDate;

var endDate;

function updateMonthName() {

    const monthNameElement = document.getElementById('month-name');
    if (monthNameElement) {
        monthNameElement.textContent = monthNumberToLabel(parseInt(currentMonthGadget));
    }
}

function updateYearNumber() {

    const yearNumberElement = document.getElementById('year-number');
    if (yearNumberElement) {

        yearNumberElement.textContent = currentYearGadget;
    }
}

function findStartAndEndDaysOfMonth() {
    var monthNumberCurrent = parseInt(currentMonthGadget);
    var yearNumberCurrent = parseInt(currentYearGadget);
    var firstDayOfMonth = toGregorian(yearNumberCurrent, monthNumberCurrent, 1);
    var lastDayOfMonth;
    if (monthNumberCurrent < 7) {
        lastDayOfMonth = toGregorian(yearNumberCurrent, monthNumberCurrent, 31)
    }
    else if (monthNumberCurrent < 12) {
        lastDayOfMonth = toGregorian(yearNumberCurrent, monthNumberCurrent, 30)
    }
    else {
        if (isValidJalaaliDate(yearNumberCurrent, 12, 30)) {
            lastDayOfMonth = toGregorian(yearNumberCurrent, monthNumberCurrent, 30)
        }
        else {
            lastDayOfMonth = toGregorian(yearNumberCurrent, monthNumberCurrent, 29)
        }
    }
    startDate = new Date(firstDayOfMonth.gy, firstDayOfMonth.gm - 1, firstDayOfMonth.gd);
    endDate = new Date(lastDayOfMonth.gy, lastDayOfMonth.gm - 1, lastDayOfMonth.gd);
}

function openCalendar() {
    var monthName = $('#month-name').text();
    var yearNumber = $('#year-number').text();
    // Create a popup element with the required HTML structure
    var popup = $('<div class="popupCalendar">' +
        '<input style="display:none;" id="datePicker" /><span style="display:none !important" class="todayAction"></span>' +
        '<span style="display:none !important" id="nextMonth"></span><span style="display:none !important" id="prevMonth"></span>' +
        '<span style="display:none !important" id="currentMonth"></span><span style="display:none !important" id="currentYear"></span>' +
        '<div style="display:none !important" class="overlay8"></div>' +
        '<div class="calendarContainer">' +
        '<div class="headerCalendarTable">' +
        '<span class="closePopupCalendar"><i class="fa fa-times fa-solid closeClaendar"></i></span>' +
        '<div class="monthYearHeader">' +
        '            <div class="row titleCalendar">' +
        '                <span><h4 class="WidthMaxContent m-1" id="currentMonthTable">' + monthName + '</h4></span>' +
        '                <span><h4 class="WidthMaxContent" style="margin:5px !important;" id="currentYearTable">' + yearNumber + '</h4></span>' +
        '            </div>' +
        '</div>' +
        '<span class="gadgetLabel">' + titleLabel + '</span>' +
        '    </div>' +
        '    <div class="WeekDays">' +
        '        <table id="targetTable">' +
        '            <thead>' +
        '                <tr class="weekdays-row">' +
        '                    <th>شنبه</th>' +
        '                    <th>یکشنبه</th>' +
        '                    <th>دوشنبه</th>' +
        '                    <th>سه شنبه</th>' +
        '                    <th>چهارشنبه</th>' +
        '                    <th>پنجشنبه</th>' +
        '                    <th>جمعه</th>' +
        '                </tr>' +
        '            </thead>' +
        '            <tbody></tbody>' +
        '        </table>' +
        '    </div>' +
        '<div class="overlayPopupFormUserTrack"></div><div id="popupFormUserTrack">' +
        '<div class="formUserTrackHeader"><span class="titleFormUserTrackHeader"></span><span class="dateFormUserTrackHeader"></span>' +
        '<span class="closeformUserTrack"><i class="fa fa-solid fa-times"></i></span></div>' +
        '<div class="bodyFormUserTrack"></div>' +
        '</div>' +
        '</div>' +
        '<div class="overlayUserTracksPopup"></div><div id="userTracksPopup">' +
        '<div class="headerUserTracksPopup"><span class="titlePopupUserTracks"></span><span class="datePopupUserTracks"></span>' +
        '<span class="closeUserTracksPopup"><i class="fa fa-solid fa-times"></i></span></div>' +
        '<div class="bodyUserTrackPopup"></div>' +
        '</div>' +
        '<div class="popupEnterNewTrack"><div class="headerPopupNewTrack">' +
        '<span class="titlePopupNewTrack"></span><span class="datePopupNewTrack"></span>' +
        '<span class="closeNewEventPopup"><i class="fa fa-solid fa-times"></i></span></div>' +
        '<div class="bodyNewTrackForm"><div><label>زمان</label><input id="timeTrackEvent" type="time"/></div><div>' +
        '<label>توضیحات</label><textarea></textarea></div><button id="submitManualTrack" class="btn-app">ثبت</button></div></div><div class="overlayNewTrackForm"></div></div>' +
        '</div>'
    );

    var overlay = '<div style="display:block" class="overlayTable"></div>';
    // Append the popup to the body
    $('body').append(overlay);
    $('body').append(popup);

    initCalendar();

    var dailyPerformance = new aData(1215053, null, 0, '');
    var listDataDailyPerformance = dailyPerformance.getList();
    if (titleClicked) {
        listDataDailyPerformance = listDataDailyPerformance.filter(item => item[titleClicked] !== '');
        findStartAndEndDaysOfMonth();
        // Filter based on the Date being between startDate and endDate
        listDataDailyPerformance = listDataDailyPerformance.filter(item => {
            var dateData = new Date(item.Date); // Convert item.Date to a Date object
            return dateData >= startDate && dateData <= endDate;
        });
        listDataDailyPerformance.forEach(item => {
            var dateData = item.Date;
            var oDateData = new Date(dateData);
            var jDateData = toJalaali(oDateData.getFullYear(), oDateData.getMonth() + 1, oDateData.getDate());
            var jDayItem = jDateData.jd;
            var itemValue = minutesToTime(item[titleClicked]);
            var hasIssues = item.HasIssues;
            // Loop through each td in the #targetTable tbody
            $('#targetTable tbody tr td').each(function () {
                var cellText = $(this).text().trim(); // Get the text inside the td and trim any extra spaces
                //#region
                // Check if the text matches jDateData.jd
                //if (dayFormatData.includes(titleClicked) && cellText === jDayItem.toString() && !$(this).hasClass('OffDays') && item[titleClicked] === "1") {
                //    $(this).append('<i style="font-size: large;" class="fa fa-check performanceValue ' + titleClicked + '"></i>');
                //}
                //else if (!$(this).hasClass('OffDays') && cellText === jDayItem.toString()) {
                // Append a span with the class 'performanceValue' and the associatedData as content
                //$(this).append('<span id="DailyWorkingTimeID-' + item.DailyWorkingTimeID + '" class="performanceValue '
                //    + titleClicked + ' borderItemValue">' + itemValue + '</span>');
                //if ($('#targetTable #DailyWorkingTimeID-' + item.DailyWorkingTimeID).text() === "00:00")
                //{ $('#targetTable #DailyWorkingTimeID-' + item.DailyWorkingTimeID).css('display', 'none'); }
                //else { $('#targetTable #DailyWorkingTimeID-' + item.DailyWorkingTimeID).css('display', 'inline-block'); }
                //if (titleClicked === 'Val021' && $('#targetTable .Val021').length > 0) {
                //    $(this).on('click', function () {

                //        var userTrackPerformance = new aData(1215054, null, 0, '');
                //        var listDataUserTrackPerformance = userTrackPerformance.getList();
                //        var monthNumberSelectedDay = convertMonthNameToNumber(monthName);
                //        var dateFormSelectedDay = yearNumber + '/' + monthNumberSelectedDay + '/' + cellText;
                //        var dateFormGregorian = toGregorian(parseInt(yearNumber), monthNumberSelectedDay, parseInt(cellText));
                //        var dateFormObject = new Date(dateFormGregorian.gy, dateFormGregorian.gm - 1, dateFormGregorian.gd);
                //        var options = ['', 'هواخوری', 'فوتبال دستی', 'مرخصی'];
                //        $('.dateFormUserTrackHeader').text(dateFormSelectedDay);
                //        $('.titleFormUserTrackHeader').text('خروج غیر مجاز');
                //        // Clear the bodyFormUserTrack content
                //        $('.bodyFormUserTrack').empty();
                //        // Start creating the table structure
                //        var table = '<div><table><thead><tr><th>ردیف</th><th>ساعت خروج</th><th>ساعت برگشت</th><th>تعیین وضعیت</th></tr></thead><tbody>';
                //        var showPopup = false;
                //        // Loop through listDataUserTrackPerformance and populate the table rows
                //        listDataUserTrackPerformance.forEach(function (userTrack, index) {
                //            var itemDateObject = new Date(userTrack.Date);
                //            // Check if the date matches the selected day
                //            if (itemDateObject.getTime() === dateFormObject.getTime() && userTrack.TrackType === 'Exit') {
                //                showPopup = true;
                //                table += '<tr>';
                //                table += '<td>' + (index + 1) + '</td>'; // First column: index (starts from 1)
                //                table += '<td>' + minutesToTime(userTrack.Time1) + '</td>'; // Second column: Time1
                //                table += '<td>' + minutesToTime(userTrack.Time2) + '</td>'; // Third column: Time2
                //                table += '<td><select>'; // Fourth column: select dropdown

                //                // Loop through the options array and append each option to the select element
                //                options.forEach(function (option) {
                //                    table += '<option value="' + option + '">' + option + '</option>';
                //                });
                //                table += '</select></td></tr>'; // Close the row
                //            }
                //        });
                //        if (showPopup) {
                //            // Close the table structure
                //            table += '</tbody></table></div>';
                //            // Append the two static labels to the bodyFormUserTrack
                //            $('.bodyFormUserTrack').append(table);
                //            // Show the popup Form Exit UserTrack  when the day is clicked
                //            $('#popupFormUserTrack').show();
                //            $('.overlayPopupFormUserTrack').show();
                //            $('#popupFormUserTrack').append('<button class="saveUserTrackPerformance">ثبت</button>');
                //        }
                //        $('.saveUserTrackPerformance').on('click', function () {
                //            // Flag to track if there is an error
                //            var hasError = false;
                //            // Check each select element for empty value
                //            $('.bodyFormUserTrack select').each(function () {
                //                if ($(this).val() === '') {
                //                    hasError = true; // Set the flag to true if an empty value is found
                //                    $(this).css('border', '1px solid red'); // Optionally highlight the select box
                //                } else {
                //                    $(this).css('border', ''); // Reset the border if the value is not empty
                //                }
                //            });
                //            if (!hasError) {
                //                $('.bodyFormUserTrack tbody tr').each(function () {
                //                    var time1 = $(this).find('td').eq(1).text();
                //                    var time2 = $(this).find('td').eq(2).text();
                //                    var trackType = $(this).find('select').val();
                //                    var dateTrack = dateFormGregorian.gy + '-' + dateFormGregorian.gm + '-' + dateFormGregorian.gd;

                //                    // Send the data for each row to the server via AJAX
                //                    $.ajax({
                //                        type: 'POST',
                //                        url: 'App_Sys/Services/EditActivity.asmx/UpdateTrackType',
                //                        data: JSON.stringify({
                //                            time1: timeToMinutes(time1),
                //                            time2: timeToMinutes(time2),
                //                            date: dateTrack,
                //                            trackType: trackType,
                //                            dailyWorkingTimeID: item.DailyWorkingTimeID,
                //                            year: parseInt(yearNumber),
                //                            month: monthNumberSelectedDay
                //                        }),
                //                        contentType: 'application/json; charset=utf-8',
                //                        dataType: 'json',
                //                        success: function (response) {
                //                            $('#DailyWorkingTimeID-' + item.DailyWorkingTimeID).remove();
                //                            //hanlde this render and trigger for reloading monthly performance
                //                            renderPage('#page-cell-1000605', 1001002, 0);
                //                            $('.togglePerformance').trigger('click');
                //                        },
                //                        error: function (xhr, status, error) {
                //                            console.error(error);
                //                        }
                //                    });
                //                });
                //                // If no error, proceed to hide the popup and remove elements
                //                $('.overlayPopupFormUserTrack').hide();
                //                $('#popupFormUserTrack').hide();
                //                $('.saveUserTrackPerformance').remove();
                //            }
                //        });
                //    });
                //    // Attach click event to close the popup and overlay
                //    $('.closeformUserTrack').on('click', function () {
                //        $('.overlayPopupFormUserTrack').hide();
                //        $('#popupFormUserTrack').hide();
                //        $('.saveUserTrackPerformance').remove();
                //    });
                //}
                //}
                //#endregion
                if (hasIssues === "True" && !$(this).hasClass('OffDays') && cellText === jDayItem.toString()) {
                    $(this).append('<span id="DailyWorkingTimeID-' + item.DailyWorkingTimeID
                        + '-WithError" class="hasErrorDay"><i class="fa fa-solid fa-exclamation-triangle"></i></span>');
                }
            });
        });

        $('#targetTable tbody tr td').each(function () {
            var cellText = $(this).text().trim(); // Get the text inside the td and trim any extra spaces
            if (!$(this).hasClass('OffDays')) {
                $(this).on('click', function (e) {
                    var gDate = toGregorian(parseInt(yearNumber), convertMonthNameToNumber(monthName), parseInt(cellText));
                    var dateUserTrack = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
                    $(".overlayUserTracksPopup").show();
                    $("#userTracksPopup").show();
                    $(".titlePopupUserTracks").text('ورود و خروج');
                    var monthNumberSelectedDay = convertMonthNameToNumber(monthName);
                    var dateFormSelectedDay = yearNumber + '/' + monthNumberSelectedDay + '/' + cellText;
                    $(".datePopupUserTracks").text(dateFormSelectedDay);
                    $(".bodyUserTrackPopup").empty();
                    loadUserTracks(dateUserTrack)
                    $(document).on('click', '#enterNewTrackForm, #exitNewTrackForm', function () {
                        // Determine which button was clicked and set the title accordingly
                        var isEntering = $(this).is('#enterNewTrackForm');
                        var titleText = isEntering ? 'ورود جدید' : 'خروج جدید';
                        var trackType = isEntering ? 'Entry' : 'Exit';
                        // 5 for custom display of previous split 5 px margin
                        var timeOfPointer = parseFloat($('.divSpanPopupTrackers').css('margin-right')) + 5;
                        var time = Math.ceil(timeOfPointer / 2.361) + 360;

                        $('.overlayNewTrackForm').show();
                        $('.popupEnterNewTrack').show();
                        $('.titlePopupNewTrack').text(titleText);
                        $('.datePopupNewTrack').text(dateFormSelectedDay);
                       
                        //  Add 360 value for hours from 00:00 to 06:00 and devide the timeOfPonter to some value for 12 hours of timeLine
                        $('#timeTrackEvent').val(minutesToTime(time));
                        $('.bodyNewTrackForm').off('click', '#submitManualTrack');

                        $('.bodyNewTrackForm').on('click', '#submitManualTrack', function () {
                            var timeSubmit = timeToMinutes($('#timeTrackEvent').val());
                            $.ajax({
                                type: 'POST',
                                url: 'App_Sys/Services/EditActivity.asmx/AddManualTrack',
                                data: JSON.stringify({
                                    trackType: trackType,
                                    time: timeSubmit,
                                    date: dateUserTrack
                                }),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json',
                                success: function (response) {
                                    $('.overlayNewTrackForm').hide();
                                    $('.popupEnterNewTrack').hide();
                                    $(".bodyUserTrackPopup").empty();
                                    loadUserTracks(dateUserTrack);
                                },
                                error: function (xhr, status, error) {
                                    console.error(error);
                                    alert('An error occurred while adding the track.');
                                }
                            });
                        });
                        $('.closeNewEventPopup').on('click', function () {
                            $('.overlayNewTrackForm').hide();
                            $('.popupEnterNewTrack').hide();
                        });
                    });

                });
            }
            $('.closeUserTracksPopup').on('click', function () {
                $('.overlayUserTracksPopup').hide();
                $('#userTracksPopup').hide();
            });

        });
    }

    // Attach click event to close the popup and overlay
    $('.closePopupCalendar').on('click', function () {
        $('.overlayTable').remove();
        $('.popupCalendar').remove();
    });

}

function loadUserTracks(dateUserTrack) {
    $.ajax({
        type: 'POST',
        url: 'App_Sys/Services/EditActivity.asmx/LoadUserTracks',
        data: JSON.stringify({
            date: dateUserTrack,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            if (response.d != "[]") {
                var timeLineConainer = $('<div class="timeline-container"></div>')
                var timeLine = $('<div class="timelineUserTrack" id="timeline"></div>');
                var step = 1700 / 12; // time line width is 1700px and we have 12 hours on time line
                // set hours from 06:00 to 18:00
                for (var i = 0; i <= 12; i++) {
                    var left = 1700 - (i * step);
                    var hour = $('<span class="hour"></span>').text(i + 6); // started hours of time line with 06:00
                    hour.css('left', left + 'px');
                    timeLine.append(hour);
                }
                timeLineConainer.append(timeLine);
                var spanPopupTrackers = $('<div class="divSpanPopupTrackers"><span id="enterNewTrackForm"' +
                    'class="spanPopupTrackers enterUserTrack">' + '<i class="fa fa-solid fa-arrow-down"></i></span>'
                    + '<span style="margin-right:5px;"  id="exitNewTrackForm" class="spanPopupTrackers exitUserTrack">' +
                    '<i class="fa fa-solid fa-arrow-up"></i></span><span style="margin-right:5px;" id="editNewTrackForm" class="spanPopupTrackers editUserTrack"' +
                    '><i class="fa fa-solid fa-pencil"></i></span></div>');
                timeLine.append(spanPopupTrackers); // new form trackers spans                           
                var responseData = typeof response.d === 'string' ? JSON.parse(response.d) : response.d;
                responseData.forEach(function (track, index) {
                    var trackSpan = "";
                    if (track.TrackType === "Exit" || track.TrackType === "Exit2" || track.TrackType === "AmentityTime") {
                        trackSpan = "red"
                    }
                    else {
                        trackSpan = "green"
                    }
                    var trackAppend;
                    var timeValue = ((track.Time1 - 360) * 2.358);
                    var timeValue2 = ((track.Time2 - 360) * 2.358);
                    var widthValue = timeValue2 - timeValue;
                    switch (trackSpan) {
                        case "green":
                            trackAppend = '<span style="right:' + timeValue + 'px;" class="UserTrack enterUserTrack">' +
                                '<i class="fa fa-solid fa-arrow-down"></i></span>' + '<div style="right:' + timeValue +
                                'px" class="userTrackHover enterUserTrack"><span>' + minutesToTime(track.Time1) + '</span><span>ساعت ورود</span></div>' +
                                '<div class="enterProcessUserTrack" style="height:40px;position:absolute;width:' + (widthValue - 15) + 'px;right:' + (timeValue + 10) +
                                'px;margin-top:-32px;background:transparent !important;"></div><span style="right:' + timeValue + 'px;width:' + widthValue +
                                'px;" class="processUserTrack enterProcessUserTrack">   </span>';
                            break;
                        case "red":
                            trackAppend = '<span style="right:' + timeValue +
                                'px;" class="UserTrack exitUserTrack"><i class="fa fa-solid fa-arrow-up"></i></span>'
                                + '<div style="right:' + timeValue +
                                'px" class="userTrackHover exitUserTrack"><span>' + minutesToTime(track.Time1) + '</span><span>ساعت خروج</span></div>' +
                                '<div class="exitProcessUserTrack" style="height:40px;position:absolute;width:' + (widthValue - 15) + 'px;right:' + (timeValue + 10) +
                                'px;margin-top:-32px;background:transparent !important;"></div><span style="right:' + timeValue + 'px;width:' + widthValue +
                                'px;" class="processUserTrack exitProcessUserTrack">   </span>';;
                            break;
                    }
                    timeLine.append(trackAppend);
                });

                $(document).on('mouseenter', '.UserTrack', function () {
                    $(this).next('.userTrackHover').css({ 'visibility': 'visible', 'opacity': '1' });
                });

                $(document).on('mouseleave', '.UserTrack', function () {
                    $(this).next('.userTrackHover').css({ 'visibility': 'hidden', 'opacity': '0' });
                });

                var timeoutId;

                // Visible spans when hovering on #timeline
                $(document).on('mouseenter', '#timeline', function (e) {

                    var widthOfScreen = $(window).width() - 100;
                    timeoutId = setTimeout(function () {
                        $('.divSpanPopupTrackers').css({
                            'visibility': 'visible',
                            'opacity': '1',
                            'margin-right': (widthOfScreen - e.pageX) - 5 + 'px' // lower 5 px for better display
                        });
                    }, 300);
                });

                // Hide spans when hovering over enterProcessUserTrack or exitProcessUserTrack
                $(document).on('mouseenter', '.enterProcessUserTrack', function (e) {
                    $('#enterNewTrackForm').hide();
                    $('#editNewTrackForm').hide();
                    $('#exitNewTrackForm').show();
                    var widthOfScreen = $(window).width() - 100;
                    $('.divSpanPopupTrackers').stop().animate({
                        'margin-right': (widthOfScreen - e.pageX) - 5 + 'px'
                    }, 300);
                });

                $(document).on('mouseenter', '.exitProcessUserTrack', function (e) {
                    $('#exitNewTrackForm').hide();
                    $('#enterNewTrackForm').show();
                    $('#editNewTrackForm').show();
                    var widthOfScreen = $(window).width() - 100;
                    $('.divSpanPopupTrackers').stop().animate({
                        'margin-right': (widthOfScreen - e.pageX) - 5 + 'px'
                    }, 300);
                });

                // Hide spans when leaving #timeline
                $(document).on('mouseleave', '#timeline', function () {
                    clearTimeout(timeoutId);
                    $('.divSpanPopupTrackers').css({
                        'opacity': '0',
                    });
                    setTimeout(function () {
                        $('.divSpanPopupTrackers').css('visibility', 'hidden');
                        $('#exitNewTrackForm').show();
                        $('#enterNewTrackForm').show();
                        $('#editNewTrackForm').hide();
                    }, 300);
                });

                $(".bodyUserTrackPopup").append(timeLineConainer);
            }
            else {
                var emptyRecords = $('<div class="emptyRecords">هیچ اطلاعاتی جهت نمایش موجود نیست!</div>');
                $(".bodyUserTrackPopup").append(emptyRecords);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


//#endregion

//#region calendar for modal working personals
function calendarView(id, objKey, objType) {

    var _actContextID = id;

    var _contextIndex = -1;

    var _objKey = $.isArray(objKey) ? objKey[0] : objKey;

    var _objType = objType;

    this._renderContext = function (
        renderMode,
        modalID,
        pageElementID,
        defaultSearch
    ) {

        var bodyID = "#box-body-" + pageElementID;

        var boxID = "#page-box-" + pageElementID;

        var footerID = "#box-footer-" + pageElementID;

        if (renderMode == "Modal") {
            bodyID = "#boxBodyModal" + modalID;

            boxID = "#pageBoxModal" + modalID;

            footerID = "#boxFooterModal" + modalID;

            _modalID = modalID;
        }

        let list = [
            {}
        ];

        //load Calnedar
        // Define the HTML content of the calendar
        var calendarHTML = `
           <div class="mainDiv">
      <div class="calendarContainer">
          <div class="headerCalendar col-12">
              <div class="datePicker">
                  <input id="datePicker" data-jdp class="jalaaliDatePicker" />
                  <span class="go" id="goButton">
                    برو      
                    <i class="fa-solid fa-calendar fa iconDatePicker"></i>
                    </span>
                  <span class="text-danger errorInput">تاریخ وارد شده معتبر نیست</span>
                
              </div>
              <div class="monthYearHeader">
                  <div class="row titleCalendar">
                    <span class="buttonApp navigationButton" id="prevMonth">
                      <i class="fa fa-solid fa-angle-right"></i>
                  </span>
                      <span>
                          <h3 id="currentMonth" class="WidthMaxContent m-1"></h3>
                      </span>
                      <span>
                          <h3 id="currentYear" class="WidthMaxContent m-1"></h3>
                      </span>
                       <span class="buttonApp navigationButton" style="padding-top: 7px; padding-bottom: 8px; margin-right: 5px;"
                      id="nextMonth">
                      <i class="fa fa-solid fa-angle-left"></i>
                       </span>
                  </div>
              </div>
              <div class="positionHeaderElements">
                  <span class="border todayAction">
                      <i class="fa-solid fa fa-rotate-right"></i>
                  </span>
                 <span class="border deletedSelectedDays">
                      <i class="fa-solid fa fa-times closeClaendar"></i>
                  </span>
                  <div class="selectCellSpanDiv">
                      <span class="selectCellSpan">انتخاب تعطیلات</span>
                  </div>
                 
              </div>
          </div>
          <div class="WeekDays">
              <table id="targetTable">
                  <thead>
                      <tr class="weekdays-row">
                          <th>شنبه</th>
                          <th>یکشنبه</th>
                          <th>دوشنبه</th>
                          <th>سه شنبه</th>
                          <th>چهارشنبه</th>
                          <th>پنجشنبه</th>
                          <th>جمعه</th>
                      </tr>
                  </thead>
                  <tbody></tbody>
              </table>
          </div>
      </div>
  </div>
  <div class="overlay"></div>
  <div id="monthPopup" style="display: none">
      <ul>
          <li class="month-option">فروردین</li>
          <li class="month-option">اردیبهشت</li>
          <li class="month-option">خرداد</li>
          <li class="month-option">تیر</li>
          <li class="month-option">مرداد</li>
          <li class="month-option">شهریور</li>
          <li class="month-option">مهر</li>
          <li class="month-option">آبان</li>
          <li class="month-option">آذر</li>
          <li class="month-option">دی</li>
          <li class="month-option">بهمن</li>
          <li class="month-option">اسفند</li>
      </ul>
  </div>
  <div class="overlay2"></div>
  <div id="yearPopup" class="scrollable-popup">
     
  </div>
  <div class="overlay8"></div>
  <div class="popupSelectDays">
      <div class=" d-flex align-items-center justify-content-center headerListUserTracksMonth">
          <p>انتخاب تعطیلات</p>
      </div>
      <div style="overflow: auto; padding: 0 15px;">
          <div class="fieldFormSelectDay">
              <span>شروع بازه</span>
              <input data-jdp id="selectDayStart" class="selectDayInput" value="1403/01/01" />
          </div>
          <div class="fieldFormSelectDay">
              <span>پایان بازه</span>
              <input data-jdp id="selectDayEnd" class="selectDayInput" value="1403/12/30"/>
          </div>
          <div class="fieldFormSelectDay borderBottom">
              <span>انتخاب روز هفته</span>
              <div class="d-flex align-items-center">
                  <div class="d-flex align-items-center m-1">
                      <small class="m-1">پنجشنبه</small>
                      <input id="thursdayCheckbox" value="پنجشنبه" type="checkbox" />
                  </div>
                  <div class="d-flex align-items-center m-1">
                      <small class="m-1">جمعه</small>
                      <input id="fridayCheckbox" value="جمعه" type="checkbox" />
                  </div>
              </div>
          </div>
          <div class="btnDiv">
              <span id="selectDaySubmit" class="btn-primary m-1">انتخاب</span>
              <span class="btn-light btnCloseFormSelectDay m-1">بستن</span>
          </div>
      </div>
  </div>`;

        // Fetch the holidays from the LoadCalendarHolidays web method using AJAX
        $.ajax({
            type: "POST",
            url: "App_Sys/Services/EditActivity.asmx/LoadCalendarHolidays",
            data: JSON.stringify({ _objKey: parseInt(_objKey) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                // Parse the response and populate the selectedCells array
                var holidays = JSON.parse(response.d); // Assuming the result is returned as a JSON string
                selectedCells = holidays.map(function (holiday) {
                    var dayObj = parseInt(holiday.Date.replaceAll('/Date(', '').replaceAll(')/', ''));
                    var date = new Date(dayObj); // Convert the timestamp to a Date object
                    // Extract year, month, and day
                    var JDate = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
                    // Return formatted date as yyyy/mm/dd
                    return `${JDate.jy}/${JDate.jm}/${JDate.jd}`;

                });
                // Define the HTML content of the calendar
                // Inject the calendar HTML into the body
                $(bodyID).html(calendarHTML);
                // Initialize the calendar after loading holidays
                initCalendar();
            },
            error: function (error) {
                console.error("Error loading holidays:", error);
            }
        });

        $(footerID).html(``);

        //#region Render Footer

        if (renderMode == "Modal") {

            $("#boxFooterModal" + modalID).append(
                '<button type="button" id="btnActModal' +
                modalID +
                '" class="btn btn-form-submit" onclick="">' +
                $$Local.formSubmit +
                "</button>&nbsp;"
            );

            $("#boxFooterModal" + modalID).append(
                '<button type="button" id="btnCnsModal' +
                modalID +
                '" class="btn btn-default btn-form-cancel" >' +
                $$Local.formCancel +
                "</button>"
            );

            $("#btnActModal" + modalID).unbind("click");

            $("#btnActModal" + modalID).click(function () {
                var calendarEntries = [];

                selectedCells.forEach(function (date) {
                    var todayDate = new Date();
                    var emroz = toJalaali(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate());
                    var jalaaliParts = date.split('/');
                    var jYear = parseInt(jalaaliParts[0]);
                    var jMonth = parseInt(jalaaliParts[1]);
                    var jDay = parseInt(jalaaliParts[2]);
                    if (emroz.jy <= jYear && emroz.jm <= jMonth) {
                        var gregorianDate = toGregorian(jYear, jMonth, jDay);
                        var entryDate = gregorianDate.gy + "-" + gregorianDate.gm + "-" + gregorianDate.gd;
                        var entryDateObj = new Date(entryDate);
                        var dayOfWeek = entryDateObj.getDay();
                        var monthLabel = monthNumberToLabel(jMonth);

                        var calendarEntry = {
                            ObjKey: parseInt(_objKey),
                            Date: entryDate,
                            DayOfWeek: dayOfWeek,
                            DayOfMonth: jDay,
                            MonthOfYear: jMonth,
                            MonthLabel: monthLabel,
                            Year: jYear
                        };
                        // Add the entry to the array
                        calendarEntries.push(calendarEntry);

                    }
                });
                // Check if calendarEntries is empty
                if (calendarEntries.length === 0) {
                    // If empty, delete all entries associated with ObjKey
                    $.ajax({
                        type: "POST",
                        url: "App_Sys/Services/EditActivity.asmx/DeleteCalendarDays",
                        data: JSON.stringify({ objKey: parseInt(_objKey) }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            console.log("All calendar entries deleted successfully.");
                        },
                        error: function (error) {
                            console.log("Error deleting calendar entries", error);
                        }
                    });
                } else {
                    // Send the array of calendar entries via AJAX
                    $.ajax({
                        type: "POST",
                        url: "App_Sys/Services/EditActivity.asmx/SaveCalendarDays",
                        data: JSON.stringify({ calendarEntries: calendarEntries }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            console.log("Calendar entries saved successfully.");
                        },
                        error: function (error) {
                            console.log("Error inserting calendar entries", error);
                        }
                    });
                }

                $("#closeBtnModal" + modalID).trigger("click");
            });


            $("#closeBtnModal" + modalID).unbind("click");

            $("#closeBtnModal" + modalID).click(function () {
                _modalID = _modalID - 1;

                $(bodyID).html("");

                $(footerID).html("");
            });

            $("#btnCnsModal" + modalID).unbind("click");

            $("#btnCnsModal" + modalID).click(function () {
                $("#closeBtnModal" + _modalID).trigger("click");
            });

        }

    }

    //#endregion
    this.renderModalContext = function (modalID, defaultSearch) {
        this._renderContext("Modal", modalID, 0, parseSearchValue(defaultSearch));
    };
}

//#endregion
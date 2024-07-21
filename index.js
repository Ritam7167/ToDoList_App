
var globalDB = [];
var allRecords = [];

function initializeDB() {
    loaddata();
}

function toggleArrowUp(event) {
    console.log("Hello");
    $(event).removeClass('fa-chevron-up').addClass('fa-chevron-down');
    $(event).parent().next().hide();
    $(event).attr('onclick', 'toggleArrowDown(this)');
}

function toggleArrowDown(event) {
    console.log("Hello");
    $(event).removeClass('fa-chevron-down').addClass('fa-chevron-up');
    $(event).parent().next().show();
    $(event).attr('onclick', 'toggleArrowUp(this)');
}

function textCount(event, totalCharacters) {
    console.log("Checking");
    var remaining = totalCharacters - $(event).val().length;
    $(event).nextAll()[1].innerHTML = remaining + ' / ' + totalCharacters + ' Characters left';
}

function addData(event) {
    var chooseDate = $(event).prevAll()[18].value;
    var eventName = $(event).prevAll()[15].value;
    var startdate = $(event).prevAll()[10].value;
    var enddate = $(event).prevAll()[7].value;
    var description = $(event).prevAll()[4].value;

    if (enddate <= startdate) {
        alert('Select correct Start time and End time.');
        return;
    }

    var singleRecord = [];
    singleRecord.push(chooseDate);
    singleRecord.push(eventName);
    singleRecord.push(startdate);
    singleRecord.push(enddate);
    singleRecord.push(description);

    globalDB.push(singleRecord);

    // Session Storage
    var allRecord = sessionStorage.getItem('Record');
    if (allRecord) {
        allRecord = allRecord.split(',');
    } else {
        allRecord = [];
    }

    allRecord.push(singleRecord.join(',')); // Convert the array to a comma-separated string
    sessionStorage.setItem("Record", allRecord);

}

function loaddata() {
    var x = sessionStorage.getItem('Record').split(',');

    if (x.length % 5 != 0)
        x.splice(0, 1);
    if (x.length == 0) {
        $('#boxContainer').html('No records found.');
        return;
    }
    allRecords = [];

    for (let i = 0; i < x.length; i += 5) {
        allRecords.push(x.slice(i, i + 5));
    }
    console.log(allRecords);

    var boxValue = '';
    for (let i = 0; i < allRecords.length; i++) {
        var eventDate = allRecords[i][0];
        var eventName = allRecords[i][1];
        var startDate = allRecords[i][2];
        var endDate = allRecords[i][3];
        var description = allRecords[i][4];

        boxValue += '<p>' + eventDate + '</p>' +
            '<div class="box" id="box1">' +
            '<div class="topDiv">' +
            '<div class="star"> <i class=\'fas fa-star\'></i></div>' +
            '<div class="stet"><b><font class="text">' + startDate + '-' + endDate + ' <i class=\'fas fa-chevron-circle-right\'> </i></font></b></div>' +
            '<div class="arrow"></i></div>' +
            '<div class="gap">' +
            '<div class="editIcon" onclick="editEvent(' + i + ')"><i class="fas fa-edit"></i></div>' +
            '</div>' +
            '<div class="delIcon" onclick="deleteCard(' + i + ')"><i class=\'fas fa-trash\'></i></div>' +
            '</div>' +
            '<p class="eventName">' + eventName + '</p>' +
            '<p class="downarrow">' +
            '<i class=\'fas fa-chevron-down\' style=\'font-size:24px\' onclick="toggleArrowDown(this)"></i>' +
            '</p>' +
            '<p class="description" hidden>' + description + '</p>' +
            '</div>';

        console.log(boxValue);

        $('#boxContainer').html(boxValue);
    }

}

function deleteCard(index) {
    allRecords.splice(index, 1);
    $('#boxContainer').html('');
    sessionStorage.setItem("Record", allRecords);
    if (allRecords.length != 0)
        loaddata();
    else
        $('#boxContainer').html('No records found.');
}

function dateFilter() {
    var selectedDate = $(".date3").val();
    var filteredRecords = allRecords.filter(record => record[0] === selectedDate);
    if (filteredRecords.length === 0) {
        $('#boxContainer').html('No events found for selected date.');
    } else {
        var boxValue = '';
        for (let i = 0; i < filteredRecords.length; i++) {
            var eventDate = filteredRecords[i][0];
            var eventName = filteredRecords[i][1];
            var startDate = filteredRecords[i][2];
            var endDate = filteredRecords[i][3];
            var description = filteredRecords[i][4];

            boxValue += '<p>' + eventDate + '</p>' +
                '<div class="box" id="box1">' +
                '<div class="topDiv">' +
                '<div class="star"> <i class=\'fas fa-star\'></i></div>' +
                '<div class="stet"><b><font class="text">' + startDate + '-' + endDate + ' <i class=\'fas fa-chevron-circle-right\'> </i></font></b></div>' +
                '<div class="arrow"></i></div>' +
                '<div class="gap">' +
                '<div class="editIcon" onclick="editEvent(' + i + ')"><i class="fas fa-edit"></i></div>' +
                '</div>' +
                '<div class="delIcon" onclick="deleteCard(' + i + ')"><i class=\'fas fa-trash\'></i></div>' +
                '</div>' +
                '<p class="eventName">' + eventName + '</p>' +
                '<p class="downarrow">' +
                '<i class=\'fas fa-chevron-down\' style=\'font-size:24px\' onclick="toggleArrowDown(this)"></i>' +
                '</p>' +
                '<p class="description" hidden>' + description + '</p>' +
                '</div>';
        }

        $('#boxContainer').html(boxValue);
    }
}

function resetSearch() {
    // Clear the date input field
    $(".date3").val("");
    // Reload all events
    loaddata();
}

function editEvent(index) {
    // Retrieve the event details based on the index
    var eventDetails = allRecords[index];

    // Populate the form fields with the event details
    $('.date1').val(eventDetails[0]);
    $('.ename').val(eventDetails[1]);
    $('.setime')[0].value = eventDetails[2];
    $('.setime')[1].value = eventDetails[3];
    $('.des').val(eventDetails[4]);

    // Change the button text to "Update Event"
    $('.button1').val('Update Event');

    // Store the index of the event being edited
    $('.button1').data('index', index);

    // Change the form action to update event
    $('form').off('submit').on('submit', function(event) {
        updateEvent(event);
    });
}

function updateEvent(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the index of the event being updated from the data attribute
    var index = $('.button1').data('index');

    // Update the event details in the global array
    allRecords[index][0] = $('.date1').val();
    allRecords[index][1] = $('.ename').val();
    allRecords[index][2] = $('.setime')[0].value;
    allRecords[index][3] = $('.setime')[1].value;
    allRecords[index][4] = $('.des').val();

    // Update the event details in the existing box
    var box = $('#boxContainer').children().eq(index);
    box.find('.eventName').text($('.ename').val());
    box.find('.stet .text').text($('.setime')[0].value + '-' + $('.setime')[1].value);
    box.find('.description').text($('.des').val());

    // Clear the form
    $('form')[0].reset();

    // Change the button text back to "Create Your Event"
    $('.button1').val('Create Your Event');

    // Remove the data-index attribute from the button
    $('.button1').removeData('index');

    // Update the sessionStorage
    sessionStorage.setItem("Record", allRecords.map(record => record.join(',')));

    // Reload the page after updating the task
    location.reload();

    return false; // Prevent form submission
}
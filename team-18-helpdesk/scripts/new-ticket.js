'use strict';

var formatDigits = function formatDigits(i) {
    if (i < 10) return '0' + i;

    return String(i);
};

var formatDate = function formatDate(d) {
    var yyyy = d.getFullYear();
    var mm = formatDigits(d.getMonth());
    var dd = formatDigits(d.getDay());

    var date = yyyy + '-' + mm + '-' + dd;

    var h = formatDigits(d.getHours());
    var i = formatDigits(d.getMinutes());
    var s = formatDigits(d.getSeconds());

    var time = h + ':' + i + ':' + s;

    return date + ' ' + time;
};

window.addEventListener('load', function () {
    if (window.location.hash) {
        var hash = window.location.hash.substring(1);

        document.querySelector('.title').innerHTML = 'New Call Log for Ticket ' + hash;
    }

    var specialistCheckbox = document.querySelector('.assign-specialist-checkbox');

    specialistCheckbox.addEventListener('change', function () {
        document.querySelector('.specialist-information').classList.toggle('hidden', !specialistCheckbox.checked);
    });

    var specialistID = document.querySelector('.specialist-id-input');

    document.querySelector('.dans-button').addEventListener('click', function () {
        specialistID.value = 'A8660251';
    });

    document.querySelector('.jims-button').addEventListener('click', function () {
        specialistID.value = 'A9585866';
    });

    document.querySelector('.bobs-button').addEventListener('click', function () {
        specialistID.value = 'A0026451';
    });

    var employeeIDCheckbox = document.querySelector('.use-employee-id');

    employeeIDCheckbox.addEventListener('change', function () {
        document.querySelector('.employee-id-container').classList.toggle('hidden', !employeeIDCheckbox.checked);
        document.querySelector('.employee-info-container').classList.toggle('hidden', employeeIDCheckbox.checked);
    });

    var newTypeCheckbox = document.querySelector('.new-type-input');

    newTypeCheckbox.addEventListener('change', function () {
        document.querySelector('.new-type-container').classList.toggle('hidden', !newTypeCheckbox.checked);
    });

    var newTicketButton = document.querySelector('.new-ticket-button');

    newTicketButton.addEventListener('click', function () {
        var confirmation = confirm('Are you sure you want to create this new ticket?');

        if (!confirmation) return;

        var config = {
            apiKey: "AIzaSyAsjefipXMkd79s2AJGu8O4IpvvYKq8o5Q",
            authDomain: "team-18-helpdesk.firebaseapp.com",
            databaseURL: "https://team-18-helpdesk.firebaseio.com",
            projectId: "team-18-helpdesk",
            storageBucket: "",
            messagingSenderId: "1003689053447"
        };

        if (!firebase.apps.length) firebase.initializeApp(config);

        var database = firebase.database().ref('/tickets');

        var callerID = document.querySelector('.caller-id-input').value;
        var callerName = document.querySelector('.caller-name-input').value;
        var callerJob = document.querySelector('.caller-job-input').value;
        var callerDepartment = document.querySelector('.caller-department-input').value;
        var callerPhone = document.querySelector('.caller-phone-input').value;

        var summary = document.querySelector('.summary-input').value;
        var problemDescription = document.querySelector('.full-description-input').value;
        var problemHardware = document.querySelector('.problem-hardware-input').value;
        var problemOperatingSystem = document.querySelector('.problem-os-input').value;
        var problemSoftware = document.querySelector('.problem-software-input').value;
        var problemType = document.querySelector('.problem-type-input').value;
        var newProblemType = document.querySelector('.new-problem-type').value;

        var newTicket = {
            summary: summary,
            callTime: new Date().getTime(),
            closed: false,
            problemType: newTypeCheckbox.checked ? newProblemType : problemType
        };

        if (specialistCheckbox.checked) {
            newTicket.specialist = { id: specialistID.value, name: 'Bob Harrison' };
        }

        if (callerName.length === 0) callerName = 'Jim Bob';
        if (callerDepartment.length === 0) callerDepartment = 'Sales Team';
        if (callerJob.length === 0) callerJob = 'Sales Assistant';

        var log = {
            caller: {
                id: callerID,
                name: callerName,
                department: callerDepartment,
                jobTitle: callerJob,
                phoneNumber: callerPhone
            },
            callTime: new Date().getTime(),
            operator: { name: 'Dan French' },
            description: problemDescription,
            hardware: problemHardware,
            operatingSystem: problemOperatingSystem,
            software: problemSoftware
        };

        if (window.location.hash) {
            var _hash = window.location.hash.substring(1);

            var ticketDatabase = firebase.database().ref('/tickets/' + _hash);

            ticketDatabase.child('logs').push(log).then(function () {
                window.location.href = 'helpdesk.html';
            });
        } else {
            database.push(newTicket).child('logs').push(log).then(function () {
                window.location.href = 'helpdesk.html';
            });
        }
    });
});
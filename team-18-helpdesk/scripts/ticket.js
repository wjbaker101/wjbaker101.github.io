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
    var logsContainer = document.querySelector('.logs-container');

    var updateCallLogs = function updateCallLogs(update) {
        logsContainer.innerHTML = '';

        var callLogs = Object.entries(update).sort(function (a, b) {
            return a[1].time < b[1].time;
        });

        callLogs.forEach(function (log) {
            var logDate = new Date(log[1].time);
            var formattedDate = dateFormat(logDate, 'HH:MM:ss dd/mm/yyyy');

            var html = '\n                <div class="call-log section bg-white hpadding-small vpadding-small">\n                    <h3><strong>' + formattedDate + '</strong></h3>\n                    <p>' + log[1].message + '</p>\n                </div>\n            ';

            logsContainer.innerHTML += html;
        });
    };

    if (window.location.hash) {
        var hash = window.location.hash.substring(1);

        document.querySelector('.ticket-title').innerHTML = hash;

        var config = {
            apiKey: "AIzaSyAsjefipXMkd79s2AJGu8O4IpvvYKq8o5Q",
            authDomain: "team-18-helpdesk.firebaseapp.com",
            databaseURL: "https://team-18-helpdesk.firebaseio.com",
            projectId: "team-18-helpdesk",
            storageBucket: "",
            messagingSenderId: "1003689053447"
        };

        if (!firebase.apps.length) firebase.initializeApp(config);

        var database = firebase.database().ref('/tickets/' + hash);

        database.on('value', function (snapshot) {
            var ticket = snapshot.val();

            var status = ticket.specialist === null ? 'Pending' : ticket.closed ? 'Closed' : 'Open';

            document.querySelector('.problem-type').innerHTML = ticket.problemType;
            document.querySelector('.ticket-status').innerHTML = status;
            document.querySelector('.os-id').innerHTML = ticket.operatingSystem + ' (Licensed!)';
            document.querySelector('.problem-software').innerHTML = ticket.software + ' (Licensed!)';

            if (ticket.logs) updateCallLogs(ticket.logs);

            var closeTicketButton = document.querySelector('.close-ticket-button');

            closeTicketButton.addEventListener('click', function () {
                var closeText = document.querySelector('.close-ticket-input').value;

                if (closeText.length === 0) throw new Error('Textbox cannot be blank.');

                var confirmation = confirm('Are you sure you want to close this ticket?');

                if (!confirmation) throw new Error('No was selected.');

                var t = ticket;

                ticket.closed = true;

                firebase.database().ref('/tickets/' + hash).set(t);
            });
        });

        var submitLogButton = document.querySelector('.submit-log-button');
        var newLogInput = document.querySelector('.new-log-input');

        submitLogButton.addEventListener('click', function () {
            if (newLogInput.value.length === 0) return;

            var newLog = { time: new Date().getTime(), message: newLogInput.value };

            database.child('logs').push().set(newLog);
        });

        var deleteButton = document.querySelector('.delete-log-button');

        deleteButton.addEventListener('click', function () {
            var confirmation = confirm('Are you sure you want to delete this log?');

            if (!confirmation) return;

            database.set(null);

            location.href = 'helpdesk.html';
        });
    } else {
        throw new Error('Ticket ID invalid.');
    }
});
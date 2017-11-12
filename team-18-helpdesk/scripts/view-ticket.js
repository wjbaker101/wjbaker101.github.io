'use strict';

window.addEventListener('load', function () {
    var logsContainer = document.querySelector('.logs-container');

    var updateCallLogs = function updateCallLogs(update) {
        var callLogs = Object.entries(update).sort(function (a, b) {
            return a[1].callTime - b[1].callTime;
        });

        callLogs.forEach(function (log) {
            var logTime = new Date(log[1].callTime);
            var formattedDate = dateFormat(logTime, 'dddd d mmmm yyyy @ HH:MM');

            var html = '\n                <div class="call-log section bg-white">\n                    <div class="details hpadding-small vpadding-small">\n                        <h3><strong>' + formattedDate + '</strong></h3>\n                        <div class="clearfix">\n                            <div class="float-left">\n                                <strong>Caller Name:</strong> ' + log[1].caller.name + ' (<strong>ID: </strong> ' + log[1].caller.id + ')<br>\n                                <strong>Job Title:</strong> ' + log[1].caller.jobTitle + '<br>\n                                <strong>Department:</strong> ' + log[1].caller.department + '<br>\n                                <strong>Telephone Number:</strong> ' + log[1].caller.phoneNumber + '<br>\n                            </div>\n                            <div class="float-right">\n                                <strong>Helpdesk Operator:</strong> Dan French\n                            </div>\n                        </div>\n                        <p><strong>Hardware Serial Number:</strong> ' + log[1].hardware + ' (Licensed!)</p>\n                        <p><strong>Software License ID:</strong> ' + log[1].software + ' (Licensed!)</p>\n                        <p><strong>Operating System Version:</strong> ' + log[1].operatingSystem + ' (Licensed!)</p>\n                    </div>\n                    <div class="message hpadding-small vpadding-small">\n                        <p>' + log[1].description + '</p>\n                    </div>\n                    <div class="hpadding-small vpadding-small">\n                        <p class="text-right"><button class="delete-log">Delete Log</button></p>\n                    </div>\n                </div>\n            ';

            logsContainer.innerHTML += html;
        });
    };

    if (window.location.hash) {
        var hash = window.location.hash.substring(1);

        document.querySelector('.ticket-id').innerHTML = hash;

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

            var status = !ticket.specialist ? 0 : ticket.closed ? 2 : 1;

            var statusFormatted = 'Closed';

            if (status === 0) {
                statusFormatted = 'Pending <a href="assign-specialist.html#' + hash + '"><button>Assign Now</button></a>';
            }

            if (status === 1) {
                statusFormatted = 'Open';

                document.querySelector('.specialist').innerHTML = ticket.specialist.name + ' <a href="assign-specialist.html#' + hash + '"><button>Switch</button></a>';
            }

            document.querySelector('.ticket-status').innerHTML = statusFormatted;
            document.querySelector('.problem-type').innerHTML = ticket.problemType;

            logsContainer.innerHTML = '';

            if (ticket.closed) {
                var html = '\n                    <div class="call-log section bg-white">\n                        <div class="details hpadding-small vpadding-small">\n                            <h3>Resolution:</h3>\n                            <p><strong>Date: </strong>' + dateFormat(new Date(ticket.resolution.closeTime), 'dddd d mmmm yyyy @ HH:MM') + '</p>\n                            <p><strong>Closed By: </strong>' + ticket.resolution.specialist + '</p>\n                        </div>\n                        <div class="hpadding-small vpadding-small clearfix">\n                            <p class="float-left">' + ticket.resolution.message + '</p>\n                            <p class="float-right"><button>Re-Open Ticket</button></p>\n                        </div>\n                    </div>\n                ';

                logsContainer.innerHTML += html;
            }

            if (ticket.logs) updateCallLogs(ticket.logs);
        });

        var newLogButton = document.querySelector('.new-log-button');

        newLogButton.addEventListener('click', function () {
            location.href = 'new-ticket.html#' + hash;
        });

        var closeTicketButton = document.querySelector('.close-ticket-button');

        closeTicketButton.addEventListener('click', function () {
            location.href = 'close-ticket.html#' + hash;
        });

        var deleteTicketButton = document.querySelector('.delete-ticket');

        deleteTicketButton.addEventListener('click', function () {
            var confirmation = confirm('Are you sure you want to permanently delete this ticket?');

            if (!confirmation) return;

            database.off('value');

            database.remove().then(function () {
                location.href = 'helpdesk.html';
            });
        });
    } else {
        throw new Error('Ticket ID invalid.');
    }
});
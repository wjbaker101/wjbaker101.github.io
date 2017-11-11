"use strict";

window.addEventListener('load', function () {
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

    var typePendingInput = document.querySelector('.type-pending-input');
    var typeOpenInput = document.querySelector('.type-open-input');
    var typeClosedInput = document.querySelector('.type-closed-input');

    var updateTicketList = function updateTicketList(update) {
        if (!update) return;

        var ticketContainer = document.querySelector('.ticket-container');

        ticketContainer.innerHTML = '';

        var tickets = Object.entries(update).sort(function (a, b) {
            return b[1].callTime - a[1].callTime;
        });

        tickets.forEach(function (ticket) {
            if (!ticket[1].closed && !ticket[1].specialist && !typePendingInput.checked) return;
            if (!ticket[1].closed && ticket[1].specialist && !typeOpenInput.checked) return;
            if (ticket[1].closed && !typeClosedInput.checked) return;

            var dateTime = new Date(ticket[1].callTime);

            var formattedDate = dateTime.format('dddd d mmmm yyyy @ HH:MM');

            var ticketElement = document.createElement('div');
            ticketElement.className = 'ticket section vpadding-small bg-white';

            var resolutionInfo = '';

            if (ticket[1].resolution) {
                var resolutionDate = new Date(ticket[1].resolution.closeTime);
                var resolutionDateFormatted = resolutionDate.format('dddd d mmmm yyyy @ HH:MM');

                resolutionInfo = "\n                    <strong>Resolved by:</strong> " + ticket[1].resolution.specialist + "<br>\n                    <strong>Date:</strong> " + resolutionDateFormatted + "\n                ";
            }

            var html = "\n                <div class=\"top-content section hpadding-small\">\n                    <h3>" + ticket[1].summary + "</h3>\n                    <p>\n                        <strong>Ticket ID:</strong>\n                        " + ticket[0] + "\n                    </p>\n                    <p>" + formattedDate + "</p>\n                    <p>" + (!ticket[1].specialist ? 'No specialist assigned yet.' : "<strong>Assigned to:</strong> " + ticket[1].specialist.name) + "</p>\n                </div>\n                <div class=\"footer-content section hpadding-small clearfix\">\n                    <div class=\"float-left\">" + resolutionInfo + "</div>\n                    <div class=\"float-right\"><button class=\"add-call\">Add Call Log</button><button class=\"view-ticket\">View Ticket</button></div>\n                </div>\n            ";

            ticketElement.innerHTML = html;

            ticketElement.querySelector('.add-call').addEventListener('click', function () {
                location.href = "new-ticket.html#" + ticket[0];
            });

            ticketElement.querySelector('.view-ticket').addEventListener('click', function () {
                location.href = "view-ticket.html#" + ticket[0];
            });

            ticketContainer.appendChild(ticketElement);
        });
    };

    var requestTickets = function requestTickets() {
        database.on('value', function (snapshot) {
            updateTicketList(snapshot.val());
        });
    };

    typePendingInput.addEventListener('change', requestTickets);
    typeOpenInput.addEventListener('change', requestTickets);
    typeClosedInput.addEventListener('change', requestTickets);

    requestTickets();
});
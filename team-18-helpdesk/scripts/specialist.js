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

    firebase.initializeApp(config);

    var database = firebase.database().ref('/tickets');

    var ticketList = document.querySelector('.ticket-list');

    var updateTicketList = function updateTicketList(update) {
        if (!update) return;

        var ticketContainer = document.querySelector('.ticket-container');

        ticketContainer.innerHTML = '';

        var tickets = Object.entries(update).sort(function (a, b) {
            return b[1].callTime - a[1].callTime;
        });

        tickets.forEach(function (ticket) {
            if (ticket[1].closed) return;

            var dateTime = new Date(ticket[1].callTime);

            var formattedDate = dateTime.format('dddd d mmmm yyyy @ HH:MM');

            var ticketElement = document.createElement('div');
            ticketElement.className = 'ticket section vpadding-small bg-white';

            var html = "\n                <div class=\"top-content section hpadding-small\">\n                    <h3>" + ticket[1].summary + "</h3>\n                    <p>\n                        <strong>Ticket ID:</strong>\n                        " + ticket[0] + "\n                    </p>\n                    <p>" + formattedDate + "</p>\n                    <p><strong>Problem Type:</strong> " + ticket[1].problemType + "</p>\n                </div>\n                <div class=\"footer-content section hpadding-small clearfix\">\n                    <div class=\"float-left\"></div>\n                    <div class=\"float-right\"><button class=\"close-ticket\">Close Ticket</button><button class=\"view-ticket\">View Ticket</button></div>\n                </div>\n            ";

            ticketElement.innerHTML = html;

            ticketElement.querySelector('.view-ticket').addEventListener('click', function () {
                location.href = "view-ticket.html#" + ticket[0];
            });

            ticketElement.querySelector('.close-ticket').addEventListener('click', function () {
                location.href = "close-ticket.html#" + ticket[0];
            });

            ticketContainer.appendChild(ticketElement);
        });
    };

    var requestTickets = function requestTickets() {
        database.on('value', function (snapshot) {
            updateTicketList(snapshot.val());
        });
    };

    requestTickets();
});
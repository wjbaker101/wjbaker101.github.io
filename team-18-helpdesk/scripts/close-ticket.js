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

    if (window.location.hash) {
        var hash = window.location.hash.substring(1);

        var database = firebase.database().ref("/tickets/" + hash);

        database.once('value').then(function (snapshot) {
            var ticket = snapshot.val();

            console.log(ticket);

            document.querySelector('.ticket-id').innerHTML = "Ticket " + hash;

            var closeButton = document.querySelector('.submit-button');

            closeButton.addEventListener('click', function () {
                var description = document.querySelector('.resolution-input').value;

                if (description.length === 0) return;

                var confirmation = confirm('Close this ticket?');

                if (!confirmation) return;

                var closedTicket = ticket;
                closedTicket.closed = true;

                database.set(closedTicket);

                database.child('resolution').set({
                    specialist: 'Bob Harrison',
                    closeTime: new Date().getTime(),
                    message: description
                }).then(function () {
                    location.href = 'specialist.html';
                });
            });
        });

        document.querySelector('.return-link').href = "view-ticket.html#" + hash;
    } else {
        throw new Error('No ticket ID.');
    }
});
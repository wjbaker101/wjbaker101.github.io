window.addEventListener('load', () =>
{
    const config =
    {
        apiKey: "AIzaSyAsjefipXMkd79s2AJGu8O4IpvvYKq8o5Q",
        authDomain: "team-18-helpdesk.firebaseapp.com",
        databaseURL: "https://team-18-helpdesk.firebaseio.com",
        projectId: "team-18-helpdesk",
        storageBucket: "",
        messagingSenderId: "1003689053447"
    };

    if (!firebase.apps.length) firebase.initializeApp(config);

    if (window.location.hash)
    {
        const hash = window.location.hash.substring(1);
    
        const database = firebase.database().ref(`/tickets/${hash}`);
        
        database.once('value').then((snapshot) =>
        {
            const ticket = snapshot.val();
            
            console.log(ticket);
            
            document.querySelector('.ticket-id').innerHTML = `Ticket ${hash}`;
        
            const closeButton = document.querySelector('.submit-button');

            closeButton.addEventListener('click', () =>
            {
                const description = document.querySelector('.resolution-input').value;
                
                if (description.length === 0) return;
                
                const confirmation = confirm('Close this ticket?');
                
                if (!confirmation) return;
                
                let closedTicket = ticket;
                closedTicket.closed = true;
                
                database.set(closedTicket);
                
                database.child('resolution').set(
                {
                    specialist: 'Bob Harrison',
                    closeTime: (new Date()).getTime(),
                    message: description
                })
                .then(() =>
                {
                    location.href = 'specialist.html';
                });
            });
        });
        
        document.querySelector('.return-link').href = `view-ticket.html#${hash}`;
    }
    else
    {
        throw new Error('No ticket ID.');
    }
});
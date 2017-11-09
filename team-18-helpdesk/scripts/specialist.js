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

    firebase.initializeApp(config);
    
    const database = firebase.database().ref('/tickets');
    
    const ticketList = document.querySelector('.ticket-list');
    
    const updateTicketList = (update) =>
    {
        if (!update) return;
        
        const ticketContainer = document.querySelector('.ticket-container');
    
        ticketContainer.innerHTML = '';
        
        const tickets = Object.entries(update).sort((a, b) => b[1].callTime - a[1].callTime);

        tickets.forEach(ticket =>
        {
            const dateTime = new Date(ticket[1].callTime);
            
            const formattedDate = dateTime.format('dddd d mmmm yyyy @ HH:MM');
            
            const ticketElement = document.createElement('div');
            ticketElement.className = 'ticket section vpadding-small bg-white';
            
            const html = `
                <div class="top-content section hpadding-small">
                    <h3>Ticket ${ticket[0]}</h3>
                    <p>${formattedDate}</p>
                </div>
                <div class="footer-content section hpadding-small clearfix">
                    <div class="float-left"></div>
                    <div class="float-right"><button class="view-ticket">View Ticket</button></div>
                </div>
            `;
            
            ticketElement.innerHTML = html;
            
            ticketElement.querySelector('.view-ticket').addEventListener('click', () =>
            {
                location.href = `view-ticket.html#${ticket[0]}`;
            });

            ticketContainer.appendChild(ticketElement);
        });
    };
    
    const requestTickets = () =>
    {
        database.on('value', (snapshot) =>
        {
            updateTicketList(snapshot.val());
        });
    };
    
    requestTickets();
});
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

    const database = firebase.database().ref('/tickets');
    
    const typePendingInput = document.querySelector('.type-pending-input');
    const typeOpenInput = document.querySelector('.type-open-input');
    const typeClosedInput = document.querySelector('.type-closed-input');
    
    const updateTicketList = (update) =>
    {
        if (!update) return;
        
        const ticketContainer = document.querySelector('.ticket-container');
    
        ticketContainer.innerHTML = '';
        
        const tickets = Object.entries(update).sort((a, b) => b[1].callTime - a[1].callTime);

        tickets.forEach(ticket =>
        {
            if ((!ticket[1].closed && !ticket[1].specialist) && !typePendingInput.checked) return;
            if ((!ticket[1].closed && ticket[1].specialist) && !typeOpenInput.checked) return;
            if (ticket[1].closed && !typeClosedInput.checked) return;
            
            const dateTime = new Date(ticket[1].callTime);
            
            const formattedDate = dateTime.format('dddd d mmmm yyyy @ HH:MM');
            
            const ticketElement = document.createElement('div');
            ticketElement.className = 'ticket section vpadding-small bg-white';
            
            let resolutionInfo = '';
            
            if (ticket[1].resolution)
            {
                const resolutionDate = new Date(ticket[1].resolution.closeTime);
                const resolutionDateFormatted = resolutionDate.format('dddd d mmmm yyyy @ HH:MM');
                
                resolutionInfo = `
                    <strong>Resolved by:</strong> ${ticket[1].resolution.specialist}<br>
                    <strong>Date:</strong> ${resolutionDateFormatted}
                `;
            }
            
            const html = `
                <div class="top-content section hpadding-small">
                    <h3>${ticket[1].summary}</h3>
                    <p>
                        <strong>Ticket ID:</strong>
                        ${ticket[0]}
                    </p>
                    <p>${formattedDate}</p>
                    <p>${!ticket[1].specialist ? 'No specialist assigned yet.' : `<strong>Assigned to:</strong> ${ticket[1].specialist.name}`}</p>
                </div>
                <div class="footer-content section hpadding-small clearfix">
                    <div class="float-left">${resolutionInfo}</div>
                    <div class="float-right"><button class="add-call">Add Call Log</button><button class="view-ticket">View Ticket</button></div>
                </div>
            `;
            
            ticketElement.innerHTML = html;
            
            ticketElement.querySelector('.add-call').addEventListener('click', () =>
            {
                location.href = `new-ticket.html#${ticket[0]}`;
            });
            
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
    
    typePendingInput.addEventListener('change', requestTickets);
    typeOpenInput.addEventListener('change', requestTickets);
    typeClosedInput.addEventListener('change', requestTickets);
    
    requestTickets();
});
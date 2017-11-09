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
            
            const html = `
                <div class="top-content section hpadding-small">
                    <h3>Ticket ${ticket[0]}</h3>
                    <p>${formattedDate}</p>
                    <p>${!ticket[1].specialist ? 'No specialist assigned yet.' : `<strong>Assigned to:</strong> ${ticket[1].specialist.name}`}</p>
                </div>
                <div class="footer-content section hpadding-small clearfix">
                    <div class="float-left"></div>
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
    
    /*const newTicketButton = document.querySelector('.new-ticket-button');
    
    newTicketButton.addEventListener('click', () =>
    {
        const callerForename = document.querySelector('.caller-forename-input').value;
        const callerSurname = document.querySelector('.caller-surname-input').value;
        const problemDescription = document.querySelector('.problem-description-input').value;
        const problemHardware = document.querySelector('.problem-hardware-input').value;
        const problemOperatingSystem = document.querySelector('.problem-os-input').value;
        const problemSoftware = document.querySelector('.problem-software-input').value;
        const problemType = document.querySelector('.problem-type-input').value;
        
        const employeeNumber = employees.indexOf(employees.find(e => `${e.firstName} ${e.surname}`.toLowerCase() === `${callerForename} ${callerSurname}`.toLowerCase()));
        
        if (employeeNumber === -1) throw new Error('No employee found.');
        
        let newTicket =
        {
            caller: { name: 'John Smith' },
            callDateTime: (new Date()).getTime(),
            operator: { name: 'Dan French' },
            callDescription: problemDescription,
            specialist: { id: '-KyAutZ8rUH8BBtLu6z9', name: 'Bob Harrison' },
            closed: false,
            hardware: problemHardware,
            operatingSystem: problemOperatingSystem,
            software: problemSoftware,
            problemType: problemType,
            logs: {},
        };
        
        database.push(newTicket).child('logs').push({ time: (new Date()).getTime(), message: problemDescription });
    });
    
    const assignSpecialistCheckbox = document.querySelector('.assign-specialist-checkbox');
    const specialistContainer = document.querySelector('.specialist-information');
    
    assignSpecialistCheckbox.addEventListener('change', () =>
    {
        specialistContainer.classList.toggle('hidden', !assignSpecialistCheckbox.checked);
    });*/
    
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
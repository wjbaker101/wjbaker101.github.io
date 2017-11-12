window.addEventListener('load', () =>
{
    const logsContainer = document.querySelector('.logs-container');
    
    const updateCallLogs = (update) =>
    {
        const callLogs = Object.entries(update).sort((a, b) => a[1].callTime - b[1].callTime);
        
        callLogs.forEach(log =>
        {
            const logTime = new Date(log[1].callTime);
            const formattedDate = dateFormat(logTime, 'dddd d mmmm yyyy @ HH:MM');
            
            const html = `
                <div class="call-log section bg-white">
                    <div class="details hpadding-small vpadding-small">
                        <h3><strong>${formattedDate}</strong></h3>
                        <div class="clearfix">
                            <div class="float-left">
                                <strong>Caller Name:</strong> ${log[1].caller.name} (<strong>ID: </strong> ${log[1].caller.id})<br>
                                <strong>Job Title:</strong> ${log[1].caller.jobTitle}<br>
                                <strong>Department:</strong> ${log[1].caller.department}<br>
                                <strong>Telephone Number:</strong> ${log[1].caller.phoneNumber}<br>
                            </div>
                            <div class="float-right">
                                <strong>Helpdesk Operator:</strong> Dan French
                            </div>
                        </div>
                        <p><strong>Hardware Serial Number:</strong> ${log[1].hardware} (Licensed!)</p>
                        <p><strong>Software License ID:</strong> ${log[1].software} (Licensed!)</p>
                        <p><strong>Operating System Version:</strong> ${log[1].operatingSystem} (Licensed!)</p>
                    </div>
                    <div class="message hpadding-small vpadding-small">
                        <p>${log[1].description}</p>
                    </div>
                    <div class="hpadding-small vpadding-small">
                        <p class="text-right"><button class="delete-log">Delete Log</button></p>
                    </div>
                </div>
            `;
            
            logsContainer.innerHTML += html;
        });
    };
    
    if (window.location.hash)
    {
        const hash = window.location.hash.substring(1);
        
        document.querySelector('.ticket-id').innerHTML = hash;
        
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
        
        const database = firebase.database().ref(`/tickets/${hash}`);
        
        database.on('value', (snapshot) =>
        {
            const ticket = snapshot.val();
            
            const status = (!ticket.specialist) ? 0 : ((ticket.closed) ? 2 : 1);
            
            let statusFormatted = 'Closed';
            
            if (status === 0)
            {
                statusFormatted = `Pending <a href="assign-specialist.html#${hash}"><button>Assign Now</button></a>`;
            }
            
            if (status === 1)
            {
                statusFormatted = `Open`;
                
                document.querySelector('.specialist').innerHTML = `${ticket.specialist.name} <a href="assign-specialist.html#${hash}"><button>Switch</button></a>`;
            }
            
            document.querySelector('.ticket-status').innerHTML = statusFormatted;
            document.querySelector('.problem-type').innerHTML = ticket.problemType;
            
            logsContainer.innerHTML = '';
            
            if (ticket.closed)
            {
                const html = `
                    <div class="call-log section bg-white">
                        <div class="details hpadding-small vpadding-small">
                            <h3>Resolution:</h3>
                            <p><strong>Date: </strong>${dateFormat(new Date(ticket.resolution.closeTime), 'dddd d mmmm yyyy @ HH:MM')}</p>
                            <p><strong>Closed By: </strong>${ticket.resolution.specialist}</p>
                        </div>
                        <div class="hpadding-small vpadding-small clearfix">
                            <p class="float-left">${ticket.resolution.message}</p>
                            <p class="float-right"><button>Re-Open Ticket</button></p>
                        </div>
                    </div>
                `;
                
                logsContainer.innerHTML += html;
            }
            
            if (ticket.logs)
                updateCallLogs(ticket.logs);
        });
            
        const newLogButton = document.querySelector('.new-log-button');

        newLogButton.addEventListener('click', () =>
        {
            location.href = `new-ticket.html#${hash}`
        });
            
        const closeTicketButton = document.querySelector('.close-ticket-button');

        closeTicketButton.addEventListener('click', () =>
        {
            location.href = `close-ticket.html#${hash}`
        });
        
        const deleteTicketButton = document.querySelector('.delete-ticket');
        
        deleteTicketButton.addEventListener('click', () =>
        {
            const confirmation = confirm('Are you sure you want to permanently delete this ticket?');
            
            if (!confirmation) return;
            
            database.off('value');
            
            database.remove().then(() =>
            {
                location.href = 'helpdesk.html';
            });
        });
    }
    else
    {
        throw new Error('Ticket ID invalid.');
    }
});
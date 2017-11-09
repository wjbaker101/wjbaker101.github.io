const formatDigits = i =>
{
    if (i < 10) return `0${i}`;
    
    return String(i);
};

const formatDate = d =>
{
    const yyyy = d.getFullYear();
    const mm = formatDigits(d.getMonth());
    const dd = formatDigits(d.getDay());
    
    const date = `${yyyy}-${mm}-${dd}`;
    
    const h = formatDigits(d.getHours());
    const i = formatDigits(d.getMinutes());
    const s = formatDigits(d.getSeconds());
    
    const time = `${h}:${i}:${s}`;
    
    return `${date} ${time}`;
};

window.addEventListener('load', () =>
{
    const logsContainer = document.querySelector('.logs-container');
    
    const updateCallLogs = (update) =>
    {
        logsContainer.innerHTML = '';
        
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
                        <p><strong>Hardware Serial Number:</strong> ${log[1].hardware}</p>
                        <p><strong>Software License ID:</strong> ${log[1].software}</p>
                        <p><strong>Operating System Version:</strong> ${log[1].operatingSystem}</p>
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
            
            const status = (ticket.specialist === null) ? 'Pending' : ((ticket.closed) ? 'Closed' : 'Open');
            
            document.querySelector('.ticket-status').innerHTML = status;
            document.querySelector('.problem-type').innerHTML = ticket.problemType;
            //document.querySelector('.os-id').innerHTML = `${ticket.operatingSystem} (Licensed!)`;
            //document.querySelector('.problem-software').innerHTML = `${ticket.software} (Licensed!)`;
            
            if (ticket.logs)
                updateCallLogs(ticket.logs);
        });
            
        const newLogButton = document.querySelector('.new-log-button');

        newLogButton.addEventListener('click', () =>
        {
            location.href = `new-ticket.html#${hash}`
        });
    
        /*const submitLogButton = document.querySelector('.submit-log-button');
        const newLogInput = document.querySelector('.new-log-input');

        submitLogButton.addEventListener('click', () =>
        {
            if (newLogInput.value.length === 0) return;

            const newLog = { time: new Date().getTime(), message: newLogInput.value };
            
            database.child('logs').push().set(newLog);
        });
        
        const deleteButton = document.querySelector('.delete-log-button');
        
        deleteButton.addEventListener('click', () =>
        {
            const confirmation = confirm('Are you sure you want to delete this log?');
            
            if (!confirmation) return;
            
            database.set(null);
            
            location.href = 'helpdesk.html';
        });*/
    }
    else
    {
        throw new Error('Ticket ID invalid.');
    }
});
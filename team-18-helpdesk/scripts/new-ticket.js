const formatDigits = (i) =>
{
    if (i < 10) return `0${i}`;
    
    return String(i);
};

const formatDate = (d) =>
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
    if (window.location.hash)
    {
        const hash = window.location.hash.substring(1);
        
        document.querySelector('.title').innerHTML = `New Call Log for Ticket ${hash}`;
    }
    
    const specialistID = document.querySelector('.specialist-id-input');
    
    document.querySelector('.dans-button').addEventListener('click', () =>
    {
        specialistID.value = 'A8660251';
    });
    
    document.querySelector('.jims-button').addEventListener('click', () =>
    {
        specialistID.value = 'A9585866';
    });
    
    document.querySelector('.bobs-button').addEventListener('click', () =>
    {
        specialistID.value = 'A0026451';
    });
    
    const employeeIDCheckbox = document.querySelector('.use-employee-id');
    
    employeeIDCheckbox.addEventListener('change', () =>
    {
        document.querySelector('.employee-id-container').classList.toggle('hidden', !employeeIDCheckbox.checked);
        document.querySelector('.employee-info-container').classList.toggle('hidden', employeeIDCheckbox.checked);
    });
    
    const newTypeCheckbox = document.querySelector('.new-type-input');
    
    newTypeCheckbox.addEventListener('change', () =>
    {
        document.querySelector('.new-type-container').classList.toggle('hidden', !newTypeCheckbox.checked);
    });
    
    const newTicketButton = document.querySelector('.new-ticket-button');
    
    newTicketButton.addEventListener('click', () =>
    {
        const confirmation = confirm('Are you sure you want to create this new ticket?');
        
        if (!confirmation) return;
        
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
        
        const callerID = document.querySelector('.caller-id-input').value;
        let callerName = document.querySelector('.caller-name-input').value;
        let callerJob = document.querySelector('.caller-job-input').value;
        let callerDepartment = document.querySelector('.caller-department-input').value;
        const callerPhone = document.querySelector('.caller-phone-input').value;
        
        const problemDescription = document.querySelector('.problem-description-input').value;
        const problemHardware = document.querySelector('.problem-hardware-input').value;
        const problemOperatingSystem = document.querySelector('.problem-os-input').value;
        const problemSoftware = document.querySelector('.problem-software-input').value;
        const problemType = document.querySelector('.problem-type-input').value;
        const newProblemType = document.querySelector('.new-problem-type').value;
        
        let newTicket =
        {
            callTime: (new Date()).getTime(),
            specialist: { id: '-KyAutZ8rUH8BBtLu6z9', name: 'Bob Harrison' },
            closed: false,
            problemType: (newTypeCheckbox.checked ? newProblemType : problemType),
        };
        
        if (callerName.length === 0) callerName = 'Jim Bob';
        if (callerDepartment.length === 0) callerDepartment = 'Sales Team';
        if (callerJob.length === 0) callerJob = 'Sales Assistant';
        
        let log =
        {
            caller:
            {
                id: callerID,
                name: callerName,
                department: callerDepartment,
                jobTitle: callerJob,
                phoneNumber: callerPhone
            },
            callTime: (new Date()).getTime(),
            operator: { name: 'Dan French' },
            description: problemDescription,
            hardware: problemHardware,
            operatingSystem: problemOperatingSystem,
            software: problemSoftware,
        };
        
        if (window.location.hash)
        {
            const hash = window.location.hash.substring(1);
            
            const ticketDatabase = firebase.database().ref(`/tickets/${hash}`);
            
            ticketDatabase.child('logs').push(log);
        }
        else
        {
            database.push(newTicket).child('logs').push(log);
        }
        
        //window.location.href = 'helpdesk.html';
    });
});
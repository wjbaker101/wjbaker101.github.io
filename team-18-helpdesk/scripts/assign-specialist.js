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
    
        document.querySelector('.return-link').href = `view-ticket.html#${hash}`;
        
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
        
        const submitButton = document.querySelector('.submit-button');
        
        submitButton.addEventListener('click', () =>
        {
            const database = firebase.database().ref(`/tickets/${hash}`);
            
            database.once('value').then((snapshot) =>
            {
                let ticket = snapshot.val();

                ticket.specialist = { id: specialistID.value, name: 'Bob Harrison' };

                database.set(ticket).then(() =>
                {
                    location.href = 'specialist.html';
                });
            });
        });
    }
    else
    {
        throw new Error('No ticket ID.');
    }
});
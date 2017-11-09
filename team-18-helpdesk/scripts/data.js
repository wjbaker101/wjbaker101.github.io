const departments = (() =>
{
    const createDepartment = (departmentName) =>
    {
        return {
            name: departmentName,
        }
    };
    
    const d =
    [
        createDepartment('IT'),
        createDepartment('Sales Team'),
        createDepartment('Accountants'),
        createDepartment('Events Team'),
        createDepartment('Helpdesk'),
    ];
    
    return d;
})();

const employees = (() =>
{
    const createEmployee = (firstName, surname, birthDate, jobTitle, departmentNo, phoneNumber) =>
    {
        return {
            firstName: firstName,
            surname: surname,
            birthDate: birthDate,
            jobTitle: jobTitle,
            departmentNumber: departmentNo,
            telephoneNumber: phoneNumber,
        }
    };
    
    const e =
    [
        createEmployee('Jim', 'Bob', '1978-07-11', 'Sales Assistant', 1, '07245193759'),
        createEmployee('John', 'Smith', '1982-02-27', 'CEO', 0, '07245193701'),
        createEmployee('Steve', 'Man', '1978-07-11', 'General Manager', 0, '07245193702'),
        createEmployee('Benjamin', 'Philips', '1978-07-11', 'Sales Assistant', 1, '07245193766'),
        createEmployee('Emily', 'Blake', '1978-07-11', 'Sales Assistant', 1, '07245193713'),
        createEmployee('Sally', 'Paris', '1978-07-11', 'Events Coordinator', 3, '07245193707'),
        createEmployee('William', 'Yates', '1978-07-11', 'Assistant Manager', 0, '07245193704'),
        createEmployee('William', 'Smith', '1978-07-11', 'Personal Assistant', 0, '07245193709'),
        createEmployee('John', 'Yates', '1978-07-11', 'Accountant', 2, '07245193717'),
        createEmployee('Dan', 'French', '1978-07-11', 'Helpdesk Operator', 4, '07245193755'),
        createEmployee('Cher', 'Lowell', '1978-07-11', 'Helpdesk Operator', 4, '07245193756'),
        createEmployee('Bob', 'Harrison', '1978-07-11', 'Specialist', 4, '07245193772'),
        createEmployee('Tim', 'Tom', '1978-07-11', 'Specialist', 4, '07245193798'),
    ];
    
    return e;
})();

const tickets = (() =>
{
    const createTicket = (employeeNumber, callDateTime, operatorNumber, callDescription) =>
    {
        return {
            employeeNumber: employeeNumber,
            callDateTime: callDateTime,
            operatorNumber: operatorNumber,
            callDescription: callDescription,
            assignedSpecialist: null,
            closed: false,
        }
    };
    
    const t =
    [
        createTicket(2, '2017-10-10 15:54:20', 9, 'Mouse does not work properly.'),
    ];
    
    return t;
})();
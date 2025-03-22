function startTestFlow() {
// יצירת משתמש חדש
const registerUser = {
    username: 'user123',
    password: 'pass123',
    membershipType: 'basic',
    fitnessGoal: 'focus'
};

const registerXhr = new FXMLHttpRequest();
registerXhr.open('POST', '/api/auth/register');
registerXhr.onload = function () {
    console.log('🔐 Registration:', JSON.parse(registerXhr.responseText));

    // ממשיכים לבדוק התחברות
    loginUser();
};
registerXhr.send(JSON.stringify(registerUser));

// התחברות משתמש
function loginUser() {
    const loginXhr = new FXMLHttpRequest();
    loginXhr.open('POST', '/api/auth/login');
    loginXhr.onload = function () {
        const res = JSON.parse(loginXhr.responseText);
        console.log('✅ Login:', res);

        // ממשיכים לבדוק יצירת משימה
        createTask(res.username);
    };
    loginXhr.send(JSON.stringify({
        username: registerUser.username,
        password: registerUser.password
    }));
}

// יצירת משימה חדשה
function createTask(userId) {
    const taskXhr = new FXMLHttpRequest();
    taskXhr.open('POST', '/api/tasks');
    taskXhr.onload = function () {
        console.log('🆕 Task Created:', JSON.parse(taskXhr.responseText));

        // ממשיכים לבדוק שליפת משימות
        getAllTasks();
    };
    taskXhr.send(JSON.stringify({
        userId: userId,
        title: 'Learn JavaScript',
        description: 'Finish DOM and async modules',
        dueDate: '2025-03-31',
        completed: false
    }));
}

// שליפת כל המשימות
function getAllTasks() {
    const getXhr = new FXMLHttpRequest();
    getXhr.open('GET', '/api/tasks');
    getXhr.onload = function () {
        const res = JSON.parse(getXhr.responseText);
        console.log('📋 All Tasks:', res.message);

        if (res.message.length > 0) {
            const taskId = res.message[0].id;
            updateTask(taskId);
        }
    };
    getXhr.send();
}

// עריכת משימה
function updateTask(taskId) {
    const updateXhr = new FXMLHttpRequest();
    updateXhr.open('PUT', `/api/tasks/${taskId}`);
    updateXhr.onload = function () {
        console.log('✏️ Task Updated:', JSON.parse(updateXhr.responseText));

        deleteTask(taskId);
    };
    updateXhr.send(JSON.stringify({
        title: 'Learn JavaScript (updated)',
        completed: true
    }));
}

// מחיקת משימה
function deleteTask(taskId) {
    const deleteXhr = new FXMLHttpRequest();
    deleteXhr.open('DELETE', `/api/tasks/${taskId}`);
    deleteXhr.onload = function () {
        console.log('🗑️ Task Deleted:', JSON.parse(deleteXhr.responseText));
    };
    deleteXhr.send();
}
}

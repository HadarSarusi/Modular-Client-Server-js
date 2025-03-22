const TasksDB = {
    getTasks: () => JSON.parse(localStorage.getItem('tasks')) || [],

    addTask: (task) => {
        const tasks = TasksDB.getTasks();
        task.id = Date.now().toString(); // מזהה ייחודי
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    },

    deleteTask: (id) => {
        let tasks = TasksDB.getTasks();
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    },

    getTask: (id) => {
        const tasks = TasksDB.getTasks();
        return tasks.find(task => task.id === id) || null;
    },

    editTask: (id, updatedTask) => {
        let tasks = TasksDB.getTasks();
        tasks = tasks.map(task =>
            task.id === id ? { ...task, ...updatedTask } : task
        );
        localStorage.setItem('tasks', JSON.stringify(tasks));
    },

    // משימות לפי שם משתמש (למשתמשים מרובים)
    getTasksByUserId: (userId) => {
        const tasks = TasksDB.getTasks();
        return tasks.filter(task => task.userId === userId);
    }
};

// const AuthDB = {
//     getUsers: () => {
//         const users = JSON.parse(localStorage.getItem('users'));
//         return Array.isArray(users) ? users : [];
//     },

//     addUser: (user) => {
//         const users = AuthDB.getUsers();
//         users.push(user);
//         localStorage.setItem('users', JSON.stringify(users));
//     },

//     getUser: (username) => {
//         const users = AuthDB.getUsers();
//         return users.find(user => user.username === username) || null;
//     },

//     updateUser: (username, updatedUser) => {
//         let users = AuthDB.getUsers();
//         users = users.map(user =>
//             user.username === username ? { ...user, ...updatedUser } : user
//         );
//         localStorage.setItem('users', JSON.stringify(users));
//     },
// };

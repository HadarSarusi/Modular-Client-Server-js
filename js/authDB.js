const AuthDB = {
    getUsers: () => {
        const users = JSON.parse(localStorage.getItem('users'));
        return Array.isArray(users) ? users : [];
    },

    addUser: (user) => {
        const users = AuthDB.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    },

    getUser: (username) => {
        const users = AuthDB.getUsers();
        return users.find(user => user.username === username) || null;
    },

    updateUser: (username, updatedUser) => {
        let users = AuthDB.getUsers();
        users = users.map(user =>
            user.username === username ? { ...user, ...updatedUser } : user
        );
        localStorage.setItem('users', JSON.stringify(users));
    },
};

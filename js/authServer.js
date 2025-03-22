const failedAttempts = {}; // מניעת ניסיונות התחברות מרובים

const AuthServer = {
    handleRequest: (method, url, data, callback) => {
        const users = AuthDB.getUsers();

        // רישום משתמש
        if (url.endsWith('/register') && method === 'POST') {
            const user = JSON.parse(data);
            const usersArray = Object.values(users);

            if (usersArray.some(u => u.username === user.username)) {
                callback({ status: 400, message: 'User already exists' });
            } else {
                AuthDB.addUser(user);
                callback({
                    status: 200,
                    message: 'User registered successfully',
                    success: true,
                    username: user.username
                });
            }
        }

        // התחברות
        else if (url.endsWith('/login') && method === 'POST') {
            const user = JSON.parse(data);
            const usersArray = Object.values(users);
            const now = Date.now();
            const lockDuration = 2 * 60 * 1000;

            const validUser = usersArray.find(u => u.username === user.username);

            if (!validUser) {
                return callback({ status: 400, message: 'User does not exist' });
            }

            if (failedAttempts[user.username] && failedAttempts[user.username].lockUntil > now) {
                let remainingTime = Math.ceil((failedAttempts[user.username].lockUntil - now) / 1000);
                return callback({
                    status: 403,
                    message: `User locked. Try again in ${remainingTime} seconds.`,
                    remainingTime
                });
            }

            if (validUser.password === user.password) {
                delete failedAttempts[user.username];
                return callback({
                    status: 200,
                    message: 'Login successful',
                    success: true,
                    username: validUser.username
                });
            } else {
                failedAttempts[user.username] = failedAttempts[user.username] || { count: 0, lockUntil: 0 };
                failedAttempts[user.username].count++;

                if (failedAttempts[user.username].count >= 3) {
                    failedAttempts[user.username].lockUntil = now + lockDuration;
                    failedAttempts[user.username].count = 0;

                    return callback({
                        status: 403,
                        message: `Too many failed attempts. Locked for ${lockDuration / 1000} seconds.`,
                        remainingTime: lockDuration / 1000
                    });
                } else {
                    return callback({
                        status: 401,
                        message: `Incorrect password. ${3 - failedAttempts[user.username].count} attempts remaining.`,
                    });
                }
            }
        }

        // התנתקות
        else if (url.endsWith('/logout') && method === 'POST') {
            callback({ status: 200, message: 'Logout successful', success: true });
        }

        // בקשה לא נתמכת
        else {
            callback({ status: 400, message: 'Invalid auth request' });
        }
    }
};

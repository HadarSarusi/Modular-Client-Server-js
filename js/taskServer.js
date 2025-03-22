const TaskServer = {
    handleRequest: (method, url, data, callback) => {
        const id = url.split('/').pop();

        if (method === 'GET' && id === "tasks") { 
            const tasks = TasksDB.getTasks();
            callback({ status: 200, message: tasks });

        } else if (method === 'GET' && id !== "tasks") {
            const task = TasksDB.getTask(id);
            callback({ status: 200, message: task });

        } else if (method === 'POST') { 
            const task = JSON.parse(data);
            TasksDB.addTask(task);
            callback({ status: 200, message: 'Task added successfully' });

        } else if (method === 'PUT') {
            const updatedTask = JSON.parse(data);
            TasksDB.editTask(id, updatedTask);
            callback({ status: 200, message: 'Task updated successfully' });

        } else if (method === 'DELETE') {
            TasksDB.deleteTask(id);
            callback({ status: 200, message: 'Task deleted successfully' });

        } else {
            callback({ status: 400, message: 'Invalid request' });
        }
    }
};

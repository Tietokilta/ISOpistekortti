import React, { useState } from "react";
import adminService from "../services/admin.js"

export function AddTask({ tasks, setTasks }) {
    const [showForm, setShowForm] = useState(false);
    const [task, setTask] = useState({
        title: "",
        description: "",
        needs_admin_approval: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggle = () => {
        setTask((prev) => ({ ...prev, needs_admin_approval: !prev.needs_admin_approval }));
    };

    const handleSubmit = async () => {
        if (!task.title.trim()) return;

        const result = await adminService.createTask(task)
        if (result.status === 201) {
            setTasks([...tasks, result.data])
            setTask({ title: "", description: "", needs_admin_approval: false });
            setShowForm(false);
        }

    };

    return (
        <div className="max-w-md mx-auto mb-4">
            {!showForm ? (
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowForm(true)}
                >
                    Add Task
                </button>
            ) : (
                <div className="p-4 mt-4 border rounded-lg shadow space-y-4 bg-white">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium">
                            Task title
                        </label>
                        <input
                            id="title"
                            name="title"
                            onChange={handleChange}
                            placeholder="Enter task title"
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium">
                            Description
                        </label>
                        <input
                            id="description"
                            name="description"
                            onChange={handleChange}
                            placeholder="Enter description"
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="needs_admin_approval"
                            checked={task.needs_admin_approval}
                            onChange={handleToggle}
                        />
                        <label htmlFor="needs_admin_approval">Needs Admin Approval</label>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            className="px-4 py-2 rounded border"
                            onClick={() => { setShowForm(false), setTask() }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={handleSubmit}
                        >
                            Save Task
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

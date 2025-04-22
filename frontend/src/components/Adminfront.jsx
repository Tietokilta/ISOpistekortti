//see and modify all the tasks
//see and modify all the users
//see the requested credits
//modify the credits of a certain user
import { useState } from "react";
import { Logout } from "./Logout"

const Container = ({title}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="p-6 rounded-2xl shadow-lg w-150 bg-white mb-4">
            <button
            className="w-full text-left flex justify-between items-center font-bold text-gray-900 text-lg p-4 border-b"
            onClick={() => setIsOpen(!isOpen)}
            >
            {title}
            <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                ▼
            </span>
            </button>
            {isOpen && (
            <div className="p-4 text-gray-600">
                jotain jotain
            </div>
            )}
        </div>
    );
}

export function AdminFront({ setLogin }) {


    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-white text-5xl mb-5">Admin Panel</h1>
            <Container title={"Users"}/>
            <Container title={"Tasks"}/>
            <Container title={"Accept requested credits"}/>
            <Logout setLogin={setLogin}/>
        </div>
    )
}

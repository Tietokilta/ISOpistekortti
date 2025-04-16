import { useState } from "react"

export function Card({ title, description}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="p-6 rounded-2xl shadow-lg w-80 bg-white mb-4">
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
              {description}
            </div>
          )}
        </div>
    );
}




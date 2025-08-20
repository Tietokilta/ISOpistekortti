import React from "react";

export function TaskProgress({ completed, total }) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="w-full max-w-md p-4">
      {/* Label */}
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-white drop-shadow-md">
          Tasks Completed
        </span>
        <span className="text-sm text-gray-300">
          {completed} / {total}
        </span>
      </div>

      {/* Progress bar background */}
      <div className="w-full bg-gray-700 rounded-full h-5 shadow-inner">
        {/* Progress fill */}
        <div
          className="h-5 bg-green-500 rounded-full shadow-lg transition-all duration-500 ease-in-out"
          style={{
            width: `${percentage}%`,
            boxShadow: "0 0 10px rgba(34,197,94,0.8)", // glow effect
          }}
        />
      </div>
    </div>
  );
}

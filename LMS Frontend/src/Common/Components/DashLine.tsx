import React from 'react';
import '../styles/main.css'; // You'll need some CSS for animation

const DashLine = () => {
  return (
    <svg
      width="100%"
      height="150"
      className='dash-bg'
      viewBox="0 0 800 150"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,100 C200,50 600,150 800,100" // Custom path
        fill="transparent"
        stroke="rgba(180, 178, 178, 0.71)"
        strokeWidth="2"
        strokeDasharray="5 10"  // Dashes
        className="typing-dash"
      />
    </svg>
  );
};

export default DashLine;

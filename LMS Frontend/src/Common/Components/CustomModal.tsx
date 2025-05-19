import React, { useEffect, useState } from "react";
import "../styles/modal.css"

interface CustomModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ title, description, onClose }) => {
  const handleNeverShowAgain = () => {
    sessionStorage.setItem("noticeToken", "never");
    onClose();
  };

  const handleShowMeLater = () => {
    sessionStorage.setItem("noticeToken", "later");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="modal-buttons">
          <button onClick={handleNeverShowAgain} className="never">
            Never Show Again
          </button>
          <button onClick={handleShowMeLater} className="later">
            Show Me Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;

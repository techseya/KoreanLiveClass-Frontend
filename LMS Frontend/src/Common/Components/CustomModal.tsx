import React from "react";
import "../styles/modal.css";

interface CustomModalProps {
  title: string;
  description: string;
  imageSrc?: string; // Optional image URL
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  description,
  imageSrc,
  onClose,
}) => {
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

        {/* Show image if provided */}
        {imageSrc && (
          <img src={imageSrc.replace("dl=0", "raw=1")} alt="Modal visual" className="modal-image" />
        )}

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

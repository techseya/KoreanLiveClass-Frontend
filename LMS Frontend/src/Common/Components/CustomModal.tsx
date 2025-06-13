import React from "react";
import "../styles/modal.css";

interface CustomModalProps {
  title: string;
  description: string;
  imageSrc?: string;
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  description,
  imageSrc,
  onClose,
}) => {
  const handleNeverShowAgain = () => {
    localStorage.setItem("noticeToken", "never");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Close icon in top-right */}
        <span className="modal-close-iconX" onClick={handleNeverShowAgain}>
          &times;
        </span>

        <h2>{title}</h2>

        {imageSrc && (
          <img
            src={imageSrc.replace("dl=0", "raw=1")}
            alt="Modal visual"
            className="modal-image"
          />
        )}

        <p>{description}</p>
      </div>
    </div>
  );
};

export default CustomModal;

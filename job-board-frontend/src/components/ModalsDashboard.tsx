import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => {
    const handleCloseClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onClose();
    }

    const modalContent = (
        <div className="fixed top-0 left-0 right-0 flex z-50 items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-fullblack bg-opacity-70">
                <div className="flex justify-between items-center mb-4">
                    {title && <h1 className="text-2xl font-bold text-dark">{title}</h1>}
                    <button onClick={handleCloseClick} className=" fixed top-10  right-5 sm:right-10 text-interact font-bold text-4xl sm:text-5xl hover:text-alert_info transition-colors">
                        &times;
                    </button>
                <div className="mb-4">{children}</div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent, 
        document.body
    );
}

export default Modal;
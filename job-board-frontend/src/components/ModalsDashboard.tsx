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
        <div className="fixed top-0 left-0 right-0 flex z-50 items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-fullblack bg-opacity-30">
            <div className="">
                <div className="">
                    <div className="">
                        <a href="#" onClick={handleCloseClick}>
                            x
                        </a>
                    </div>
                    {title && <h1>{title}</h1>}
                    <div className="">{children}</div>
                </div>
            </div>
        </div>
    )

    return ReactDOM.createPortal(
        modalContent, 
        document.body
    );
}

export default Modal;
import React, { FC } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 ml-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

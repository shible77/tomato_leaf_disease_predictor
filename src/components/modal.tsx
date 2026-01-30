import type { FC } from "react";
import { useEffect } from "react";


interface ModalProps {
  open: boolean;
  setShowModal: ()=> void;
}

const Modal: FC<ModalProps> = ({ open, setShowModal }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, setShowModal]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:cursor-pointer"
      onClick={setShowModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-[90%] max-w-md rounded-2xl bg-white p-3 shadow-xl animate-fadeIn hover:cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center justify-center space-y-4 w-full p-3">
          <div>
            <h2 id="modal-title" className="text-md font-semibold text-gray-800">
              Since the model is deployed on a free-tier server, initial request may take longer than usual.
            </h2>
            <p className="mt-4 text-sm text-gray-600">
              Thank you for your patience!
            </p>
          </div>
          <div className="flex w-full items-end">
            <button
              onClick={setShowModal}
              className="ml-auto rounded-sm bg-red-600 px-3 py-1 text-white hover:bg-red-700 transition hover:cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;

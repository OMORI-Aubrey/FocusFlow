import React, { useState } from 'react';
import HelpModal from './HelpModal';
import HelpSelection from './HelpSelection';

const HelpButton = () => {
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); // 'guide' or 'hotkey'

  const openSelection = () => setSelectionOpen(true);
  const closeSelection = () => setSelectionOpen(false);

  const openModal = (type) => {
    setModalContent(type);
    setSelectionOpen(false); // Close selection when modal opens
  };
  const closeModal = () => {
    setModalContent(null);
  }

  return (
    <>
      <button
        onClick={openSelection}
        className="fixed top-5 right-5 w-10 h-10 bg-blue-500 text-white rounded-full text-2xl font-bold cursor-pointer shadow-lg z-10 flex justify-center items-center"
      >
        ?
      </button>
      {selectionOpen && <HelpSelection onSelect={openModal} closeModal={closeSelection} />}
      {modalContent && <HelpModal contentType={modalContent} closeModal={closeModal} />}
    </>
  );
};

export default HelpButton;

import React, { useState } from 'react';
import HelpModal from './HelpModal';

const HelpButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="fixed top-5 right-5 w-10 h-10 bg-blue-500 text-white rounded-full text-2xl font-bold cursor-pointer shadow-lg z-10 flex justify-center items-center"
      >
        ?
      </button>
      {isModalOpen && <HelpModal closeModal={closeModal} />}
    </>
  );
};

export default HelpButton;

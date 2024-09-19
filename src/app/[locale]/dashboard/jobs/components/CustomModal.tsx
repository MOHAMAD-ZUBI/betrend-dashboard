"use client";
import React from "react";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  className,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <ModalHeader>
        <h3>{title}</h3>
      </ModalHeader>
      <ModalContent>{children}</ModalContent>
      <ModalFooter>
        <Button color="default" onClick={onClose}>
          Cancel
        </Button>
        {onSubmit && <Button onClick={onSubmit}>Submit</Button>}
      </ModalFooter>
    </Modal>
  );
};

export default CustomModal;

"use client";
import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;

  description: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  description,
}) => (
  <Modal isOpen={isVisible} onClose={onClose}>
    <ModalHeader>User Deletion</ModalHeader>
    <ModalBody>
      <p>{description}</p>
      <p>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </p>
    </ModalBody>
    <ModalFooter>
      <Button color="default" onPress={onClose}>
        Cancel
      </Button>
      <Button color="danger" onPress={onConfirm}>
        Confirm
      </Button>
    </ModalFooter>
  </Modal>
);

export default CustomModal;

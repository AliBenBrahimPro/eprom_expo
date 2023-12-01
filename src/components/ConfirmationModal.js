import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const ConfirmationModal = ({ isVisible, onCancel, onConfirm }) => {
  return (
    <Modal isVisible={isVisible}>
      <View>
        <Text>Are you sure?</Text>
        <Text>You will delete this survey definitively!</Text>
        <TouchableOpacity onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onConfirm}>
          <Text>Yes, delete</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

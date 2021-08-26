import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import AddEntryForm, { HealthCheckEntryFormValues, HospitalEntryFormValues, OccupationalEntryFormValues } from './AddEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onHealthCheckSubmit: (values: HealthCheckEntryFormValues) => void;
  onHospitalEntrySubmit: (values: HospitalEntryFormValues) => void;
  onOccupationalEntrySubmit: (values: OccupationalEntryFormValues) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onHealthCheckSubmit, onHospitalEntrySubmit, onOccupationalEntrySubmit, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddEntryForm 
        onHealthCheckSubmit={onHealthCheckSubmit}
        onHospitalEntrySubmit={onHospitalEntrySubmit}
        onOccupationalEntrySubmit={onOccupationalEntrySubmit}
        onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default AddEntryModal;

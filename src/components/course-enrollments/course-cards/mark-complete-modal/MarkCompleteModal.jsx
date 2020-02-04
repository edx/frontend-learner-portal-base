import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { camelCaseObject } from '@edx/frontend-platform';
import { Modal, StatefulButton } from '@edx/paragon';

import ModalBody from './ModalBody';
import { markCourseAsCompleteRequest } from './data/service';
import { AppContext } from '../../../app-context';

export const MarkCompleteModalContext = createContext();

const initialState = {
  confirmButtonState: 'default',
  confirmError: null,
  confirmSuccessful: false,
};

const MarkCompleteModal = ({
  courseId,
  isOpen,
  courseTitle,
  courseLink,
  onSuccess,
  onClose,
}) => {
  const { pageContext: { enterpriseUUID } } = useContext(AppContext);
  const [
    { confirmButtonState, confirmError, confirmSuccessful },
    setState,
  ] = useState(initialState);

  const handleConfirmButtonClick = async () => {
    setState({ confirmButtonState: 'pending' });
    try {
      const res = await markCourseAsCompleteRequest({
        enterprise_id: enterpriseUUID,
        course_id: courseId,
        marked_done: 'True',
      });
      onSuccess({
        response: camelCaseObject(res.data),
        /**
         * We're passing a function to reset the `MarkCompleteModal` state
         * to its initial state here. That way, the consumer of this component
         * can call this function to reset the modal state. When the `open` prop
         * on the Paragon `Modal` component changes to false, it doesn't trigger
         * the `onClose` callback, another place where we reset to initial state.
         * Because of this, passing the `resetModalState` function gives control
         * to the consumer of this component to reset to initial state as needed.
         */
        resetModalState: () => setState({ ...initialState }),
      });
    } catch (error) {
      setState({
        confirmButtonState: 'default',
        confirmError: error,
      });
    }
  };

  const handleModalOnClose = () => {
    setState({ ...initialState });
    onClose();
  };

  return (
    <MarkCompleteModalContext.Provider
      value={{
        courseTitle,
        courseLink,
        confirmError,
      }}
    >
      <Modal
        title="Mark course as complete"
        body={<ModalBody />}
        buttons={[
          <StatefulButton
            labels={{
              default: 'Mark as complete',
              pending: 'Marking as complete...',
            }}
            disabledStates={['pending']}
            className="confirm-mark-complete-btn btn-primary"
            state={confirmButtonState}
            onClick={handleConfirmButtonClick}
            key="confirm-mark-complete-btn"
          />,
        ]}
        open={isOpen && !confirmSuccessful}
        onClose={handleModalOnClose}
        closeText="Cancel"
      />
    </MarkCompleteModalContext.Provider>
  );
};

MarkCompleteModal.propTypes = {
  courseId: PropTypes.string.isRequired,
  courseTitle: PropTypes.string.isRequired,
  courseLink: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

MarkCompleteModal.defaultProps = {
  isOpen: false,
};

export default MarkCompleteModal;

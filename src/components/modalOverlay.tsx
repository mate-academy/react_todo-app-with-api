import React from 'react';
import classNames from 'classnames';

type Props = {
  isTodoUpdating: boolean,
  isTodoLoading: boolean,
};

export const ModalOverlay: React.FC<Props> = ({
  isTodoUpdating,
  isTodoLoading,
}) => {
  return (
    <div className={classNames(
      'modal', 'overlay', {
        'is-active':
     isTodoUpdating || isTodoLoading,
      },
    )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};

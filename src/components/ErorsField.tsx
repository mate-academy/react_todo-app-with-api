/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';

type Props = {
  onCloseError: () => void,
  unableAddTodo: boolean,
  unableEmptyTitle: boolean,
  unableDeleteTodo: boolean,
  unableUpdateTodo: boolean,
};

export const ErorsField: FC<Props> = (props) => {
  const {
    onCloseError,
    unableAddTodo,
    unableEmptyTitle,
    unableDeleteTodo,
    unableUpdateTodo,
  } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className="notification is-danger is-light has-text-weight-normal"
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          onCloseError();
        }}
      />
      {(unableAddTodo || unableEmptyTitle) && 'Unable to add a todo'}
      {unableDeleteTodo && 'Unable to delete a todo'}
      {unableUpdateTodo && 'Unable to update a todo'}
    </div>
  );
};

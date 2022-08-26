/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

type Props = {
  errorMsgTodo: boolean;
  hasLoadingTodoError: boolean;
  hasDeleteTodoError: boolean;
  hasUpdateTodoError: boolean;
  hideErrors: boolean;
  toHideErrors: () => void;
};

export const ErrorNotification: React.FC<Props> = (props) => {
  const {
    errorMsgTodo,
    hasLoadingTodoError,
    hasDeleteTodoError,
    hasUpdateTodoError,
    hideErrors,
    toHideErrors,
  } = props;

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
        { hidden: hideErrors },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={toHideErrors}
      />
      { errorMsgTodo && <>Title can&#39;t be empty</>}
      {hasLoadingTodoError && <>Unable to add a todo</>}
      <br />
      {hasDeleteTodoError && <>Unable to delete a todo</>}
      <br />
      {hasUpdateTodoError && <>Unable to update a todo</>}
    </div>
  );
};

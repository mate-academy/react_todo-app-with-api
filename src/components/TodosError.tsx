import cn from 'classnames';
import { useTodo } from '../providers/AppProvider';

export const TodosError = () => {
  const { errorTitle, setError } = useTodo();

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !errorTitle,
      })}
    >
      {/* eslint-disable-next-line */}
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => {
          setError('');
        }}
      />

      {errorTitle}
    </div>
  );
};

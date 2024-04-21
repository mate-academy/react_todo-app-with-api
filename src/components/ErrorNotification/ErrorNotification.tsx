import classNames from 'classnames';
import { useContext } from 'react';
import { todosContext } from '../../Store';

type Props = { errorMessage: string };

export const ErrorNotification: React.FC<Props> = ({ errorMessage }) => {
  const [store, setters] = useContext(todosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setters.setErrorMessage('')}
      />
      {store.errorMessage}
    </div>
  );
};

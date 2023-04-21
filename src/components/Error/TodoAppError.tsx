import {FC, useContext, useEffect} from 'react';
import classNames from 'classnames/bind';
import {AppTodoContext} from '../../contexts/AppTodoContext';
import {ErrorType} from "../../types/enums";

export const TodoAppError: FC = () => {
  const { errorMessage, setErrorMessage } = useContext(AppTodoContext);

  useEffect(() => {
    let timerID: NodeJS.Timeout;

    if (errorMessage !== ErrorType.NoError) {
      timerID = setTimeout(() => {
        setErrorMessage(ErrorType.NoError);
      }, 3000);
    }

    return () => {
      clearTimeout(timerID);
    };
  }, [errorMessage]);

  return (
    <div
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: errorMessage === ErrorType.NoError },
      )}
    >
      <button
        aria-label="close button"
        value=""
        type="button"
        className="delete"
        onClick={() => {
          setErrorMessage(ErrorType.NoError);
        }}
      />
      {errorMessage !== ErrorType.NoError && errorMessage}
    </div>
  );
};

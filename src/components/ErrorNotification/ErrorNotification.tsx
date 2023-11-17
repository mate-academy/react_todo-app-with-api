import {
  useEffect,
  // useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorType } from '../../types/ErrorType';
import { AppDispatch, RootState } from '../../redux/store';
import { clearErrorType, hideError } from '../../redux/todoSlice';
import { showErrorWithTimeout } from '../../redux/showErrorThunk';

export const ErrorNotification: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const errorType = useSelector((state: RootState) => state.todos.errorType);
  const isErrorVisible = useSelector(
    (state: RootState) => state.todos.isErrorVisible,
  );

  useEffect(() => {
    if (errorType) {
      dispatch(showErrorWithTimeout());
    }
  }, [errorType, dispatch]);

  const handleHideError = () => {
    dispatch(hideError());
    dispatch(clearErrorType());
  };

  const getErrorMessage = () => {
    switch (errorType) {
      case ErrorType.LoadError:
        return 'Unable to load todos';
      case ErrorType.EmptyTitle:
        return 'Title should not be empty';
      case ErrorType.AddTodoError:
        return 'Unable to add a todo';
      case ErrorType.DeleteTodoError:
        return 'Unable to delete a todo';
      case ErrorType.UpdateTodoError:
        return 'Unable to update a todo';
      default:
        return null;
    }
  };

  return (
    isErrorVisible ? (
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="Hide error"
          onClick={handleHideError}
        />
        {getErrorMessage()}
        <br />
      </div>
    ) : null
  );
};

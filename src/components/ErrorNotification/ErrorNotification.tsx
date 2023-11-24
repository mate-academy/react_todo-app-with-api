import {
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
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

  const getErrorMessage = (error: ErrorType | null): string | null => {
    return error;
  };

  return (
    <CSSTransition
      in={isErrorVisible}
      timeout={300}
      classNames="notification"
      unmountOnExit
    >
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!isErrorVisible ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="Hide error"
          onClick={handleHideError}
        />
        {getErrorMessage(errorType)}
        <br />
      </div>
    </CSSTransition>
  );
};

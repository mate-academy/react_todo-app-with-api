/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoContext } from '../../TodoContext/TodoContext';
import { Errors } from '../../utils/enums';

export const TodoError = () => {
  const {
    errorMessage,
    setErrorMessage,
  } = useContext(TodoContext);

  return (
    <TransitionGroup>
      {errorMessage && (
        <CSSTransition
          timeout={300}
          classNames="item"
        >
          <div className={cn(
            'notification',
            'is-danger',
            'is-light',
            'has-text-weight-normal',
            { hidden: !errorMessage },
          )}
          >
            <button
              type="button"
              className="delete"
              onClick={() => setErrorMessage(Errors.NoErrors)}
            />

            {errorMessage}
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

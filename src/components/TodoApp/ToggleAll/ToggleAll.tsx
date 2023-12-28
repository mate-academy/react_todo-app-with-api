/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useCallback, useContext } from 'react';
import { DispatchContext, StateContext } from '../../../libs/state';
import { Actions, ErrorMessages } from '../../../libs/enums';
import { updateTodo } from '../../../api/todos';
import { setErrorMessage } from '../../../libs/helpers';

type Props = {
  hasActiveTodos: boolean;
};

export const ToggleAll: React.FC<Props> = ({ hasActiveTodos }) => {
  const { todos } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleToggleAll = useCallback(() => {
    const shouldToggleTodos = hasActiveTodos
      ? todos.filter(({ completed }) => !completed)
      : todos;

    dispatch({
      type: Actions.setLoader,
      payload: {
        isLoading: true,
        todoIds: shouldToggleTodos.map(({ id }) => id),
      },
    });

    const toggledPromises = shouldToggleTodos.map(
      ({ id, completed }) => updateTodo(id, { completed: !completed }),
    );

    Promise.allSettled(toggledPromises)
      .then((results) => {
        let hasError = false;

        results.forEach((result => {
          if (result.status === 'fulfilled') {
            dispatch({ type: Actions.update, payload: { todo: result.value } });
          }

          if (result.status === 'rejected') {
            hasError = true;
          }
        }));

        if (hasError) {
          setErrorMessage(dispatch, ErrorMessages.FailedToUpdate);
        }
      })
      .finally(() => {
        dispatch({ type: Actions.setLoader, payload: { isLoading: false } });
      });
  },
  [dispatch, hasActiveTodos, todos]);

  return (
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: !hasActiveTodos,
      })}
      data-cy="ToggleAllButton"
      onClick={handleToggleAll}
    />
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import * as todosAction from '../../features/todos';
import * as statusAction from '../../features/status';
import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  toggleAllChange: () => void
};

export const Header: React.FC<Props> = ({ toggleAllChange }) => {
  const [inputDisabled, setInputDisabled] = useState(false);
  const [textTodo, setTextTodo] = useState('');
  const statusAllCompleted = useAppSelector(
    state => state.status.statusAllCompleted,
  );
  const todos = useAppSelector(state => state.todos.todos);

  const USER_ID = 11582;

  const dispatch = useAppDispatch();

  const createTodo = (
    title: string,
  ) => {
    if (!title.trim()) {
      dispatch(todosAction.setErrorMessage('Title should not be empty'));

      return;
    }

    setInputDisabled(true);
    const temporaryTodo: Todo = {
      id: 0, userId: USER_ID, title, completed: false,
    };

    dispatch(todosAction.addTempo(temporaryTodo));

    todoService.createTodos({ userId: USER_ID, title, completed: false })
      .then(newTodo => {
        dispatch(todosAction.add(newTodo));
        setTextTodo('');
      })
      .catch((error) => {
        dispatch(todosAction.setErrorMessage('Unable to add a todo'));
        throw error;
      })
      .finally(() => {
        setInputDisabled(false);
        dispatch(todosAction.clearTempo());
      });
  };

  return (
    <header className="todoapp__header">

      {(todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', { active: statusAllCompleted },
          )}
          onClick={() => {
            toggleAllChange();

            dispatch(statusAction.setStatusAllCompleted(!statusAllCompleted));
          }}
        />
      ))}

      {/* Add a todo on form submit */}
      <form
        onSubmit={(event) => {
          event.preventDefault();

          createTodo(textTodo.trim());
        }}
      >
        <input
          disabled={inputDisabled}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={textTodo}
          onChange={(event) => setTextTodo(event.target.value)}
          ref={(input) => input && input.focus()}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { USER_ID } from '../../constants/user';
import { addTodos, updateTodos } from '../../api/todos';
import { TodoContext } from '../../context/TodoContext';
import { Error } from '../../types/Error';

export const Header: React.FC = () => {
  const [value, setValue] = useState('');

  const {
    todos,
    tempTodo,
    handleError,
    addNewTodo,
    handleSetTempTodo,
    updateTodo,
    handleUpdatingTodosIds,
  } = useContext(TodoContext);

  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoInput.current?.focus();
  }, [todos.length, tempTodo]);

  const isAllTodoCompleted = todos.every(({ completed }) => completed);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const newTodo = {
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    e.preventDefault();
    handleError('');

    if (!value.trim()) {
      handleError('Title should not be empty');

      return;
    }

    todoInput.current?.setAttribute('disabled', 'true');

    handleSetTempTodo({ ...newTodo, id: 0 });
    addTodos(newTodo)
      .then((todo) => {
        addNewTodo(todo);
        setValue('');
      })
      .catch(() => {
        handleError(Error.Add);
      })
      .finally(() => {
        todoInput.current?.removeAttribute('disabled');
        handleSetTempTodo(null);
      });
  };

  const handleCompleteAll = () => {
    const completedTodos = todos
      .filter(({ completed }) => completed);

    const activeTodos = todos
      .filter(({ completed }) => !completed);

    handleError('');

    if (!isAllTodoCompleted) {
      activeTodos.forEach(({ title, completed, id }) => {
        handleUpdatingTodosIds(id);

        updateTodos({ title, completed: !completed, id })
          .then(() => updateTodo({ title, completed: !completed, id }))
          .catch(() => {
            handleError(Error.Update);
          })
          .finally(() => handleUpdatingTodosIds(null));
      });
    } else {
      completedTodos.forEach(({ title, completed, id }) => {
        handleUpdatingTodosIds(id);

        updateTodos({ title, completed: !completed, id })
          .then(() => updateTodo({ title, completed: !completed, id }))
          .catch(() => {
            handleError(Error.Update);
          })
          .finally(() => handleUpdatingTodosIds(null));
      });
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllTodoCompleted })}
          data-cy="ToggleAllButton"
          onClick={handleCompleteAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={todoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </header>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React,
{
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoContext } from '../../context/TodoContext';
import { USER_ID } from '../../constants/user';
import { addTodos, updateTodos } from '../../api/todos';
import { Error } from '../../types/Error';

export const Header: React.FC = () => {
  const {
    todos,
    tempTodo,
    addTodo,
    updateTodo,
    handleUpdatingTodosIds,
    handleError,
    handleSetTempTodo,
  } = useContext(TodoContext);

  const [value, setValue] = useState('');

  const todoInput = useRef<HTMLInputElement>(null);
  const isAllTodosCompleted = todos.every(({ completed }) => completed);

  useEffect(() => {
    todoInput.current?.focus();
  }, [todos.length, tempTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const newTodo = {
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    event.preventDefault();
    handleError('');

    if (!value.trim()) {
      handleError('Title should not be empty');

      return;
    }

    todoInput.current?.setAttribute('disabled', 'true');

    handleSetTempTodo({ ...newTodo, id: 0 });
    addTodos(newTodo)
      .then((todo) => {
        addTodo(todo);
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

    if (isAllTodosCompleted) {
      completedTodos.forEach(({ title, completed, id }) => {
        handleUpdatingTodosIds(id);

        updateTodos({ title, completed: !completed, id })
          .then(() => updateTodo({ title, completed: !completed, id }))
          .catch(() => {
            handleError(Error.Update);
          })
          .finally(() => handleUpdatingTodosIds(null));
      });
    } else {
      activeTodos.forEach(({ title, completed, id }) => {
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
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isAllTodosCompleted },
          )}
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
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
    </header>
  );
};

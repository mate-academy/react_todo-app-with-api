import { useEffect, useRef } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type Props = {
  isDisabled: boolean,
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  onTitleChange: (title: string) => void,
  todos: Todo[],
  onTodosChange: React.Dispatch<React.SetStateAction<Todo[]>>,
  onErrorMesssageChange: (val: string) => void,
};

export const TodoHeader: React.FC<Props> = ({
  isDisabled,
  onHandleSubmit,
  title,
  onTitleChange,
  todos,
  onTodosChange,
  onErrorMesssageChange,
}) => {
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [todos.length, isDisabled]);

  const isAllTodosCopmleted = todos.every(({ completed }) => completed);

  const handleToggleAllTodos = async () => {
    const updatedTodos: Promise<Todo>[] = [];

    if (isAllTodosCopmleted) {
      todos.forEach(todo => {
        if (todo.completed) {
          const updatedTodo = { ...todo, completed: false };

          updatedTodos.push(updateTodo(todo.id, updatedTodo));
        }
      });
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          const updatedTodo = { ...todo, completed: true };

          updatedTodos.push(updateTodo(todo.id, updatedTodo));
        }
      });
    }

    try {
      await Promise.all(updatedTodos);

      onTodosChange(currentTodos => {
        return currentTodos.map(todo => ({
          ...todo,
          completed: !isAllTodosCopmleted,
        }));
      });
    } catch (error) {
      onErrorMesssageChange('Unable to update a todos');
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          aria-label="toggle"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: isAllTodosCopmleted },
          )}
          onClick={handleToggleAllTodos}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onHandleSubmit}>
        <input
          disabled={isDisabled}
          ref={inputField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            onTitleChange(event.target.value);
          }}
        />
      </form>
    </header>
  );
};

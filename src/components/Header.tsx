/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useRef, useEffect, useCallback, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { addTodo } from '../api/todos';
import { PrevTodos } from '../types/PrevState';

type Props = {
  todos: Todo[];
  handleToggleTodo: (todo: Todo) => void;
  activeTodosCounter: number;
  completedTodosCounter: number;
  onTempTodoChange: (tempTodo: Todo | null) => void;
  onErrorMessageChange: (error: string) => void;
  onTodosChange: (todos: Todo[] | PrevTodos) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  handleToggleTodo,
  activeTodosCounter,
  completedTodosCounter,
  onTempTodoChange,
  onErrorMessageChange,
  onTodosChange,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isTodoAdding, setIsTodoAdding] = useState(false);

  const handleAddTodo = useCallback((newTodoTitle: string) => {
    onErrorMessageChange('');
    onTempTodoChange({
      id: 0,
      title: newTodoTitle,
      userId: 0,
      completed: false,
    });

    return addTodo(newTodoTitle.trim())
      .then((newTodo) => {
        onTodosChange((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch((error) => {
        onErrorMessageChange('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        onTempTodoChange(null);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      onErrorMessageChange('Title should not be empty');

      return;
    }

    setIsTodoAdding(true);
    handleAddTodo(todoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .catch((error) => {
        onErrorMessageChange('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setIsTodoAdding(false);
      });
  };

  const handleToggleAll = () => {
    const activeTodos = todos.filter(todo => !todo.completed);

    const todosToToggle = activeTodosCounter === todos.length
      || completedTodosCounter === todos.length
      ? todos
      : activeTodos;

    const togglePromises = todosToToggle.map(todo => handleToggleTodo(todo));

    Promise.all(togglePromises)
      .catch(() => {
        onErrorMessageChange('Unable to toggle all todos');
      });
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current?.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeTodosCounter,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
};

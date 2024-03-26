import cn from 'classnames';
import React, { useEffect, useRef } from 'react';

import { USER_ID, addTodo, updateTodo } from '../../api/todos';
import { useTodos } from '../../hooks/useTodos';
import { Todo } from '../../types';

const TodoInput: React.FC = () => {
  const [isAllCompleted, setIsAllCompleted] = React.useState(false);

  const {
    todos,
    setTodos,
    setError,
    isLoading,
    setIsLoading,
    setTempTodo,
    handleError,
    isAllDeleted,
    setLoadingTodosIDs,
  } = useTodos();

  const [newTodoTitle, setNewTodoTitle] = React.useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const isAllSelected = todos.every(todo => todo.completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isAllDeleted]);

  const hangleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
    setError('');
  };

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) {
      handleError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    });

    const newTodo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, 0]);

    addTodo(newTodo)
      .then(data => {
        setTodos(prevTodos => [...prevTodos, data]);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
        setLoadingTodosIDs([]);
      });
  };

  const handleEnterEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTodo();
    }
  };

  const handleUpdateCheckbox = (todoId: number, completed: boolean) => {
    setIsLoading(true);
    setLoadingTodosIDs(prev => [...prev, todoId]);

    updateTodo(todoId, { completed: completed })
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(prevTodo => {
            return prevTodo.id === todoId
              ? { ...prevTodo, completed: completed }
              : prevTodo;
          }),
        );
      })
      .catch(() => {
        handleError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setIsAllCompleted(!isAllCompleted);
        setLoadingTodosIDs([]);
      });
  };

  const handleToggleAll = () => {
    if (isAllSelected) {
      todos.forEach(todo => {
        handleUpdateCheckbox(todo.id, !todo.completed);
      });
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          handleUpdateCheckbox(todo.id, true);
        }
      });
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="toggle all active todos"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllSelected && todos.length > 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form>
        <input
          value={newTodoTitle}
          ref={inputRef}
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          onChange={hangleInputChange}
          onKeyDown={handleEnterEvent}
        />
      </form>
    </header>
  );
};

export default TodoInput;

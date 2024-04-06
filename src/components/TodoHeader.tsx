import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../enums/Errors';

interface Props {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (error: Errors | null) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  loadingTodosIds: number[];
  setLoadingTodosIds: (todos: number[]) => void;
  setFocusInput: (bool: boolean) => void;
  focusInput: boolean;
  clearErrorMessage: () => void;
  updtTodo: (todo: Todo, data: Partial<Todo>) => Promise<Todo>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  addTodo,
  setErrorMessage,
  setTempTodo,
  loadingTodosIds,
  setLoadingTodosIds,
  setFocusInput,
  focusInput,
  clearErrorMessage,
  updtTodo,
  setTodos,
}) => {
  const [newTodoTitle, setNewTodoTitle] = React.useState('');
  const isAllSelected = todos.every(todo => todo.completed);

  const inputField = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
      setFocusInput(false);
    }
  }, [setFocusInput]);

  useEffect(() => {
    if (inputField.current && focusInput) {
      inputField.current.focus();
      setFocusInput(false);
    }
  }, [focusInput, setFocusInput]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    clearErrorMessage();

    if (!newTodoTitle.trim()) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    const newTodo = {
      userId: 11946,
      title: newTodoTitle.trim(),
      completed: false,
    };

    const tempTodo = {
      id: 0,
      userId: 11946,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(tempTodo);

    setLoadingTodosIds([...loadingTodosIds, tempTodo.id]);

    addTodo(newTodo)
      .then(() => {
        setNewTodoTitle('');
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingTodosIds(loadingTodosIds.filter(id => id !== tempTodo.id));
        setFocusInput(true);
      });
  };

  const handleToggleAll = () => {
    setLoadingTodosIds(todos.map(todo => todo.id));

    if (isAllSelected) {
      Promise.all(todos.map(todo => updtTodo(todo, { completed: false })))
        .then(() => {
          setTodos(
            todos.map(prevTodo => {
              return { ...prevTodo, completed: false };
            }),
          );
        })
        .catch(error => {
          setErrorMessage(Errors.UpdateTodo);
          throw error;
        })
        .finally(() => {
          setLoadingTodosIds([]);
        });
    } else {
      const todosToUpdate = todos
        .filter(todo => !todo.completed)
        .map(todo => updtTodo(todo, { completed: true }));

      Promise.all(todosToUpdate)
        .then(() => {
          setTodos(
            todos.map(prevTodo => {
              return { ...prevTodo, completed: true };
            }),
          );
        })
        .catch(error => {
          setErrorMessage(Errors.UpdateTodo);
          throw error;
        })
        .finally(() => {
          setLoadingTodosIds([]);
        });
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllSelected,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          disabled={loadingTodosIds.length !== 0}
          onChange={handleInputChange}
          ref={inputField}
        />
      </form>
    </header>
  );
};

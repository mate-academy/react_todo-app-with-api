import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../enums/Errors';
import { USER_ID } from '../api/todos';

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
  handleToggleAll: () => void;
  isAllSelected: boolean;
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
  handleToggleAll,
  isAllSelected,
}) => {
  const [newTodoTitle, setNewTodoTitle] = React.useState('');

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
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    const tempTodo = {
      id: 0,
      userId: USER_ID,
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

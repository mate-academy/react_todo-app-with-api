import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../enums/Errors';

interface Props {
  todos: Todo[];
  preparedTodos: Todo[];
  setTempTodo: (tempTodo: Todo | null) => void;
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (error: Errors | null) => void;
  clearErrorMessage: () => void;
  inputField: React.RefObject<HTMLInputElement>;
  loadingTodosIds: number[];
  setLoadingTodosIds: (todos: number[]) => void;
  updtTodo: (id: number, data: Partial<Todo>) => Promise<Todo>;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  preparedTodos,
  setTempTodo,
  addTodo,
  setErrorMessage,
  clearErrorMessage,
  loadingTodosIds,
  setLoadingTodosIds,
  inputField,
  updtTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const isToggleAllChecked = useMemo(() => {
    return preparedTodos.every(todo => todo.completed);
  }, [preparedTodos]);

  useEffect(() => {
    if (loadingTodosIds.length === 0) {
      inputField.current?.focus();
    }
  }, [loadingTodosIds, inputField]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    clearErrorMessage();

    if (!newTodoTitle.trim()) {
      setErrorMessage(Errors.EmptyTitle);
      inputField.current?.focus();

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
        inputField.current?.focus();
      });
  };

  const handleToggleAll = () => {
    setLoadingTodosIds(preparedTodos.map(todo => todo.id));

    let todosToUpdate = [];

    if (isToggleAllChecked) {
      todosToUpdate = preparedTodos.map(todo =>
        updtTodo(todo.id, { completed: false }),
      );
    } else {
      todosToUpdate = todos
        .filter(todo => !todo.completed)
        .map(todo => updtTodo(todo.id, { completed: true }));
    }

    Promise.all(todosToUpdate)
      .catch(error => {
        setErrorMessage(Errors.UpdateTodo);
        throw error;
      })
      .finally(() => {
        setLoadingTodosIds([]);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isToggleAllChecked,
          })}
          onClick={handleToggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loadingTodosIds.length !== 0}
          value={newTodoTitle}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};

import { useState } from 'react';
import cn from 'classnames';

import { addTodo, updateTodo } from '../../api/todos';

import { useTodosContext } from '../../context/TodosContext';

import { AddTodoForm } from './AddTodoForm';

import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

export const Header = () => {
  const [title, setTitle] = useState('');
  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    setLoadingIds,
    createNewTodo,
  } = useTodosContext();

  const isToggleButtonActive = todos.every(t => t.completed);
  const showToggleAll = !!todos.length;

  function addNewTodo(newTodo: Todo) {
    addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(prev => [...prev, todoFromServer]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.addError);
        setTempTodo(null);
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingIds([]);
      });
  }

  function updatingTodo(todoForUpdate: Todo, updatedTodos: Todo[]) {
    updateTodo(todoForUpdate)
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        setErrorMessage(Errors.updateError);
      })
      .finally(() => {
        setLoadingIds([]);
      });
  }

  const handleAddTodoAndSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage(Errors.titleError);

      return;
    }

    const newTodo = createNewTodo(title);

    setTempTodo(newTodo);
    setLoadingIds(prev => [...prev, 0]);

    addNewTodo(newTodo);
  };

  const handleToggleAllTodosStatus = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    const todoIdsToUpdate = allCompleted
      ? todos.map(todo => todo.id)
      : todos.filter(todo => !todo.completed).map(todo => todo.id);

    setLoadingIds(todoIdsToUpdate);

    await Promise.all(
      updatedTodos.map(todo =>
        todoIdsToUpdate.includes(todo.id)
          ? updatingTodo(todo, updatedTodos)
          : Promise.resolve(),
      ),
    );
  };

  return (
    <header className="todoapp__header">
      {showToggleAll && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isToggleButtonActive,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllTodosStatus}
        />
      )}
      <AddTodoForm
        submit={handleAddTodoAndSubmit}
        setTitle={setTitle}
        title={title}
      />
    </header>
  );
};

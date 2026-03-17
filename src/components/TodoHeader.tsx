import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import React from 'react';
import { postTodo, updateTodo } from '../api/todos';
import EError from '../utils/EError';
import classNames from 'classnames';

interface ITodoHeader {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTempTodo: (todo: Todo | null) => void;
  setErrorMessage: (error: EError) => void;
}

export const TodoHeader: React.FC<ITodoHeader> = ({
  todos,
  setTodos,
  setLoadingIds,
  setTempTodo,
  setErrorMessage,
}) => {
  const [value, setValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAllCompleted = todos.length > 0 && todos.every(t => t.completed);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding, todos]);

  const onUpdateTodo = async (todoToUpdate: Todo) => {
    setLoadingIds(prev => [...prev, todoToUpdate.id]);

    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch {
      setErrorMessage(EError.update);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  };

  const handleToogle = async () => {
    const targetStatus = !isAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    await Promise.all(
      todosToUpdate.map(todo =>
        onUpdateTodo({ ...todo, completed: targetStatus }),
      ),
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!value.trim()) {
      setErrorMessage(EError.emptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: 3941,
      title: value.trim(),
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(newTodo);

    try {
      const createdTodo = await postTodo(newTodo);

      setTodos(current => [...current, createdTodo]);
      setValue('');
    } catch (error) {
      setErrorMessage(EError.add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  return (
    <header
      className={classNames('todoapp__header', { active: isAllCompleted })}
    >
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={handleToogle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          value={value}
          disabled={isAdding}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setValue(event.target.value)}
        />
      </form>
    </header>
  );
};

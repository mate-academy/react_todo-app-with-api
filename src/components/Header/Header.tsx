import React, { useEffect, useRef, useState } from 'react';
import { ErrorType } from '../../types/Error';
import { USER_ID, addTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface Props {
  todos: Todo[];
  loadingIds: number[];
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Header: React.FC<Props> = ({
  todos,
  loadingIds,
  setTodos,
  setTempTodo,
  setError,
  setLoadingIds,
}) => {
  const formInputRef = useRef<HTMLInputElement>(null);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  const allCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    formInputRef.current?.focus();
  }, [todos, loading]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normTask = newTask.trim();

    if (!normTask) {
      setError(ErrorType.EmptyTitle);

      return;
    }

    setLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: normTask,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addTodo(newTodo)
      .then((todo: Todo) => {
        setTodos([...todos, todo]);
        setNewTask('');
      })
      .catch(() => {
        setError(ErrorType.AddFail);
        setNewTask(newTodo.title);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const handleToggleAllCompleted = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    const updatePromises = todos.map(todo =>
      todo.completed === allCompleted
        ? updateTodo({ ...todo, completed: !allCompleted })
        : Promise.resolve(),
    );

    const todoIds = updatedTodos.map(todo => todo.id);

    setLoadingIds(todoIds);

    Promise.all(updatePromises)
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        setError(ErrorType.UpdateFail);
      })
      .finally(() => setLoadingIds([]));
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={handleInputChange}
          ref={formInputRef}
          disabled={loading || !!loadingIds.length}
        />
      </form>
    </header>
  );
};

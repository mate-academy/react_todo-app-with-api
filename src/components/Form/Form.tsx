import React, { useEffect, useRef, useState } from 'react';
import { ErrorType } from '../../types/Error';
import { USER_ID, addTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  deletingIds: number[];
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setUpdatingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Form: React.FC<Props> = ({
  todos,
  deletingIds,
  setTodos,
  setTempTodo,
  setError,
  setUpdatingIds,
}) => {
  const formInputRef = useRef<HTMLInputElement>(null);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    formInputRef.current?.focus();
  }, [loading, deletingIds.length]);

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
    const allCompleted = todos.every(todo => todo.completed);
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

    setUpdatingIds(todoIds);

    Promise.all(updatePromises)
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        setError(ErrorType.UpdateFail);
      })
      .finally(() => setUpdatingIds([]));
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className="todoapp__toggle-all active"
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
          disabled={loading || !!deletingIds.length}
        />
      </form>
    </header>
  );
};

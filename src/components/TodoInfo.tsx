import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContent } from './TodoContent';

type Props = {
  todo: Todo;
  isLoaderVisible: boolean;
  onDelete: (todoId: number) => void;
  changeTodoTitle: (todo: Todo, newTitle: string) => void;
  changeTodoStatus: (todo: Todo) => void;
  setUpdatingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isLoaderVisible,
  onDelete,
  changeTodoTitle,
  changeTodoStatus,
  setUpdatingTodoIds,
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsCompleted(todo?.completed);
  }, [isLoaderVisible]);

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
      setIsEditing(false);
      setQuery(todo.title);
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIsEditing(false);
    event.preventDefault();

    if (query === todo.title) {
      return;
    }

    if (!query.trim()) {
      onDelete(todo.id);

      return;
    }

    changeTodoTitle(todo, query);
  };

  const toggleStatus = () => {
    setIsCompleted(!isCompleted);
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);
    changeTodoStatus(todo);
  };

  return (
    <div className={classNames('todo', {
      completed: isCompleted,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={toggleStatus}
        />
      </label>

      <span
        className="todo__title"
        onDoubleClick={() => {
          setIsEditing(true);
        }}
      >
        <TodoContent
          todo={todo}
          query={query}
          setQuery={setQuery}
          onDelete={onDelete}
          isEditing={isEditing}
          onSubmit={handleFormSubmit}
        />
      </span>

      <div className={classNames(
        'modal',
        'overlay', {
          'is-active': isLoaderVisible,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

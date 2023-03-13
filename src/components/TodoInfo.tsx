import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContent } from './TodoContent';

type Props = {
  todo: Todo;
  isLoaderVisible: boolean;
  onDelete: (todoId: number) => void;
  handleChangeStatus: (todo: Todo) => void;
  handleChangeTitle: (todo: Todo, newTitle: string) => void;
  setUpdatingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  isLoaderVisible,
  handleChangeTitle,
  setUpdatingTodoIds,
  handleChangeStatus,
}) => {
  const [query, setQuery] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setIsCompleted(todo?.completed);
  }, [isLoaderVisible]);

  function handleKeyUp(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      setIsEditing(false);
      setQuery(todo.title);
    }
  }

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

    handleChangeTitle(todo, query);
  };

  const toggleStatus = () => {
    setIsCompleted(!isCompleted);
    setUpdatingTodoIds(prevTodoIds => [...prevTodoIds, todo.id]);
    handleChangeStatus(todo);
  };

  return (
    <li className={classNames('todo', {
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

      <div
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
      </div>

      <div
        className={classNames(
          'modal',
          'overlay', {
            'is-active': isLoaderVisible,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};

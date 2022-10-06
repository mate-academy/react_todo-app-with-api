import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  isLoading: boolean;
  removeTodo: (TodoId: number) => void;
  isSelectId: number[];
  changeStatus: (todoId: number, data: Partial<Todo>) => void;
  todos: Todo[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  isSelectId,
  changeStatus,
  todos,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [selectedTodo, setSelectedTodo] = useState(0);
  const { title, id, completed } = todo;

  const isAdding = isSelectId.includes(id) && isLoading && id === 0;

  const updateTitile = () => {
    if (newTitle === title) {
      setIsEdit(false);

      return;
    }

    if (!newTitle) {
      removeTodo(selectedTodo);
    }

    if (todos.find(item => item.title === newTitle)) {
      setIsEdit(false);
    }

    changeStatus(selectedTodo, { title: newTitle });
    setIsEdit(false);
    setNewTitle('');
  };

  const titleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleIsEdit = () => {
    setIsEdit(true);
    setSelectedTodo(id);
    setNewTitle(title);
  };

  const handleBlur = () => {
    updateTitile();
    setIsEdit(false);
  };

  const handleKey = (event: { key: string }) => {
    if (event.key === 'Enter') {
      updateTitile();
    }

    if (event.key === 'Escape') {
      setIsEdit(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => changeStatus(id, { completed: !completed })}
        />
      </label>
      { isEdit && selectedTodo === id
        ? (
          <form onSubmit={event => {
            event.preventDefault();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              value={newTitle}
              placeholder="Employ todo will be deleted"
              onChange={titleChange}
              onBlur={handleBlur}
              onKeyDown={handleKey}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleIsEdit}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                removeTodo(id);
              }}
            >
              ×
            </button>
          </>
        )}

      {isSelectId.includes(id) && (
        <TodoLoader />
      )}

      {isAdding && (
        <TodoLoader />
      )}
    </div>
  );
};

import classNames from 'classnames';
import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  todos: Todo[];
  isAdding?: boolean;
  selectedTodosIds: number[];
  onDelete: (id: number) => Promise<void>;
  handleOnChange: (id: number, data: Partial<Todo>) => Promise<void>;
  completedTodosIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  isAdding,
  selectedTodosIds,
  onDelete,
  handleOnChange,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [selectedTodo, SetSelectedTodo] = useState(0);
  const [newTodo, setNewTodo] = useState('');
  const [doubleClick, setDoubleClick] = useState(false);

  const { id, title, completed } = todo;

  const isActive = selectedTodosIds.includes(id) || isAdding;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  const UpdateTitle = () => {
    if (!newTodo) {
      onDelete(selectedTodo);
      setDoubleClick(false);

      return;
    }

    if (newTodo === title) {
      setDoubleClick(false);

      return;
    }

    if (todos.find(element => element.title === newTodo)) {
      setDoubleClick(false);
      SetSelectedTodo(0);
    }

    handleOnChange(selectedTodo, { title: newTodo });
    setDoubleClick(false);
    setNewTodo('');
    SetSelectedTodo(0);
  };

  const TitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleDoubleClick = () => {
    setDoubleClick(true);
    SetSelectedTodo(id);
    setNewTodo(title);
  };

  const handleBlur = () => {
    UpdateTitle();
    setDoubleClick(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setDoubleClick(false);
      SetSelectedTodo(0);
    }

    if (event.key === 'Enter') {
      UpdateTitle();
      SetSelectedTodo(0);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleOnChange(id, { completed: !completed })}
        />
      </label>
      {doubleClick && selectedTodo === id
        ? (
          <form onSubmit={event => {
            event.preventDefault();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              value={newTodo}
              className="todo__title-field"
              placeholder="If your todo is empty, it will be deleted"
              onChange={TitleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}
      <Loader
        isActive={isActive}
      />
    </div>
  );
};

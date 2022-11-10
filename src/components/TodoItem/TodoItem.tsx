import classNames from 'classnames';
import {
  ChangeEvent, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';
import { Error } from '../../types/ErrorType';
import { deleteTodos } from '../../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  selectedTodosIds: number[];
  errorNotification: string | null;
  isAdding?: boolean;
  handleOnChange: (id: number, data: Partial<Todo>) => Promise<void>;
  setErrorNotification: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  selectedTodosIds,
  errorNotification,
  isAdding,
  handleOnChange,
  setErrorNotification,
  setSelectedTodosIds,
  setTodos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [selectedTodo, SetSelectedTodo] = useState(0);
  const [newTodo, setNewTodo] = useState('');
  const [doubleClick, setDoubleClick] = useState(false);

  const { id, title, completed } = todo;

  const isActive = useMemo(
    () => selectedTodosIds.includes(id) || (isAdding && todo.id === 0),
    [selectedTodosIds, isAdding, todo.id],
  );

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedTodosIds([TodoId]);
    try {
      await deleteTodos(TodoId);

      setTodos((prevTodos) => prevTodos.filter((item) => item.id !== TodoId));
    } catch {
      setErrorNotification(Error.Delete);
    }
  }, [todos, errorNotification]);

  const updateTitle = useCallback(() => {
    if (!newTodo) {
      removeTodo(selectedTodo);
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
  }, [newTodo, selectedTodo, doubleClick]);

  const titleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleDoubleClick = () => {
    setDoubleClick(true);
    SetSelectedTodo(id);
    setNewTodo(title);
  };

  const handleBlur = () => {
    updateTitle();
    setDoubleClick(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setDoubleClick(false);
      SetSelectedTodo(0);
    }

    if (event.key === 'Enter') {
      updateTitle();
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
              onChange={titleChange}
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
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
          </>
        )}
      {isActive && (
        <Loader
          isActive={isActive}
        />
      )}
    </div>
  );
};

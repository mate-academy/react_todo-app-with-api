import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo,
  onDelete: (id: number) => Promise<void>,
  onStatusChange: (todoId: number, data: Partial<Todo>) => void,
  loadingTodoIds: number[],
  isAdding: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onStatusChange,
  loadingTodoIds,
  isAdding,
}) => {
  const { id, title, completed } = todo;
  const [newTodo, setNewTodo] = useState(title);
  const [onDoubleClick, setOnDoubleClick] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  const loaderCondition = loadingTodoIds.includes(todo.id)
  || (isAdding && todo.id === 0);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [onDoubleClick]);

  const newTitle = () => {
    if (newTodo.trim().length === 0) {
      onDelete(todo.id);
      setOnDoubleClick(false);

      return;
    }

    if (newTodo === todo.title) {
      setOnDoubleClick(false);
    }

    onStatusChange(todo.id, { title: newTodo });
    setOnDoubleClick(false);
    setNewTodo('');
  };

  const handleTitleUpdate = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleOnBlur = () => {
    newTitle();
    setOnDoubleClick(false);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOnDoubleClick(false);
    }

    if (event.key === 'Enter') {
      newTitle();
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classnames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            onStatusChange(id, { completed: !completed });
          }}
        />
      </label>
      { onDoubleClick
        ? (
          <form onSubmit={newTitle}>
            <input
              type="text"
              data-cy="TodoTitleField"
              value={newTodo}
              ref={newTodoField}
              placeholder="The empty todo will be removed"
              className="todo__title-field"
              onBlur={handleOnBlur}
              onChange={handleTitleUpdate}
              onKeyDown={onKeyPress}
            />
          </form>
        ) : (

          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setOnDoubleClick(true);
                setNewTodo(title);
              }}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(id)}
            >
              &times;
            </button>
          </>
        )}
      { loaderCondition && (
        <Loader
          isAdding={isAdding}
        />
      )}
    </div>
  );
};

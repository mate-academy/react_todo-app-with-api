import classNames from 'classnames';
import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo,
  removeTodo: (id: number) => Promise<void>,
  isDeleting: boolean,
  onUpdateTodo: (todo: Todo, title?: string) => Promise<void>,
  isUpdating: boolean
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isDeleting,
  onUpdateTodo,
  isUpdating,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;
  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isClicked]);

  const onDeleteTodo = () => {
    setSelectedTodoId(id);

    removeTodo(id).catch(() => setSelectedTodoId(0));
  };

  const handleToggleTodoStatus = async () => {
    setSelectedTodoId(id);

    await onUpdateTodo(todo);
    setSelectedTodoId(0);
  };

  const updateTitleTodo = () => {
    if (title === newTodoTitle) {
      setIsClicked(false);

      return;
    }

    if (newTodoTitle.trim().length === 0) {
      onDeleteTodo();
      setIsClicked(false);

      return;
    }

    setSelectedTodoId(id);

    onUpdateTodo(todo, newTodoTitle).finally(() => setSelectedTodoId(0));

    setIsClicked(false);
  };

  const handleDoubleClick = () => {
    setIsClicked(true);
    setNewTodoTitle(todo.title);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTitleTodo();
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      await updateTitleTodo;
      setIsClicked(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        {
          completed,
        })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleToggleTodoStatus}
        />
      </label>

      {isClicked ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={handleTitleChange}
            onBlur={updateTitleTodo}
            onKeyDown={handleKeyPress}
            ref={newTodoField}
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
            onClick={onDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      {(id === 0
        || selectedTodoId
        || isUpdating
        || (isDeleting && completed)) && (
        <TodoLoader />
      )}

    </div>
  );
};

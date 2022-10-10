import classNames from 'classnames';
import {
  useEffect,
  useRef,
  useState,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

interface Props {
  todoItem: Todo,
  selectedTodo: number[],
  handleDelete: (id: number) => Promise<void>;
  isAdd: boolean
  isDelete: boolean;
  isUpdateTodo: (todo: Todo, title?: string) => Promise<void>;
  isUpdate: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todoItem,
  selectedTodo,
  handleDelete,
  isAdd,
  isDelete,
  isUpdateTodo,
  isUpdate,
}) => {
  const {
    title,
    completed,
    id,
  } = todoItem;

  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isClicked]);

  const handleToggleTodoStatus = async () => {
    setSelectedTodoId(id);

    await isUpdateTodo(todoItem);
    setSelectedTodoId(0);
  };

  const updateTodoTitle = () => {
    if (title === newTodoTitle) {
      setIsClicked(false);

      return;
    }

    if (!newTodoTitle.trim()) {
      handleDelete(id);
      setIsClicked(false);

      return;
    }

    setSelectedTodoId(id);

    isUpdateTodo(todoItem, newTodoTitle).finally(() => setSelectedTodoId(0));

    setIsClicked(false);
  };

  const handleDoubleClick = () => {
    setIsClicked(true);
    setNewTodoTitle(todoItem.title);
  };

  const handleSubmitUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateTodoTitle();
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      await updateTodoTitle();
      setIsClicked(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
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
        <form onSubmit={handleSubmitUpdate}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={handleTitleChange}
            onBlur={updateTodoTitle}
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
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      )}

      {(id === 0
      || (isAdd && selectedTodo)
      || isUpdate
      || selectedTodoId
      || (isDelete && completed)) && (
        <TodoLoader />
      )}
    </div>
  );
};

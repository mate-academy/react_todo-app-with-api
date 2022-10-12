import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  isDeleting: boolean;
  changeStatusTodo: (id: number) => void;
  tooggleIds: number[];
  updateTitle: (title: string, id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, isDeleting, changeStatusTodo, tooggleIds, updateTitle,
}) => {
  const changeTitleInput = useRef<HTMLInputElement>(null);
  const [selectedTodoid, setSelectedTodoid] = useState(0);
  const [isInput, setIsInput] = useState(false);
  const [inputValue, setInputValue] = useState(todo.title);

  const removeTodo = (id: number) => {
    setSelectedTodoid(id);
    deleteTodo(id);
  };

  const changeCheckboxStatus = async (id: number) => {
    setSelectedTodoid(id);
    await changeStatusTodo(id);
    setSelectedTodoid(0);
  };

  useEffect(() => {
    if (changeTitleInput.current) {
      changeTitleInput.current.focus();
    }
  }, [isInput]);

  const handleDoubleClick = () => {
    setInputValue(todo.title);
    setIsInput(true);
  };

  const saveNewTitle = async () => {
    setSelectedTodoid(todo.id);
    setIsInput(false);
    if (todo.title === inputValue) {
      setSelectedTodoid(0);

      return;
    }

    await updateTitle(inputValue, todo.id);

    setInputValue(todo.title);

    setSelectedTodoid(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveNewTitle();
    }

    if (e.key === 'Escape') {
      setIsInput(false);
      setInputValue(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => {
            changeCheckboxStatus(todo.id);
          }}
        />
      </label>

      {!isInput ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              handleDoubleClick();
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              removeTodo(todo.id);
            }}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            ref={changeTitleInput}
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onBlur={() => {
              saveNewTitle();
            }}
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          (todo.id === 0
          || selectedTodoid
          || (isDeleting && selectedTodoid)
          || tooggleIds.includes(todo.id))
          && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  selectedTodoId: number | null;
  isRemoveLoading: boolean;
  updateTodoById: (todoId: number, data: {}) => void;
  isUpdateLoading: boolean;
  isAllToggled: boolean;
};

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    removeTodo,
    selectedTodoId,
    isRemoveLoading,
    updateTodoById,
    isUpdateLoading,
    isAllToggled,
  } = props;

  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isDoubleClicked]);

  const handleBlur = () => setIsDoubleClicked(false);

  const changeCompleteStatus = () => {
    updateTodoById(todo.id, { completed: !todo.completed });
  };

  const renameTodo = (todoId: number) => {
    if (!newTitle) {
      removeTodo(todo.id);

      return;
    }

    updateTodoById(todoId, { title: newTitle });
    setIsDoubleClicked(false);
  };

  const handleKeyPress = (
    e: KeyboardEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    if (e.key === 'Escape') {
      handleBlur();
      setNewTitle(todo.title);
    }

    if (e.key === 'Enter') {
      renameTodo(todoId);
      handleBlur();
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={changeCompleteStatus}
        />
      </label>

      {isDoubleClicked
        ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={newTitle}
              ref={newTodoField}
              onBlur={() => {
                renameTodo(todo.id);
                handleBlur();
              }}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, todo.id)}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsDoubleClicked(true)}
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
        )}

      {((isRemoveLoading && selectedTodoId === todo.id)
        || (isUpdateLoading && selectedTodoId === todo.id)
        || (isAllToggled))
        && (
          <div data-cy="TodoLoader" className={`modal overlay ${(isRemoveLoading || isUpdateLoading) ? 'is-active' : ''}`}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
    </div>
  );
};

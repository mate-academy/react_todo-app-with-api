import classNames from 'classnames';
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

  const isLoading = ((isRemoveLoading && selectedTodoId === todo.id)
    || (isUpdateLoading && selectedTodoId === todo.id)
    || (isAllToggled));

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
    event: KeyboardEvent<HTMLInputElement>,
    todoId: number,
  ) => {
    if (event.key === 'Escape') {
      handleBlur();
      setNewTitle(todo.title);
    }

    if (event.key === 'Enter') {
      renameTodo(todoId);
      handleBlur();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={changeCompleteStatus}
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

      {isLoading && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay',
            { 'is-active': (isRemoveLoading || isUpdateLoading) })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

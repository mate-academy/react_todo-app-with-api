import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from '../context/TodosContext';

type Props = {
  todo: Todo
};

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const {
    tempTodo,
    deleteTodo,
    upgradeTodo,
  } = useContext(TodosContext);

  const isTempTodo = tempTodo && tempTodo.id === todo.id;
  const [isEdited, setIsEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const focusTodo = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    focusTodo.current?.focus();
  }, [isEdited]);

  const handleComplete = () => {
    upgradeTodo({
      ...todo,
      completed: !todo.completed,
    });
  };

  const hendleDoubleClick = () => {
    setIsEdited(true);
  };

  const handleUpdateTodo = () => {
    if (!newTitle.trim()) {
      deleteTodo(todo.id);

      return;
    }

    setIsEdited(false);

    upgradeTodo({
      ...todo,
      title: newTitle.trim(),
    });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEdited(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', {
          completed: todo.completed,
        },
      )}
      onDoubleClick={hendleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked
          onChange={() => handleComplete()}
        />
      </label>

      {isEdited ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateTodo();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={focusTodo}
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={() => handleUpdateTodo()}
            onKeyUp={event => handleKey(event)}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>

        </>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay', {
            'is-active': isTempTodo,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

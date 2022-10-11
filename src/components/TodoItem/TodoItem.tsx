import classNames from 'classnames';
import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isAdding: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  leftTodosLength: number;
  removeTodo: (id: number) => Promise<void>;
  patchTodo: (todo: Todo, newTitle?: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  isDeleting,
  isUpdating,
  leftTodosLength,
  removeTodo,
  patchTodo,
}) => {
  const {
    userId,
    title,
    completed,
    id,
  } = todo;

  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [todoTitle, setTodoTitle] = useState(title);
  const [isChosen, setIsChosen] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);
  const isActive = (isAdding && userId === -1)
    || (selectedTodoId)
    || (isDeleting && completed)
    || (!leftTodosLength && isUpdating && completed)
    || (leftTodosLength && isUpdating && !completed);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isChosen]);

  const onDeleteTodo = () => {
    setSelectedTodoId(id);

    removeTodo(id).finally(() => setSelectedTodoId(0));
  };

  const handleTodo = () => {
    setSelectedTodoId(id);

    patchTodo(todo).finally(() => setSelectedTodoId(0));
  };

  const renameTodo = () => {
    if (title === todoTitle) {
      setIsChosen(false);

      return;
    }

    if (todoTitle.trim().length === 0) {
      onDeleteTodo();
      setIsChosen(false);

      return;
    }

    setSelectedTodoId(id);

    patchTodo(todo, todoTitle).finally(() => setSelectedTodoId(0));

    setIsChosen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    renameTodo();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
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
          defaultChecked
          onChange={handleTodo}
        />
      </label>

      {isChosen ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleChange}
            onBlur={renameTodo}
            onKeyDown={(e) => e.key === 'Escape' && setIsChosen(false)}
            ref={newTodoField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsChosen(true)}
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

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isActive },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

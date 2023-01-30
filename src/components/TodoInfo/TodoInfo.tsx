import {
  memo, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  onDeleteTodo: (todoId: number) => void,
  isLoading: boolean,
  onUpdateTodo: (todo: Todo) => void,
  isUpdating: boolean
};

export const TodoInfo: React.FC <Props> = memo(({
  todo,
  onDeleteTodo,
  isLoading,
  onUpdateTodo,
  isUpdating,
}) => {
  const [editingTodoTitle, setEditingTodoTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const todoTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing === true) {
      todoTitleField.current?.focus();
    }
  }, [isEditing]);

  const cancelEditingTodo = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditingTodoTitle(todo.title);
    }
  };

  const changeTodoTitle = (
    event: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    event.preventDefault();

    if (editingTodoTitle === todo.title) {
      return;
    }

    if (editingTodoTitle === '') {
      setEditingTodoTitle('');
      onDeleteTodo(todo.id);

      return;
    }

    if (editingTodoTitle !== todo.title) {
      setIsEditing(true);
      onUpdateTodo({
        ...todo,
        title: editingTodoTitle,
      });
    }

    setIsEditing(false);
  };

  const isLoaderNeeded = todo.id === 0 || isUpdating;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onChange={() => onUpdateTodo({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={changeTodoTitle}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={todoTitleField}
              className="todo__title-field"
              value={editingTodoTitle}
              placeholder="Emty todo will be deleted"
              onChange={(event) => setEditingTodoTitle(event.target.value)}
              onBlur={changeTodoTitle}
              onKeyDown={cancelEditingTodo}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      {isLoaderNeeded && (
        <Loader
          isLoading={isLoading}
        />
      )}
    </div>
  );
});

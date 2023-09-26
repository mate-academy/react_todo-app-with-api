import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
// import { deleteTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  // key: number;
  onTodoDelete: (todoId: number) => void;
  onTodoUpdate: (title: string) => void;
  // isLoading: boolean;
  loadingTodoIds: number[];
  // setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  // setError: React.Dispatch<React.SetStateAction<string>>;
  // newTodoField: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = ({
  todo,
  // setTodos,
  // setError,
  // newTodoField,
  onTodoDelete,
  onTodoUpdate,
  // isLoading,
  loadingTodoIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      onTodoUpdate(todoTitle);
    } else {
      onTodoDelete(todoId);
    }

    setIsEditing(false);
  };

  const handleTodoTitleChange
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoTitle(event.target.value);
    };
  // const deleteTodoHandler = (todoId: number) => {
  //   deleteTodo(todoId)
  //     .then(() => {
  //       setTodos(prevState => (
  //         prevState.filter(todo => todo.id !== todoId)
  //       ));

  //       newTodoField.current?.focus();
  //     })
  //     .catch(() => {
  //       setError('Unable to delete a todo');

  //       setTimeout(() => {
  //         setError('');
  //       }, 3000);
  //     });
  // };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>

        {isEditing ? (
          <form
            onSubmit={handleTodoSave}
            onBlur={handleTodoSave}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTodoTitleChange}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleTodoDoubleClick}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onTodoDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

        {/* overlay will cover the todo while it is being updated */}
        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': loadingTodoIds.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};

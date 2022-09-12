import classNames from 'classnames';
import React, { FC } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  visibleTodos: Todo[],
  handleComplite: (todoId: number, status: boolean) => void,
  isEditing: number | null,
  onEditing: (id: number) => void,
  todoTitleField: React.RefObject<HTMLInputElement>,
  editingValue: string,
  setEditingValue: React.Dispatch<React.SetStateAction<string>>,
  setIsEditing: React.Dispatch<React.SetStateAction<number | null>>,
  deleteTodo: (id: number) => void,
  loadTodoIds: number[]
}

export const TodoItems: FC<Props> = (props) => {
  const {
    visibleTodos,
    handleComplite,
    isEditing,
    onEditing,
    todoTitleField,
    editingValue,
    setEditingValue,
    setIsEditing,
    deleteTodo,
    loadTodoIds,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              onChange={() => handleComplite(todo.id, todo.completed)}
            />
          </label>

          {isEditing === todo.id
            ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onEditing(todo.id);
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  ref={todoTitleField}
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.currentTarget.value)}
                  onBlur={() => onEditing(todo.id)}
                />
              </form>
            )
            : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setIsEditing(todo.id);
                    setEditingValue(todo.title);
                  }}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
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
                'is-active': loadTodoIds.includes(todo.id),
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

    </section>
  );
};

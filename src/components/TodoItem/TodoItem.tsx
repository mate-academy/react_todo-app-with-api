import { useEffect, useRef, useState } from 'react';
import '../../styles/todo.scss';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onClickDeleteTodo: (todoId: number) => void;
  listTodoId: number[];
  onClickToggleCompleted: ({
    id,
    title,
    completed,
  }: Omit<Todo, 'userId'>) => void;
  onDoubleClickEditTodo: (todoId: number) => void;
  currentEditingTodoId: number | null;
  onSubmitUpdateTodo: ({ id, title, completed }: Omit<Todo, 'userId'>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onClickDeleteTodo,
  listTodoId,
  onClickToggleCompleted,
  onDoubleClickEditTodo,
  currentEditingTodoId,
  onSubmitUpdateTodo,
}) => {
  const [updateInputData, setUpdateInputData] = useState('');
  const isEditing = currentEditingTodoId === todo.id;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isEditing]);

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', { completed: todo.completed === true })}
      >
        <label
          htmlFor={`${todo.id}`}
          className="todo__status-label"
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            onClickToggleCompleted({
              id: todo.id,
              title: todo.title,
              completed: !todo.completed,
            });
          }}
        >
          <input
            id={`${todo.id}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            aria-label="Mark todo as completed"
          />
        </label>

        <>
          {isEditing ? (
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                onSubmitUpdateTodo({
                  id: todo.id,
                  title: updateInputData.trim(),
                  completed: todo.completed,
                });
              }}
            >
              <input
                ref={inputRef}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={updateInputData}
                onChange={e => setUpdateInputData(e.target.value)}
                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                  event.preventDefault();
                  onSubmitUpdateTodo({
                    id: todo.id,
                    title: updateInputData.trim(),
                    completed: todo.completed,
                  });
                }}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  onDoubleClickEditTodo(todo.id);
                  setUpdateInputData(todo.title);
                }}
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  onClickDeleteTodo(todo.id);
                }}
              >
                ×
              </button>
            </>
          )}
        </>

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': listTodoId.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};

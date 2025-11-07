/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { ErrorMessages, Todo } from '../../types';
import cn from 'classnames';
import * as React from 'react';
import { useDeleteTodos } from '../../hooks/useDeleteTodo';
import { useToggleTodo } from '../../hooks/useToggleTodo';
import { useUpdateTodo } from '../../hooks/useUpdateTodo';
import { SetStateAction, Dispatch } from 'react';

type Props = {
  filteredTodos: Todo[];
  todoIdLoading: number[];
  inputRef: React.RefObject<HTMLInputElement>;

  onSetTodoIdLoading: Dispatch<SetStateAction<number[]>>;
  onSetError: (error: ErrorMessages) => void;
  onSetPreparedTodos: Dispatch<SetStateAction<Todo[]>>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  todoIdLoading,
  inputRef,

  onSetTodoIdLoading,
  onSetError,
  onSetPreparedTodos,
}) => {
  const [activeForm, setActiveForm] = React.useState<number>(-1);
  const [todoText, setTodoText] = React.useState<string>('');

  const editInputRef = React.useRef<HTMLInputElement | null>(null);

  const { handleDeleteTodos } = useDeleteTodos({
    filteredTodos,
    inputRef,

    onSetPreparedTodos,
    onSetError,
    onSetTodoIdLoading,
  });

  const { handleToggleTodos } = useToggleTodo({
    preparedTodos: filteredTodos,

    onSetTodoIdLoading,
    onSetError,
  });

  const { handleUpdateTodos } = useUpdateTodo({
    preparedTodos: filteredTodos,

    onSetTodoIdLoading,
    onSetError,
    onSetActiveForm: setActiveForm,
    handleDeleteTodos,
    editInputRef,
  });

  const changeInputField = (id: number, text: string) => {
    setActiveForm(id);
    setTodoText(text);
  };

  const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setActiveForm(-1);
    }
  };

  React.useEffect(() => {
    if (activeForm > 0) {
      editInputRef.current?.focus();
    }
  }, [activeForm]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => handleToggleTodos(todo.id)}
              />
            </label>

            {activeForm === todo.id ? (
              <form
                onSubmit={event => handleUpdateTodos(todo.id, todoText, event)}
              >
                <input
                  data-cy="TodoTitleField"
                  className="todo__title-field"
                  type="text"
                  value={todoText}
                  onChange={e => setTodoText(e.target.value)}
                  ref={editInputRef}
                  onKeyDown={e => handleEsc(e)}
                  onBlur={() => handleUpdateTodos(todo.id, todoText)}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => changeInputField(todo.id, todo.title)}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodos(todo.id)}
                >
                  ×
                </button>
              </>
            )}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': todoIdLoading.includes(todo.id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};

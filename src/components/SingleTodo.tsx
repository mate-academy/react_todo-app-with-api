import {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  FormEvent,
  FocusEvent,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types';
import { useAppContext } from '../context/AppContext';

type Props = {
  todo: Todo,
};

export const SingleTodo: FC<Props> = ({ todo }) => {
  const [todoInputValue, setTodoInputValue] = useState<string>(todo.title);

  const {
    todosBeingLoaded,
    removeTodo,
    changeTodoStatus,
    todoInEdit,
    setTodoInEdit,
    renameTodo,
  } = useAppContext();

  const todoInput = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoInputValue(event.target.value.trimStart());
  };

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleCheck = () => {
    changeTodoStatus(todo.id, todo.completed);
  };

  const handleEdit = () => {
    setTodoInEdit(todo.id);
  };

  const handleRename = (
    event: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    renameTodo(todo, todoInputValue, setTodoInputValue);
    setTodoInEdit(null);
  };

  const handleCancelEdit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTodoInEdit(null);
      setTodoInputValue(todo.title);
    }
  };

  const isLoading = useMemo(() => {
    return todosBeingLoaded.includes(todo.id);
  }, [todo.id, todosBeingLoaded]);

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  }, [todoInEdit]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheck}
        />
      </label>
      {
        todoInEdit === todo.id
          ? (
            <form
              onSubmit={handleRename}
            >
              <input
                ref={todoInput}
                onBlur={handleRename}
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={todoInputValue}
                onChange={handleInputChange}
                onKeyUp={handleCancelEdit}
              />
            </form>
          )
          : (
            <>
              <span
                onDoubleClick={handleEdit}
                data-cy="TodoTitle"
                className="todo__title"
              >
                {todoInputValue || <p className="is-invisible">.</p>}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={handleRemove}
              >
                ×
              </button>
            </>
          )
      }

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};

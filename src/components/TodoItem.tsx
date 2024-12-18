import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as todosService from '../api/todos';

import { Todo } from '../types/Todo';
import cn from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
  changeComplete: (todo: Todo) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setIsDeleted: (isDeleted: boolean) => void;
  setErrorMessage: (error: ErrorMessage) => void;
  todosForDelete: Todo[];
  editedTodos: Todo[];
  isInEdit: boolean;
  setEditMode: Dispatch<SetStateAction<number | null>>;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  changeComplete,
  setTodos,
  setIsDeleted,
  setErrorMessage,
  todosForDelete,
  editedTodos,
  isInEdit,
  setEditMode,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [allEditedTodos, setEditedTodos] = useState<Todo[]>([]);
  const [allDeletedTodos, setDeletedTodos] = useState<Todo[]>([]);

  const currentField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isInEdit) {
      return;
    }

    if (currentField.current) {
      currentField.current.focus();
    }
  }, [isInEdit]);

  useEffect(() => setEditedTodos(editedTodos), [editedTodos]);
  useEffect(() => setDeletedTodos(todosForDelete), [todosForDelete]);

  const handleDeleteTodo = async (todoItem: Todo) => {
    setIsLoading(true);
    try {
      await todosService.deleteTodo(todoItem.id);
      setTodos(todosPrev =>
        todosPrev.filter(todoCurrent => todoCurrent.id !== todoItem.id),
      );
      setIsDeleted(true);
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToDelete);
      if (isInEdit) {
        setEditMode(todo.id);
        currentField.current?.focus();
      }
    } finally {
      setIsLoading(false);
      setEditMode(null);
    }
  };

  const handleSubmitEditedTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      handleDeleteTodo(todo);
    } else if (title.trim() === todo.title) {
      setEditMode(null);
    } else {
      setIsLoading(true);
      setEditMode(todo.id);

      todosService
        .editTodo({ ...todo, title: title.trim() })
        .then(todoRes => {
          setTodos(currenTodos => {
            const newTodos = [...currenTodos].map(todoCur =>
              todoCur.id === todo.id ? todoRes : todoCur,
            );

            return newTodos;
          });
        })
        .then(() => setEditMode(null))
        .catch(() => {
          setErrorMessage(ErrorMessage.UnableToUpdate);
          setEditMode(todo.id);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setEditMode(null);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        {' '}
        <input
          checked={todo.completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => changeComplete(todo)}
        />
      </label>

      {isInEdit ? (
        <form onSubmit={handleSubmitEditedTodo} onBlur={handleSubmitEditedTodo}>
          <input
            ref={currentField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onKeyUp={handleEscape}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditMode(todo.id)}
          >
            {todo.title}
          </span>

          <button
            onClick={() => handleDeleteTodo(todo)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            x
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            isLoading ||
            allEditedTodos.includes(todo) ||
            allDeletedTodos.includes(todo),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

import cn from 'classnames';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, patchTodos } from '../../api/todos';

interface Props {
  todo: Todo;
  todos: Todo[];
  setTodos: (value: React.SetStateAction<Todo[]>) => void;
  isLoading: number[];
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setError: (value: React.SetStateAction<string>) => void;
  setIsErrorShown: React.Dispatch<React.SetStateAction<boolean>>;
  onTodoFocus: () => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  isLoading,
  setIsLoading,
  setError,
  setIsErrorShown,
  onTodoFocus,
}) => {
  const [editedInput, setEditedInput] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const currentEditField: RefObject<HTMLInputElement> = useRef(null);

  async function editData() {
    setIsLoading([todo.id]);
    try {
      if (editedInput.trim()) {
        if (editedInput !== todo.title) {
          await patchTodos(todo.id, { ...todo, title: editedInput });
          setTodos(
            todos.map((t: Todo) => {
              if (t.id === todo.id) {
                return {
                  ...t,
                  title: editedInput,
                };
              }

              return t;
            }),
          );
        } else {
          setIsEdited(false);
        }
      }

      if (!editedInput.trim()) {
        try {
          await deleteTodo(todo.id);
          setTodos(todos.filter((t: Todo) => t.id !== todo.id));
        } catch {
          setError('Unable to delete a todo');
          setIsErrorShown(true);
          setTodos(todos);
        }
      }

      setIsEdited(false);
    } catch {
      setError('Unable to update a todo');
      setIsErrorShown(true);
      setTodos(todos);
    } finally {
      setIsLoading([]);
    }
  }

  const handleRemove = (todoId: number) => {
    async function getDeleted() {
      setIsLoading([todoId]);

      try {
        await deleteTodo(todoId);
        setTodos(todos.filter(t => t.id !== todoId));
      } catch {
        setTodos(todos);
        setError('Unable to delete a todo');
        setIsErrorShown(true);
      } finally {
        setIsLoading([]);
      }
    }

    getDeleted();
  };

  const handleToggle = () => {
    setIsLoading([todo.id]);

    async function updatedTodos() {
      try {
        await patchTodos(todo.id, { ...todo, completed: !todo.completed });
        setTodos(
          todos.map((t: Todo) => {
            if (t.id === todo.id) {
              return {
                ...t,
                completed: !t.completed,
              };
            }

            return t;
          }),
        );
      } catch {
        setError('Unable to update a todo');
        setIsErrorShown(true);
        setTodos(todos);
      } finally {
        setIsLoading([]);
      }
    }

    updatedTodos();
  };

  const handleIsEdited = () => {
    setIsEdited(true);
    setEditedInput(todo.title);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedInput(e.target.value);
  };

  const handleCloseEditField = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEdited(false);
      onTodoFocus();
    }
  };

  const handleEditSubmission = (e: React.FormEvent) => {
    e.preventDefault();

    onTodoFocus();
    editData();
    setEditedInput('');
    setIsEdited(false);
  };

  useEffect(() => {
    if (currentEditField.current) {
      currentEditField.current.focus();
    }
  }, [isEdited]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={handleIsEdited}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleToggle}
        />
      </label>

      {isEdited ? (
        // eslint-disable-next-line
        <form
          onSubmit={handleEditSubmission}
          onKeyDown={handleCloseEditField}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={currentEditField}
            onChange={handleInput}
            value={editedInput}
            onBlur={handleEditSubmission}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleRemove(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

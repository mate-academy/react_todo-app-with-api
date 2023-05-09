import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { editTodos } from '../../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  actionsTodosId: number[] | [];
  handleDeleteTodo: (id: number) => void;
  handleToggleTodo: (id: number) => void;
  setActionsTodosId: React.Dispatch<React.SetStateAction<number[] | []>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<Error>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  actionsTodosId,
  handleDeleteTodo,
  handleToggleTodo,
  setActionsTodosId,
  setTodos,
  setError,
}) => {
  const { title, completed, id } = todo;
  const [isEditTodo, setIsEditTodo] = useState(false);
  const [newValue, setNewValue] = useState(title);
  const isAction = actionsTodosId.some(todoId => todoId === id);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditTodo]);

  const handleEditTodo = () => {
    setIsEditTodo(false);

    if (newValue === title) {
      return;
    }

    if (!newValue) {
      handleDeleteTodo(id);

      return;
    }

    setActionsTodosId([id]);

    editTodos(id, {
      ...todo,
      title: newValue,
    })
      .then(() => {
        const newTodoList = todos.map(t => {
          return t.id === id
            ? { ...t, title: newValue }
            : t;
        });

        setTodos(newTodoList);
      })
      .catch(() => setError(Error.Update))
      .finally(() => setActionsTodosId([]));
  };

  const handleSubmitEditTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleEditTodo();
  };

  const handleInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setNewValue(title);
      setIsEditTodo(false);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          onChange={() => handleToggleTodo(id)}
        />
      </label>

      {isEditTodo ? (
        <form onSubmit={handleSubmitEditTodo}>
          <input
            type="text"
            className="todo__title-field"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onBlur={handleEditTodo}
            onKeyUp={handleInputKeyUp}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditTodo(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames(
          'modal overlay',
          {
            'is-active': isAction,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

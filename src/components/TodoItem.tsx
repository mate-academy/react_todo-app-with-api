/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { Dispatch, FC, FormEvent, useEffect, useState } from 'react';
import { deleteTodo, updateTodos } from '../api/todos';

import classNames from 'classnames';
import useFocusInput from '../hooks/useFocusInput';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onErrorMessage: (message: string) => void;
  setTodos: Dispatch<React.SetStateAction<Todo[]>>;
  setDeletingId: Dispatch<React.SetStateAction<number>>;
  deletingId: number;
  setUpdatingTodoId: Dispatch<React.SetStateAction<number>>;
  updatingTodoId: number;
  onTodoChange: (updatedTodo: Todo) => void;
}

const TodoItem: FC<Props> = ({
  todo,
  onErrorMessage,
  setTodos,
  setDeletingId,
  deletingId,
  updatingTodoId,
  onTodoChange,
  setUpdatingTodoId,
}) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState(selectedTodo?.title ?? todo.title);
  const inputRef = useFocusInput();

  useEffect(() => {
    if (selectedTodo) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [inputRef, selectedTodo]);

  useEffect(() => {
    const handleEscKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedTodo(null);
      }
    };

    document.addEventListener('keyup', handleEscKeyPress);

    return () => {
      document.removeEventListener('keyup', handleEscKeyPress);
    };
  }, []);

  const handleDeleteTodo = (id: number) => {
    setDeletingId(id);
    deleteTodo(id)
      .then(() =>
        setTodos((prevState: Todo[]) =>
          prevState.filter(todoItem => todoItem.id !== id),
        ),
      )
      .catch(() => onErrorMessage('Unable to delete a todo'))
      .finally(() => setDeletingId(0));
  };

  const handleToggleComplete = (id: number) => {
    const updatedTodo: Todo = { ...todo, completed: !todo.completed };

    setUpdatingTodoId(updatedTodo.id);

    updateTodos(id, updatedTodo)
      .then(() =>
        setTodos(prevState =>
          prevState.map(todoItem =>
            todoItem.id === id ? updatedTodo : todoItem,
          ),
        ),
      )
      .catch(() => onErrorMessage('Unable to update a todo'))
      .finally(() => setUpdatingTodoId(0));
  };

  const handleUpdateTodo = () => {
    if (title.trim() === '') {
      handleDeleteTodo(todo.id);

      return;
    }

    if (title === todo.title) {
      setSelectedTodo(null);

      return;
    }

    setUpdatingTodoId(todo.id);

    const updatedTodo: Todo = { ...todo, title: title.trim() };

    updateTodos(todo.id, updatedTodo)
      .then(() => {
        onTodoChange(updatedTodo);
        setSelectedTodo(null);
      })
      .catch(() => {
        onErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingTodoId(0);
      });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateTodo();
  };

  return selectedTodo && selectedTodo.id === todo.id ? (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: selectedTodo.completed,
        editing: selectedTodo,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleComplete(todo.id)}
        />
      </label>

      <form onSubmit={handleSubmit}>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
          onBlur={handleUpdateTodo}
          ref={inputRef}
        />
      </form>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.id === 0 || deletingId === todo.id || updatingTodoId === todo.id ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  ) : (
    <div
      key={todo.id}
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
          onChange={() => handleToggleComplete(todo.id)}
        />
      </label>

      <span
        onDoubleClick={() => setSelectedTodo(todo)}
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.id === 0 || deletingId === todo.id || updatingTodoId === todo.id ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;

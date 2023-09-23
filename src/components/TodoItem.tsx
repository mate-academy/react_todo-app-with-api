import React, {
  useState,
  useRef, useEffect,
  useContext,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from '../context/TodoContext';
import { deleteTodo, updateTodo } from '../api/todos';
// import { TodosContext } from '../context/TodosContext';

type Props = {
  todo: Todo;
  selectedTodo?: Todo | null;
  setSelectedTodo?: (todo: Todo | null) => void;
  hideError?: () => void;
  processedTodoIds?: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodo = null,
  setSelectedTodo = () => { },
  hideError = () => { },
  processedTodoIds = [],

}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [todos, setTodos, errorMsg, setErrorMsg] = useContext(TodosContext);
  // add setter
  const [tempTitle, setTempTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedTodo]);

  const handleTodoDeletion = () => {
    if (todo.id === 0) {
      return;
    }

    setIsSaving(true);

    if (errorMsg !== '') {
      hideError();
    }

    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter(({ id }) => id !== todo.id));
      })
      .catch(() => {
        setErrorMsg('Unable to delete a todo');
      })
      .finally(() => setIsSaving(false));
  };

  const handleTodoCheck = () => {
    if (todo.id === 0) {
      return;
    }

    setIsSaving(true);

    if (errorMsg !== '') {
      hideError();
    }

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
      })
      .catch(() => {
        setErrorMsg('Unable to update a todo');
      })
      .finally(() => setIsSaving(false));
  };

  const handleTodoTitleChange = (
    event: React.FormEvent<HTMLFormElement>
    | React.FocusEvent<HTMLInputElement>,
  ) => {
    if (event.type === 'submit') {
      event.preventDefault();
    }

    if (todo.id === 0) {
      return;
    }

    if (errorMsg !== '') {
      hideError();
    }

    if (tempTitle.trim() === '') {
      handleTodoDeletion();

      return;
    }

    setIsSaving(true);

    const updatedTodo = {
      ...todo,
      title: tempTitle.trim(),
    };

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
      })
      .catch(() => {
        setErrorMsg('Cant update a todo');
      })
      .finally(() => {
        setIsSaving(false);
        setSelectedTodo?.(null);
      });
  };

  const handleEditCancel = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setTempTitle(todo.title);
      setSelectedTodo?.(null);
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={`todo-${todo.id}`}
          onChange={handleTodoCheck}
        />
      </label>

      {selectedTodo?.id !== todo.id ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setSelectedTodo?.(todo)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleTodoDeletion}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handleTodoTitleChange}
        >
          <input
            type="text"
            className="todo__title-field"
            value={tempTitle}
            disabled={isSaving}
            onChange={(event) => setTempTitle(event.target.value)}
            ref={inputRef}
            onBlur={handleTodoTitleChange}
            onKeyUp={handleEditCancel}
          />
        </form>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isSaving || todo.id === 0
          || processedTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

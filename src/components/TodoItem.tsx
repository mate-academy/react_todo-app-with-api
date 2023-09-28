import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  FormEvent,
  useEffect,
  useRef,
  useContext,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/todoContext';

type Props = {
  todo: Todo;
  disabled: boolean;
  processing: boolean;
  selectedTodoIds: number[];
  onDeleteTodo: (todoId: number) => void;
  onUpdateTodo: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  disabled,
  processing,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const { deletedTodos } = useContext(TodoContext);

  const editingRef = useRef<HTMLInputElement | null>(null);

  function updateTodoTitle() {
    if (todo.title === newTitle) {
      return;
    }

    if (!newTitle.trim()) {
      onDeleteTodo(todo.id);

      return;
    }

    const todoUpdate: Todo = {
      ...todo,
      title: newTitle,
    };

    onUpdateTodo(todoUpdate);
  }

  const handleEditTodoTitle = (event?: FormEvent) => {
    event?.preventDefault();

    updateTodoTitle();

    setEditing(false);
  };

  const updateTodoCompleted = (event: ChangeEvent<HTMLInputElement>) => {
    const todoForUpdate: Todo = {
      ...todo,
      completed: event.target.checked,
    };

    onUpdateTodo(todoForUpdate);
  };

  useEffect(() => {
    if (editing && editingRef.current) {
      editingRef.current.focus();
    }
  }, [editing]);

  const cancel = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditing(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={updateTodoCompleted}
        />
      </label>

      {editing ? (
        <form onSubmit={handleEditTodoTitle}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            ref={editingRef}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleEditTodoTitle}
            onKeyUp={cancel}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => {
              setEditing(true);
              setNewTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(todo.id)}
            disabled={disabled}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': disabled || processing || (deletedTodos?.includes(todo)),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

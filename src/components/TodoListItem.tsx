import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoContext } from '../context/todo.context';

type TodoListItemProps = {
  todo: Todo,
};
const TodoListItem: React.FC<TodoListItemProps> = ({ todo }) => {
  const {
    loadingTodo, removeTodo, selectedTodoIds, onUpdateTodo,
  } = useContext(TodoContext);

  const [newTitleInput, setNewTitleInput] = useState(todo.title);
  const [editMode, setEditMode] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const updateTodoCompleted = (event: ChangeEvent<HTMLInputElement>) => {
    const updatingTodo: Todo = {
      ...todo,
      completed: event.target.checked,
    };

    onUpdateTodo(updatingTodo);
  };

  const updateTodoTitle = () => {
    if (todo.title === newTitleInput) {
      return;
    }

    if (!newTitleInput.trim()) {
      removeTodo(todo.id);

      return;
    }

    const todoForUpdate: Todo = {
      ...todo,
      title: newTitleInput,
    };

    onUpdateTodo(todoForUpdate);
  };

  const handleEditTodoTitle = (event?: FormEvent) => {
    event?.preventDefault();

    updateTodoTitle();

    setEditMode(false);
  };

  const cancelEditing = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditMode(false);
      setNewTitleInput(todo.title);
    }
  };

  useEffect(() => {
    if (editMode && titleRef.current) {
      titleRef.current.focus();
    }
  }, [editMode]);

  return (
    <div className={cn('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={updateTodoCompleted}
        />
      </label>

      {
        editMode ? (
          <form onSubmit={handleEditTodoTitle}>
            <input
              ref={titleRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitleInput}
              onChange={event => setNewTitleInput(event.target.value)}
              onBlur={handleEditTodoTitle}
              onKeyUp={cancelEditing}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setEditMode(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(todo.id)}
            >
              ×
            </button>
          </>
        )
      }

      {/* overlay will cover the todo while it is being updated */}
      <div className={cn('modal overlay', {
        'is-active': todo.id === loadingTodo?.id
      || selectedTodoIds.includes(todo.id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoListItem;

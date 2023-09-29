import cn from 'classnames';
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { useTodoEdit } from './useTodoEdit';

type ToDoRowProps = {
  todo: Todo;
  isDisabled?: boolean;
  isEdited?:boolean;
  editTodo?: (todoId:number | null) => void;
};

export const ToDoRow = ({
  todo,
  isDisabled,
  isEdited,
  editTodo = () => {},
}: ToDoRowProps) => {
  const {
    isLoading,
    saveTodo,
    deleteTodo,
  } = useTodoEdit();
  const [editedTitle, setEditedTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdited]);

  const handleEdit = (event:FormEvent) => {
    event.preventDefault();

    if (editedTitle.trim() === todo.title) {
      editTodo(null);

      return;
    }

    if (!editedTitle.trim()) {
      deleteTodo(todo).then(() => editTodo(null));

      return;
    }

    saveTodo({ ...todo, title: editedTitle.trim() })
      .then(() => {
        setEditedTitle('');
        editTodo(null);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => saveTodo({ ...todo, completed: !todo.completed })}
          readOnly
        />
      </label>
      {isEdited && (
        <form onSubmit={handleEdit} onBlur={handleEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            ref={inputRef}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyUp={key => {
              if (key.code === 'Escape') {
                setEditedTitle(todo.title);
                editTodo(null);
              }
            }}
          />
        </form>
      )}
      {!isEdited && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditedTitle(todo.title);
              editTodo(todo.id);
            }}
          >
            {editedTitle || todo.title}
          </span>
          {
            !isLoading(todo.id) && !isDisabled
            && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo)}
              >
                ×
              </button>
            )
          }
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading(todo.id) || isDisabled,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

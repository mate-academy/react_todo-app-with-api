import cn from 'classnames';
import {
  useContext, useState, useRef, useEffect,
} from 'react';
import { TodosContext } from '../TodosProvider';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState('');

  const {
    todosFromServer,
    deleteTodoHandler,
    updateTodoHandler,
    processingTodoIds,
    isEditing,
    setIsEditing,
    setProcessingTodoIds,
    setTodosError,
  } = useContext(TodosContext);

  const focusTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusTodo.current) {
      focusTodo.current.focus();
    }
  });

  const handleDoubleClick = (todoToEdit: Todo) => {
    setEditTodo(todoToEdit);
    setNewTodo(todoToEdit.title.trim());
    setIsEditing(false);
    if (focusTodo.current) {
      focusTodo.current.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editTodo?.title === newTodo) {
      setEditTodo(null);

      return;
    }

    if (editTodo) {
      if (!newTodo) {
        await deleteTodoHandler(editTodo.id);
      } else {
        try {
          await updateTodoHandler({
            id: editTodo.id,
            userId: editTodo.userId,
            title: newTodo,
            completed: editTodo.completed,
          });
        } catch {
          setTodosError('Unable to update todo');
        } finally {
          if (
            todosFromServer.find((el) => el.id === editTodo.id)?.title
            !== newTodo
          ) {
            setProcessingTodoIds(
              processingTodoIds.filter((todoId) => todoId !== editTodo.id),
            );
            if (focusTodo.current) {
              setIsEditing(false);
              focusTodo.current.disabled = false;
              focusTodo.current.focus();
            }
          } else {
            setEditTodo(null);
          }
        }
      }
    }
  };

  const handleOnBlur = async () => {
    if (editTodo?.title === newTodo) {
      setEditTodo(null);

      return;
    }

    if (editTodo) {
      if (!newTodo) {
        await deleteTodoHandler(editTodo.id);
      } else {
        try {
          await updateTodoHandler({
            id: editTodo.id,
            userId: editTodo.userId,
            title: newTodo,
            completed: editTodo.completed,
          });
        } catch {
          setTodosError('Unable to update todo');
        } finally {
          if (
            todosFromServer.find((el) => el.id === editTodo?.id)?.title
            !== newTodo
          ) {
            setProcessingTodoIds(
              processingTodoIds.filter((todoId) => todoId !== editTodo?.id),
            );
            setEditTodo(null);
          }
        }
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape' && editTodo?.id) {
      setEditTodo(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={() => handleDoubleClick(todo)}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodoHandler({
            id: todo.id,
            userId: todo.userId,
            title: todo.title.trim(),
            completed: !todo.completed,
          })}
        />
      </label>

      {todo.id !== editTodo?.id ? (
        <>
          <span
            role="button"
            data-cy="TodoTitle"
            className="todo__title"
            onKeyDown={() => setEditTodo(todo)}
            tabIndex={0}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodoHandler(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            ref={focusTodo}
            onKeyDown={handleKeyDown}
            disabled={isEditing}
            onBlur={handleOnBlur}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            processingTodoIds.find((el) => el === todo.id) && isEditing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useTodos } from '../Contexts/TodosContext';
import { useLoadingTodos } from '../Contexts/LoadingTodosContext';
import { deleteTodo, updateTodo } from '../../api/todos';
import { useErrorMessage } from '../Contexts/ErrorMessageContext';

type Props = {
  todo: Todo,
};

export const TodoTask: React.FC<Props> = ({
  todo,
}) => {
  const { setTodos } = useTodos();
  const { loadingTodos, setLoadingTodos } = useLoadingTodos();
  const { handleShowError } = useErrorMessage();

  const [editingTodoTitle, setEditingTodoTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [isEditing]);

  const handleChangeTodoTitle = async () => {
    if (editingTodoTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setLoadingTodos(prev => [...prev, todo.id]);
    if (editingTodoTitle) {
      try {
        const updatedTodo = await updateTodo(todo.id,
          { title: editingTodoTitle });

        setTodos(prev => prev.map((currentTodo) => {
          if (currentTodo.id === updatedTodo.id) {
            return updatedTodo;
          }

          return currentTodo;
        }));
      } catch (error) {
        handleShowError('Encounted error while trying to update Todo');
      }
    }

    if (!editingTodoTitle) {
      try {
        await deleteTodo(todo.id);
        setTodos(prev => prev.filter(({ id }) => id !== todo.id));
      } catch {
        handleShowError('Encounted error while trying to delete Todo');
      }
    }

    setLoadingTodos(prev => prev.filter(id => (
      id !== todo.id)));

    setIsEditing(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleChangeTodoTitle();
  };

  const handleComplete = async (todoId: number,
    event: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingTodos(prev => [...prev, todo.id]);
    try {
      const updatedTodo = await updateTodo(todoId,
        { completed: event.target.checked });

      setTodos(prev => prev.map(currentTodo => {
        if (currentTodo.id === todoId) {
          return updatedTodo;
        }

        return currentTodo;
      }));
    } catch {
      handleShowError('There is an error when completing todo');
    }

    setLoadingTodos(prev => prev.filter(id => (
      id !== todo.id)));
  };

  const onDelete = async (todoId: number) => {
    setLoadingTodos(prev => [...prev, todo.id]);
    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(({ id }) => id !== todoId));
    } catch {
      handleShowError('There is an error when deleting todo');
    }

    setLoadingTodos(prev => prev.filter(id => (
      id !== todo.id)));
  };

  const handlePressEsc = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
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
          onChange={(event) => handleComplete(todo.id, event)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputFieldRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTodoTitle}
            onKeyUp={handlePressEsc}
            onChange={(event) => setEditingTodoTitle(event.target.value)}
            onBlur={handleChangeTodoTitle}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay', {
        'is-active': loadingTodos.some((id) => (
          id === todo.id)),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

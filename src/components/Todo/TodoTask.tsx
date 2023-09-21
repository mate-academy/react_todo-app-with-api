import classNames from 'classnames';
import { useState } from 'react';
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
  const { setErrorMessage, setIsErrorHidden } = useErrorMessage();

  const [editingTodoTitle, setEditingTodoTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingTodos(prev => [...prev, { todoId: todo.id, isLoading: true }]);

    if (editingTodoTitle) {
      const updatedTodo = await updateTodo(todo.id,
        { title: editingTodoTitle });

      try {
        setTodos(prev => prev.map((currentTodo) => {
          if (currentTodo.id === updatedTodo.id) {
            return updatedTodo;
          }

          return currentTodo;
        }));
      } catch (error) {
        setErrorMessage('Encounted error while trying to update Todo');
        setIsErrorHidden(false);

        setTimeout(() => {
          setIsErrorHidden(true);
        }, 3000);
      }
    }

    if (!editingTodoTitle) {
      await deleteTodo(todo.id);
      try {
        setTodos(prev => prev.filter(({ id }) => id !== todo.id));
      } catch {
        setErrorMessage('Encounted error while trying to delete Todo');
        setIsErrorHidden(false);

        setTimeout(() => {
          setIsErrorHidden(true);
        }, 3000);
      }

      setLoadingTodos(prev => prev.filter(newTodo => (
        newTodo.todoId !== todo.id)));

      setIsEditing(false);
    }

    setLoadingTodos(prev => prev.filter(newTodo => (
      newTodo.todoId !== todo.id)));

    setIsEditing(false);
  };

  const onComplete = async (todoId: number,
    event: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingTodos(prev => [...prev, { todoId, isLoading: true }]);
    const updatedTodo = await updateTodo(todoId,
      { completed: event.target.checked });

    try {
      setTodos(prev => prev.map(currentTodo => {
        if (currentTodo.id === todoId) {
          return updatedTodo;
        }

        return currentTodo;
      }));
    } catch {
      setErrorMessage('There is an error when completing todo');
      setIsErrorHidden(false);
      setTimeout(() => {
        setIsErrorHidden(true);
      }, 3000);
    }

    setLoadingTodos(prev => prev.filter(currentTodo => (
      currentTodo.todoId !== todoId)));
  };

  const onDelete = async (todoId: number) => {
    setLoadingTodos(prev => [...prev, { todoId, isLoading: true }]);
    await deleteTodo(todoId);

    try {
      setTodos(prev => prev.filter(({ id }) => id !== todoId));
    } catch {
      setErrorMessage('There is an error when deleting todo');
      setIsErrorHidden(false);
      setTimeout(() => {
        setIsErrorHidden(true);
      }, 3000);
    }

    setLoadingTodos(prev => prev.filter(currentTodo => (
      currentTodo.todoId !== todoId)));
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
          onChange={(event) => onComplete(todo.id, event)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTodoTitle}
            onChange={(event) => setEditingTodoTitle(event.target.value)}
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
        'is-active': loadingTodos.find(({ todoId }) => (
          todoId === todo.id))?.isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { useTodos } from '../Contexts/TodosContext';
import { useLoadingTodos } from '../Contexts/LoadingTodosContext';
import { updateTodo } from '../../api/todos';
import { useErrorMessage } from '../Contexts/ErrorMessageContext';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void,
};

export const TodoTask: React.FC<Props> = ({
  todo,
  onDelete,
}) => {
  const { setTodos } = useTodos();
  const { loadingTodos, setLoadingTodos } = useLoadingTodos();
  const { setErrorMessage, setIsErrorHidden } = useErrorMessage();

  const [editingTodoTitle, setEditingTodoTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingTodos(prev => [...prev, { todoId: todo.id, isLoading: true }]);

    if (editingTodoTitle) {
      updateTodo(todo.id, { title: editingTodoTitle })
        .then(updatedTodo => {
          setTodos(prev => prev.map((currentTodo) => {
            if (currentTodo.id === updatedTodo.id) {
              return updatedTodo;
            }

            return currentTodo;
          }));
        })
        .catch((error) => {
          setErrorMessage(JSON.parse(error.message).error);
          setIsErrorHidden(false);

          setTimeout(() => {
            setIsErrorHidden(true);
          }, 3000);
        })
        .finally(() => {
          setLoadingTodos(prev => prev.filter(newTodo => (
            newTodo.todoId !== todo.id)));

          setIsEditing(false);
        });
    }
  };

  const onComplete = (todoId: number,
    event: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingTodos(prev => [...prev, { todoId, isLoading: true }]);
    updateTodo(todoId, { completed: event.target.checked })
      .then((newTodo) => {
        setTodos(prev => prev.map((currentTodo) => {
          if (currentTodo.id === todoId) {
            return newTodo;
          }

          return currentTodo;
        }));
      })
      .catch((error) => {
        setErrorMessage(JSON.parse(error.message).error);
        setIsErrorHidden(false);

        setTimeout(() => {
          setIsErrorHidden(true);
        }, 3000);
      })
      .finally(() => {
        setLoadingTodos(prev => prev.filter(currentTodo => (
          currentTodo.todoId !== todoId)));
      });
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

      <div className={classNames(
        'modal overlay', {
          'is-active': loadingTodos.find(({ todoId }) => (
            todoId === todo.id))?.isLoading,
        },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

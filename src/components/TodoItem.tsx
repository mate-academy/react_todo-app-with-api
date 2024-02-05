import { useContext, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { deleteTodo, updateTodos } from '../api/todos';
import { TodoContext } from '../contexts/TodoContext';
import { ErrorMessage } from '../types/ErrorMessage';
import { EditTodoForm } from './EditTodoForm';

interface Props {
  todo: Todo,
  isTemp?: boolean,
}

export const TodoItem: React.FC<Props> = ({ todo, isTemp = false }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { setErrorMessage, setTodos, updateTodoList } = useContext(TodoContext);
  const handleCatch = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => setTodos(prevTodos => prevTodos
        .filter(todoToFilter => todoToFilter.id !== todoId)))
      .catch(() => setErrorMessage(ErrorMessage.FailedLoad))
      .finally(() => handleCatch());
  };

  const handleUpdateStatus = (todoToStatusUpdate: Omit<Todo, 'userId'>) => {
    const { completed } = todoToStatusUpdate;

    updateTodos({
      ...todoToStatusUpdate,
      completed: !completed,
    })
      .then(() => {
        updateTodoList({ ...todoToStatusUpdate, completed: !completed });
      })
      .catch(() => setErrorMessage(ErrorMessage.FailedUpdateTodo))
      .finally(() => {});
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
      onDoubleClick={() => setIsEditMode(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleUpdateStatus(todo)}
          checked={todo.completed}
        />
      </label>

      {
        isEditMode
          ? (
            <EditTodoForm
              todoOnUpdate={todo}
              onEditMode={setIsEditMode}
            />
          )
          : (
            <>
              <span data-cy="TodoTitle" className="todo__title">
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
            </>
          )
      }

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isTemp })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

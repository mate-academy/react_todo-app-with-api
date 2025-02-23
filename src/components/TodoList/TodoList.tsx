/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { useContext } from 'react';
import { TodoContext } from '../../TodoContext';

export const TodoList: React.FC = () => {
  const {
    readyTodos,
    handleCompletedStatus,
    editingTitleField,
    handleDelete,
    tempTodo,
    isLoading,
    isDeletion,
    currentTodoId,
    selectedTodo,
    setEditedTitle,
    setWasEdited,
    handleSubmit,
    setSelectedTodo,
  } = useContext(TodoContext);

  const handleEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value.trim());
    setWasEdited(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    } else if (event.key === 'Escape' && selectedTodo) {
      setEditedTitle(selectedTodo.title);
      setSelectedTodo(null);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {readyTodos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleCompletedStatus(todo)}
            />
          </label>
          {selectedTodo && selectedTodo.id === todo.id ? (
            <form>
              <input
                data-cy="TodoTitleField"
                ref={editingTitleField}
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                defaultValue={todo.title}
                onChange={handleEditing}
                onKeyDown={handleKeyDown}
                onBlur={event => {
                  handleSubmit(event);
                }}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => {
                  setSelectedTodo(todo);
                }}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDelete(todo)}
              >
                ×
              </button>
            </>
          )}
          <div
            data-cy="TodoLoader"
            className={classNames('modal', 'overlay', {
              'is-active':
                (isLoading && todo.id === currentTodoId) ||
                (isDeletion && todo.id === currentTodoId),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

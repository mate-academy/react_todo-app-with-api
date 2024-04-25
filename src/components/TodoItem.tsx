/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useContext, useState } from 'react';
import { TodoListContext } from '../variables/LangContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { updateTodo, deleteTodo, loadingTodoIds } =
    useContext(TodoListContext);
  const [showEditedForm, setShowEditedForm] = useState(false);
  const [titleHiddenForm, setTitleHiddenForm] = useState(todo.title || '');

  const handleTitleHiddenForm = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitleHiddenForm(event.target.value);
  };

  const handleHiddenFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todo.title === titleHiddenForm) {
      setShowEditedForm(false);

      return;
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
      onDoubleClick={() => setShowEditedForm(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => updateTodo(todo)}
          checked={todo.completed}
        />
      </label>

      {showEditedForm && (
        <form onSubmit={handleHiddenFormSubmit}>
          <input
            type="text"
            placeholder="Empty todo will be deleted"
            className="todoapp__new-todo"
            value={titleHiddenForm}
            onChange={handleTitleHiddenForm}
            autoFocus
          />
        </form>
      )}
      {!showEditedForm && (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title.trim()}
        </span>
      )}
      {!showEditedForm && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

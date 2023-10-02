import classNames from 'classnames';
import { useRef, useState } from 'react';
import { patchTodo } from '../../api/todos';
// import { deleteTodoHandler } from '../../App'

export const TodoRow = ({
  todo, deleteTodoHandler, updateStatusHandler, isLoading, setTodos, todos,

}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [isCompletedLocale] = useState(todo.completed);
  const [isLoadingLocale, setIsLoadingLocale] = useState(false);
  const inputRef = useRef();

  const saveTodo = (t, data) => {
    patchTodo(t, data);
  };

  const changeTitleHandler = () => {
    setIsLoadingLocale(true);

    const updatedList = todos.filter(item => item !== todo);

    setIsEdited(false);
    saveTodo(todo, { title: editTitle });
    setTodos([...updatedList, { ...todo, title: editTitle }]);
    setIsLoadingLocale(false);
    setEditTitle('');
  };

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          // eslint-disable-next-line max-len
          onClick={() => updateStatusHandler(todo, { completed: !todo.completed })}
        />
      </label>

      {isEdited && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            changeTitleHandler();
            saveTodo(todo, { title: editTitle });
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onBlur={changeTitleHandler}
          />
        </form>
      )}

      {!isEdited && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          ref={inputRef}
          onDoubleClick={() => {
            setIsEdited(true);
            setEditTitle(todo.title);
          }}
        >
          {todo.title}
          {' '}
          {todo.id}

        </span>
      )}

      {/* Remove button appears only on hover */}
      {!isEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodoHandler(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isLoading.includes(todo.id) || isLoadingLocale },
          // isLoading.includes(todo.id)
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};

import classnames from 'classnames';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Props } from './TodoItem.props';

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  selectedTodos,
  setSelectedTodos,
  onUpdate,
  selectedTodo,
  setSelectedTodo,
  todos,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleTitleUpdate = () => {
    if (!newTodoTitle) {
      setIsClicked(false);

      onDelete(selectedTodo);
      onDelete(selectedTodo);
    }

    if (newTodoTitle === todo.title) {
      setIsClicked(false);

      return;
    }

    if (todos.find(element => element.title === newTodoTitle)) {
      setIsClicked(false);
    }

    onUpdate(selectedTodo, { title: newTodoTitle });
    setIsClicked(false);
    setNewTodoTitle('');
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodo]);

  return (
    <div
      data-cy="Todo"
      className={classnames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
          defaultChecked
        />
      </label>

      {isClicked && selectedTodo === todo.id
        ? (
          <form onSubmit={event => {
            event.preventDefault();
          }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              value={newTodoTitle}
              placeholder="If your todo is empty, it will be deleted"
              onChange={event => {
                setNewTodoTitle(event.target.value);
              }}
              onBlur={() => {
                handleTitleUpdate();
                setIsClicked(false);
              }}
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  setIsClicked(false);
                }

                if (event.key === 'Enter') {
                  handleTitleUpdate();
                }
              }}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsClicked(true);
                setSelectedTodo(todo.id);
                setNewTodoTitle(todo.title);
              }}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                onDelete(todo.id);
                setSelectedTodos([todo.id]);
              }}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classnames(
          'modal overlay',
          { 'is-active': selectedTodos.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

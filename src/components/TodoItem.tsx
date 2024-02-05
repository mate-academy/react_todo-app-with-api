import cn from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const {
    loadingUpdatedTodo, selectedTodo, setSelectedTodo, deleteTodo, updateTodo,
  } = useContext(TodosContext);

  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const setTodoCompleted = (state: boolean) => {
    const updatedTodo = { ...todo, completed: state };

    return updateTodo(updatedTodo);
  };

  const handleCheckboxChange = () => {
    setTodoCompleted(!todo.completed);
  };

  const handleTitleEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const startEditing = () => {
    setSelectedTodo(todo);
    setEditMode(true);
  };

  const finishEditing = () => {
    setSelectedTodo(null);
    setEditMode(false);

    if (!editedTitle.trim()) {
      deleteTodo(todo.id);

      return;
    }

    if (editedTitle === todo.title) {
      setEditedTitle(todo.title);
      setSelectedTodo(null);
      setEditMode(false);

      return;
    }

    updateTodo({ ...todo, title: editedTitle });
    setEditedTitle(todo.title);
  };

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      finishEditing();
    }
  };

  const handleEscPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setSelectedTodo(null);
      setEditMode(false);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (selectedTodo === todo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedTodo, todo]);

  return (
    <CSSTransition
      key={todo.id}
      timeout={300}
      classNames="item"
    >
      <div
        key={todo.id}
        data-cy="Todo"
        className={cn({
          'todo completed': todo.completed,
          todo: !todo.completed,
        })}
        onDoubleClick={startEditing}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleCheckboxChange}
          />
        </label>

        {editMode ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              // placeholder="Empty todo will be deleted"
              value={editedTitle}
              onChange={handleTitleEditing}
              ref={inputRef}
              onBlur={finishEditing}
              onKeyDown={handleEnterPress}
              onKeyUp={handleEscPress}
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

        {loadingUpdatedTodo && (
          <div
            data-cy="TodoLoader"
            className="modal overlay"
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </CSSTransition>
  );
};

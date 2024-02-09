/* eslint-disable max-len */
import classNames from 'classnames';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { GlobalContext } from '../TodoContext';
import { Todo } from '../types/interfaces';
import { TodoLoader } from './TodoLoader';

interface ItemProps {
  todo: Todo
}

export const TodoItem: React.FC<ItemProps> = ({ todo }) => {
  const {
    handleCheck,
    handleDeleteTodo,
    setTodosIsLoading,
    todosIsLoading,
    handleEditTodo,
    isEditing,
    setIsEditing,

  } = useContext(GlobalContext);

  const [inputValue, setInputValue] = useState('');

  const trimedInputValue = inputValue.trim();

  const todoTitleFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleFieldRef.current?.focus();
  }, [isEditing]);

  const onClickHandler: React.MouseEventHandler<HTMLInputElement> = () => {
    setTodosIsLoading(prev => (
      [...prev, todo.id]
    ));
    handleCheck(todo);
  };

  const onDeleteTodo: React.MouseEventHandler<HTMLButtonElement> = () => {
    setTodosIsLoading(prev => (
      [...prev, todo.id]
    ));
    handleDeleteTodo(todo);
  };

  function onEdit() {
    setIsEditing(todo.id);
    setInputValue(todo.title);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && trimedInputValue && inputValue !== todo.title) {
      setTodosIsLoading(prev => (
        [...prev, todo.id]
      ));
      handleEditTodo(todo, inputValue.trim());
    } else if (event.key === 'Enter' && trimedInputValue === '') {
      setTodosIsLoading(prev => (
        [...prev, todo.id]
      ));
      handleDeleteTodo(todo);
    } else if ((event.key === 'Enter' && inputValue === todo.title)
    || (event.key === 'Escape')) {
      setIsEditing(null);
    }
  }

  const onBlur = () => {
    if (todo.title !== inputValue && trimedInputValue !== '') {
      setTodosIsLoading(prev => (
        [...prev, todo.id]
      ));
      handleEditTodo(todo, trimedInputValue);
    } else if (trimedInputValue === '') {
      setTodosIsLoading(prev => (
        [...prev, todo.id]
      ));
      handleDeleteTodo(todo);
    } else if (inputValue === todo.title) {
      setIsEditing(null);
    }
  };

  const editMode = todo.id === isEditing;
  const loading = todosIsLoading.includes(todo.id);

  return (
    <>
      {editMode ? (
        <div
          onDoubleClick={onEdit}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={onClickHandler}
            />
          </label>

          <span>
            <input
              ref={todoTitleFieldRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onBlur={onBlur}
              onKeyDown={handleKeyPress}
            />
          </span>

          <TodoLoader loading={loading || todo.id === 0} />
        </div>
      ) : (
        <div
          onDoubleClick={onEdit}
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={onClickHandler}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDeleteTodo}
          >
            ×
          </button>

          <TodoLoader loading={loading || todo.id === 0} />
        </div>
      )}
    </>
  );
};

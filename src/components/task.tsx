import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[];
};

export const Task: React.FC<Props> = ({ todo, setTodos, todos }) => {
  const [inputValue, setInputValue] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleToggleCompletion = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  const handleRemove = () => {
    const updatedTodo = { ...todo, removed: true };

    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  const handleEditStart = () => {
    const updatedTodo = { ...todo, editing: true };

    setInputValue(todo.title);
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  const saveChanges = () => {
    const updatedTodo = { ...todo, title: inputValue, editing: false };

    if (updatedTodo.title === '') {
      handleRemove();
    } else {
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    }

    setInputValue('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const cancelEditing = () => {
    const updatedTodo = { ...todo, editing: false };

    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));

    setInputValue('');
  };

  const handleInputKeyPress
  = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveChanges();
    }
  };

  const handleInputEscPress
  = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  };

  const handleInputBlur = () => {
    saveChanges();
  };

  useEffect(() => {
    if (todo.editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [todo.editing]);

  return (
    <div
      className={todo.completed ? 'todo completed' : 'todo'}
      onDoubleClick={handleEditStart}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleCompletion}
        />
      </label>
      {!todo.editing ? (
        <>
          <span className="todo__title">{todo.title}</span>
          <button type="button" className="todo__remove" onClick={handleRemove}>
            ×
          </button>
        </>
      ) : (
        <input
          ref={inputRef}
          type="text"
          className="todoapp__new"
          placeholder="Empty todo will be deleted"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
          onBlur={handleInputBlur}
          onKeyUp={handleInputEscPress}
        />
      )}
    </div>
  );
};

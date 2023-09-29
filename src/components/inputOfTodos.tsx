/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  setNewTodo: (newTodo: string) => void;
  newTodo: string;
  addTodo: (title: string) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

export const InputOfTodos: React.FC<Props> = ({
  setNewTodo, newTodo, addTodo, todos, setTodos,
}) => {
  const handleAddNewTodo = () => {
    if (newTodo) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  const allComplited = (todos.every((t) => t.completed));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleInputKeyPress
  = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddNewTodo();
    }
  };

  const handleTaggleAll = () => {
    let updatedTodos = todos;

    if (!allComplited) {
      updatedTodos = todos.map((t) => ({
        ...t,
        completed: true,
      }));
    } else {
      updatedTodos = todos.map((t) => ({
        ...t,
        completed: !t.completed,
      }));
    }

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allComplited ? 'active' : ''}`}
          onClick={handleTaggleAll}
        />
      )}

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleInputChange}
          onKeyPress={handleInputKeyPress}
        />
      </form>
    </header>
  );
};

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

    if (todos.some((t) => !t.completed)) {
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
      {/* i can not write it as {todos.lenght && as when its value is 0 it will display  '0' on the screen  */}
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every((t) => t.completed) ? 'active' : ''}`}
          onClick={handleTaggleAll}
        />
      )}

      {/* Add a todo on form submit */}
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

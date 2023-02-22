import React, { useContext } from 'react';
import cn from 'classnames';
import { AddTodoForm } from '../AddTodoForm';
import { TodosContext } from '../TodosProvider';

export const Header: React.FC = () => {
  const { todos, handleStatusAll } = useContext(TodosContext);
  const activeTodos = todos.filter(todo => !todo.completed);
  const todosToToggle = activeTodos.length ? activeTodos : todos;

  return (
    <header className="todoapp__header">
      <button
        aria-label="todoapp__toggle-all__button"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          {
            active: !activeTodos.length,
          },
        )}
        onClick={() => {
          handleStatusAll(todosToToggle);
        }}
      />

      <AddTodoForm />
    </header>
  );
};

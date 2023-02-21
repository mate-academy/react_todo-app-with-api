import React, { useContext } from 'react';
import cn from 'classnames';
import { AddTodoForm } from '../AddTodoForm';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosProvider';

type Props = {
  todos: Todo[];
};
export const Header: React.FC<Props> = (
  {
    todos,
  },
) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const todosToToggle = activeTodos.length > 0 ? activeTodos : todos;
  const { handleStatusAll } = useContext(TodosContext);

  return (
    <header className="todoapp__header">
      <button
        aria-label="todoapp__toggle-all__button"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          {
            active: activeTodos.length === 0,
          },
        )}
        onClick={() => {
          handleStatusAll(todosToToggle);
        }}
      />

      {/* Add a todo on form submit */}
      <AddTodoForm />
    </header>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState, useMemo } from 'react';
import { Status } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';

import { TodosContext } from '../TodosContext';
import { TodoHeader } from '../TodoHeader';
import { TodoList } from '../TodoList';
import { TodoFooter } from '../TodoFooter';
import { TempTodoItem } from '../TempTodoItem';
import { ErrorNotification } from '../ErrorNotification';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(Status.All);

  const filterTodos = (currentTodos: Todo[], filterType: Status) => {
    let filteredTodos = [...currentTodos];

    switch (filterType) {
      case Status.Active:
        filteredTodos = filteredTodos.filter(item => !item.completed);

        return filteredTodos;
      case Status.Completed:
        filteredTodos = filteredTodos.filter(item => item.completed);

        return filteredTodos;
      default:
        break;
    }

    return filteredTodos;
  };

  const filteredTodos = useMemo(() => filterTodos(todos, filter),
    [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader onTodoAdd={setTempTodo} />

        <TodoList items={filteredTodos} />

        {tempTodo && <TempTodoItem tempItem={tempTodo} />}

        {todos.length ? (
          <TodoFooter
            currentFilter={filter}
            onFilterChange={setFilter}
          />
        ) : (null)}
      </div>

      <ErrorNotification />
    </div>
  );
};

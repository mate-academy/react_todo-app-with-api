import React from 'react';

import { useTodosContext } from '../../hooks/getContextHooks';
import { TodoItem } from '../TodoItem';

import getFilteredTodos from '../../helpers/getFilteredTodos';

export const TodosList: React.FC = () => {
  const { todos, filter, tempTodo } = useTodosContext();

  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => <TodoItem todo={todo} key={todo.id} />)}
      {tempTodo && (
        <TodoItem todo={tempTodo} key={tempTodo.id} />
      )}
    </section>
  );
};

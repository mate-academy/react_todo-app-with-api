import React, { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/Todo';
import { StateContext } from '../../Store';
import { Filter } from '../../types/Filter';
import { TempTodo } from '../TempTodo/TempTodo';

export const TodoList: React.FC = () => {
  const { todos, tempTodo, filter } = useContext(StateContext);

  const preparedTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};

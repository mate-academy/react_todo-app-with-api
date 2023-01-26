import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  selectedTodoIds: number[],
  removeTodo: (todoId: number) => void;
  toggleTodoStatus: (todoId: number, status: boolean) => void;
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos, removeTodo, toggleTodoStatus, selectedTodoIds,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodoIds={selectedTodoIds}
          removeTodo={removeTodo}
          toggleTodoStatus={toggleTodoStatus}
        />
      ))}
    </section>
  );
});

import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodosItem } from './TodosItem';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  selectedTodosID: number[];
  onChangeTodo: (todoId: number, dataToUpdate: Partial<Todo>) => Promise<void>;
};

export const TodosList: React.FC<Props> = memo(({
  todos,
  onDeleteTodo,
  selectedTodosID,
  onChangeTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodosItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          isDeleted={selectedTodosID.includes(todo.id)}
          onChangeTodo={onChangeTodo}
        />
      ))}
    </section>
  );
});

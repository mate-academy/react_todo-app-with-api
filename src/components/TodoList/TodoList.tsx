import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  handleDeleteTodo: (id: number) => void,
  handleTogglingTodo: (todoId: number, todoStatus: boolean) => void,
  loadingTodoIds: number[],
  updateTitle: (todoId: number, title: string) => void,
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  handleDeleteTodo,
  loadingTodoIds,
  handleTogglingTodo,
  updateTitle,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => {
      const isLoading = loadingTodoIds.includes(todo.id);

      return (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          handleTogglingTodo={handleTogglingTodo}
          isLoading={isLoading}
          updateTitle={updateTitle}
        />
      );
    })}
  </section>
));

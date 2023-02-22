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

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  loadingTodoIds,
  handleTogglingTodo,
  updateTitle,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        todo={todo}
        key={todo.id}
        handleDeleteTodo={handleDeleteTodo}
        handleTogglingTodo={handleTogglingTodo}
        loadingTodoIds={loadingTodoIds}
        updateTitle={updateTitle}
      />
    ))}
  </section>
);

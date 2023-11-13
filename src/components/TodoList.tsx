import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todoId: number) => void,
  onCompletedChange?: (todoId: number) => void,
  loadingTodosIds: number[],
  handleUpdateTodo: (todo: Todo, newTodoTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onCompletedChange,
  loadingTodosIds,
  handleUpdateTodo,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map(todo => (
        <TodoItem
          onDeleteTodo={onDeleteTodo}
          todo={todo}
          key={todo.id}
          onCompletedChange={onCompletedChange}
          isLoading={loadingTodosIds.includes(todo.id)}
          onUpdateTodo={
            (todoTitle: string) => handleUpdateTodo(todo, todoTitle)
          }
        />
      ))}
    </section>
  );
};

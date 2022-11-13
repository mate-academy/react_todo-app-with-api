import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoListItem } from '../TodoListItem';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => Promise<void>,
  isAdding: boolean,
  tempTodo: Todo,
  todoIdsToRemove: number[],
  toggleTodoStatus: (todoId: number, status: boolean) => Promise<void>,
  changeTitle: (todoId: number, newTitle: string) => Promise<void>
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  removeTodo,
  isAdding,
  tempTodo,
  todoIdsToRemove,
  toggleTodoStatus,
  changeTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          isLoading={todoIdsToRemove.includes(todo.id)}
          onRemove={removeTodo}
          toggleTodoStatus={toggleTodoStatus}
          removeTodo={removeTodo}
          changeTitle={changeTitle}
        />
      ))}

      {isAdding && (
        <TodoListItem
          todo={tempTodo}
          isLoading={isAdding}
          toggleTodoStatus={toggleTodoStatus}
          removeTodo={removeTodo}
          changeTitle={changeTitle}
        />
      )}
    </section>
  );
});

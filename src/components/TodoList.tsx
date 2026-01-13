import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  onDeleteTodo: (todoId: number) => void;
  onToggleTodo?: (todo: Todo) => Promise<void>;
  onUpdateTodo?: (
    todoId: number,
    data: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  onDeleteTodo,
  onToggleTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={() => onDeleteTodo(todo.id)}
          //isLoading={deletingTodoIds.includes(todo.id)}
          onToggleTodo={onToggleTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={
            deletingTodoIds.includes(todo.id) ||
            updatingTodoIds.includes(todo.id)
          }
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};

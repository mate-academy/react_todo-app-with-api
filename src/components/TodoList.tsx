import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  loadingTodoId: number | null,
  onDelete: (todoId: number) => void,
  onToggleTodoStatus: (tododId: number, completed: boolean) => void,
  onEditTodoTitle: (tododId: number, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoId,
  onDelete,
  onToggleTodoStatus,
  onEditTodoTitle,
}) => {
  return (
    <ul className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          loading={loadingTodoId === todo.id}
          onToggleTodoStatus={onToggleTodoStatus}
          onEditTodoTitle={onEditTodoTitle}

        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDelete}
          loading={loadingTodoId === tempTodo.id}
          onToggleTodoStatus={onToggleTodoStatus}
          onEditTodoTitle={onEditTodoTitle}
        />
      )}
    </ul>
  );
};

import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  allTodos: Todo[];
  tempTodo: Todo | null;
  deletingTodoId: number | null;
  todosIds: number[];

  handleDeleteTodo: (todoId: number) => void;
  onToggleCompleted: (id: number, title: string, completed: boolean) => void;
  handleTitleChange: (
    id: number,
    title: string,
    completed: boolean,
  ) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  allTodos,
  tempTodo,
  deletingTodoId,
  todosIds,
  handleDeleteTodo,
  onToggleCompleted,
  handleTitleChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {allTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodoId={deletingTodoId}
          onToggleCompleted={onToggleCompleted}
          todosIds={todosIds}
          handleTitleChange={handleTitleChange}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          deletingTodoId={deletingTodoId}
          onToggleCompleted={onToggleCompleted}
          todosIds={todosIds}
          handleTitleChange={handleTitleChange}
        />
      )}
    </section>
  );
};

import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

interface Props {
  todos: Todo[],
  todoIdsToDelete: number[],
  todoIdsToUpdate: number[],
  deleteCurrentTodo: (todoId: number) => void,
  isAdding: boolean,
  title: string,
  onStatusUpdate: (todoId: number, completed: boolean) => void,
  onTitleUpdate: (todoId: number, newTitle: string) => void,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  deleteCurrentTodo,
  todoIdsToDelete,
  isAdding,
  title,
  onStatusUpdate,
  todoIdsToUpdate,
  onTitleUpdate,
}) => {
  const tempTodo = {
    id: 0,
    userId: 0,
    title,
    completed: false,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todoIdsToDelete={todoIdsToDelete}
          todo={todo}
          deleteCurrentTodo={deleteCurrentTodo}
          todoIdsToUpdate={todoIdsToUpdate}
          onStatusUpdate={onStatusUpdate}
          onTitleUpdate={onTitleUpdate}
        />
      ))}
      {isAdding && (
        <TodoInfo
          todoIdsToUpdate={todoIdsToUpdate}
          onStatusUpdate={onStatusUpdate}
          todoIdsToDelete={todoIdsToDelete}
          todo={tempTodo}
          deleteCurrentTodo={deleteCurrentTodo}
          onTitleUpdate={onTitleUpdate}
        />
      )}
    </section>
  );
});

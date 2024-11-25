import React, { FC } from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  temptTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  loadingTodoId: number[];
  updateTodo: (updatedTodo: Todo) => void;
  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const TodoList: FC<Props> = ({
  todos,
  temptTodo,
  onDeleteTodo,
  loadingTodoId,
  updateTodo,
  editingTodoId,
  setEditingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          loadingTodoId={loadingTodoId}
          isLoading={loadingTodoId.includes(todo.id)}
          updateTodo={updateTodo}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />
      ))}

      {temptTodo && (
        <TodoItem
          todo={temptTodo}
          onDeleteTodo={onDeleteTodo}
          loadingTodoId={loadingTodoId}
          isLoading={false}
          updateTodo={updateTodo}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />
      )}
    </section>
  );
};

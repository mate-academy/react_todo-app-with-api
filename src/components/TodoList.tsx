import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDeleteTodos: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  loadingTodosIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = props => {
  const { todos, loadingTodosIds, onDeleteTodos, onUpdateTodo, tempTodo } =
    props;

  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodos={onDeleteTodos}
          onUpdateTodo={onUpdateTodo}
          isLoading={loadingTodosIds.includes(todo.id)}
          isEditing={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDeleteTodos={onDeleteTodos}
          onUpdateTodo={onUpdateTodo}
          setEditedTodoId={setEditedTodoId}
          isLoading
        />
      )}
    </section>
  );
};

import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  editTitle: (todo: Todo) => Promise<void>;
  loadingTodos: Set<number>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  updateTodo,
  editTitle,
  loadingTodos,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={() => deleteTodo(todo.id)}
        onUpdate={() => updateTodo(todo)}
        isLoading={loadingTodos.has(todo.id)}
        onEditTitle={editedTitle => editTitle({ ...todo, title: editedTitle })}
      />
    ))}

    {tempTodo && (
      <TodoItem key={tempTodo.id} todo={tempTodo} isTemp isLoading={true} />
    )}
  </section>
);

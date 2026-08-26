import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  checkedTodoCompleted: (id: number, completed: boolean) => void;
  removeTodo: (id: number) => void;
  deletingTodoId: number[];
  loadingTodo: number[];
  saveEdit: (id: number, newTitle: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  checkedTodoCompleted,
  removeTodo,
  deletingTodoId,
  loadingTodo,
  saveEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          checkedTodoCompleted={checkedTodoCompleted}
          removeTodo={removeTodo}
          deletingTodoId={deletingTodoId}
          loadingTodo={loadingTodo}
          saveEdit={saveEdit}
        />
      ))}
    </section>
  );
};

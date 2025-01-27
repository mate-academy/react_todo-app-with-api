import React from 'react';
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './ToDoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (userId: number) => Promise<boolean>;
  toggleTodoStatus: (todoId: number, completed: boolean) => void;
  todosAreLoadingIds: number[];
  updateTodoTitle: (todoId: number, newTitle: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  toggleTodoStatus,
  updateTodoTitle,
  tempTodo,
  todosAreLoadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          toggleTodoStatus={toggleTodoStatus}
          updateTodoTitle={updateTodoTitle}
          todosAreLoadingIds={todosAreLoadingIds}
        />
      ))}
      {tempTodo && <TempTodo tempTitle={tempTodo.title} />}
    </section>
  );
};

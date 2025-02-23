import React from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/Todoitem';
import { TempTodo } from '../TempTodo';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  updateTodo: (
    todoId: number,
    title: string,
    completed?: boolean,
  ) => Promise<void> | undefined;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  deleteTodo,
  tempTodo,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingTodoIds={loadingTodoIds}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
      ))}
      {tempTodo && <TempTodo title={tempTodo.title} />}
    </section>
  );
};

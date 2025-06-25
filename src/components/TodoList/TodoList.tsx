/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoCard } from '../TodoCard/TodoCard';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (todoId: number) => void;
  changeTodoCompleteStatus: (todoId: number, status?: boolean) => void;
  changeTodoTitle: (todoId: number, title: string) => Promise<void> | undefined;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  changeTodoCompleteStatus,
  changeTodoTitle,
}) => {
  let tempTodoToRender = {
    id: 0,
    userId: 0,
    title: 'Unknown',
    completed: false,
    loading: false,
  };

  if (tempTodo) {
    tempTodoToRender = tempTodo;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoCard
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          changeTodoCompleteStatus={changeTodoCompleteStatus}
          changeTodoTitle={changeTodoTitle}
        />
      ))}
      {Boolean(tempTodo) && (
        <TodoCard todo={tempTodoToRender} deleteTodo={deleteTodo} />
      )}
    </section>
  );
};

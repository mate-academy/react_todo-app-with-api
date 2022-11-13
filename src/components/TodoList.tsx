import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (id: number) => void;
  changeTodoTitle: (todoId: number, newTitle: string) => void;
  changeTodoStatus: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  changeTodoStatus,
  changeTodoTitle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {visibleTodos.map(todo => (
      <TodoInfo
        todo={todo}
        deleteTodo={deleteTodo}
        key={todo.id}
        changeTodoTitle={changeTodoTitle}
        changeTodoStatus={changeTodoStatus}
      />
    ))}
  </section>

);

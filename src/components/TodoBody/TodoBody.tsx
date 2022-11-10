import React from 'react';
import { TodoItem } from '../TodoItem';
import { AddingTodoItem } from '../AddingTodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[],
  isLoading: boolean,
  todoTitle: string,
  deleteTodo: (todoId: number) => void;
  proccessedTodoId: number[],
  changeCompleteStatus: (todoId: number, isComplited: boolean) => void;
  changeTodoTitle: (todoId: number, newTitle: string) => void;
};

export const TodoBody: React.FC<Props> = React.memo(({
  visibleTodos,
  isLoading,
  todoTitle,
  deleteTodo,
  proccessedTodoId,
  changeCompleteStatus,
  changeTodoTitle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">

    {visibleTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        proccessedTodoId={proccessedTodoId}
        changeCompleteStatus={changeCompleteStatus}
        changeTodoTitle={changeTodoTitle}
      />
    ))}

    {isLoading && (
      <AddingTodoItem
        title={todoTitle}
      />
    )}
  </section>
));

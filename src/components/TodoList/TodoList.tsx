import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  loader: boolean;
  focusedTodoId: number;
  togglerLoader: boolean;
  clearCompletedLoader: boolean;
  onDeleteTodo: (value: number) => void;
  onUpdateTodo: (todoId: number, todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loader,
  focusedTodoId,
  togglerLoader,
  clearCompletedLoader,
  onDeleteTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          loader={loader}
          focusedTodoId={focusedTodoId}
          togglerLoader={togglerLoader}
          clearCompletedLoader={clearCompletedLoader}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </section>
  );
};

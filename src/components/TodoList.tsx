import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setTodos: (arg: Todo[]) => void;
  setErrorMessage: (arg: string) => void;
  loadingTodoId: number[];
  setLoadingTodoId: (arg: number[]) => void;
  filteredTodos: Todo[];
  onDeleteTodo: (arg: number) => void;
  onUpdateTodo: (arg: Todo) => void;
  // activeTodos: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  loadingTodoId,
  setLoadingTodoId,
  filteredTodos,
  onDeleteTodo,
  onUpdateTodo,
  // activeTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          loadingTodoId={loadingTodoId}
          setLoadingTodoId={setLoadingTodoId}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          // activeTodos={activeTodos}
        />
      ))}
    </section>
  );
};

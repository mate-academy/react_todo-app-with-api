import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';
import { ErrorHandler } from '../../types/ErrorHandler';

type Props = {
  todos: Todo[];
  tempTodo: Todo;
  isAdding: boolean;
  onDelete: (todoId:number) => void;
  todosToDelete: number[];
  toggleTodo: (todoId: number, status: boolean) => void;
  changeTitle: (todoId: number, title: string) => void;
  setError: (error: ErrorHandler) => void;
  getTodos: () => void;
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  isAdding,
  onDelete,
  todosToDelete,
  toggleTodo,
  changeTitle,
  setError,
  getTodos,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        isAdding={todosToDelete.includes(todo.id)}
        onDelete={onDelete}
        toggleTodo={toggleTodo}
        changeTitle={changeTitle}
        setError={setError}
        getTodos={getTodos}
      />
    ))}
    {(isAdding && (
      <TodoInfo
        todo={tempTodo}
        isAdding={isAdding}
        onDelete={onDelete}
        toggleTodo={toggleTodo}
        changeTitle={changeTitle}
        setError={setError}
        getTodos={getTodos}
      />
    ))}
  </section>
);

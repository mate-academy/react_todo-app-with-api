import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { ErrorMessage } from '../../types/ErrorStatusType';

type TodoListProps = {
  todos: Todo[];
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  setTodos: (todos: Todo[]) => void;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  todoIdsToDelete: number[];
  todoIdsToUpdate: number[];
  setTodoIdsToDelete: (idsToDelete: number[]) => void;
  setTodoIdsToUpdate: (idsToUpdate: number[]) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  visibleTodos,
  tempTodo,
  setTodos,
  setErrorMessage,
  todoIdsToDelete,
  todoIdsToUpdate,
  setTodoIdsToDelete,
  setTodoIdsToUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            setTodos={setTodos}
            todos={todos}
            setErrorMessage={setErrorMessage}
            todoIdsToDelete={todoIdsToDelete}
            isTempTodo={false}
            todoIdsToUpdate={todoIdsToUpdate}
            setTodoIdsToDelete={setTodoIdsToDelete}
            setTodoIdsToUpdate={setTodoIdsToUpdate}
          />
        );
      })}
      {tempTodo && <TodoItem todo={tempTodo} isTempTodo />}
    </section>
  );
};

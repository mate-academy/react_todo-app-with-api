/* eslint-disable no-lone-blocks */
// import { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  deleteTodo: (todoId: number) => void;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTodo: (todoId: number) => void
  updateTodoList: (updatedTodoItem: Todo) => void
  setErrorMessage: (newMessage: string) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  deleteTodo,
  deletingTodoId,
  isLoading,
  setIsLoading,
  tempTodo,
  toggleTodo,
  updateTodoList,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isDeleting={deletingTodoId === todo.id && isLoading}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          toggleTodo={toggleTodo}
          updateTodoList={updateTodoList}
          setErrorMessage={setErrorMessage}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          toggleTodo={toggleTodo}
          updateTodoList={updateTodoList}
          setErrorMessage={setErrorMessage}
        />
      )}
    </section>
  );
};

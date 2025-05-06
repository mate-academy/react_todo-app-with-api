import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todoList: Todo[];
  isLoading: boolean;
  deleteTodos: (todoId: number) => void;
  loadingIds: number[];
  tempTodo: Todo | null;
  filteredTodos: Todo[];
  updatePost: (todoToUpdate: Todo) => Promise<void>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  isLoading,
  deleteTodos,
  loadingIds,
  tempTodo,
  filteredTodos,
  updatePost,
  inputRef,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {isLoading && !todoList.length ? (
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    ) : (
      filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodos={deleteTodos}
          isLoading={loadingIds.includes(todo.id)}
          updatePost={updatePost}
          inputRef={inputRef}
        />
      ))
    )}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        deleteTodos={deleteTodos}
        isLoading={loadingIds.includes(tempTodo.id)}
        updatePost={updatePost}
        inputRef={inputRef}
      />
    )}
  </section>
);

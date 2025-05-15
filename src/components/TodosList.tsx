/* eslint-disable prettier/prettier */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (deleteTodo: Todo) => void;
  handleChecked: (checkedTodo: Todo) => void;
  handleUpdateTodoTitle: (
    todoId: number,
    editedTitle: string,
  ) => Promise<boolean>;
  loadingIds: number[];
  isLoadingAll: boolean;
};

export const TodosList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleChecked,
  handleUpdateTodoTitle,
  loadingIds,
  isLoadingAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {isLoadingAll
        ? todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDeleteTodo={handleDeleteTodo}
            handleChecked={handleChecked}
            handleUpdateTodoTitle={handleUpdateTodoTitle}
            loadingIds={todos.map(currentTodo => currentTodo.id)}
          />
        ))
        : todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDeleteTodo={handleDeleteTodo}
            handleChecked={handleChecked}
            handleUpdateTodoTitle={handleUpdateTodoTitle}
            loadingIds={loadingIds}
          />
        ))}
    </section>
  );
};

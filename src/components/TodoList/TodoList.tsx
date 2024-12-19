import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[] | null;
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  isEditingTodos: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  loadingTodoIds: number[];
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  isEditingTodos,
  setErrorMessage,
  loadingTodoIds,
  setLoadingTodoIds,
  setTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos &&
        todos.map((todo: Todo) => (
          <TodoItem
            todo={todo}
            deleteTodo={deleteTodo}
            isLoading={loadingTodoIds.includes(todo.id)}
            key={todo.id}
            isEditingTodos={isEditingTodos}
            setErrorMessage={setErrorMessage}
            setLoadingTodoIds={setLoadingTodoIds}
            setTodos={setTodos}
          />
        ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          isLoading={true}
          isEditingTodos={isEditingTodos}
          setErrorMessage={setErrorMessage}
          setLoadingTodoIds={setLoadingTodoIds}
          setTodos={setTodos}
        />
      )}
    </section>
  );
};

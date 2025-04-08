import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { ERROR, TempTodoAction } from '../../types/enums';

type Props = {
  todos: Todo[];
  setErrorMessage: (value: ERROR) => void;
  setTodos: (callback: (prev: Todo[]) => Todo[]) => void;
  todosLoading: number[];
  loadingIdsState: {
    adIdToLoadingList: (id: number) => void;
    removeIdFromLoadingList: (id: number | null) => void;
  };
  setTempTodo: (
    tempTodo: {
      type: TempTodoAction;
      todo?: Todo;
      todoId?: Todo['id'];
    } | null,
  ) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingIdsState: loading,
  setErrorMessage,
  setTodos,
  todosLoading,
  setTempTodo,
}) => {
  const onError = (message: ERROR) => {
    setErrorMessage(message);
    loading.removeIdFromLoadingList(null);
    throw new Error(message);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingList={{
            adIdToLoadingList: loading.adIdToLoadingList,
            removeIdFromLoadingList: loading.removeIdFromLoadingList,
          }}
          onError={onError}
          setTodos={setTodos}
          isLoading={todosLoading.includes(todo.id)}
          setTempTodo={setTempTodo}
        />
      ))}
    </section>
  );
};

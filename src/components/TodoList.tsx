import React from 'react';
import { Todo } from '../types/Todo';
import { ToDo } from './Todo';
import { User } from '../types/User';
import { ErrorType } from '../types/ErrorType';

type Props = {
  List: Todo[],
  onErrorRemove: (value: ErrorType) => void,
  onErrorUpdate: (value: ErrorType) => void,
  onHidden: (value: boolean) => void,
  updateTodoList: (u: User) => void,
  isAdding: Todo | null,
  selectComplited: (todo: Todo) => Promise<void>,
  clearLoader: boolean,
  loadingAllTodos: boolean,
  onLoadTodo:(value: Todo | null) => void,
  loadTodo: Todo | null,
};

export const TodoLIst: React.FC<Props> = React.memo((
  {
    List,
    onErrorRemove,
    onErrorUpdate,
    onHidden,
    updateTodoList,
    isAdding,
    selectComplited,
    clearLoader,
    loadingAllTodos,
    onLoadTodo,
    loadTodo,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {List.map(todo => (
        <ToDo
          todo={todo}
          updateTodoList={updateTodoList}
          setErrorUpdate={onErrorUpdate}
          setErrorRemove={onErrorRemove}
          setHidden={onHidden}
          selectComplited={selectComplited}
          clearLoader={clearLoader}
          loadingAllTodos={loadingAllTodos}
          onLoadTodo={onLoadTodo}
          loadTodo={loadTodo}
        />
      ))}

      {isAdding && (
        <ToDo
          todo={isAdding}
          updateTodoList={updateTodoList}
          setErrorUpdate={onErrorUpdate}
          setErrorRemove={onErrorRemove}
          setHidden={onHidden}
          selectComplited={selectComplited}
          clearLoader={clearLoader}
          loadingAllTodos={loadingAllTodos}
          onLoadTodo={onLoadTodo}
          loadTodo={loadTodo}
        />
      )}
    </section>
  );
});

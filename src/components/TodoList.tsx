import React from 'react';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';

type Props = {
  visibleTodos: Todo[];
  handleDeleteTodo: (id: number) => void;
  loadingTodoIds: number[];
  handleUpdateTodo: (todo: Todo) => void;
  updateTodoId: number | null;
  setUpdateTodoId: (value: number | null) => void;
  tempTodo: Todo | null;
  inputRef: React.RefObject<HTMLInputElement>;
};

// eslint-disable-next-line react/display-name
export const TodoList: React.FC<Props> = React.memo(
  ({
    visibleTodos,
    handleDeleteTodo,
    loadingTodoIds,
    handleUpdateTodo,
    updateTodoId,
    setUpdateTodoId,
    tempTodo,
    inputRef,
  }: Props) => {
    return (
      <div data-cy="TodoList">
        {visibleTodos.map(todo => (
          <TodoElement
            todo={todo}
            key={todo.id}
            handleDeleteTodo={handleDeleteTodo}
            loadingTodoIds={loadingTodoIds}
            handleUpdateTodo={handleUpdateTodo}
            updateTodoId={updateTodoId}
            setUpdateTodoId={setUpdateTodoId}
            inputRef={inputRef}
          />
        ))}
        {tempTodo && (
          <TodoElement
            key={tempTodo.id}
            todo={tempTodo}
            handleDeleteTodo={() => {}}
            loadingTodoIds={[0]}
            handleUpdateTodo={() => {}}
            updateTodoId={null}
            setUpdateTodoId={() => {}}
            inputRef={inputRef}
          />
        )}
      </div>
    );
  },
);

import React, { RefObject } from 'react';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  handleOnClickDelete: (todoForDelate: Todo) => Promise<void>;
  handleOnChangeStatus: (todoForChange: Todo) => Promise<void>;
  handleOnDoubleClick: (thisTodo: Todo) => void;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  saveChanges: () => Promise<void>;
  inputRef: RefObject<HTMLInputElement>;
  query: string;
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  loadingTodosId: number[];
  editingTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  handleOnClickDelete,
  handleOnChangeStatus,
  handleOnDoubleClick,
  handleOnChange,
  handleOnSubmit,
  saveChanges,
  inputRef,
  query,
  filteredTodos,
  tempTodo,
  loadingTodosId,
  editingTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            handleOnClickDelete={handleOnClickDelete}
            handleOnChangeStatus={handleOnChangeStatus}
            handleOnDoubleClick={handleOnDoubleClick}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
            saveChanges={saveChanges}
            query={query}
            todo={todo}
            inputRef={inputRef}
            loadingTodosId={loadingTodosId}
            editingTodo={editingTodo}
          />
        );
      })}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};

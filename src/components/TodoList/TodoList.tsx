import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { filterTodosByStatus } from '../../utils/filterTodosByStatus';
import { TodoItem } from '../TodoItem/TodoItem';
import { Error } from '../../types/Error';

import React, { Dispatch, SetStateAction, RefObject } from 'react';

import { patchTodos } from '../../api/todos';

function filterToBool(filter: Filter) {
  let boolFilter;

  switch (filter) {
    case Filter.Active:
      boolFilter = false;
      break;
    case Filter.Completed:
      boolFilter = true;
      break;
    default:
      boolFilter = null;
      break;
  }

  return boolFilter;
}

type Props = {
  todos: Todo[];
  activeFilter: Filter;
  handleTodoStatusChange: (id: number, newStatus: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  loadingTodoIds: number[];
  setLoadingTodoIds: Dispatch<SetStateAction<number[]>>;
  addTodoField: RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  showError: (message: Error) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  activeFilter,
  handleTodoStatusChange,
  onDelete,
  loadingTodoIds,
  setLoadingTodoIds,
  addTodoField,
  tempTodo,
  setTodos,
  showError,
}) => {
  function handleTitleChange(editingTodoId: number | null, newTitle: string) {
    const updateTitle = { title: newTitle };

    return patchTodos(editingTodoId, updateTitle)
      .then(fetchedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === fetchedTodo.id ? fetchedTodo : todo,
          ),
        );
      })
      .catch(error => {
        showError(Error.UpdateError);
        throw error;
      });
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodosByStatus(todos, filterToBool(activeFilter)).map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleTodoStatusChange={handleTodoStatusChange}
          onDelete={onDelete}
          loadingTodoIds={loadingTodoIds}
          setLoadingTodoIds={setLoadingTodoIds}
          addTodoField={addTodoField}
          handleTitleChange={handleTitleChange}
        />
      ))}

      {!!tempTodo && (
        <TodoItem key={tempTodo.id} todo={tempTodo} isTemp={true} />
      )}
    </section>
  );
};

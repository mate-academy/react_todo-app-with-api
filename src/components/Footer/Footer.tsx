import React from 'react';
import { FilterTypes } from '../../types/FilterTypes';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';
import { FilterTodos } from '../FilterTodos';

type Props = {
  notCompletedTodosCount: number;
  setIsDeletedTodoHasLoader: (state: boolean) => void;
  completedIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isAnyCompletedTodos: boolean;
  selectedTodos: FilterTypes;
  setSelectedTodos: (state: FilterTypes) => void;
  setErrorMessage: (error: string) => void;
};

export const Footer: React.FC<Props> = ({
  notCompletedTodosCount,
  setIsDeletedTodoHasLoader,
  completedIds,
  setTodos,
  isAnyCompletedTodos,
  selectedTodos,
  setSelectedTodos,
  setErrorMessage,
}) => {
  function handleDeleteCompletedTodos() {
    setIsDeletedTodoHasLoader(true);

    Promise.allSettled(completedIds.map(id => deleteTodo(id)))
      .then(results => {
        const successfulIds = results
          .map((result, index) =>
            result.status === 'fulfilled' ? completedIds[index] : null,
          )
          .filter(id => id !== null);

        setTodos(currTodos =>
          currTodos.filter(todo => !successfulIds.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          setErrorMessage(ErrorMessage.DeleteTodoError);
        }
      })
      .finally(() => {
        setIsDeletedTodoHasLoader(false);
      });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <FilterTodos
        selectedTodos={selectedTodos}
        setSelectedTodos={setSelectedTodos}
      />
      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isAnyCompletedTodos}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};

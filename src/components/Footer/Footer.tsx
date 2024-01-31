import React, { useCallback, useContext, useMemo } from 'react';
import { Filter } from '../Filter';
import { GlobalContext } from '../GlobalContextProvider';
import { Errors } from '../../types/Errors';
import { deleteTodo } from '../../api/todos';

interface Props {
  inputField?: React.RefObject<HTMLInputElement>;
}

export const Footer: React.FC<Props> = React.memo(({ inputField }) => {
  const {
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    setErrorMessage,
    setSelectedTodosIds,

  } = useContext(GlobalContext);

  const onClearCompleted = useCallback(() => {
    setErrorMessage(null);
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setSelectedTodosIds(idsToLoad => [...idsToLoad, ...completedTodosIds]);

    const requests = completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => {
          setTodos(tasks => {
            return tasks.filter(task => !completedTodosIds.includes(task.id));
          });
        });
    });

    Promise.all(requests)
      .then(() => {
        setSelectedTodosIds(idsToLoad => idsToLoad.filter(id => {
          return !completedTodosIds.includes(id);
        }));
        inputField?.current?.focus();
      })
      .catch(() => setErrorMessage(Errors.deleteTodoError));
  }, [
    todos,
    setErrorMessage,
    setTodos,
    setSelectedTodosIds,
    inputField,
  ]);

  const activeTodosLength = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosLength} items left`}
      </span>

      <Filter
        currentStatus={filterBy}
        setStatus={setFilterBy}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});

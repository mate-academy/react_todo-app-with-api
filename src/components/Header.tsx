/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useState } from 'react';
import { createTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { NewTodoField } from './NewTodoField';

type Props = {
  user: User | null,
  titleToAdd: string,
  changeTitle: (value: string) => void,
  onSetTodo: (newTodo: Todo) => void,
  onSetTitleError: (isError: boolean) => void,
  onSetIsAdding: (isLoading: boolean) => void,
  isAdding: boolean,
  completedTodos: Todo[],
  activeTodos: Todo[],
  todos: Todo[]
  loadTodos: () => void,
  addTodoToLoadingList: (idToAdd: number) => void,
  clearLoadingList: () => void,
};

export const Header: React.FC<Props> = (
  {
    user,
    titleToAdd,
    changeTitle,
    onSetTodo,
    onSetTitleError,
    onSetIsAdding,
    isAdding,
    completedTodos,
    activeTodos,
    todos,
    loadTodos,
    addTodoToLoadingList,
    clearLoadingList,
  },
) => {
  const [addTodoError, setAddTodoError] = useState(false);

  const addNewTodo = async () => {
    onSetTitleError(false);
    setAddTodoError(false);

    if (!user) {
      return;
    }

    if (titleToAdd.trim().length === 0) {
      onSetTitleError(true);
      setTimeout(() => onSetTitleError(false), 3000);

      return;
    }

    try {
      onSetIsAdding(true);
      const newTodo = await createTodo(titleToAdd, user.id, false);

      onSetTodo(newTodo);
      onSetIsAdding(false);
      changeTitle('');
    } catch {
      setAddTodoError(true);
      onSetIsAdding(false);
      setTimeout(() => {
        setAddTodoError(false);
      }, 3000);
    }
  };

  const toggleAll = async () => {
    if (completedTodos.length === todos.length) {
      await Promise.all(completedTodos.map(({ id, title, completed }) => {
        addTodoToLoadingList(id);

        return updateTodo(id, title, !completed);
      }));
    } else {
      await Promise.all(activeTodos.map(({ id, title, completed }) => {
        addTodoToLoadingList(id);

        return updateTodo(id, title, !completed);
      }));
    }

    await loadTodos();
    clearLoadingList();
  };

  return (
    <>
      {addTodoError && (
        <div
          className={classNames(
            'notification', 'is-danger', 'is-light', {
              hidden: !addTodoError,
            },
          )}
        >
          <span>Unable to add a todo</span>
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setAddTodoError(false)}
          />
        </div>
      )}

      <header className="todoapp__header">
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          onClick={toggleAll}
        />

        <NewTodoField
          title={titleToAdd}
          changeTitle={changeTitle}
          onSetTitleError={onSetTitleError}
          isAdding={isAdding}
          onSubmit={addNewTodo}
        />
      </header>
    </>
  );
};

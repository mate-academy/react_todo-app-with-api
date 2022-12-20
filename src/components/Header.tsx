/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { createTodo, updateTodo } from '../api/todos';
import { ErrorTypes } from '../types/ErrorTypes';
import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { NewTodoField } from './NewTodoField';

type Props = {
  user: User | null,
  titleToAdd: string,
  changeTitle: (value: string) => void,
  onSetTodo: (newTodo: Todo) => void,
  errorInfo: (errorTitle: ErrorTypes) => void,
  onSetIsAdding: (isLoading: boolean) => void,
  isAdding: boolean,
  completedTodos: Todo[],
  activeTodos: Todo[],
  todos: Todo[]
  loadTodos: () => void,
  addTodoToLoadingList: (idToAdd: number) => void,
  clearLoadingList: () => void,
  clearErrorMessage: () => void,
};

export const Header: React.FC<Props> = (
  {
    user,
    titleToAdd,
    changeTitle,
    onSetTodo,
    errorInfo,
    onSetIsAdding,
    isAdding,
    completedTodos,
    activeTodos,
    todos,
    loadTodos,
    addTodoToLoadingList,
    clearLoadingList,
    clearErrorMessage,
  },
) => {
  const handleSubmit = async () => {
    clearErrorMessage();

    if (!user) {
      return;
    }

    if (titleToAdd.trim().length === 0) {
      errorInfo(ErrorTypes.TITLE);

      return;
    }

    try {
      onSetIsAdding(true);
      const newTodo = await createTodo(titleToAdd, user.id, false);

      onSetTodo(newTodo);
      onSetIsAdding(false);
      changeTitle('');
    } catch {
      onSetIsAdding(false);
      errorInfo(ErrorTypes.TITLE);
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
        onSetTitleError={clearErrorMessage}
        isAdding={isAdding}
        onSubmit={handleSubmit}
      />
    </header>
  );
};

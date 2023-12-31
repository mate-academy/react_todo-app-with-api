/*eslint-disable*/

import cn from "classnames";

import { Todo } from "../../types/Todo";

import { TodoForm } from "../TodoForm/TodoForm";


type Props = {
  onDeleteCompletedTodos: () => void,
  onErrorMessage: (value: string) => void,
  onToggleAll: () => void,
  onSubmit: (value: Todo) => Promise<void>,
  onDelete: (value: number) => void,
  onQuery: (value: string) => void,

  updateInputFocus: boolean,
  isInputDisabled: boolean,
  query: string,
  todos: Todo[],
}

export const Header: React.FC<Props> = ({
  onDeleteCompletedTodos,
  onErrorMessage,
  onToggleAll,
  onSubmit,
  onDelete,
  onQuery,

  updateInputFocus,
  isInputDisabled,
  query,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <TodoForm
        onDeleteCompletedTodos={onDeleteCompletedTodos}
        onErrorMessage={onErrorMessage}
        onSubmit={onSubmit}
        onDelete={onDelete}
        onQuery={onQuery}
        updateInputFocus={updateInputFocus}
        isInputDisabled={isInputDisabled}
        query={query}
      />
    </header>
  );
};

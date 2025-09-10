import classNames from 'classnames';
import { Todo } from '../../types/types';

export type Props = {
  quantityActiveTasks: number;
  handleSearchQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string | '';
  inputRef: React.RefObject<HTMLInputElement>;
  setSearchQuery: (value: string) => void;
  handleAddTodo: (
    title: string,
    setSearchQuery: (value: string) => void,
  ) => void;
  handleToggleAll: () => void;
  todos: Todo[];
  loadingTodos: number[];
};

export const TodoHeader: React.FC<Props> = ({
  quantityActiveTasks,
  handleSearchQuery,
  searchQuery,
  handleAddTodo,
  inputRef,
  setSearchQuery,
  loadingTodos,
  handleToggleAll,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      {/* ? */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: quantityActiveTasks === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddTodo(searchQuery, setSearchQuery);
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={searchQuery}
          onChange={handleSearchQuery}
          disabled={loadingTodos.length > 0}
        />
      </form>
    </header>
  );
};

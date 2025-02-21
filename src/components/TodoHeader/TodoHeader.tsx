import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoList } from '../TodoList/TodoList';
import { FilterNav } from '../../types/Filter';
import { TodoFooter } from '../TodoFooter/TodoFooter';

type Props = {
  allTodos: Todo[];
  filtredTodos: Todo[];
  onSubmit: (newTitle: string) => Promise<void>;
  deleteTodo: (todoId: number) => void;
  handleFilter: (filterName: FilterNav) => void;
  selectFilter: FilterNav;
  tempTodo: Todo | null;
  handleDeleteAllTodo: () => Promise<void>;
  toggleTodoStatus: (todoId: number) => Promise<void>;
  toggleAllTodoStatus: (todosToUpdateIds: number[]) => Promise<void>;
  updateTodoTitle: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({
  allTodos,
  filtredTodos,
  onSubmit,
  deleteTodo,
  handleFilter,
  selectFilter,
  tempTodo,
  handleDeleteAllTodo,
  toggleTodoStatus,
  toggleAllTodoStatus,
  updateTodoTitle,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isAllLoading, setIsAllLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setNewTodoTitle('');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDisabled(true);
    onSubmit(newTodoTitle)
      .then(reset)
      .finally(() => {
        setIsDisabled(false);

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      });
  };

  const isAllTodosDone = () => allTodos.every(todo => todo.completed);

  const handleToggleAll = async () => {
    const allCompleted = isAllTodosDone();
    const todosToUpdateIds = allTodos
      .filter(todo => todo.completed !== !allCompleted)
      .map(todo => todo.id);

    setIsAllLoading(true);

    try {
      await toggleAllTodoStatus(todosToUpdateIds);
    } catch (error) {
      throw error;
    } finally {
      setIsAllLoading(false);
    }
  };

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosDone(),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />

        <form onSubmit={handleFormSubmit}>
          <input
            disabled={isDisabled}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={handleInputSubmit}
            ref={inputRef}
          />
        </form>
      </header>
      {filtredTodos.length > 0 && (
        <TodoList
          todos={filtredTodos}
          deleteTodo={deleteTodo}
          toggleTodoStatus={toggleTodoStatus}
          tempTodo={tempTodo}
          updateTodoTitle={updateTodoTitle}
          isAllLoading={isAllLoading}
        />
      )}

      {allTodos.length > 0 && (
        <TodoFooter
          todos={allTodos}
          handleFilter={handleFilter}
          selectFilter={selectFilter}
          handleDeleteAllTodo={handleDeleteAllTodo}
        />
      )}
    </div>
  );
};

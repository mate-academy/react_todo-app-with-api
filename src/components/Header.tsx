import { TodosForm } from './TodosForm';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  addPost: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAllCompleted: (toggle: boolean) => void;
  allActiveTodo: boolean;
  todosList: Todo[];
  handleSubmit: (
    event: React.FormEvent,
    query: string,
    setQuery: (event: string) => void,
  ) => void;
}

export const Header: React.FC<Props> = ({
  addPost,
  setErrorMessage,
  setIsLoading,
  isLoading,
  inputRef,
  toggleAllCompleted,
  allActiveTodo,
  todosList,
  handleSubmit,
}) => {
  const [query, setQuery] = useState('');

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosList.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allActiveTodo,
          })}
          data-cy="ToggleAllButton"
          onClick={() => {
            toggleAllCompleted(todosList.some(todo => !todo.completed));
          }}
        />
      )}

      {/* Add a todo on form submit */}
      <TodosForm
        query={query}
        setQuery={setQuery}
        addPost={addPost}
        setErrorMessage={setErrorMessage}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        inputRef={inputRef}
        handleSubmit={handleSubmit}
      />
    </header>
  );
};

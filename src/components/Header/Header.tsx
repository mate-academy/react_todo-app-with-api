import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useTodosContext } from '../../context/TodosProvider';
import { getActiveTodos, getCompletedTodos } from '../../utils/functions';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

const Header = () => {
  const { todos, errorMessage, tempTodo, handleAddTodo, handleUpdateTodo } =
    useTodosContext();
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeTodos = getActiveTodos(todos);
  const completedTodos = getCompletedTodos(todos);
  const isAllCompletedTodos = completedTodos.length === todos.length;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleAddTodo(query, setQuery);
  };

  const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setQuery(value);
  };

  const handleToggleTodos = () => {
    const todosForUpdate = isAllCompletedTodos ? todos : activeTodos;

    todosForUpdate.forEach((todo: Todo) =>
      handleUpdateTodo({
        ...todo,
        completed: !todo.completed,
      })(),
    );
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, errorMessage]);

  return (
    <>
      <header className="todoapp__header">
        {!!todos.length && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllCompletedTodos,
            })}
            data-cy="ToggleAllButton"
            aria-label="delete"
            onClick={handleToggleTodos}
          />
        )}

        {/* Add a todo on form submit */}
        <form onSubmit={onSubmit}>
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={query}
            onChange={onChange}
            disabled={!!tempTodo}
          />
        </form>
      </header>
    </>
  );
};

export default Header;

import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { OptionUpdate } from '../types/OptionsType';

type Props = {
  todos: Todo[];
  loading: boolean;
  changeFocus: boolean;
  errorMsg: string | null;
  showError: (text: string | null) => void;
  updateChecked: (updatedTodo: Todo, option: OptionUpdate) => void;
  createTodo: (todo: string) => Promise<string>;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  loading,
  changeFocus,
  errorMsg,
  updateChecked = () => {},
  createTodo,
  showError = () => {},
}) => {
  const [todo, setTodo] = useState<string>('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isAllCompletedTots, setIsAllCompletedTots] = useState<boolean>(false);

  const checkingIsAllCompletedTodos = (allTodos: Todo[]) => {
    return allTodos.every(todoItem => todoItem.completed);
  };

  useEffect(() => {
    if (changeFocus) {
      inputRef.current?.focus();
    }
  }, [todos, errorMsg, changeFocus]);

  useEffect(() => {
    setIsAllCompletedTots(checkingIsAllCompletedTodos(todos));
  }, [todos]);

  const toggleAllTodos = (): void => {
    const isCompletedAllTodos = todos.some(item => !item.completed);

    if (isCompletedAllTodos) {
      const isNotActiveTodo = todos.filter(itemTodo => !itemTodo.completed);

      isNotActiveTodo.forEach(todoItem => {
        updateChecked(todoItem, 'all');
      });

      return;
    }

    todos.map(todoItem => {
      updateChecked(todoItem, 'once');
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    showError(null);
    setTodo(event.target.value);
  };

  const onCreateTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todo.trim()) {
      showError('Title should not be empty');

      return;
    } else {
      createTodo(todo).then(text => {
        if (text === todo) {
          setTodo('');
        }
      });
    }

    return;
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompletedTots,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={onCreateTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={todo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          disabled={loading}
        />
      </form>
    </header>
  );
};

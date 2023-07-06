/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo, UpdateTodoArgs } from '../../types/Todo';

interface Props {
  onAddTodo: (arg: string) => void;
  query: string;
  onQueryChange: (arg: string) => void;
  onErrorMessageChange: (arg: string) => void;
  initialTodos: Todo[];
  changeTodoDetails: (todoId: number, data: UpdateTodoArgs) => void;
  completedTodo: Todo[]
}

export const Header: React.FC<Props> = ({
  onAddTodo,
  query,
  onQueryChange,
  onErrorMessageChange,
  initialTodos,
  changeTodoDetails,
  completedTodo,
}) => {
  const isEveryTodoCompleted = completedTodo.length >= initialTodos.length;
  const toggleAllTodo = () => {
    if (isEveryTodoCompleted) {
      initialTodos.map(todo => changeTodoDetails(
        todo.id,
        { completed: false },
      ));
    }

    initialTodos
      .filter(todo => !todo.completed)
      .map(filteredTodo => changeTodoDetails(
        filteredTodo.id,
        { completed: true },
      ));
  };

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query) {
      onErrorMessageChange('Title can\'t be empty');
      setTimeout(() => {
        onErrorMessageChange('');
      }, 3000);

      return;
    }

    try {
      onAddTodo(query);
      onQueryChange('');
    } catch {
      onErrorMessageChange('Unable to add todo title');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isEveryTodoCompleted,
        })}
        onClick={toggleAllTodo}
        aria-label="toggle status"
      />

      <form
        onSubmit={handleSubmitForm}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </form>
    </header>
  );
};

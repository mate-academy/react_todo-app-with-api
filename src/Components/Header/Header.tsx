/* eslint-disable jsx-a11y/control-has-associated-label */

import { FC, useState } from 'react';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type Props = {
  addTodo: (todo: string) => void;
  setErrors: (errors: Errors | null) => void;
  tempTodo: Todo | null;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setWaitingResponse: (id: number[]) => void;
};

export const Header: FC<Props> = ({
  addTodo,
  setErrors,
  tempTodo,
  todos,
  setTodos,
  setWaitingResponse,
}) => {
  const [inputValue, setInputValue] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const todoTitle = inputValue.trim();

    if (!todoTitle) {
      setErrors({ noTitle: true });

      return;
    }

    addTodo(todoTitle);
    setInputValue('');
  }

  const handleUpdateChecked = async () => {
    const completed = await todos.every((todo) => todo.completed === true);

    const completedTodos = todos.filter((todo) => todo.completed === completed);

    const completedTodoIds = completedTodos.map((todo) => todo.id!);

    setWaitingResponse(completedTodoIds);

    try {
      await Promise.all(
        todos.map(async (todo) => {
          await updateTodo(todo.id!, { completed: !completed });
        }),
      );
      setTodos(todos.map((todo) => ({ ...todo, completed: !completed })));
    } catch (error) {
      setErrors({ editing: true });
    }

    setWaitingResponse([]);
  };

  return (
    <header className="todoapp__header">
      {/* these buttons are active only if there are some active todos */}
      <button
        type="button"
        onClick={handleUpdateChecked}
        className="todoapp__toggle-all active"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};

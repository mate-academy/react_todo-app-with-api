/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { postTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>
  onSetIsError: React.Dispatch<React.SetStateAction<boolean>>
  onSetTypeError: React.Dispatch<React.SetStateAction<string>>
  userId: number | null
  toLoad:() => Promise<void>
  newTitleTodo: string
  onSetNewTitleTodo: React.Dispatch<React.SetStateAction<string>>
  isAdding: boolean
  onSetIsAdding: React.Dispatch<React.SetStateAction<boolean>>
  todos: Todo[]
  toUpdateTodo: (id: number, data: Partial<Todo>) => Promise<void>
};

export const Header: React.FC<Props> = ({
  newTodoField,
  onSetIsError,
  onSetTypeError,
  userId,
  toLoad,
  isAdding,
  onSetIsAdding,
  newTitleTodo,
  onSetNewTitleTodo,
  todos,
  toUpdateTodo,
}) => {
  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  });

  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTitleTodo.trim()) {
      onSetTypeError(Errors.ErrBlankTitle);
      onSetIsError(false);
      onSetNewTitleTodo('');
    }

    const addTodo = async () => {
      if (newTitleTodo && userId) {
        try {
          onSetIsAdding(true);
          await postTodo({
            userId,
            title: newTitleTodo,
            completed: false,
          });
        } catch (inError) {
          onSetIsError(false);
          onSetTypeError(Errors.ErrADD);
        }
      }

      onSetNewTitleTodo('');
      toLoad();
      // onSetIsAdding(false);
    };

    addTodo();
  };

  const handleInput = (input: string) => {
    onSetNewTitleTodo(input);
    onSetIsError(true);
  };

  const isAllTodosCompleted = todos.every(todo => todo.completed === true);

  useEffect(() => {
    setIsAllCompleted(isAllTodosCompleted);
  });

  const toggleCompleteAllTodos = () => {
    todos.forEach(todo => {
      if (!isAllCompleted) {
        toUpdateTodo(todo.id, { completed: true });
      } else {
        toUpdateTodo(todo.id, { completed: !todo.completed });
      }
    });
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isAllCompleted },
        )}
        onClick={toggleCompleteAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitleTodo}
          onChange={(e) => handleInput(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};

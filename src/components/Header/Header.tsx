/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { postTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  userId: number | null
  isAdding: boolean
  onSetNewTitleTodo: React.Dispatch<React.SetStateAction<string>>
  onSetTypeError: React.Dispatch<React.SetStateAction<Errors>>
  onSetIsAdding: React.Dispatch<React.SetStateAction<boolean>>
  toUpdateTodo: (id: number, data: Partial<Todo>) => Promise<void>
  toLoad:() => Promise<void>
};

export const Header: React.FC<Props> = ({
  todos,
  userId,
  isAdding,
  onSetNewTitleTodo,
  onSetTypeError,
  onSetIsAdding,
  toUpdateTodo,
  toLoad,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  });

  const [innerInput, setInnerInput] = useState('');
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!innerInput.trim()) {
      onSetTypeError(Errors.ErrBlankTitle);
      setInnerInput('');
    }

    onSetNewTitleTodo(innerInput);
    const addTodo = async () => {
      if (innerInput && userId) {
        try {
          onSetIsAdding(true);
          await postTodo({
            userId,
            title: innerInput.trim(),
            completed: false,
          });
        } catch (inError) {
          onSetTypeError(Errors.ErrADD);
        }
      }

      setInnerInput('');
      toLoad();
    };

    if (innerInput.trim()) {
      addTodo();
    }
  };

  const handleInput = (input: string) => {
    setInnerInput(input);
    onSetTypeError(Errors.ErrNone);
  };

  useEffect(() => {
    const isAllTodosCompleted = todos.every(todo => todo.completed === true);

    setIsAllCompleted(isAllTodosCompleted);
  }, [todos]);

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
          value={innerInput}
          onChange={(e) => handleInput(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};

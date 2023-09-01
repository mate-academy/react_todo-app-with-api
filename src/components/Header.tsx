/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { FormEvent, useState } from 'react';
import { Errors, Todo } from '../types';
import { addTodo } from '../api/todos';

type Props = {
  todosNotCompleted: number,
  todos: Todo[];
  handleUpdateCheckTodo: (value: number) => void;
  handleSelectedTodo: (todoID: number[]) => void;
  handleError: (value:Errors) => void;
  handleSetTempTodo: (value:Todo | null) => void;
  userId: number,
  handleSetMakeAnyChange: (value: boolean) => void;
  makeAnyChange: boolean,
  selectedTodo: number[],
};

export const Header: React.FC<Props> = ({
  todosNotCompleted,
  todos,
  handleUpdateCheckTodo,
  handleSelectedTodo,
  handleError,
  handleSetTempTodo,
  userId,
  handleSetMakeAnyChange,
  makeAnyChange,
  selectedTodo,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoadingTodo, setIsLoadingTodo] = useState(false);
  const buttonAllCompleted = (value: number) => classNames(
    'todoapp__toggle-all',
    { active: value === 0 },
  );

  const updateCheckAllTodo = () => {
    try {
      if (todosNotCompleted === 0) {
        todos.forEach(todo => handleSelectedTodo([...selectedTodo, todo.id]));
      } else {
        todos.forEach(todo => {
          if (todo.completed === false) {
            handleSelectedTodo([...selectedTodo, todo.id]);
          }
        });
      }
    } finally {
      handleSelectedTodo([]);
    }

    if (todosNotCompleted === 0) {
      todos.forEach(todo => handleUpdateCheckTodo(todo.id));
    } else {
      todos.forEach(todo => {
        if (todo.completed === false) {
          handleUpdateCheckTodo(todo.id);
        }
      });
    }
  };

  const handleAddTodo = async (
    event: FormEvent<HTMLFormElement> & {
      target: {
        todoAdd: {
          value:string;
        };
      };
    },
  ) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return handleError(Errors.emptyTitle);
    }

    setIsLoadingTodo(true);

    handleSetTempTodo({
      id: 0,
      userId: 11361,
      title: inputValue,
      completed: false,
    });

    try {
      await addTodo(userId, {
        id: 0,
        userId: 11361,
        title: inputValue,
        completed: false,
      });
    } catch (error) {
      handleError(Errors.add);
    }

    setIsLoadingTodo(false);
    handleSetTempTodo(null);
    setInputValue('');
    handleSetMakeAnyChange(!makeAnyChange);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={buttonAllCompleted(todosNotCompleted)}
        onClick={() => {
          updateCheckAllTodo();
        }}
      />

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoadingTodo}
        />
      </form>
    </header>
  );
};

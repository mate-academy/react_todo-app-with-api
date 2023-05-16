import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { postTodos, updateTodos } from './api/todos';
import { TodosContext } from './TodoContext';

type Props = {
  todos: Todo[],
  active: number,
  toggleAll: Todo[],
  untoggleAll: Todo[],
  setTodos(todosArray: Todo[]): void,
};

export const Header: React.FC<Props> = ({
  todos,
  active,
  toggleAll,
  untoggleAll,
  setTodos,
}) => {
  const {
    setTempTodo,
    setIsAddError,
    setIsUpdateError,
  } = useContext(TodosContext);
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const postTodo = async (todo: Omit<Todo, 'id'>) => {
    setIsAddError(false);
    setIsInputDisabled(true);

    try {
      const response = await postTodos(todo);

      setTodos([
        ...todos,
        response,
      ]);
    } catch {
      setIsAddError(true);
    }

    setTempTodo(null);
    setIsInputDisabled(false);
  };

  const updateAll = async () => {
    setIsUpdateError(false);

    try {
      if (todos.findIndex(todo => todo.completed === false) > -1) {
        await Promise.all(todos.map(todo => updateTodos(todo.id, true)));

        setTodos(toggleAll);
      } else {
        await Promise.all(todos.map(todo => updateTodos(todo.id, false)));

        setTodos(untoggleAll);
      }
    } catch {
      setIsUpdateError(true);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="Mute volume"
        className={classNames(
          'todoapp__toggle-all', { active: active === 0 },
        )}
        onClick={() => updateAll()}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();

          const newTodo = {
            completed: false,
            userId: 9968,
            title: todoTitle,
          };

          postTodo(newTodo);

          setTempTodo({
            id: 0,
            ...newTodo,
          });

          setTodoTitle('');
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          disabled={isInputDisabled}
          onChange={(event) => {
            setTodoTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};

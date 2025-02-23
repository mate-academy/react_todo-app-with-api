import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

import { addTodo } from '../../api/todos';
import { handleError } from '../../utils/handleError';

import { USER_ID } from '../../constants/constants';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  numberOfActiveTodos: number;
  setTodos: (updateTodos: (todos: Todo[]) => Todo[]) => void;
  setError: (error: Errors) => void;
  setTempTodo: (todo: Todo | null) => void;
  setIdsForUpdate: (prevIds: (ids: number[]) => number[]) => void;
  setNewTodoData: (newData: Partial<Todo>) => void;
}

const Header: FC<Props> = ({
  todos,
  tempTodo,
  numberOfActiveTodos,
  setTodos,
  setError,
  setTempTodo,
  setIdsForUpdate,
  setNewTodoData,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.trimStart());
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedTitle = title.trim();

    if (!formattedTitle) {
      handleError(Errors.TITLE_ERROR, setError);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: formattedTitle,
      completed: false,
    };

    const tmpTodo: Todo = {
      id: 0,
      ...newTodo,
    };

    setTempTodo(tmpTodo);

    try {
      const todo = await addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, todo]);
      setTitle('');
      setTempTodo(null);
    } catch {
      setTempTodo(null);
      handleError(Errors.ADD_TODO, setError);
    }
  };

  const handleToggleAll = () => {
    const isAllTodosCompleted = todos.every(todo => todo.completed);

    todos.map(todo => {
      setIdsForUpdate(currentIds => [...currentIds, todo.id]);
      setNewTodoData({ completed: isAllTodosCompleted ? false : true });
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, tempTodo]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !numberOfActiveTodos,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={handleChangeTitle}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};

export default Header;

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { AuthContext } from './Auth/AuthContext';

type Props = {
  todos: Todo[],
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setUnableAddTodo: React.Dispatch<React.SetStateAction<boolean>>,
  setUnableEmptyTitle: React.Dispatch<React.SetStateAction<boolean>>,
};

export const Header: React.FC<Props> = (props) => {
  const {
    todos,
    setIsLoading,
    setTodos,
    setUnableAddTodo,
    setUnableEmptyTitle,
  } = props;

  const [isAllActive, setisAllActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const addTodo = useCallback(() => {
    setIsLoading(true);
    if (user && newTodo.trim().length) {
      client.post<Todo>('/todos', {
        title: newTodo,
        userId: user?.id,
        completed: false,
      })
        .then(res => setTodos(prev => [...prev, res]))
        .catch(() => setUnableAddTodo(true))
        .finally(() => setIsLoading(false));
    } else if (!newTodo.trim().length) {
      setIsLoading(false);
      setUnableEmptyTitle(true);
    }

    setNewTodo('');
  }, [newTodo]);

  const updateAllTodoStatus = useCallback(() => {
    setisAllActive(!isAllActive);

    todos.map(todo => client.patch(`/todos/${todo.id}`, { completed: isAllActive }));

    setTodos(prev => prev.map(todo => ({
      ...todo,
      completed: isAllActive,
    })));
  }, [isAllActive, todos]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        onClick={() => updateAllTodoStatus()}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        addTodo();
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          onBlur={() => addTodo()}
        />
      </form>
    </header>
  );
};

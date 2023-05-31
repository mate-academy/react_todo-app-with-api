/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useState,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
  FormEvent,
} from 'react';
import classNames from 'classnames';

import { CustomError } from '../types/CustomError';
import { NewTodo, Todo } from '../types/Todo';

import { postTodo, updateTodo } from '../api/todos';
import { useLoadStatusContext } from '../utils/LoadStatusContext';

import { initData } from '../constants/initData';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  activeLeft: number,
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  setError: (newError: CustomError, delay?: number) => void,
};

export const Header: FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  activeLeft,
  setTempTodo,
  setError,
}) => {
  const [newTodo, setNewTodo] = useState<NewTodo>(initData.newTodo);
  const [inputDisabled, setInputDisabled] = useState(initData.inputDisabled);

  const { setLoadingStatus } = useLoadStatusContext();
  const focusInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focusInput.current) {
      focusInput.current.focus();
    }
  }, [tempTodo]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodo.title.length) {
      setError(CustomError.EmptyTitle, 3000);
    } else {
      setInputDisabled(true);
      setTempTodo({ ...newTodo, id: 0 });

      postTodo(newTodo)
        .then((response) => {
          setTodos(prevTodos => [...prevTodos, response]);
          setTempTodo(null);
          setNewTodo(initData.newTodo);
          setInputDisabled(false);
        })
        .catch(() => setError(CustomError.Add, 3000));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo((prevState) => ({ ...prevState, title: e.target.value }));
  };

  const handleToggleAll = () => {
    let idsForToggle = todos.filter(todo => !todo.completed)
      .map(todo => todo.id);

    if (activeLeft === 0 || activeLeft === todos.length) {
      idsForToggle = todos.map(todo => todo.id);
    }

    todos.forEach((todo, index) => {
      if (idsForToggle.some(id => id === todo.id)) {
        const data = { completed: !todo.completed };

        setLoadingStatus(prevState => [...prevState, todo.id]);

        updateTodo(todo.id, data)
          .then((response: Todo) => {
            setTodos(prevState => {
              return [
                ...prevState.slice(0, index),
                {
                  ...response,
                },
                ...prevState.slice(index + 1, prevState.length),
              ];
            });

            setLoadingStatus(prevState => [
              ...prevState.filter(id => id !== response.id),
            ]);
          })
          .catch(() => setError(CustomError.Update));
      }
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          onClick={handleToggleAll}
          className={classNames(
            'todoapp__toggle-all',
            { active: !activeLeft },
          )}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={focusInput}
          disabled={inputDisabled}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo.title}
          onChange={handleInputChange}
        />
      </form>
    </header>

  );
};

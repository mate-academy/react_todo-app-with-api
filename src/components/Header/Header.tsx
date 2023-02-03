/* eslint-disable jsx-a11y/control-has-associated-label */
import classnames from 'classnames';
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { postTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { TempTodo, Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  setError: Dispatch<SetStateAction<ErrorType>>;
  setTempTodo: Dispatch<SetStateAction<TempTodo | null>>;
  isAllCompleted: boolean
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  handleToggleAll: () => {}
};

export const Header:React.FC<Props> = ({
  setError,
  setTempTodo,
  setTodos,
  isAllCompleted,
  handleToggleAll,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setLoading] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isLoading]);

  const addTodo = async (title: string) => {
    setLoading(true);
    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: 0,
    });

    try {
      const todo = {
        userId: user?.id,
        title,
        completed: false,
      };

      const newTodo = await postTodo(todo);

      setTodos(current => [...current, newTodo]);
      setNewTitle('');
    } catch (err) {
      setError(ErrorType.InsertionError);
    } finally {
      setTempTodo(null);
      setLoading(false);
    }
  };

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTitle === '') {
      setError(ErrorType.TitleError);

      return;
    }

    if (newTodoField.current) {
      addTodo(newTitle);
      setNewTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classnames('todoapp__toggle-all',
          { active: isAllCompleted })}
        onClick={() => handleToggleAll()}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};

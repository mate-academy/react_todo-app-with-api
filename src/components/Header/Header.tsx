import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { trimTitle } from '../../utils/trimTitle';
import { Error } from '../../types/Error';
import cN from 'classnames';

import { postTodos, USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  handleTodoStatusChange: (id: number, newStatus: boolean) => Promise<void>;
  showError: (message: Error) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  addTodoField: RefObject<HTMLInputElement>;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({
  todos,
  handleTodoStatusChange,
  showError,
  setTodos,
  setTempTodo,
  addTodoField,
  tempTodo,
}) => {
  const [inputText, setInputText] = useState('');

  const isAllCompleted = useMemo(() => {
    return !todos.some(todo => todo.completed === false);
  }, [todos]);

  function changeStatusAll() {
    const status = !isAllCompleted;

    todos.forEach(todo => {
      if (todo.completed !== status) {
        handleTodoStatusChange(todo.id, status);
      }
    });
  }

  function handleAddTodoOnEnter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = trimTitle(inputText);

    if (!title.length) {
      showError(Error.EmptyTitleError);
    } else {
      const newTodo = {
        id: 0,
        title: title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(newTodo);

      postTodos(newTodo)
        .then(fetchedTodo => {
          setInputText('');
          setTodos(prevTodos => [...prevTodos, fetchedTodo]);
        })
        .catch(() => showError(Error.AddError))
        .finally(() => {
          setTempTodo(null);
        });
    }
  }

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cN('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={changeStatusAll}
        />
      )}

      <form onSubmit={handleAddTodoOnEnter}>
        <input
          ref={addTodoField}
          data-cy="NewTodoField"
          type="text"
          value={inputText}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setInputText(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};

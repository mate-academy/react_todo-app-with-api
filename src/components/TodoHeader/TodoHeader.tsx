import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../utils/userId';
import { addTodo, updateTodo } from '../../api/todos';
import { TodoContext } from '../TodoContext';
import { ErrorContext } from '../ErrorContext';
import { GlobalLoader } from '../../types/GlobalLoader';

type Props = {
  onTempTodoAdd: (todo: Todo | null) => void;
  tempTodo: Todo | null;
  onGlobalLoaderChange: (globalLoader: GlobalLoader) => void;
};

export const TodoHeader: React.FC<Props> = (props) => {
  const {
    onTempTodoAdd,
    tempTodo,
    onGlobalLoaderChange,
  } = props;

  const { setError } = useContext(ErrorContext);
  const { todos, setTodos } = useContext(TodoContext);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isAllCompleted = todos.every(todo => todo.completed);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setError('Title can\'t be empty');

      return;
    }

    onTempTodoAdd({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });
  };

  const handleToggleAll = () => {
    const updatedTodos: Promise<Todo>[] = [];

    if (isAllCompleted) {
      onGlobalLoaderChange(GlobalLoader.Completed);
      todos.forEach(todo => {
        updatedTodos.push(updateTodo(todo.id, { completed: false })
          .then(updatedTodo => updatedTodo)
          .catch((error) => {
            throw error;
          }));
      });
    } else {
      onGlobalLoaderChange(GlobalLoader.Active);
      todos.forEach(todo => {
        updatedTodos.push(updateTodo(todo.id, { completed: true })
          .then(updatedTodo => updatedTodo)
          .catch((error) => {
            throw error;
          }));
      });
    }

    Promise.all(updatedTodos)
      .then(setTodos)
      .catch(() => setError('Unable to update a todo'))
      .finally(() => onGlobalLoaderChange(GlobalLoader.Non));
  };

  useEffect(() => {
    if (tempTodo) {
      addTodo(USER_ID, tempTodo)
        .then((res) => {
          setTodos(prevState => [...prevState, res]);
          setTitle('');
        })
        .catch(() => setError('Unable to add a todo'))
        .finally(() => {
          onTempTodoAdd(null);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        });
    }
  }, [tempTodo]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          aria-label="button_toggle_all"
          onClick={handleToggleAll}
        />
      )}
      <form
        onSubmit={handleSubmitForm}
      >
        <input
          ref={inputRef}
          disabled={!!tempTodo}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};

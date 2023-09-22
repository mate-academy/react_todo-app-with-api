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
import { TodoLoader } from '../../types/TodoLoader';

type Props = {
  onTempTodoAdd: (todo: Todo | null) => void;
  tempTodo: Todo | null;
  onGlobalLoaderChange: (globalLoader: TodoLoader) => void;
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

    const tempTitle = title.trim();

    if (!tempTitle) {
      setError('Title can\'t be empty');
      setTitle('');

      return;
    }

    onTempTodoAdd({
      id: 0,
      userId: USER_ID,
      title: tempTitle,
      completed: false,
    });
  };

  const handleToggleAll = () => {
    const updatedTodos: Promise<Todo>[] = [];

    onGlobalLoaderChange(isAllCompleted
      ? TodoLoader.Completed
      : TodoLoader.Active);
    todos.forEach(todo => {
      updatedTodos.push(updateTodo(todo.id, { completed: !isAllCompleted })
        .then(updatedTodo => updatedTodo)
        .catch((error) => {
          throw error;
        }));
    });

    Promise.all(updatedTodos)
      .then(setTodos)
      .catch(() => setError('Unable to update a todo'))
      .finally(() => onGlobalLoaderChange(TodoLoader.None));
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
        });
    }
  }, [tempTodo]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length]);

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
      <form onSubmit={handleSubmitForm}>
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

import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import { TodoContext, USER_ID } from '../TodoContext';
import { addTodo, editTodo } from '../api/todos';
import { Error } from '../types/Error';

export const Header: React.FC = () => {
  const {
    todos,
    inputRef,
    setTempTodo,
    setTodos,
    setError,
    tempTodo,
    setToggledTodos,
    isEveryTodoCompleted,
    setIsToggleAllClicked,
  } = useContext(TodoContext);

  const [inputValue, setInputValue] = useState('');
  const [isToggleAll, setIsToggleAll] = useState(false);

  useEffect(() => {
    setIsToggleAll(isEveryTodoCompleted);
  }, [todos, isEveryTodoCompleted]);

  const onToggleAll = useCallback(async () => {
    setIsToggleAllClicked(true);

    try {
      if (isToggleAll) {
        const notCompletedTodos = todos.filter(todo => todo.completed);

        await Promise.all(notCompletedTodos.map(async todo => {
          await editTodo(todo.id, { completed: false });
        }));

        setTodos(todos.map(currentTodo => ({
          ...currentTodo,
          completed: false,
        })));
      } else {
        const completedTodos = todos.filter(todo => !todo.completed);

        await Promise.all(completedTodos.map(async todo => {
          setToggledTodos(todo.id);
          await editTodo(todo.id, { completed: true });
        }));

        setTodos(todos.map(currentTodo => ({
          ...currentTodo,
          completed: true,
        })));
      }
    } catch (error) {
      setError(Error.UpdateTodo);
    } finally {
      setIsToggleAllClicked(false);
    }
  }, [isToggleAll,
    setError,
    setIsToggleAllClicked,
    setTodos,
    setToggledTodos,
    todos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, inputRef]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (inputValue.trim()) {
        const newTodo = {
          id: 0,
          userId: USER_ID,
          title: inputValue.trim(),
          completed: false,
        };

        setTempTodo(newTodo);

        addTodo(newTodo)
          .then((todo) => {
            setTodos([...todos, todo]);
            setInputValue('');
          })
          .catch(() => setError(Error.AddTodo))
          .finally(() => {
            setTempTodo(null);
          });
      } else {
        setError(Error.TitleEmpty);
      }
    }, [inputValue, setError, setTempTodo, setTodos, todos],
  );

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isEveryTodoCompleted },
          )}
          data-cy="ToggleAllButton"
          aria-label="ToggleAll"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={tempTodo !== null}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
      </form>
    </header>
  );
};

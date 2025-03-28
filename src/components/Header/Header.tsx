import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { createTodo, updateTodo, USER_ID } from '../../api/todos';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  allTodos: Todo[];
  isEmpty: boolean;
  isDelete: boolean;
  setIsAdd: (value: boolean) => void;
  setIsChange: (value: boolean) => void;
  setChangedId: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (value: string) => void;
  setTodoCounter: (value: number) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  allTodos,
  isEmpty,
  isDelete,
  setIsAdd,
  setIsChange,
  setChangedId,
  setTodos,
  setErrorMessage,
  setTodoCounter,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const inputFocus = useRef<HTMLInputElement>(null);

  const handleFocusInput = () => {
    inputFocus.current?.focus();
  };

  useEffect(() => {
    handleFocusInput();
  }, [isEmpty, isDisabled, isDelete]);

  const handleSwitchTodos = async () => {
    const active = !todos.every(todo => todo.completed);

    setIsChange(true);

    todos.forEach(todo => {
      const newTodo = { ...todo, completed: active };

      if (newTodo.completed !== todo.completed) {
        setChangedId(prevIds => [...prevIds, todo.id]);

        updateTodo(todo.id, newTodo)
          .then(updatedTodo => {
            setTodos(prevTodos =>
              prevTodos.map(prevTodo =>
                prevTodo.id === updatedTodo.id ? updatedTodo : prevTodo,
              ),
            );
          })
          .catch(() => setErrorMessage('Unable to update todo'))
          .finally(() => {
            setIsChange(false);
            setChangedId(prevIds => prevIds.filter(id => id !== todo.id));
          });
      }
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim()) {
      setIsDisabled(true);

      const todoWithoutId = {
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      };

      const localTodo = { ...todoWithoutId, id: USER_ID };

      setIsAdd(true);
      setTodos(prevTodos => [...prevTodos, localTodo]);

      createTodo(todoWithoutId)
        .then(newTodo => {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== USER_ID).concat(newTodo),
          );
          setTodoCounter(todos.filter(todo => !todo.completed).length);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== USER_ID));
        })
        .finally(() => {
          setIsAdd(false);
          setIsDisabled(false);
        });
    } else {
      setErrorMessage('Title should not be empty');
    }
  };

  return (
    <header className="todoapp__header">
      {allTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed === true),
          })}
          data-cy="ToggleAllButton"
          onClick={handleSwitchTodos}
        />
      )}

      <form onSubmit={e => handleSubmit(e)}>
        <input
          ref={inputFocus}
          disabled={isDisabled}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={text => setTitle(text.target.value)}
          value={title}
        />
      </form>
    </header>
  );
};

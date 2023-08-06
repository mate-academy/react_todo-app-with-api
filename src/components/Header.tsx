import { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { addTodos, updateTodos } from '../api/todos';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: (v: string) => void,
  setHiddenError: (v: boolean) => void,
  loading: boolean,
  setLoading: (v: boolean) => void,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setItemId: React.Dispatch<React.SetStateAction<number[]>>,
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  setHiddenError,
  loading,
  setLoading,
  setTempTodo,
  setItemId,
}) => {
  const [inputValue, setInputValue] = useState('');
  const toggleActive = todos.every(todo => todo.completed);
  const USER_ID = 11093;
  const handleError = (message: string) => {
    setHiddenError(false);
    setTimeout(() => setHiddenError(true), 3000);
    setErrorMessage(message);
  };

  const handleFinally = () => {
    setLoading(false);
    setTempTodo(null);
    setItemId([0]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const data = {
      title: inputValue.trim(),
      userId: USER_ID,
      completed: false,
    };

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: data.title,
      completed: false,
    };

    setTempTodo(tempTodo);

    const handlerAddTodos = () => {
      setLoading(true);
      addTodos(data).then((res: Todo) => {
        const newTodoRes = { ...tempTodo, id: res.id };

        setTodos(prev => [...prev, newTodoRes]);
      })
        .catch(() => handleError('Unable to add a todo'))
        .finally(handleFinally);
    };

    e.preventDefault();
    if (data.title) {
      handlerAddTodos();
    } else {
      handleError("Title can't be empty");
    }

    setInputValue('');
  };

  const handleToggle = () => {
    let newValue = true;

    if (toggleActive) {
      newValue = false;
    }

    todos.forEach(todo => {
      if (todo.completed !== newValue) {
        setItemId((prev) => [...prev, todo.id]);
        setLoading(true);

        updateTodos({ ...todo, completed: newValue }).then((res) => {
          setTodos(prev => {
            const updateTodo = [...prev];
            const indexTodo = updateTodo.findIndex(el => el.id === todo.id);

            updateTodo.splice(indexTodo, 1, res);

            return updateTodo;
          });
        })
          .catch(() => handleError('Unable to update a todo'))
          .finally(handleFinally);
      }
    });
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length) && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: toggleActive })}
          onClick={handleToggle}
        />
      )}

      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setInputValue(e.target.value)}
          value={inputValue}
          disabled={loading}
        />
      </form>
    </header>
  );
};

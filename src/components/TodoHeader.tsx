/* eslint-disable quote-props */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import cn from 'classnames';
import { addTodos, getTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';

type Props = {
  userId: number,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setError: React.Dispatch<React.SetStateAction<Error>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  processing: boolean,
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  areAllCompleted: boolean,
  toggleAll: () => void,

};

export const TodoHeader: React.FC<Props> = ({
  userId,
  setTempTodo,
  setError,
  setTodos,
  processing,
  setProcessing,
  areAllCompleted,
  toggleAll,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      setError(Error.empty);

      return;
    }

    const newTodo = {
      title: todoTitle,
      completed: false,
      userId,
    };

    setTodoTitle('');
    setProcessing(true);

    addTodos(userId, newTodo)
      .then(() => {
        return getTodos(userId)
          .then(setTodos)
          .catch(() => setError(Error.load));
      })
      .catch(() => setError(Error.add))
      .finally(() => {
        setTempTodo(null);
        setProcessing(false);
      });

    setTempTodo({
      id: 0,
      ...newTodo,
    });
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={submitHandler}>
        <button
          type="button"
          className={cn('todoapp__toggle-all', { 'active': areAllCompleted })}
          onClick={toggleAll}
        />

        <input
          disabled={processing}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};

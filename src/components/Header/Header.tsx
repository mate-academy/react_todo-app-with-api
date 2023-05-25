/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useContext, useState } from 'react';
import classNames from 'classnames';
import { addNewTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';
import { USER_ID } from '../../constants';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../TodoProvider';

interface Props {
  todos: Todo[];
  onChange: React.Dispatch<React.SetStateAction<Todo | null>>;
}

export const Header: FC<Props> = ({
  todos,
  onChange,
}) => {
  const [newTodoQuery, setNewTodoQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isAllTodosCompleted = todos.every(todo => todo.completed);
  const {
    setProcessing,
    setTodos,
    setError,
    updateTodo,
  } = useContext(TodoContext);

  const addTodo = async () => {
    try {
      setIsLoading(true);
      onChange({
        id: 0,
        userId: USER_ID,
        title: newTodoQuery,
        completed: false,
      });
      setProcessing(prev => [...prev, 0]);

      const newTodo = await addNewTodo(USER_ID, newTodoQuery);

      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      setError(ErrorType.Add);
    } finally {
      setIsLoading(false);
      onChange(null);
      setProcessing(prev => prev.filter(id => id !== 0));
    }
  };

  const handleNewTodoInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(ErrorType.None);
    setNewTodoQuery(event.target.value);
  };

  const handleClickToggleAll = async () => {
    if (isAllTodosCompleted) {
      todos
        .forEach(todo => updateTodo(todo.id, { completed: !todo.completed }));
    }

    todos.forEach(todo => {
      if (!todo.completed) {
        updateTodo(todo.id, { completed: !todo.completed });
      }
    });
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoQuery.trim()) {
      setError(ErrorType.EmptyTitle);

      return;
    }

    addTodo();
    setNewTodoQuery('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllTodosCompleted,
        })}
        onClick={handleClickToggleAll}
      />

      <form onSubmit={handleOnSubmit}>
        <input
          disabled={isLoading}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoQuery}
          onChange={handleNewTodoInput}
        />
      </form>
    </header>
  );
};

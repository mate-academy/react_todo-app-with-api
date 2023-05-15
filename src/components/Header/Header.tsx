/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useState } from 'react';
import classNames from 'classnames';
import { addNewTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';
import { USER_ID } from '../../constants';
import { Todo } from '../../types/Todo';

interface Props {
  preparedTodos: Todo[];
  onUpdateTodo: (todoId: number, dataToUpdate: Partial<Todo>) => void;
  onChangeTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  onChangeTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  onChangeError: React.Dispatch<React.SetStateAction<ErrorType>>;
  onChangeProcessing: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Header: FC<Props> = ({
  preparedTodos,
  onUpdateTodo,
  onChangeTempTodo,
  onChangeTodos,
  onChangeError,
  onChangeProcessing,
}) => {
  const [newTodoQuery, setNewTodoQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isAllTodosCompleted = preparedTodos.every(todo => todo.completed);

  const addTodo = async () => {
    try {
      setIsLoading(true);
      onChangeTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTodoQuery,
        completed: false,
      });
      onChangeProcessing(prev => [...prev, 0]);

      const newTodo = await addNewTodo(USER_ID, newTodoQuery);

      onChangeTodos(prev => [...prev, newTodo]);
    } catch (error) {
      onChangeError(ErrorType.Add);
    } finally {
      setIsLoading(false);
      onChangeTempTodo(null);
      onChangeProcessing(prev => prev.filter(id => id !== 0));
    }
  };

  const handleNewTodoInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeError(ErrorType.None);
    setNewTodoQuery(event.target.value);
  };

  const handleClickToggleAll = async () => {
    if (isAllTodosCompleted) {
      preparedTodos
        .forEach(todo => onUpdateTodo(todo.id, { completed: !todo.completed }));
    }

    preparedTodos.forEach(todo => {
      if (!todo.completed) {
        onUpdateTodo(todo.id, { completed: !todo.completed });
      }
    });
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoQuery.trim()) {
      onChangeError(ErrorType.EmptyTitle);

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

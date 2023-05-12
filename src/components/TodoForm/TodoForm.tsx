/* eslint-disable jsx-a11y/control-has-associated-label */
import classnames from 'classnames';
import { FC, useContext, useState } from 'react';
import { TodosContext } from '../TodosContext/TodosContext';
import { ErrorMessage, Todo } from '../../types';
import { addTodos, toggleTodos } from '../../api/todos';

interface Props {
  activeTodosCount: number;
}

export const TodoForm: FC<Props> = ({
  activeTodosCount,
}) => {
  const {
    todos,
    setTodos,
    setNewTodo,
    todoLoading,
    setError,
    setTodoLoading,
    setIsTodoDeleting,
    USER_ID,
  } = useContext(TodosContext);
  const [queryTodo, setQueryTodo] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!queryTodo.trim()) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setTodoLoading(true);

    const todo: Todo = {
      id: 0,
      userId: USER_ID,
      title: queryTodo,
      completed: false,
    };

    setNewTodo(todo);

    addTodos(todo)
      .then((newTodo: Todo) => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setTodoLoading(false);
        setNewTodo(null);
        setQueryTodo('');
      });
  };

  const handleAllCompleted = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const completed = !allCompleted;

    const activeTodos = todos
      .filter(todo => todo.completed !== completed)
      .map(todo => todo.id);

    setIsTodoDeleting(activeTodos);

    Promise.all(
      todos.filter(todo => todo.completed !== completed)
        .map(todo => toggleTodos(todo.id, completed)),
    )
      .then(() => {
        setTodos((prevTodos: Todo[]) => prevTodos
          .map(currTodo => ({ ...currTodo, completed })));
      }).catch(() => {
        setError(ErrorMessage.Update);
      }).finally(() => {
        setIsTodoDeleting([]);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classnames('todoapp__toggle-all', {
          active: activeTodosCount,
        })}
        onClick={handleAllCompleted}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={queryTodo}
          onChange={(event) => setQueryTodo(event.target.value)}
          disabled={todoLoading}
        />
      </form>
    </header>
  );
};

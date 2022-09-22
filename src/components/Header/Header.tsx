import classNames from 'classnames';
import React from 'react';
import { getTodos, patchTodo, postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

type Props = {
  user: User | null,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setLoadingTodosId: React.Dispatch<React.SetStateAction<number[]>>,
  showError: (text: string) => void,
  completedTodos: Todo[],
};

export const Header: React.FC<Props> = ({
  user,
  todos,
  setTodos,
  title,
  setTitle,
  setLoadingTodosId,
  showError,
  completedTodos,
}) => {
  const allTodosCompleted = todos?.every(todo => todo.completed);

  const showNewTodoField = (newTodo: Omit<Todo, 'id'>) => {
    const newField = {
      ...newTodo,
      id: todos.length + 1,
    };

    setTodos(prev => [...prev, newField]);
    setLoadingTodosId(prev => [...prev, newField.id]);
  };

  const addTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      showError('Title can\'t be empty');

      return;
    }

    try {
      if (user) {
        const newTodo: Omit<Todo, 'id'> = {
          userId: user.id,
          title,
          completed: false,
        };

        showNewTodoField(newTodo);

        await postTodo(newTodo);
        const result = await getTodos(user.id);

        setTitle('');
        setTodos(result);

        return;
      }
    } catch {
      showError('Unable to add a todo');
    }
  };

  const getDataForToggleAll = (todo: Todo) => {
    if (completedTodos.length > 0 && completedTodos.length !== todos.length) {
      const data = {
        completed: true,
      };

      return data;
    }

    const data = {
      completed: !todo.completed,
    };

    return data;
  };

  const toggleAll = () => {
    if (todos.length > 0) {
      todos.forEach(async (todo) => {
        try {
          const data = getDataForToggleAll(todo);

          if (todo.completed !== data.completed) {
            setLoadingTodosId(prev => [...prev, todo.id]);
          }

          await patchTodo(todo.id, data);
        } catch {
          showError('Unable to update todo');
        } finally {
          if (user) {
            const result = await getTodos(user.id);

            setTodos(result);
          }

          setLoadingTodosId(prev => prev.filter(id => id !== todo.id));
        }
      });
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          aria-label="toggle all"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          onClick={toggleAll}
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};

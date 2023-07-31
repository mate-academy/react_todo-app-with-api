import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';

import './TodoApp.scss';
import { Filter } from '../Filter';
import { Todo } from '../Todo';
import { TodoType } from '../../types/TodoType';
import * as TodoService from '../../api/todos';
import { FilterValue } from '../../types/FilterValue';
import { TodoItem } from '../TodoItem';

type Props = {
  userId: number;
};

function filterTodos(todo: TodoType, filterValue: FilterValue) {
  switch (filterValue) {
    case FilterValue.All:
      return true;

    case FilterValue.Active:
      return !todo.completed;

    case FilterValue.Completed:
      return todo.completed;

    default:
      throw new Error('Undefined error');
  }
}

export const TodoApp: React.FC<Props> = ({ userId }) => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState(FilterValue.All);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);
  const [updatedStatusIds, setUpdatedStatusIds] = useState<number[]>([]);

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage('');

    TodoService.getTodos(userId)
      .then(setTodos)
      .catch(() => handleError('Unable to load todos'));
  }, []);

  const makeSetErrorMessage = (message: string) => () => (
    setErrorMessage(message)
  );

  const filteredTodos = todos.filter(todo => (
    filterTodos(todo, filterValue)
  ));

  const addTodo = (title: string) => (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.length) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setErrorMessage('');

    const newTodo = { userId, title, completed: false };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    TodoService.addTodo(userId, newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => (
          [...currentTodos, createdTodo]
        ));
        setNewTitle('');
      })
      .catch((error) => {
        handleError('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteFunctionCall = (id: number) => {
    return TodoService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        handleError('Unable to delete a todo');
        setTodos(todos);
        throw error;
      });
  };

  const updateStatusFunctionCall = (id: number, todo: TodoType) => {
    return TodoService.updateTodoStatus(id, { ...todo })
      .then(updatedTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos
            .findIndex(currentTodo => id === currentTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch((error) => {
        handleError('Unable to udpate a todo');
        setTodos(todos);
        throw error;
      });
  };

  const updateTitleFunctionCall = (id: number, todo: TodoType) => {
    return TodoService.updateTodoTitle(id, { ...todo })
      .then(updatedTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos
            .findIndex(currentTodo => id === currentTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch((error) => {
        handleError('Unable to udpate a todo');
        setTodos(todos);
        throw error;
      });
  };

  const deleteTodo = (id: number) => {
    return deleteFunctionCall(id);
  };

  const deleteCompletedTodos = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        setDeletedTodoIds((currentIds) => [...currentIds, todo.id]);

        deleteFunctionCall(todo.id)
          .finally(() => {
            setDeletedTodoIds([]);
          });
      });
  };

  const updateAllTodosStatus = () => {
    let incompleteTodos = todos.filter(todo => !todo.completed);

    if (!incompleteTodos.length) {
      incompleteTodos = todos;
    }

    incompleteTodos.forEach(todo => {
      setUpdatedStatusIds((currentIds) => [...currentIds, todo.id]);

      updateStatusFunctionCall(todo.id, { ...todo })
        .finally(() => {
          setUpdatedStatusIds([]);
        });
    });
  };

  const updateStatus = (todo: TodoType) => {
    return updateStatusFunctionCall(todo.id, { ...todo });
  };

  const updateTitle = (todo: TodoType) => {
    return updateTitleFunctionCall(todo.id, { ...todo });
  };

  const makeSetNewTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setNewTitle(event.target.value);

  const completedTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn(
              'todoapp__toggle-all',
              { active: todos.every(todo => todo.completed) },
            )}
            aria-label="Change All"
            onClick={updateAllTodosStatus}
          />

          <form
            onSubmit={addTodo(newTitle)}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={makeSetNewTitle}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {filteredTodos.map(todo => (
            <Todo
              todo={todo}
              onDelete={deleteTodo}
              ids={deletedTodoIds}
              updatedStatus={updatedStatusIds}
              onChangeStatus={updateStatus}
              onChangeTitle={updateTitle}
              key={todo.id}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
            />
          )}
        </section>

        {!!todos.length && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${completedTodosCount} item${(completedTodosCount !== 1) ? 's' : ''} left`}
            </span>

            <Filter filterValue={filterValue} handleFilter={setFilterValue} />

            <button
              type="button"
              className={cn(
                'todoapp__clear-completed',
                { 'is-invisible': todos.every(todo => !todo.completed) },
              )}
              onClick={deleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          type="button"
          className="delete"
          aria-label="Delete"
          onClick={makeSetErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};

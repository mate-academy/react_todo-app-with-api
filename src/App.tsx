/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  removeTodos,
  updateTodos,
} from './api/todos';
import { Todo } from './components/Todo';
import { Todo as TypeTodo } from './types/Todo';
import { FilterType } from './types/filterType';
import { TodosList } from './components/TodosList';
import { Filter } from './components/Filter';
import { Notification } from './components/Notification';
import { InputField } from './components/InputTodoField';

const USER_ID = 10607;

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<TypeTodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TypeTodo[]>([]);
  const [filter, setFilter] = useState(FilterType.All);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<TypeTodo | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  const loadTodos = () => {
    getTodos(USER_ID)
      .then(response => {
        setTodosList(response);
        setFilteredTodos(response);
      })
      .catch(() => setError('Unable to Load todos'));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (tempTodo) {
      addTodo(USER_ID, tempTodo)
        .then((response: TypeTodo) => {
          setTodosList(before => [...before, response]);
        })
        .catch(() => setError('Unable to Load todos'));
    }
  }, [tempTodo]);

  const handleFilterChange = (chosenFilter: FilterType) => {
    setFilter(chosenFilter);

    switch (filter) {
      case FilterType.Active: {
        setFilteredTodos(todosList.filter(todo => !todo.completed));
        break;
      }

      case FilterType.Completed: {
        setFilteredTodos(todosList.filter(todo => todo.completed));
        break;
      }

      default: {
        setFilteredTodos(todosList);
      }
    }
  };

  useEffect(() => {
    setTempTodo(null);
    handleFilterChange(filter);
  }, [todosList, filter]);

  const handleRemoveTodos = (idsToRemove: number[]) => {
    removeTodos(idsToRemove).then(() => {
      setTodosList(
        before => before.filter(todo => !idsToRemove.includes(todo.id)),
      );
    }).catch(() => setError('Unable to delete a todo'));
  };

  const handleErrorReset = () => {
    setError('');
  };

  const handleAddTodo = (
    event: React.FormEvent<HTMLFormElement>,
    title: string,
  ) => {
    event.preventDefault();

    if (title.trim() !== '') {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      });
    } else {
      setError('Unable to add a todo');
    }
  };

  const completedTodos = todosList.filter(todo => (todo.completed));
  const activeTodos = todosList.filter(todo => !todo.completed);

  const handleRemoveCompleted = () => {
    const idsToRemove = completedTodos.map(todo => todo.id);

    handleRemoveTodos(idsToRemove);
  };

  const handleChangeTodo = (
    ids: number[],
    updates: Partial<TypeTodo>,
  ) => {
    updateTodos(ids, updates).then(() => loadTodos())
      .catch(() => setError('Unable to edit a todo'));
  };

  const handleSetAllCompleted = () => {
    const ids = activeTodos.length > 0
      ? activeTodos.map(todo => todo.id)
      : todosList.map(todo => todo.id);

    const status = activeTodos.length > 0;

    updateTodos(ids, { completed: status })
      .then(() => loadTodos())
      .catch(() => setError('Unable to set all todos as completed'));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <InputField
          hasTodos={todosList.length > 0}
          handleSubmitTodo={handleAddTodo}
          active={completedTodos.length === todosList.length}
          handleSetAllCompleted={handleSetAllCompleted}
        />

        {todosList.length > 0 && (
          <>
            <section className="todoapp__main">
              <TodosList
                filteredTodos={filteredTodos}
                handleRemoveTodos={handleRemoveTodos}
                handleUpdateTodos={handleChangeTodo}
              />
              {tempTodo && <Todo todo={tempTodo} temp />}
            </section>

            <Filter
              handleFilterChange={handleFilterChange}
              filter={filter}
              handleRemoveCompleted={handleRemoveCompleted}
              todos={todosList}
            />
          </>
        )}
      </div>
      <Notification message={error} handleErrorReset={handleErrorReset} />
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useState } from 'react';
import { Todo } from './Components/Todo';
import { Todo as TodoType } from './types/Todo';
import { FilterOption } from './types/FilterOption';
import {
  getTodos,
  addTodo,
  removeTodo,
  updateTodo,
} from './api/todos';
import { Notification } from './Components/Notification';
import { Filter } from './Components/Filter';

const USER_ID = 10539;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [error, setError] = useState('');
  const [filteredTodos, setFilteredTodos] = useState<TodoType[]>([]);
  const [filter, setFilter] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch(() => setError('Unable to Load todos'));
  }, [deleteIds, isUpdating, tempTodo]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setFilteredTodos(response);
      })
      .catch(() => setError('Unable to Load todos'));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  useEffect(() => {
    switch (filter) {
      case FilterOption.Active: {
        setFilteredTodos(todos.filter(todo => todo.completed === false));
        break;
      }

      case FilterOption.Completed: {
        setFilteredTodos(todos.filter(todo => todo.completed === true));
        break;
      }

      default: {
        setFilteredTodos(todos);
      }
    }
  }, [filter, todos]);

  const handleFilter = (value: string) => {
    setFilter(value);
  };

  const handleClose = () => {
    setError('');
  };

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    if (!inputValue) {
      setError('Title cant be empty');
    } else {
      const newTodo: TodoType = {
        id: 0,
        userId: USER_ID,
        title: inputValue,
        completed: false,
      };

      setTempTodo(newTodo);
      setIsInputDisabled(true);

      addTodo(USER_ID, newTodo).then(() => {
        setInputValue('');
      }).catch(() => setError('Unable to add a todo')).finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
    }
  };

  const handleRemoveTodo = (id: number) => {
    removeTodo(id).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    }).catch(() => setError('Unable to delete a todo'));
  };

  const handleComplete = (id: number, completed: boolean) => {
    updateTodo(id, { completed: !completed }).then(() => {
      setIsUpdating(prevState => !prevState);
    }).catch(() => setError('Unable to update a todo'));
  };

  const handleAllComplete = () => {
    const allInCompleted = filteredTodos.filter(todo => (
      todo.completed === false
    ));

    if (allInCompleted.length === 0) {
      filteredTodos.forEach(todo => {
        updateTodo(todo.id, { completed: false }).then(() => {
          setIsUpdating(prevState => !prevState);
        }).catch(() => setError('Unable to update a todo'));
      });
    }

    allInCompleted.forEach(todo => {
      updateTodo(todo.id, { completed: !todo.completed }).then(() => {
        setIsUpdating(prevState => !prevState);
      }).catch(() => setError('Unable to update a todo'));
    });
  };

  const handleEditTitle = (id: number, text: string) => {
    updateTodo(id, { title: text }).then(() => {
      setIsUpdating(prevState => !prevState);
    }).catch(() => setError('Unable to update a todo'));
  };

  const todoElements = filteredTodos.map(todo => (
    <Todo
      todo={todo}
      temp={!!deleteIds.includes(todo.id)}
      handleRemoveTodo={handleRemoveTodo}
      key={todo.id}
      handleComplete={handleComplete}
      handleEditTitle={handleEditTitle}
    />
  ));
  const countNotCompletedTodos = todos.filter(todo => (
    todo.completed === false
  )).length;

  const completedTodos = todos.filter(todo => (
    todo.completed === true
  ));

  const handleRemoveCompletedTodos = () => {
    completedTodos.forEach(completedTodo => {
      removeTodo(completedTodo.id).then(() => {
        setTodos(todos.filter((todo) => todo.id !== completedTodo.id));
        setDeleteIds(prevState => ([
          ...prevState,
          completedTodo.id,
        ]));
      }).catch(() => setError('Unable to delete a todo'));
    });
  };

  const activeTodo = todos.find(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              onClick={handleAllComplete}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              disabled={isInputDisabled}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {todoElements}
          {tempTodo && <Todo todo={tempTodo} temp />}
        </section>

        {todos.length > 0
          && (
            <Filter
              countNotCompletedTodos={countNotCompletedTodos}
              handleFilter={handleFilter}
              filter={filter}
              handleRemoveCompletedTodos={handleRemoveCompletedTodos}
              activeTodo={activeTodo}
            />
          )}
      </div>

      <Notification message={error} handleClose={handleClose} />
    </div>
  );
};

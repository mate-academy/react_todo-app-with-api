/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { Input } from './components/Input/Input';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorField } from './components/ErrorField/ErrorField';
import {
  getTodos, createTodo, deleteTodos, updateTodos,
} from './api/todos';

const USER_ID = 11893;

enum Filter {
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoEditedId, setTodoEditedId] = useState(0);
  const [updateOverlay, setUpdateOverlay] = useState(0);

  const filterTodos = () => {
    let filteredList = todos;

    switch (filter) {
      case Filter.Active:
        filteredList = todos.filter(todo => !todo.completed);
        break;
      case Filter.Completed:
        filteredList = todos.filter(todo => todo.completed);
        break;
      default:
        filteredList = todos;
    }

    return filteredList;
  };

  const filteredTodos = filterTodos();

  const activeChecker = todos.every(todo => todo.completed);

  // error handler
  const displayError = (errorMessage: string) => {
    setError(errorMessage);

    setTimeout(() => setError(''), 3000);
  };

  // todo creation
  const addNewTodo = (title: string): void => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then(todo => {
        setTodos((prevTodos) => [...prevTodos, todo]);
      })
      .catch(() => displayError('Unable to add a todo'))
      .finally(() => setTempTodo(null));
  };

  // delete todo on x press
  const deleteTodo = (id: number) => {
    setUpdateOverlay(id);

    deleteTodos(id)
      .then(() => setTodos(
        (currentTodos) => currentTodos.filter(todo => todo.id !== id),
      ))
      .catch(() => displayError('Unable to delete a todo'))
      .finally(() => setUpdateOverlay(0));
  };

  // deleting completed todos
  const deleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  // toggle todo completion
  const switchTodoStatus = (todo: Todo) => {
    setUpdateOverlay(todo.id);
    const changedTodo = { ...todo, completed: !todo.completed };

    updateTodos(changedTodo)
      .then(() => setTodos((currentTodos) => currentTodos
        .map(mapTodo => {
          if (mapTodo.id === changedTodo.id) {
            return changedTodo;
          }

          return mapTodo;
        })))
      .catch(() => {
        displayError('Unable to update a todo');
      })
      .finally(() => setUpdateOverlay(0));
  };

  // toggle all todos completion
  const switchStatusAll = () => {
    if (activeChecker === true) {
      todos.forEach((todo) => switchTodoStatus(todo));
    } else {
      todos
        .filter((todo) => !todo.completed)
        .forEach((todo) => switchTodoStatus(todo));
    }
  };

  // handle todo title change
  const changeTitle = (todo: Todo, editedTitle: string) => {
    setUpdateOverlay(todo.id);

    const changedTodo = { ...todo, title: editedTitle };

    updateTodos(changedTodo)
      .then((updatedTodo) => setTodos((currentTodos) => currentTodos
        .map(mappedTodo => {
          if (mappedTodo.id === updatedTodo.id) {
            return updatedTodo;
          }

          return mappedTodo;
        })))
      .catch(() => {
        displayError('Unable to update a todo');
      })
      .finally(() => setUpdateOverlay(0));
  };

  // import todos
  useEffect(() => {
    getTodos(USER_ID)
      .then(listOfTodos => setTodos(listOfTodos))
      .catch(() => displayError('Unable to load todos'));
  }, [filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Input
          activeTodo={activeChecker}
          addNewTodo={addNewTodo}
          displayError={displayError}
          switchStatusAll={switchStatusAll}
        />

        <TodoList
          todos={todos}
          filteredTodos={filteredTodos}
          filter={filter}
          changeFilter={setFilter}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          deleteCompleted={deleteCompleted}
          switchTodoStatus={switchTodoStatus}
          todoEditedId={todoEditedId}
          setTodoEditedId={setTodoEditedId}
          changeTitle={changeTitle}
          updateOverlay={updateOverlay}
        />
      </div>

      <ErrorField error={error} removeError={setError} />
    </div>
  );
};

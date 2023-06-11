/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification/Notification';
import { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';
import { Footer } from './components/Footer/Footer';

const USER_ID = 10596;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputText, setInputText] = useState('');
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [needUpdate, setNeedUpdate] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [allLoading, setAllLoading] = useState(false);

  const handleErrorMessage = (type: string) => {
    setErrorMessage(`Unable to ${type} a Todo`);
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(String(todoId))
      .then(() => setNeedUpdate(true))
      .catch(() => handleErrorMessage('delete'));
  };

  const handleUpdateTodo = (todoId: number, todo: Partial<Todo>) => {
    const thisTodo = {
      ...todo,
      userId: USER_ID,
    };

    updateTodo(String(todoId), thisTodo)
      .then(() => setNeedUpdate(true))
      .catch(() => handleErrorMessage('update'));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((value) => {
        setTodos(value);
        setNeedUpdate(false);
      })
      .catch(() => handleErrorMessage('get'))
      .finally(() => setAllLoading(false));
  }, [needUpdate]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    switch (filterType) {
      case FilterTypes.COMPLETED: {
        setCurrentTodos(todos.filter((todo) => todo.completed));
        break;
      }

      case FilterTypes.ACTIVE: {
        setCurrentTodos(todos.filter((todo) => !todo.completed));
        break;
      }

      default: {
        setCurrentTodos(todos);
      }
    }
  }, [todos, filterType]);

  useEffect(() => {
    if (todos.filter((todo) => !todo.completed).length > 0) {
      setAllComplete(false);
    } else {
      setAllComplete(true);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={
              classNames('todoapp__toggle-all', { active: allComplete })
            }
            onClick={() => setAllLoading(true)}
          />

          <NewTodo
            tempTodo={tempTodo}
            userId={USER_ID}
            inputText={inputText}
            todos={todos}
            onTextChange={setInputText}
            onError={setErrorMessage}
            onTempTodo={setTempTodo}
            onTodoAdded={setTodos}
            onGenericError={handleErrorMessage}
          />
        </header>

        <TodoList
          todos={currentTodos}
          tempTodo={tempTodo}
          allLoading={allLoading}
          allComplete={allComplete}
          onDeleteTodo={handleDeleteTodo}
          onUpdateTodo={handleUpdateTodo}
        />

        {!!todos.length && (
          <Footer
            allTodos={todos}
            currentTodos={currentTodos}
            currentFilter={filterType}
            onSelectFilter={setFilterType}
          />
        )}
      </div>

      <Notification error={errorMessage} />
    </div>
  );
};

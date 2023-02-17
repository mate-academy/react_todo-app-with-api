/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Error } from './components/Error/Error';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { FilterBy } from './types/Filter';
import { ErrorOf } from './types/Error';

const USER_ID = 6156;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState(FilterBy.all);
  const [error, setError] = useState(ErrorOf.none);
  const [completedTodoIds, setCompletedTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<unknown | null>(null);
  const [isTitleDisabled, setIsTitleDisabled] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const isAnyTodoCompleted
    = todos.some(todo => todo.completed);

  const areAllTodosCompleted
    = !todos.some(todo => !todo.completed);

  const todoCount = todos.length;

  const changeTodosFilter = (filter: FilterBy) => {
    setTodoFilter(filter);
    setVisibleTodos(todos.filter(todo => {
      switch (filter) {
        case FilterBy.all:
        default:
          return true;
        case FilterBy.active:
          return !todo.completed;
        case FilterBy.completed:
          return todo.completed;
      }
    }));
  };

  const createTodo = (title: string) => {
    if (title.trim() === '') {
      setError(ErrorOf.emptyTitle);
    } else {
      postTodo(USER_ID, title)
        .then(todo => {
          setTodos(current => [...current, todo]);
          setTodoTitle('');
        })
        .catch(() => {
          setError(ErrorOf.add);
        })
        .finally(() => {
          setIsTitleDisabled(false);
          setTempTodo(null);
        });
    }
  };

  const toggleClick = (todo: Todo) => {
    setProcessingTodoIds(current => [...current, todo.id]);
    updateTodo(todo.id, { completed: !todo.completed })
      .then(() => {
        setTodos(current => [
          ...current.filter(td => td.id !== todo.id),
          { ...todo, completed: !todo.completed },
        ]);
      })
      .catch(() => {
        setError(ErrorOf.update);
      })
      .finally(() => {
        setProcessingTodoIds(current => current.filter(id => id !== todo.id));
      });
  };

  const toggleAllClick = () => {
    if (areAllTodosCompleted) {
      todos.forEach(todo => toggleClick(todo));
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          toggleClick(todo);
        }
      });
    }
  };

  const removeTodo = (todoId: number) => {
    setProcessingTodoIds(current => [...current, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorOf.delete);
      })
      .finally(() => {
        setProcessingTodoIds(current => current.filter(id => id !== todoId));
      });
  };

  const removeCompletedTodos = () => {
    completedTodoIds.forEach(id => removeTodo(id));
  };

  useEffect(() => {
    changeTodosFilter(todoFilter);
    setCompletedTodoIds(todos.filter(todo => todo.completed).map(todo => todo.id));
  }, [todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
        setVisibleTodos(response);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          toggleClick={toggleClick}
          toggleAllClick={toggleAllClick}
          areAllTodosCompleted={areAllTodosCompleted}
          isTitleDisabled={isTitleDisabled}
          setIsTitleDisabled={setIsTitleDisabled}
          createTodo={createTodo}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          setTempTodo={setTempTodo}
        />

        <TodoList
          removeTodo={removeTodo}
          tempTodo={tempTodo}
          todoTitle={todoTitle}
          todos={visibleTodos}
          processingTodoIds={processingTodoIds}
          toggleClick={toggleClick}
        />

        {todos.length > 0 && (
          <TodoFilter
            todoCount={todoCount}
            filter={todoFilter}
            filterTodos={changeTodosFilter}
            removeCompletedTodos={removeCompletedTodos}
            renderClearCompleted={isAnyTodoCompleted}
            completedTodoIds={completedTodoIds}
            processingTodoIds={processingTodoIds}
            setProcessingTodoIds={setProcessingTodoIds}
          />
        )}
      </div>

      <Error error={error} />
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  USER_ID,
  addTodo,
  getTodos,
  filterTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState<Status>(Status.All);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  const addInputRef = useRef<HTMLInputElement>(null);
  const allAreCompleted = todos.every(todo => todo.completed);
  const hasTodos = todos.length > 0;

  const filteredTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const handleError = (error: string) => {
    setErrorMsg(error);

    setTimeout(() => {
      setErrorMsg('');
    }, 3000);
  };

  const onTodoAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      handleError('Title should not be empty');

      return;
    }

    setTempTodo({
      title: newTodoTitle.trim(),
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    addTodo(newTodoTitle.trim())
      .then((newTodo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
        setTodos(todos);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const onTodoDelete = (todoId: number) => {
    setProcessingTodos(prevProcessing => [...prevProcessing, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(prevTodo => prevTodo.id !== todoId));
      })
      .catch((error) => {
        handleError('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setProcessingTodos(prevIds => prevIds.filter(id => id !== todoId));
      });
  };

  const onTodoDeleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => onTodoDelete(todo.id));
  };

  const onTodoEdit = (todoId: number, updatedFields: Partial<Todo>) => {
    setProcessingTodos(prev => [...prev, todoId]);

    return updateTodo(todoId, updatedFields)
      .then(res => {
        setTodos(prevTodos => prevTodos.map(todo => {
          return todo.id === todoId ? res : todo;
        }));
      })
      .catch((error) => {
        handleError('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setProcessingTodos(prevIds => prevIds
          .filter(prevId => prevId !== todoId));
      });
  };

  const onToggleCompletedAll = () => {
    const todosToToggle = allAreCompleted
      ? [...todos]
      : todos.filter(todo => !todo.completed);

    todosToToggle
      .forEach(todo => onTodoEdit(todo.id, { completed: !todo.completed }));
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => handleError('Unable to load todos'));
  }, []);

  useEffect(() => {
    addInputRef.current?.focus();
  }, [todos, tempTodo]);

  return !USER_ID
    ? <UserWarning />
    : (
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {hasTodos && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', { active: allAreCompleted })}
              data-cy="ToggleAllButton"
              onClick={onToggleCompletedAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={onTodoAdd}>
            <input
              disabled={!!tempTodo}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={addInputRef}
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
            />
          </form>
        </header>

        <div className="todoapp__content">
          <section className="todoapp__main" data-cy="TodoList">
            <TransitionGroup>
              {filteredTodos.map(todo => (
                <CSSTransition
                  key={todo.id}
                  timeout={300}
                  classNames="item"
                >
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={onTodoDelete}
                    processingTodos={processingTodos}
                    onEdit={onTodoEdit}
                  />
                </CSSTransition>
              ))}

              {tempTodo && (
                <CSSTransition
                  key={0}
                  timeout={300}
                  classNames="temp-item"
                >
                  <TodoItem
                    todo={tempTodo}
                  />
                </CSSTransition>
              )}
            </TransitionGroup>
          </section>
          {/* Hide the footer if there are no todos */}
          {hasTodos && (
            <footer className="todoapp__footer" data-cy="Footer">
              <TodoFilter
                filter={filter}
                onFilterChange={setFilter}
                todos={todos}
                onDelete={onTodoDeleteCompleted}
              />
            </footer>
          )}
        </div>

        <div
          data-cy="ErrorNotification"
          className={
            cn('notification is-danger is-light has-text-weight-normal', {
              hidden: !errorMsg,
            })
          }
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMsg('')}
          />
          {errorMsg}
        </div>
      </div>
    );
};

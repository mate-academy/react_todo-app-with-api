import { FC, useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

import { TodoStatusFilter } from './types/TodoStatusFilter';
import {
  addTodo,
  changeTodo,
  deleteTodo,
  getTodos,
  USER_ID,
} from './api/todos';
import { getFilteredTodos } from './utils/filterTodos';

import { TodoItem } from './components/TodoItem';
import { TodoForm } from './components/TodoForm';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<Todo['id'][]>([]);
  const [selectedFilter, setSelectedFilter] = useState(TodoStatusFilter.ALL);

  const todoTitleInputRef = useRef<HTMLInputElement>(null);

  const completedTodos = todos.filter(todo => todo.completed);

  const filteredTodos = getFilteredTodos(todos, selectedFilter);

  const newStatus = !todos.every(todo => todo.completed);
  const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

  useEffect(() => {
    if (todoTitleInputRef.current) {
      todoTitleInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setErrorMessage('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  const addLoadingId = (todoId: Todo['id']) => {
    setLoadingTodoIds(current => [...current, todoId]);
  };

  const removeLoadingId = (todoId: Todo['id']) => {
    setLoadingTodoIds(current => current.filter(id => id !== todoId));
  };

  const getIsTodoLoading = (todoId: Todo['id']) =>
    loadingTodoIds.includes(todoId);

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    addLoadingId(todoId);
    setErrorMessage('');

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      removeLoadingId(todoId);
      todoTitleInputRef.current?.focus();
    }
  };

  const handleDeleteAllCompletedTodo = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleAddTodo = async (newTitle: string, reset: () => void) => {
    if (!todoTitleInputRef.current) {
      return;
    }

    const newTodo = {
      userId: USER_ID,
      completed: false,
      title: newTitle,
    };

    setTempTodo({ id: 0, ...newTodo });
    todoTitleInputRef.current.disabled = true;

    try {
      const addedTodo = await addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, addedTodo]);
      reset();
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      todoTitleInputRef.current.disabled = false;
      todoTitleInputRef.current.focus();
    }
  };

  const handleChangeStatus = (status: TodoStatusFilter) => {
    setSelectedFilter(status);
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage('');
  };

  const handleAddErrorMessage = (newErrorMessage: string) => {
    setErrorMessage(newErrorMessage);
  };

  const handleChangeTodo = async (changedTodo: Todo) => {
    addLoadingId(changedTodo.id);

    try {
      const updatedTodo = await changeTodo(changedTodo);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
      throw new Error();
    } finally {
      removeLoadingId(changedTodo.id);
      todoTitleInputRef.current?.focus();
    }
  };

  const handleChangeAllCompleted = () => {
    todosToUpdate.forEach(todo => {
      const updatedTodo = { ...todo, completed: newStatus };

      handleChangeTodo(updatedTodo);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleChangeAllCompleted}
            />
          )}

          <TodoForm
            ref={todoTitleInputRef}
            onError={handleAddErrorMessage}
            onFormSubmit={handleAddTodo}
          />
        </header>

        {filteredTodos.length !== 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            <TransitionGroup>
              {filteredTodos.map(todo => (
                <CSSTransition key={todo.id} timeout={300} classNames="item">
                  <TodoItem
                    todo={todo}
                    isLoading={getIsTodoLoading(todo.id)}
                    onDelete={handleDeleteTodo}
                    onChangeTodo={handleChangeTodo}
                  />
                </CSSTransition>
              ))}

              {tempTodo && (
                <CSSTransition key="temp" timeout={300} classNames="temp-item">
                  <TodoItem todo={tempTodo} isLoading />
                </CSSTransition>
              )}
            </TransitionGroup>
          </section>
        )}

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            selectedFilter={selectedFilter}
            onStatusChange={handleChangeStatus}
            onDeleteAllCompletedTodos={handleDeleteAllCompletedTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseErrorMessage={handleCloseErrorMessage}
      />
    </div>
  );
};

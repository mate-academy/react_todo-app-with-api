import React, { useEffect, useMemo, useRef, useState } from 'react';
import { USER_ID } from './api/todos';
import * as todoServices from './api/todos';
import { Todo } from './types/Todo';
import { FILTER } from './types/Filter';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import cn from 'classnames';
import { TodoItem } from './components/TodoItem/TodoItem';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoFilter } from './components/Footer/Footer';
import { ERROR } from './types/ErrorMessage';

const filterByStatus = (todos: Todo[], selectedStatus: string) => {
  if (selectedStatus === FILTER.ACTIVE) {
    return todos.filter(todo => !todo.completed);
  }

  if (selectedStatus === FILTER.COMPLETED) {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(FILTER.ALL);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const editTodoFieldRef = useRef<HTMLInputElement>(null);

  const visibleTodos = useMemo(
    () => filterByStatus(todos, selectedStatus),
    [todos, selectedStatus],
  );

  const focusNewTodoField = () => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  };

  useEffect(() => {
    if (!isAddingTodo) {
      focusNewTodoField();
    }
  }, [isAddingTodo]);

  const focusEditTodoField = () => {
    if (editTodoFieldRef.current) {
      editTodoFieldRef.current.focus();
    }
  };

  useEffect(() => {
    if (errorMessage) {
      focusEditTodoField();
    }
  }, [errorMessage]);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setIsLoading(true);
    todoServices
      .getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage(ERROR.LOAD);
        setIsLoading(false);
      });
  }, []);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const editedTitle = newTodoTitle.trim();

    if (!editedTitle) {
      setErrorMessage(ERROR.TITLE);

      return;
    }

    const temporaryTodo = {
      id: 0,
      userId: USER_ID,
      title: editedTitle,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setIsAddingTodo(true);

    try {
      const todoToAdd = await todoServices.postTodo(editedTitle);

      setTodos(prevTodos => {
        const filteredTodos = prevTodos.filter(todo => todo.id !== 0);

        return [...filteredTodos, todoToAdd];
      });

      setNewTodoTitle('');
    } catch (error) {
      showErrorMessage(ERROR.ADD);
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
      focusNewTodoField();
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, isDeleting: true } : todo,
        ),
      );

      await todoServices.deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, isDeleting: false } : todo,
        ),
      );
      setErrorMessage(ERROR.DELETE);
    } finally {
      focusNewTodoField();
    }
  };

  const editTodo = async (todoId: number, newTitle: string) => {
    if (editingTodoId === null || todoId !== editingTodoId) {
      return;
    }

    const originalTodo = todos.find(todo => todo.id === todoId);

    if (originalTodo && originalTodo.title.trim() === newTitle.trim()) {
      setEditingTodoId(null);

      return;
    }

    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, isUpdating: true } : todo,
        ),
      );

      const updatedTodo = await todoServices.updateTodo(todoId, {
        title: newTitle.trim(),
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...updatedTodo, isUpdating: false } : todo,
        ),
      );

      setEditingTodoId(null);
    } catch {
      showErrorMessage(ERROR.UPDATE);
    }
  };

  const deleteCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
    }

    const results = await Promise.allSettled(
      completedTodos.map(todo => todoServices.deleteTodo(todo.id)),
    );

    const successfulDeletions = results
      .map((result, index) =>
        result.status === 'fulfilled' ? completedTodos[index].id : null,
      )
      .filter(id => id !== null);

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfulDeletions.includes(todo.id)),
    );

    const hasErrors = results.some(result => result.status === 'rejected');

    if (hasErrors) {
      setErrorMessage(ERROR.DELETE);
    }

    focusNewTodoField();
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.completed !== newStatus ? { ...todo, isUpdating: true } : todo,
      ),
    );

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          todoServices.updateTodo(todo.id, { completed: newStatus }),
        ),
      );

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          const updatedTodo = updatedTodos.find(
            updated => updated.id === todo.id,
          );

          return updatedTodo ? updatedTodo : todo;
        }),
      );
    } catch {
      showErrorMessage(ERROR.UPDATE);
    } finally {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.completed !== newStatus ? { ...todo, isUpdating: false } : todo,
        ),
      );
      focusNewTodoField();
    }
  };

  const isToggleAllActive = todos.every(todo => todo.completed);

  const handleToggleTodo = async (todoId: number, data: Partial<Todo>) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, isUpdating: true } : todo,
      ),
    );

    try {
      const updatedTodo = await todoServices.updateTodo(todoId, data);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...updatedTodo, isUpdating: false } : todo,
        ),
      );
    } catch (error) {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, isUpdating: false } : todo,
        ),
      );

      showErrorMessage(ERROR.UPDATE);
      throw error;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && !isLoading && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: isToggleAllActive,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
              disabled={todos.length === 0}
            />
          )}

          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              ref={newTodoFieldRef}
              disabled={isAddingTodo}
              id="new-todo-field"
              name="newTodoField"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  todo={todo}
                  onDelete={deleteTodo}
                  onUpdate={handleToggleTodo}
                  isProcessed={todo.isDeleting || todo.isUpdating}
                  onError={showErrorMessage}
                  editTodoFieldRef={editTodoFieldRef}
                  focusEditTodoField={focusEditTodoField}
                  handleEditTodo={editTodo}
                />
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition
                key={tempTodo.id}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem
                  todo={tempTodo}
                  isProcessed
                  editTodoFieldRef={editTodoFieldRef}
                  focusEditTodoField={focusEditTodoField}
                  handleEditTodo={editTodo}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todos.length > 0 && (
          <TodoFilter
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            todos={todos}
            activeTodosCount={activeTodosCount}
            onClearCompleted={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};

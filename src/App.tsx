import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as todoServices from './api/todos';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { TodoItem } from './components/todoItem';
import { TodoFilter } from './components/todoFilter';
import { ErrorMessage } from './components/errorMessage';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const editTodoFieldRef = useRef<HTMLInputElement>(null);

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
        setErrorMessage('Unable to load todos');
        setIsLoading(false);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      case Filters.All:
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => {
    return todos.reduce(
      (count, todo) => (!todo.completed ? count + 1 : count),
      0,
    );
  }, [todos]);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTodoTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    setIsAddingTodo(true);

    try {
      const newTodo = await todoServices.postTodo(title);

      setTodos(prevTodos => [
        ...prevTodos.filter(todo => todo.id !== 0),
        newTodo,
      ]);
      setNewTodoTitle('');
    } catch {
      showErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
      focusNewTodoField();
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, isDeleting: true } : todo,
        ),
      );

      await todoServices.deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, isDeleting: false } : todo,
        ),
      );
      setErrorMessage('Unable to delete a todo');
    } finally {
      focusNewTodoField();
    }
  };

  const handleEditTodo = async (todoId: number, newTitle: string) => {
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
      showErrorMessage('Unable to update the todo');
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(
      completedTodos.map(todo => todoServices.deleteTodo(todo.id)),
    ).then(results => {
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
        setErrorMessage('Unable to delete a todo');
      }

      focusNewTodoField();
    });
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    setTodos(
      todos.map(todo =>
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
      showErrorMessage('Unable to update todos');
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
    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, isUpdating: true } : todo,
        ),
      );

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
      showErrorMessage('Unable to update a todo');
      throw error;
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

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

          <form onSubmit={handleAddTodo}>
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
            {filteredTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  onUpdate={handleToggleTodo}
                  isProcessed={todo.isDeleting || todo.isUpdating}
                  onError={showErrorMessage}
                  editTodoFieldRef={editTodoFieldRef}
                  focusEditTodoField={focusEditTodoField}
                  handleEditTodo={handleEditTodo}
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
                  handleEditTodo={handleEditTodo}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todos.length > 0 && (
          <TodoFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            todos={todos}
            activeTodosCount={activeTodosCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};

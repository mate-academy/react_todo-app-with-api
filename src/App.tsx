/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import {
  getTodos,
  addTodo as addTodoApi,
  deleteTodo as deleteTodoApi,
  changeCompletedStatus,
  updateTodo as updateTodoApi,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMassage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const completedTodosNumber = todos.filter(todo => !todo.completed).length;
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Empty,
  );
  const [isAnyCompleted, setIsAnyCompleted] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);
  const [changeStatusTodoId, setChangeStatusTodoId] = useState<number | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [istoggleAll, setIsToggleAll] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeError = () => {
    setErrorMessage(ErrorMessage.Empty);
  };
  const fetchTodos = async () => {
    setErrorMessage(ErrorMessage.Empty);
    try {
      const data: Todo[] = await getTodos();
      setTodos(data);
    } catch (error) {
      setErrorMessage(ErrorMessage.LoadError);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.Empty);
      }, 3000);
    }
  };
  const selectNewFilter = (newFilter: Filter) => {
    setSelectedFilter(newFilter);
    switch (newFilter) {
      case Filter.All:
        setFilteredTodos(todos);
        break;
      case Filter.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case Filter.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      default:
        setFilteredTodos(todos);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, todos]);
  const findCompletedTodos = () => {
    setIsAnyCompleted(todos.some(todo => todo.completed));
  };
  useEffect(() => {
    selectNewFilter(selectedFilter);
    findCompletedTodos();
  }, [todos]);
  useEffect(() => {
    setIsToggleAll(todos.length > 0 && todos.every(todo => todo.completed));
  }, [todos]);
  if (!USER_ID) {
    return <UserWarning />;
  }
  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const value = inputRef.current?.value.trim();

    if (!value) {
      setErrorMessage(ErrorMessage.TitleError);
      setTimeout(() => setErrorMessage(ErrorMessage.Empty), 3000);
      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: value,
      completed: false,
    };

    setTempTodo(temp);
    setLoading(true);

    try {
      const created = await addTodoApi(temp);

      setTodos(prev => [...prev, created]);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch {
      setErrorMessage(ErrorMessage.AddError);
      setTimeout(() => setErrorMessage(ErrorMessage.Empty), 3000);
    } finally {
      setTempTodo(null);
      setLoading(false);
    }
  };
  const deleteTodo = async (id: number) => {
    setDeleteTodoId(id);
    try {
      await deleteTodoApi(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
      setEditingId(null);
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteError);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.Empty);
      }, 3000);

      return null;
    } finally {
      setDeleteTodoId(null);
    }
  };
  const statusTodo = async (id: number, completed: boolean) => {
    setChangeStatusTodoId(id);
    try {
      await changeCompletedStatus(id, completed);
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, completed } : todo)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateError);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.Empty);
      }, 3000);
    } finally {
      setChangeStatusTodoId(null);
    }
  };
  const handleUncheckAll = async () => {
    if (!istoggleAll) return;
    setTodos(prev =>
      prev.map(todo => ({
        ...todo,
        completed: false,
      })),
    );

    try {
      await Promise.all(
        todos.map(todo => changeCompletedStatus(todo.id, false)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateError);
      setTimeout(() => setErrorMessage(ErrorMessage.Empty), 3000);
    }
  };
  const handleCheckToNotToggle = async () => {
    if (istoggleAll) return;
    setTodos(prev =>
      prev.map(todo => ({
        ...todo,
        completed: true,
      })),
    );

    try {
      await Promise.all(
        todos.map(todo =>
          todo.completed
            ? Promise.resolve()
            : changeCompletedStatus(todo.id, true),
        ),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateError);
      setTimeout(() => setErrorMessage(ErrorMessage.Empty), 3000);
    }
  };

  const deleteCompleted = async () => {
    await Promise.all(
      todos.filter(todo => todo.completed).map(todo => deleteTodo(todo.id)),
    );
  };
  const handleDoubleClick = (todo: Todo) => {
    setEditingId(todo.id);
    setTempTitle(todo.title);
  };
  const handleSubmit = async (id: number) => {
    if (isSubmitting) return; // ✅ prevent double call

    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const trimmed = tempTitle.trim();

    setIsSubmitting(true);

    try {
      // same title → cancel
      if (trimmed === todo.title) {
        setEditingId(null);
        return;
      }

      // empty → delete
      if (!trimmed) {
        setDeleteTodoId(id);

        await deleteTodoApi(id);
        setTodos(prev => prev.filter(t => t.id !== id));

        setEditingId(null);
        return;
      }

      // update
      setChangeStatusTodoId(id);

      const updated = await updateTodoApi(id, trimmed);

      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, title: updated.title } : t)),
      );

      setEditingId(null);
    } catch {
      setErrorMessage(
        trimmed ? ErrorMessage.UpdateError : ErrorMessage.DeleteError,
      );
      setTimeout(() => setErrorMessage(ErrorMessage.Empty), 3000);
    } finally {
      setIsSubmitting(false);
      setChangeStatusTodoId(null);
      setDeleteTodoId(null);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      handleSubmit(id);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingId(null);
    }
  };
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={todos.length > 0}
          isToggleAll={istoggleAll}
          loading={loading}
          inputRef={inputRef}
          onToggleAll={() =>
            istoggleAll ? handleUncheckAll() : handleCheckToNotToggle()
          }
          onSubmit={handleAddTodo}
        />

        <TodoList
          todos={filteredTodos}
          editingId={editingId}
          tempTitle={tempTitle}
          deleteTodoId={deleteTodoId}
          changeStatusTodoId={changeStatusTodoId}
          tempTodo={tempTodo}
          onToggle={statusTodo}
          onDelete={deleteTodo}
          onDoubleClick={handleDoubleClick}
          onChangeTitle={setTempTitle}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            count={completedTodosNumber}
            selectedFilter={selectedFilter}
            isAnyCompleted={isAnyCompleted}
            onFilterChange={selectNewFilter}
            onClearCompleted={deleteCompleted}
          />
        )}
      </div>

      <ErrorNotification message={errorMessage} onClose={closeError} />
    </div>
  );
};

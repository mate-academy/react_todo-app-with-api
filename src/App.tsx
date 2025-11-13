import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { useEffect, useRef, useState } from 'react';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Todo } from './types/Todo';
import { TodoStatusFilter } from './types/TodoStatusFilter';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Notification } from './components/Notifications/Notifications';
import {
  todoErrorMessageText,
  TodoErrorMessage,
  USER_ID,
  todoServices,
} from './api/todos';
import { CreateTodoForm } from './components/CreateTodoForm/CreateTodoForm';
import { TodoCreate } from './types/TodoCreate';

const getfilteredTodos = (
  todos: Todo[],
  { status }: { status: TodoStatusFilter },
) => {
  const filteredTodos = [...todos];

  if (status === TodoStatusFilter.all) {
    return todos;
  }

  return filteredTodos.filter(todo => {
    if (status === TodoStatusFilter.completed) {
      return todo.completed;
    }

    return !todo.completed;
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<Todo['id'][]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo['id'] | null>(null);
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>(
    TodoStatusFilter.all,
  );

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const todoInputTitleRef = useRef<HTMLInputElement>(null);

  const handleAddTodoIdToloading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);
  };

  const handleRemoveTodoIdFromloading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
  };

  const getIsTodoLoading = (todoId: Todo['id']) =>
    loadingTodoIds.includes(todoId);

  const handleHideError = () => setErrorMessage('');

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(handleHideError, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    handleHideError();
    async function loadTodos() {
      try {
        const loadedTodos = await todoServices.getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage(
          todoErrorMessageText[TodoErrorMessage.UNABLE_TO_LOAD_TODOS],
        );
      }
    }

    loadTodos();
  }, []);

  const handleAddTodo = async (
    createdTitle: string,
    clearTitle: () => void,
  ) => {
    if (!todoInputTitleRef.current) {
      return;
    }

    handleHideError();

    const todoCreate: TodoCreate = {
      userId: USER_ID,
      title: createdTitle,
      completed: false,
    };

    const createTepmDodo = {
      id: 0,
      ...todoCreate,
    };

    todoInputTitleRef.current.disabled = true;

    setTempTodo(createTepmDodo);
    try {
      const newTodo: Todo = await todoServices.addTodo(todoCreate);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      clearTitle();
    } catch {
      setErrorMessage(
        todoErrorMessageText[TodoErrorMessage.UNABLE_TO_ADD_A_TODO],
      );
    } finally {
      setTempTodo(null);
      if (!todoInputTitleRef.current) {
        return;
      }

      todoInputTitleRef.current.disabled = false;
      todoInputTitleRef.current.focus();
    }
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    handleHideError();
    handleAddTodoIdToloading(todoId);
    try {
      await todoServices.deleteTodos(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(
        todoErrorMessageText[TodoErrorMessage.UNABLE_TO_DELETE_A_TODO],
      );
    } finally {
      handleRemoveTodoIdFromloading(todoId);
      if (!todoInputTitleRef.current) {
        return;
      }

      todoInputTitleRef.current.focus();
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    handleHideError();
    handleAddTodoIdToloading(updatedTodo.id);

    try {
      await todoServices.updateTodo(updatedTodo.id, updatedTodo);
      setTodos(currentTodos =>
        currentTodos.map(todo => {
          return todo.id === updatedTodo.id ? updatedTodo : todo;
        }),
      );

      setEditingTodo(null);
    } catch {
      setErrorMessage(
        todoErrorMessageText[TodoErrorMessage.UNABLE_TO_UPDATE_A_TODO],
      );
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleDeleteComplitedTodos = (todosComplited: Todo[]) => {
    todosComplited.forEach(todoComplited => handleDeleteTodo(todoComplited.id));
  };

  const handleCompletedChange = async (id: number) => {
    const currentTodo = todos.find(todo => todo.id === id);

    if (!currentTodo) {
      return;
    }

    const updatedTodo = {
      ...currentTodo,
      completed: !currentTodo.completed,
    };

    await handleUpdateTodo(updatedTodo);
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    todos.forEach(todo => {
      if (todo.completed !== newStatus) {
        handleCompletedChange(todo.id);
      }
    });
  };

  const visibleTodos = getfilteredTodos(todos, { status: statusFilter });

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
              onClick={handleToggleAll}
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}
          <CreateTodoForm
            onSubmit={handleAddTodo}
            onError={setErrorMessage}
            ref={todoInputTitleRef}
          />
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onCompletedChange={handleCompletedChange}
              onDelete={handleDeleteTodo}
              onEditing={setEditingTodo}
              editingTodo={editingTodo}
              onEditingTodo={handleUpdateTodo}
              isLoading={getIsTodoLoading(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              onCompletedChange={() => {}}
              onDelete={() => {}}
              onEditing={() => {}}
              editingTodo={null}
              onEditingTodo={() => {}}
              isLoading
            />
          )}
        </section>
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>
            <TodoFilter
              status={statusFilter}
              onStatusChange={setStatusFilter}
            />
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!completedTodos.length}
              onClick={() => handleDeleteComplitedTodos(completedTodos)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <Notification error={errorMessage} onHideError={handleHideError} />
    </div>
  );
};

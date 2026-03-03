/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TODO_STATUS, TodoStatus } from './types/TodoStatus';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [todoQuery, setTodoQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const newTodoRef = useRef<HTMLInputElement>(null);
  const focusNewTodo = () => {
    setTimeout(() => newTodoRef.current?.focus(), 0);
  };

  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);

  const [todosStatusFilter, setTodoStatusFilter] = useState<TodoStatus>(
    TODO_STATUS.ALL,
  );
  const [loadingTodoIds, setloadingTodoIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodos);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  const {
    active: todosActiveCount,
    completed: todosCompletedCount,
    filtered: filteredTodos,
  } = todos.reduce(
    (acc, todo) => {
      const active = acc.active + (todo.completed ? 0 : 1);
      const completed = acc.completed + (todo.completed ? 1 : 0);

      const shouldInclude =
        todosStatusFilter === TODO_STATUS.ALL ||
        (todosStatusFilter === TODO_STATUS.ACTIVE && !todo.completed) ||
        (todosStatusFilter === TODO_STATUS.COMPLETED && todo.completed);

      return {
        active,
        completed,
        filtered: shouldInclude ? [...acc.filtered, todo] : acc.filtered,
      };
    },
    { active: 0, completed: 0, filtered: [] as Todo[] },
  );

  const isAllCompleted =
    todos.length > 0 && todos.length === todosCompletedCount;

  const handleAddTodo = async () => {
    setErrorMessage(null);

    const trimmed = todoQuery.trim();

    if (!trimmed) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    if (isAdding) {
      return;
    }

    setIsAdding(true);
    setTempTodo({
      id: -1,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    });

    try {
      const createdTodo = await createTodo({
        userId: USER_ID,
        title: trimmed,
        completed: false,
      });

      setTodos(prev => [...prev, createdTodo]);
      setTodoQuery('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
      focusNewTodo();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (loadingTodoIds.includes(id)) {
      return;
    }

    setloadingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      focusNewTodo();
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setloadingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleClearCompleted = async () => {
    setErrorMessage(null);

    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    await Promise.all(completedIds.map(id => handleDeleteTodo(id)));

    focusNewTodo();
  };

  const handleEditTodo = async (
    todo: Todo,
    data: Partial<Omit<Todo, 'id' | 'userId'>>,
  ) => {
    if (loadingTodoIds.includes(todo.id)) {
      return;
    }

    setErrorMessage(null);
    setloadingTodoIds(prev =>
      prev.includes(todo.id) ? prev : [...prev, todo.id],
    );

    try {
      const updated = await updateTodo(todo.id, data);

      setTodos(prev =>
        prev.map(currentTodo =>
          currentTodo.id === todo.id ? updated : currentTodo,
        ),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodo);
      throw new Error(ErrorMessage.UpdateTodo);
    } finally {
      setloadingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleSetTodoStatus = async (todo: Todo, completed: boolean) => {
    return handleEditTodo(todo, { completed });
  };

  const handleToggleAllStatus = async () => {
    setErrorMessage(null);

    const targetCompleted = todosCompletedCount < todos.length ? true : false;

    await Promise.all(
      todos
        .filter(todo => todo.completed != targetCompleted)
        .map(todo => handleEditTodo(todo, { completed: targetCompleted })),
    );
  };

  const handleSelectTodoStatus = (todoStatus: TodoStatus) => {
    setTodoStatusFilter(todoStatus);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodoHeader
            newTodoQuery={todoQuery}
            onNewTodoQueryChange={setTodoQuery}
            shouldFocusNewTodo={editedTodoId === null}
            inputRef={newTodoRef}
            onAddTodo={handleAddTodo}
            isAllCompleted={isAllCompleted}
            isToggleBtn={todos.length > 0}
            isAdding={isAdding}
            onToggleAllStatus={handleToggleAllStatus}
          />

          {(filteredTodos.length > 0 || tempTodo) && (
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              onToggleTodoStatus={handleSetTodoStatus}
              loadingTodoIds={loadingTodoIds}
              editedTodoId={editedTodoId}
              setEditedTodoId={setEditedTodoId}
              onDeleteTodo={handleDeleteTodo}
              onEditTodo={handleEditTodo}
            />
          )}
          {todos.length > 0 && (
            <TodoFooter
              todosActiveCount={todosActiveCount}
              todosStatusFilter={todosStatusFilter}
              onSelectStatusFilter={handleSelectTodoStatus}
              disableClearCompletedBtn={todosCompletedCount === 0}
              onClearCompleted={handleClearCompleted}
            />
          )}
        </div>

        <ErrorNotification
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      </div>
    </>
  );
};

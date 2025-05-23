import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  getTodos,
  removeTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo, TodoData } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { ErrorMessage, FilterStatus } from './components/enums/enums';
import { TodoItem } from './components/TodoItem/TodoItem';

type BatchTodoResult = { id: number; success: boolean };

const filterTodos = (todos: Todo[], status: FilterStatus) => {
  let filteredTodos = [...todos];

  if (status === FilterStatus.Active) {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  }

  if (status === FilterStatus.Completed) {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [statusValue, setStatusValue] = useState(FilterStatus.All);
  const [error, setError] = useState('');
  const [todoTitleValue, setTodoTitleValue] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [todosDeleting, setTodosDeleting] = useState<Todo['id'][]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosUpdating, setTodosUpdating] = useState<Todo['id'][]>([]);

  const todosCompleted = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const todosActive = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const showErrorContainer = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setTodos(await getTodos());
      } catch {
        showErrorContainer(ErrorMessage.Load);
      }
    }

    fetchData();
  }, []);

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, statusValue);
  }, [todos, statusValue]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();
    const cleanTitle = todoTitleValue.trim();

    if (!cleanTitle) {
      showErrorContainer(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodoData: TodoData = {
      title: cleanTitle,
      userId: USER_ID,
      completed: false,
    };

    setIsAddingTodo(true);

    addTodo(newTodoData)
      .then(todo => {
        setTodoTitleValue('');
        setTodos(prev => [...prev, todo]);
      })
      .catch(() => {
        showErrorContainer(ErrorMessage.Add);
      })
      .finally(() => {
        setIsAddingTodo(false);
        setTempTodo(null);
      });

    setTempTodo({ ...newTodoData, id: 0 });
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    setTodosDeleting(prev => [...prev, todoId]);

    try {
      await removeTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      showErrorContainer(ErrorMessage.Delete);

      return false;
    } finally {
      setTodosDeleting(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleUpdateTodo = async (
    todoId: Todo['id'],
    updatedFields: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setTodosUpdating(prev => [...prev, todoId]);

    try {
      await updateTodo(todoId, updatedFields);
      setTodos(prev =>
        prev.map(todo =>
          todo.id === todoId ? { ...todo, ...updatedFields } : todo,
        ),
      );

      return true;
    } catch {
      showErrorContainer(ErrorMessage.Update);

      return false;
    } finally {
      setTodosUpdating(prev => prev.filter(id => id !== todoId));
    }
  };

  const performBatchTodoAction = async (
    todosToUse: Todo[],
    action: (todo: Todo) => Promise<unknown>,
    errorMsg: ErrorMessage,
    setTracking: React.Dispatch<React.SetStateAction<number[]>>,
  ): Promise<number[]> => {
    const ids = todosToUse.map(todo => todo.id);

    setTracking(prev => [...prev, ...ids]);

    const results = await Promise.allSettled(
      todosToUse.map(async todo => {
        try {
          await action(todo);

          return { id: todo.id, success: true };
        } catch {
          showErrorContainer(errorMsg);

          return { id: todo.id, success: false };
        } finally {
          setTracking(prev => prev.filter(id => id !== todo.id));
        }
      }),
    );

    return results
      .filter(
        result =>
          result.status === 'fulfilled' && result.value.success === true,
      )
      .map(
        result => (result as PromiseFulfilledResult<BatchTodoResult>).value.id,
      );
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletedIds = await performBatchTodoAction(
      completedTodos,
      todo => removeTodo(todo.id),
      ErrorMessage.Delete,
      setTodosDeleting,
    );

    if (deletedIds.length > 0) {
      setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));
    }
  };

  const handleToggleAll = async () => {
    const targetCompletedState = !(todos.length > 0 && !todosActive);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== targetCompletedState,
    );

    const updatedIds = await performBatchTodoAction(
      todosToUpdate,
      todo => updateTodo(todo.id, { completed: targetCompletedState }),
      ErrorMessage.Update,
      setTodosUpdating,
    );

    if (updatedIds.length > 0) {
      setTodos(prev =>
        prev.map(todo =>
          updatedIds.includes(todo.id)
            ? { ...todo, completed: targetCompletedState }
            : todo,
        ),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        todosActive={todosActive}
        todosCompleted={todosCompleted}
        titleValue={todoTitleValue}
        handleTitleValueChange={setTodoTitleValue}
        handleAddTodo={handleAddTodo}
        isAddingTodo={isAddingTodo}
        isDeletingTodo={todosDeleting.length > 0}
        handleToggleAll={handleToggleAll}
      />

      <div className="todoapp__content">
        {todos.length !== 0 && (
          <TodoList
            todos={filteredTodos}
            todosDeleting={todosDeleting}
            handleDeleteTodo={handleDeleteTodo}
            todosUpdating={todosUpdating}
            handleUpdateTodo={handleUpdateTodo}
          />
        )}
        {tempTodo && <TodoItem todo={tempTodo} isLoading />}

        {todos.length !== 0 && (
          <Footer
            todosActive={todosActive}
            todosCompleted={todosCompleted}
            statusValue={statusValue}
            handleStatusValueChange={setStatusValue}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} hideNotification={() => setError('')} />
    </div>
  );
};

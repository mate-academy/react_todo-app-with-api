import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, updateTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { ERROR_MESSAGES, TodoStatus } from './utils/constants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<Todo['id'][]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setError(null);
    getTodos()
      .then(setTodos)
      .catch(() => setError(ERROR_MESSAGES.LOAD_TODOS));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const filteredTodos = useMemo(() => {
    const list = [...todos];

    if (tempTodo) {
      list.push(tempTodo);
    }

    return list.filter(todo => {
      switch (status) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, tempTodo, status]);

  useEffect(() => {
    if (!isAdding && !selectedTodo) {
      const input = document.querySelector<HTMLInputElement>(
        'input.todoapp__new-todo',
      );

      input?.focus();
    }
  }, [isAdding, todos.length, selectedTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('NewTodoField') as HTMLInputElement;
    const title = input.value.trim();

    if (!title) {
      setError(ERROR_MESSAGES.EMPTY_TITLE);

      return;
    }

    const tempId = Date.now();
    const newTemp: Todo = {
      id: tempId,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTemp);
    setProcessingIds(prev => [...prev, tempId]);
    setIsAdding(true);
    setError(null);

    addTodo(title)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTempTodo(null);
        form.reset();
      })
      .catch(() => {
        setTempTodo(null);
        setError(ERROR_MESSAGES.ADD_TODO);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== tempId));
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setError(null);
    setProcessingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todoId));
        if (selectedTodo?.id === todoId) {
          setSelectedTodo(null);
        }
      })
      .catch(() => setError(ERROR_MESSAGES.DELETE_TODO))
      .finally(() =>
        setProcessingIds(prev => prev.filter(id => id !== todoId)),
      );
  };

  const handleUpdateTodo = (todoId: number, data: Partial<Todo>) => {
    setError(null);
    setProcessingIds(prev => [...prev, todoId]);

    return updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === todoId ? updatedTodo : t)),
        );
        setSelectedTodo(null);
      })
      .catch(() => {
        setError(ERROR_MESSAGES.UPDATE_TODO);
      })
      .finally(() =>
        setProcessingIds(prev => prev.filter(id => id !== todoId)),
      );
  };

  const handleEditTodo = (todo: Todo) => {
    const trimmedTitle = todo.title.trim();

    if (!trimmedTitle) {
      handleDeleteTodo(todo.id);

      return;
    }

    const originalTodo = todos.find(t => t.id === todo.id);

    if (originalTodo && originalTodo.title !== trimmedTitle) {
      handleUpdateTodo(todo.id, { title: trimmedTitle });
    } else {
      setSelectedTodo(null);
    }
  };

  const handleToggleAll = () => {
    setError(null);

    const areAllCompleted = todos.every(todo => todo.completed);
    const targetStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    todosToUpdate.forEach(todo => {
      handleUpdateTodo(todo.id, { completed: targetStatus });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isAdding={isAdding}
          handleToggleAll={handleToggleAll}
          handleAddTodo={handleAddTodo}
        />

        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodoId={tempTodo?.id ?? null}
            selectedTodo={selectedTodo}
            setSelectedTodo={setSelectedTodo}
            handleUpdateTodo={handleUpdateTodo}
            handleDeleteTodo={handleDeleteTodo}
            handleEditTodo={handleEditTodo}
            processingIds={processingIds}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            status={status}
            setStatus={setStatus}
            handleDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};

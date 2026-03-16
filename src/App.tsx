/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Error } from './types/ErrMsg';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMsg, setErrorMsg] = useState<Error | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [processingId, setProcessingId] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setErrorMsg('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMsg(Error.Fetch);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleErrorClose = useCallback(() => {
    setErrorMsg('');
  }, []);

  const onAddTodo = (title: string) => {
    setIsSubmiting(true);
    setErrorMsg('');

    const newTodo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    addTodo(newTodo)
      .then(created => {
        setTodos(prev => [...prev, created]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMsg(Error.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmiting(false);
      });
  };

  const handleOnDelete = (id: number) => {
    setProcessingId(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMsg(Error.Delete);
      })
      .finally(() => {
        setProcessingId(prev => prev.filter(i => i !== id));
      });
  };

  const onDeleteCompletedTodos = () => {
    const completed = todos.filter(todo => todo.completed);

    if (completed.length === 0) {
      return;
    }

    const ids = completed.map(todo => todo.id);
    setProcessingId(prev => [...prev, ...ids]);

    Promise.all(ids.map(id => deleteTodo(id)))
      .then(() => {
        setTodos(prev => prev.filter(todo => !ids.includes(todo.id)));
      })
      .catch(() => {
        setErrorMsg(Error.Delete);
      })
      .finally(() => {
        setProcessingId(prev => prev.filter(id => !ids.includes(id)));
      });
  };

  const allTodosCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  const handleToggleTodo = (id: number, completed: boolean) => {
    setProcessingId(prev => [...prev, id]);
    setErrorMsg('');

    updateTodo(id, { completed: !completed })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(item => (item.id === id ? updatedTodo : item)),
        );
      })
      .catch(() => {
        setErrorMsg(Error.Update);
      })
      .finally(() => {
        setProcessingId(prev => prev.filter(i => i !== id));
      });
  };

  const handleToggleAll = () => {
    setErrorMsg('');

    const status = allTodosCompleted;
    const activeItems = todos.filter(todo => todo.completed === status);

    if (activeItems.length === 0) {
      return;
    }

    const ids = activeItems.map(todo => todo.id);
    setProcessingId(prev => [...prev, ...ids]);

    Promise.all(
      activeItems.map(todo => updateTodo(todo.id, { completed: !status })),
    )
      .then(updatedTodos => {
        setTodos(current =>
          current.map(todo => updatedTodos.find(u => u.id === todo.id) ?? todo),
        );
      })
      .catch(() => {
        setErrorMsg(Error.Update);
      })
      .finally(() => {
        setProcessingId(prev => prev.filter(id => !ids.includes(id)));
      });
  };

  const handleUpdateTodo = (
    id: number,
    data: { title: string },
  ): Promise<void> => {
    setErrorMsg('');
    setProcessingId(prev => [...prev, id]);

    return updateTodo(id, data)
      .then(updatedTodo => {
        setTodos(current =>
          current.map(item => (item.id === id ? updatedTodo : item)),
        );
      })
      .catch(err => {
        setErrorMsg(Error.Update);
        throw err;
      })
      .finally(() => {
        setProcessingId(prev => prev.filter(i => i !== id));
      });
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length > 0,
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          isSubmitting={isSubmiting}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          onAddTodo={onAddTodo}
          setErrMsg={setErrorMsg}
          areAllCompleted={allTodosCompleted}
          toggleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          isLoading={isLoading}
          processingId={processingId}
          onDelete={handleOnDelete}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
        />

        {tempTodo && <TodoItem todo={tempTodo} isSubmitting />}

        {todos.length !== 0 && (
          <TodoFooter
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompletedTodos={onDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errMsg={errorMsg} onClose={handleErrorClose} />
    </div>
  );
};

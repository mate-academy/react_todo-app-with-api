/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TodosBar } from './components/TodosBar';
import { TodoFilter } from './components/TodoFilter';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';
import { FilterBy } from './types/Filter';
import { AddBar } from './components/AddBar';
import { TypeErrMes } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<TypeErrMes | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<Set<number>>(new Set());
  const [isUpdated, setIsUpdate] = useState<Set<number>>(new Set());
  const [titleChangeSubmit, setTitleChangeSubmit] = useState<boolean>(false);

  const activeTodosCount = todos.reduce(
    (count, todo) => count + Number(!todo.completed),
    0,
  );
  const hasCompleteTodosId = todos
    .filter(todo => todo.completed)
    .map(comleteTodo => comleteTodo.id);

  const mainField = useRef<HTMLInputElement>(null);

  const onInnerSubmitChange = (value: boolean) => {
    setTitleChangeSubmit(value);
  };

  const createTempTodo = (title: string) => {
    const TempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: title,
      completed: false,
    };

    setTempTodo(TempTodo);
  };

  const updateTodo = (id: number, data: Partial<Todo>): Promise<void> => {
    setErrorMessage(null);

    if (isUpdated.has(id)) {
      return Promise.resolve();
    }

    setIsUpdate(curr => {
      const newSet = new Set(curr);

      newSet.add(id);

      return newSet;
    });

    return patchTodo({ id, ...data })
      .then(res =>
        setTodos(curr =>
          curr.map(todo => (todo.id === id ? { ...todo, ...res } : todo)),
        ),
      )
      .catch(() => {
        setErrorMessage(TypeErrMes.UnableUpdate);

        throw new Error();
      })
      .finally(() =>
        setIsUpdate(curr => {
          const newSet = new Set(curr);

          newSet.delete(id);

          return newSet;
        }),
      );
  };

  const toggleTodo = (oldTodo: Todo) => {
    const { id, completed } = oldTodo;

    const newTodo = { id, completed: !completed };

    updateTodo(id, newTodo);
  };

  const toggleAllTodo = () => {
    if (todos.length === 0) {
      return;
    }

    const newStatus = todos.some(todo => !todo.completed);
    const todoToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todoToUpdate.length === 0) {
      return;
    }

    todoToUpdate.forEach(todo => updateTodo(todo.id, { completed: newStatus }));
  };

  const addNewTodo = (newTodo: Todo) => {
    setTodos(currTodos => [...currTodos, newTodo]);
  };

  const createTodo = (title: string, clearTitle: () => void) => {
    setErrorMessage(null);
    const parseTitle = title.trim();

    if (parseTitle) {
      setIsCreating(true);
      createTempTodo(parseTitle);
      const newTodo = { userId: USER_ID, title: parseTitle, completed: false };

      postTodo(newTodo)
        .then(addTodo => {
          clearTitle();
          setTempTodo(null);
          addNewTodo(addTodo);
        })
        .catch(() => {
          setErrorMessage(TypeErrMes.UnableAdd);
          setTempTodo(null);
        })
        .finally(() => {
          setIsCreating(false);
        });
    } else {
      setErrorMessage(TypeErrMes.TitleNotBeEmpty);
    }
  };

  const onDeleteErrorMessage = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const filtertTodos = useMemo<Todo[]>(() => {
    switch (filter) {
      case FilterBy.All:
        return todos;
      case FilterBy.Active:
        return todos.filter(todo => !todo.completed);
      case FilterBy.Completed:
        return todos.filter(todo => todo.completed);
    }
  }, [filter, todos]);

  const delTodo = async (todoId: number) => {
    setErrorMessage(null);

    setIsDeleted(curr => {
      const newSet = new Set(curr);

      newSet.add(todoId);

      return newSet;
    });

    try {
      await deleteTodo(todoId);

      setTodos(curr => curr.filter(oldTodo => oldTodo.id !== todoId));
    } catch {
      setErrorMessage(TypeErrMes.UnableDelete);
      throw new Error();
    } finally {
      setIsDeleted(currSet => {
        const newSet = new Set(currSet);

        newSet.delete(todoId);

        return newSet;
      });
    }
  };

  const deleteAllCompleteTodos = async () => {
    if (hasCompleteTodosId.length === 0) {
      return;
    }

    const idToDelete = [...hasCompleteTodosId];

    setIsDeleted(curr => {
      const newSet = new Set(curr);

      idToDelete.forEach(id => newSet.add(id));

      return newSet;
    });

    try {
      const result = await Promise.all(
        idToDelete.map(async todoId => {
          try {
            await delTodo(todoId);

            return { id: todoId, success: true };
          } catch {
            return { id: todoId, success: false };
          }
        }),
      );

      const successIds = result.filter(r => r.success).map(r => r.id);
      const failedCount = result.reduce(
        (count, todoRes) => count + Number(!todoRes.success),
        0,
      );

      if (successIds.length > 0) {
        setTodos(curr => curr.filter(todo => !successIds.includes(todo.id)));
      }

      if (failedCount > 0) {
        setErrorMessage(TypeErrMes.UnableDelete);
      }
    } finally {
      setIsDeleted(curr => {
        const newSet = new Set(curr);

        idToDelete.forEach(id => newSet.delete(id));

        return newSet;
      });
    }
  };

  const changeTodoTitle = (oldTodo: Todo, newTitle: string) => {
    return updateTodo(oldTodo.id, { title: newTitle });
  };

  useEffect(() => {
    const loadTodo = async () => {
      try {
        setErrorMessage(null);

        const todosRes = await getTodos();

        setTodos(todosRes);
      } catch {
        setErrorMessage(TypeErrMes.UnableLoad);
      }
    };

    loadTodo();
  }, []);

  useEffect(() => {
    if (!titleChangeSubmit) {
      mainField.current?.focus();
    }
  }, [isDeleted, isCreating, titleChangeSubmit]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddBar
          createTodo={createTodo}
          isCreating={isCreating}
          mainField={mainField}
          toggleAllTodo={toggleAllTodo}
          todos={todos}
        />

        <TodosBar
          todos={filtertTodos}
          tempTodo={tempTodo}
          delTodo={delTodo}
          isDeleted={isDeleted}
          isUpdated={isUpdated}
          toggleTodo={toggleTodo}
          changeTodoTitle={changeTodoTitle}
          onInnerSubmitChange={onInnerSubmitChange}
        />

        {todos.length > 0 && (
          <TodoFilter
            hasCompleteTodosId={hasCompleteTodosId}
            activeTodosCount={activeTodosCount}
            selectFilter={filter}
            onFilter={setFilter}
            deleteAllCompleteTodos={deleteAllCompleteTodos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onDeleteErrorMessage={onDeleteErrorMessage}
      />
    </div>
  );
};

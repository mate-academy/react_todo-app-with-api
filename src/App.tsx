import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteTodo,
  getTodos,
  createTodo,
  updateTodoCompleted,
  updateTodoTitle,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { TodoCompletedCategory } from './types/TodoCompletedCategory';
import { filterTodosByComplated } from './utils/filterTodosByCompleted';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedCategory, setCompletedCategory] =
    useState<TodoCompletedCategory>(TodoCompletedCategory.all);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.noneError);
  const [updatedTodosId, setUpdatedTodosId] = useState([0]);

  const filtredTodos = useMemo(
    () => filterTodosByComplated(todos, completedCategory),
    [todos, completedCategory],
  );
  const countOfCompletedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );
  const countOfNotCompletedTodos = useMemo(
    () => todos.length - countOfCompletedTodos,
    [todos, countOfCompletedTodos],
  );
  const isSomeTodoComplated = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  async function fetchTodosFromApi() {
    try {
      const todosFromApi = await getTodos();

      setTodos(todosFromApi);
    } catch {
      setErrorMessage(Errors.loadError);
    }
  }

  const handleAddTodo = useCallback(async (newTitle: string) => {
    const formatedTitle = newTitle.trim();

    if (!formatedTitle) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw Errors.emptyTitleError;
    }

    let newTodo: Todo = {
      id: 0,
      title: formatedTitle,
      userId: 0,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      newTodo = await createTodo(formatedTitle);
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw Errors.addError;
    } finally {
      setTempTodo(null);
      if (newTodo.id !== 0) {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      }
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setUpdatedTodosId(current => [...current, todoId]);
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(Errors.deleteError);
    } finally {
      setUpdatedTodosId(current => current.filter(id => id !== todoId));
    }
  }, []);

  const deleteAllCompletedTodos = useCallback(() => {
    const completedTodosId: number[] = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.allSettled(
      completedTodosId.map(async id => {
        await handleDeleteTodo(id);
      }),
    );
  }, [todos, handleDeleteTodo]);

  const handleUpdateTodoCompleted = useCallback(
    async (todoId: number, isCompleted: boolean) => {
      try {
        setUpdatedTodosId(current => [...current, todoId]);
        await updateTodoCompleted(todoId, isCompleted);
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, completed: isCompleted };
            }

            return todo;
          }),
        );
      } catch {
        setErrorMessage(Errors.updateError);
      } finally {
        setUpdatedTodosId(current => current.filter(id => id !== todoId));
      }
    },
    [],
  );

  const updateAllTodosCompletion = useCallback(async () => {
    if (!countOfNotCompletedTodos) {
      Promise.allSettled(
        todos.map(async todo => {
          await handleUpdateTodoCompleted(todo.id, false);
        }),
      );
    } else {
      const notCompletedTodosId: number[] = todos
        .filter(todo => !todo.completed)
        .map(todo => todo.id);

      Promise.allSettled(
        notCompletedTodosId.map(async todoId => {
          await handleUpdateTodoCompleted(todoId, true);
        }),
      );
    }
  }, [todos, handleUpdateTodoCompleted, countOfNotCompletedTodos]);

  const handleUpdateTodoTitle = useCallback(
    async (todoId: number, newTitle: string) => {
      const trimedNewTitle = newTitle.trim();

      try {
        setUpdatedTodosId(current => [...current, todoId]);
        await updateTodoTitle(todoId, trimedNewTitle);
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, title: trimedNewTitle };
            }

            return todo;
          }),
        );

        return true;
      } catch {
        setErrorMessage(Errors.updateError);

        return false;
      } finally {
        setUpdatedTodosId(current => current.filter(id => id !== todoId));
      }
    },
    [],
  );

  useEffect(() => {
    fetchTodosFromApi();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          countOfTodos={todos.length}
          countOfCompletedTodos={countOfCompletedTodos}
          isInputDisabled={!!tempTodo}
          onAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          updateAllTodosCompletion={updateAllTodosCompletion}
        />
        {!!todos.length && (
          <>
            <TodoList
              todos={filtredTodos}
              tempTodo={tempTodo}
              updatedTodosId={updatedTodosId}
              onDeleteTodo={handleDeleteTodo}
              onUpdateTodoCompleted={handleUpdateTodoCompleted}
              onUpdateTodoTitle={handleUpdateTodoTitle}
            />
            <TodoFooter
              countOfNotCompletedTodos={countOfNotCompletedTodos}
              isSomeTodoComplated={isSomeTodoComplated}
              completedCategory={completedCategory}
              onCompletedCategory={setCompletedCategory}
              deleteAllCompletedTodos={deleteAllCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};

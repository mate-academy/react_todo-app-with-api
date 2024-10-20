import React, { useEffect, useState } from 'react';
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

  const filtredTodos = filterTodosByComplated(todos, completedCategory);
  const countOfCompletedTodos = todos.filter(todo => todo.completed).length;
  const countOfNotCompletedTodos = todos.length - countOfCompletedTodos;
  const isSomeTodoComplated = todos.some(todo => todo.completed);

  async function fetchTodosFromApi() {
    try {
      const todosFromApi = await getTodos();

      setTodos(todosFromApi);
    } catch {
      setErrorMessage(Errors.loadError);
    }
  }

  async function fetchAddTodo(newTitle: string) {
    let newTodo: Todo = {
      id: 0,
      title: newTitle,
      userId: 0,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      newTodo = await createTodo(newTitle);
    } catch {
      setErrorMessage(Errors.addError);
    } finally {
      setTempTodo(null);
      if (newTodo.id !== 0) {
        setTodos(currentTodos => [...currentTodos, newTodo]);

        return true;
      } else {
        return false;
      }
    }
  }

  async function fetchDeleteTodo(todoId: number) {
    try {
      setUpdatedTodosId(current => [...current, todoId]);
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(Errors.deleteError);
    } finally {
      setUpdatedTodosId(current => current.filter(id => id !== todoId));
    }
  }

  function deleteAllCompletedTodos() {
    const completedTodosId: number[] = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.allSettled(
      completedTodosId.map(async id => {
        await fetchDeleteTodo(id);
      }),
    );
  }

  async function fetchUpdateTodoCompleted(
    todoId: number,
    isCompleted: boolean,
  ) {
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
  }

  async function UpdateAllTodosCompleted() {
    if (!countOfNotCompletedTodos) {
      Promise.allSettled(
        todos.map(async todo => {
          await fetchUpdateTodoCompleted(todo.id, false);
        }),
      );
    } else {
      const notCompletedTodosId: number[] = todos
        .filter(todo => !todo.completed)
        .map(todo => todo.id);

      Promise.allSettled(
        notCompletedTodosId.map(async todoId => {
          await fetchUpdateTodoCompleted(todoId, true);
        }),
      );
    }
  }

  async function fetchUpdateTodoTitle(todoId: number, newTitle: string) {
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
  }

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
          fetchAddTodo={fetchAddTodo}
          setErrorMessage={setErrorMessage}
          UpdateAllTodosCompleted={UpdateAllTodosCompleted}
        />
        {!!todos.length && (
          <>
            <TodoList
              todos={filtredTodos}
              tempTodo={tempTodo}
              updatedTodosId={updatedTodosId}
              onDeleteTodo={fetchDeleteTodo}
              fetchUpdateTodoCompleted={fetchUpdateTodoCompleted}
              fetchUpdateTodoTitle={fetchUpdateTodoTitle}
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

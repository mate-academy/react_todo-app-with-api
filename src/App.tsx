import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { FooterTodo } from './components/FooterTodo';
import { HeaderTodo } from './components/HeaderTodo';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { StatusToFilter } from './types/StatusToFilter';
import { FilterContext } from './components/TodoFilter/FilterContext';
import {
  AddNewTodoFormContext,
} from './components/AddNewTodoForm/AddNewTodoFormContext';
import { ErrorText } from './types/ErrorText';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const { filterStatus } = useContext(FilterContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const {
    title,
    errorText,
    setErrorText,
    isAdding,
    setIsAdding,
  } = useContext(AddNewTodoFormContext);
  const [todoIdsToDelete, setTodoIdsToDelete] = useState<number[]>([0]);
  const [todoIdsToUpdate, setTodoIdsToUpdate] = useState<number[]>([0]);

  const getUserTodos = useCallback(async () => {
    if (user) {
      try {
        setErrorText(ErrorText.None);

        setTodos(await getTodos(user.id));
      } catch (error) {
        setErrorText(ErrorText.Connect);
      }
    }
  }, []);

  const getVisibleGoods = useCallback((allTodos: Todo[]) => {
    return allTodos.filter(todo => {
      switch (filterStatus) {
        case StatusToFilter.Active:
          return !todo.completed;

        case StatusToFilter.Completed:
          return todo.completed;

        case StatusToFilter.All:
        default:
          return todo;
      }
    });
  }, [todos, filterStatus]);

  const addNewTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    try {
      setErrorText(ErrorText.None);
      setIsAdding(true);

      const newTodo = {
        ...todoData,
        id: Math.max(...todos.map(todo => todo.id)) + 1,
      };

      await addTodo(newTodo);

      await getUserTodos();

      setIsAdding(false);
    } catch (error) {
      setErrorText(ErrorText.Add);
    }
  }, []);

  const deleteCurrentTodo = useCallback(async (todoId: number) => {
    try {
      setErrorText(ErrorText.None);

      setTodoIdsToDelete(prevTodoIds => [...prevTodoIds, todoId]);

      await deleteTodo(todoId);

      await getUserTodos();

      setTodoIdsToDelete([0]);
    } catch (error) {
      setErrorText(ErrorText.Delete);
    }
  }, []);

  const clearAllCompletedTodos = useCallback(async () => {
    setErrorText(ErrorText.None);

    const completedTodos = todos.filter(todo => todo.completed);

    setTodoIdsToDelete(prevTodoIds => (
      [...prevTodoIds, ...completedTodos.map(todo => todo.id)]));

    completedTodos.forEach(todo => {
      deleteCurrentTodo(todo.id);
    });

    await getUserTodos();
  }, [todos]);

  const updatingTodoTitle = useCallback(
    async (todoId: number, newTitle: string) => {
      try {
        setErrorText(ErrorText.None);

        setTodoIdsToUpdate(prevTodoIds => [...prevTodoIds, todoId]);

        await updateTodoTitle(todoId, newTitle);

        await getUserTodos();

        setTodoIdsToUpdate([0]);
      } catch (error) {
        setErrorText(ErrorText.Update);
      }
    }, [],
  );

  const updatingTodoStatus = useCallback(
    async (todoId: number, completed: boolean) => {
      try {
        setErrorText(ErrorText.None);

        setTodoIdsToUpdate(prevTodoIds => [...prevTodoIds, todoId]);

        await updateTodoStatus(todoId, completed);

        await getUserTodos();

        setTodoIdsToUpdate([0]);
      } catch (error) {
        setErrorText(ErrorText.Update);
      }
    }, [],
  );

  const setAllTodosToComplete = useCallback(async () => {
    setErrorText(ErrorText.None);

    const todosToChange = todos.some(todo => !todo.completed)
      ? todos.filter(todo => !todo.completed)
      : [...todos];

    setTodoIdsToUpdate(prevTodoIds => (
      [...prevTodoIds, ...todosToChange.map(todo => todo.id)]));

    todosToChange.forEach(todo => {
      updatingTodoStatus(todo.id, !todo.completed);
    });

    await getUserTodos();
  }, [todos]);

  useEffect(() => {
    getUserTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodo
          todos={todos}
          onTodoAdd={addNewTodo}
          onSetAllTodosToComplete={setAllTodosToComplete}
        />

        <TodoList
          title={title}
          isAdding={isAdding}
          todoIdsToDelete={todoIdsToDelete}
          todoIdsToUpdate={todoIdsToUpdate}
          todos={getVisibleGoods(todos)}
          deleteCurrentTodo={deleteCurrentTodo}
          onStatusUpdate={updatingTodoStatus}
          onTitleUpdate={updatingTodoTitle}
        />

        {todos.length > 0 && (
          <FooterTodo
            onClearAllCompletedTodos={clearAllCompletedTodos}
            todos={todos}
          />
        )}
      </div>

      <ErrorNotification
        errorText={errorText}
        onSetErrorText={setErrorText}
      />
    </div>
  );
};

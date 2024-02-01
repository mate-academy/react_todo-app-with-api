import React, {
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilteredBy, filteredTodoList } from './helpers';
import { Errors } from './components/Errors/Errors';
import { ErrorType } from './types/ErorTypes';

const USER_ID = 12036;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilteredBy>(FilteredBy.All);
  const [errorType, setErorType] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const todosToView = useMemo(
    () => filteredTodoList(todos, filterBy),
    [todos, filterBy],
  );

  const deleteTodo = useCallback(
    async (todoId: number) => {
      try {
        setProcessingTodoIds(prevIds => [...prevIds, todoId]);

        await todoService.removeTodo(todoId);

        setTodos((currentTodos) => currentTodos.filter(
          (todo) => todo.id !== todoId,
        ));
      } catch (error) {
        setErorType(ErrorType.DeleteError);
      } finally {
        setProcessingTodoIds(
          currentIds => currentIds
            .filter(proccesingId => proccesingId !== todoId),
        );
      }
    },
    [setTodos, setErorType],
  );

  const addTodo = useCallback(
    async (todoTitle: string) => {
      try {
        setProcessingTodoIds(prevIds => [...prevIds, 0]);

        const newTempTodo: Todo = {
          id: 0,
          userId: USER_ID,
          title: todoTitle,
          completed: false,
        };

        setTempTodo(newTempTodo);

        const addedTodo = await todoService.addTodo({
          title: todoTitle,
          completed: false,
          userId: USER_ID,
        });

        setTodos((currentTodos) => [...currentTodos, addedTodo]);
      } catch (error) {
        setErorType(ErrorType.AddError);
      } finally {
        setTempTodo(null);
        setNewTodoTitle('');
        setProcessingTodoIds(
          currentIds => currentIds.filter(proccesingId => proccesingId !== 0),
        );
      }
    },
    [setTempTodo, setTodos, setErorType, setNewTodoTitle],
  );

  const updateTodo = useCallback(
    async (id: number, todo: Todo) => {
      try {
        setProcessingTodoIds((currentIds) => [...currentIds, id]);

        const updatedTodo = await todoService.updateTodo(id, { ...todo });

        setTodos((currentTodos) => currentTodos.map(
          (t) => (t.id === id ? updatedTodo : t),
        ));
      } catch (error) {
        setErorType(ErrorType.UpdateError);
      } finally {
        setProcessingTodoIds((currentIds) => currentIds
          .filter((proccesingId) => proccesingId !== id));
      }
    },
    [setTodos, setErorType, setProcessingTodoIds],
  );

  const clearCompleted = useCallback(async () => {
    try {
      const deletePromises = todosToView
        .filter(todo => todo.completed)
        .map(todo => deleteTodo(todo.id));

      await Promise.all(deletePromises);

      setErorType(null);
    } catch (error) {
      setErorType(ErrorType.DeleteError);
    }
  }, [todosToView, deleteTodo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErorType(null);
        const todosFromServer = await todoService.getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        setErorType(ErrorType.LoadError);
      }
    };

    fetchData();
  }, []);

  const closeError = useCallback(() => setErorType(null), []);
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllTodosCompleted}
          onAdd={addTodo}
          onError={setErorType}
          onNewTodoTitle={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          onUpdate={updateTodo}
          todos={todosToView}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todosToView}
              onDelete={deleteTodo}
              todoTemp={tempTodo}
              onUpdate={updateTodo}
              processingTodoIds={processingTodoIds}
            />
            <Footer
              onFilter={setFilterBy}
              todos={todosToView}
              filterBy={filterBy}
              onClear={clearCompleted}
            />
          </>
        )}

      </div>
      {errorType
        && (
          <Errors
            error={errorType}
            onClose={closeError}
          />
        )}
    </div>
  );
};

import { useEffect, useState } from 'react';
import { TodoHeader } from '../TodoHeader/TodoHeader';
import { Todo } from '../../types/Todo';
import { deleteTodo, getTodos, patchTodo, postTodo } from '../../api/todos';
import { TodoList } from '../TodoList/TodoList';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { FilterOptions } from '../../types/FilterOptions';
import { Errors } from '../../types/Errors';
import { USER_ID } from '../../utils/preferences';

export const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NoError);
  const [isErrorState, setIsErrorState] = useState(false);
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.All,
  );
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  // const [processingId, setProcessingId] = useState<number>(0);
  // const [isTodoDeleting, setIsTodoDeleting] = useState(false);
  const [isInputProcessing, setIsInputProcessing] = useState(false);

  const isAllCompleted: boolean = todos.every(todo => todo.completed);
  const todosCompleted: Todo[] = todos.filter(todo => todo.completed);
  const todosAmount: number = todos.length;
  const todosLeft: number = todosAmount - todosCompleted.length;
  const isVisibleTodoList: boolean = !isLoading && todos.length > 0;
  const isThereCoplited: boolean = todosAmount === todosLeft;

  const handleFilterOption = (option: FilterOptions) => {
    setFilterOption(option);
  };

  const handleHideError = () => {
    setErrorMessage(Errors.NoError);
  };

  const handleDeleteTodo = async (todoId: number) => {
    const afterDeletingTodo = todos.filter(todo => todo.id !== todoId);

    try {
      setProcessingIds(ids => [...ids, todoId]);
      await deleteTodo(todoId);
      setTodos(afterDeletingTodo);
    } catch (error) {
      setErrorMessage(Errors.UnableDeleteTodo);
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todoId));
    }
  };

  const handleDeleteCopmleted = async () => {
    const completedTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessingIds(completedTodos);
    try {
      await Promise.all(
        todosCompleted.map(async deletingTodo => {
          await deleteTodo(deletingTodo.id);
          setTodos(prev => prev.filter(todo => todo.id !== deletingTodo.id));
        }),
      );
    } catch (error) {
      setErrorMessage(Errors.UnableDeleteTodo);
    } finally {
      setProcessingIds([]);
    }
  };

  const handleSubmit = async (inputedTitle: string): Promise<boolean> => {
    if (inputedTitle === '') {
      setErrorMessage(Errors.NoTitle);

      return false;
    }

    const prevTodo = [...todos];
    const newTodo: Todo = {
      id: todosAmount + 1,
      userId: USER_ID,
      title: inputedTitle,
      completed: false,
    };
    const { id, ...normilizedTodo }: Todo = newTodo;
    const afterAddingTodo = [...todos, newTodo];

    try {
      setProcessingIds(ids => [...ids, newTodo.id]);
      setIsInputProcessing(true);
      setTodos(afterAddingTodo);
      const afterPostitngTodo: Todo = await postTodo(normilizedTodo);
      const newStateTodo: Todo[] = [...prevTodo, afterPostitngTodo];

      setTodos(newStateTodo);

      return true;
    } catch (error) {
      setErrorMessage(Errors.UnableAddTodo);
      setIsErrorState(true);
      setTodos(prevTodo);

      return false;
    } finally {
      setProcessingIds([]);
      setIsInputProcessing(false);
      // setProcessingId(0);
    }
  };

  const handleToggleStatus = async (todoToUpdate: Todo) => {
    setProcessingIds(ids => [...ids, todoToUpdate.id]);

    try {
      const updatedTodo = await patchTodo(todoToUpdate.id, {
        completed: !todoToUpdate.completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch (error) {
      setErrorMessage(Errors.UnableUpdateTodo);
      throw error;
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todoToUpdate.id));
    }
  };

  const handleToggleStatusAll = async () => {
    const toggledTodos = todos.filter(
      todo => todo.completed === isAllCompleted,
    );

    try {
      toggledTodos.forEach(todToToggle => handleToggleStatus(todToToggle));
    } catch (error) {
      setErrorMessage(Errors.UnableUpdateTodo);
      throw error;
    }
  };

  const handleUpdateTodo = async (todoId: number, newTitle: string) => {
    const prevTodods = [...todos];
    const optimisticTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, title: newTitle };
      }

      return todo;
    });

    try {
      setProcessingIds([todoId]);
      setTodos(optimisticTodos);
      const updatedTodo = await patchTodo(todoId, { title: newTitle });
      const updatedTodos = todos.map(todo => {
        if (todo.id === todoId) {
          return updatedTodo;
        }

        return todo;
      });

      setTodos(updatedTodos);

      return true;
    } catch (error) {
      setErrorMessage(Errors.UnableUpdateTodo);
      setTodos(prevTodods);

      return false;
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todoId));
    }
  };

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch (error) {
      setErrorMessage(Errors.ServerError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    let autoHideError: number;

    if (errorMessage) {
      autoHideError = window.setTimeout(() => {
        setErrorMessage(Errors.NoError);
      }, 3000);
    }

    return () => {
      window.clearTimeout(autoHideError);
    };
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          isAllCompleted={isAllCompleted}
          todosAmount={todosAmount}
          isInputProcessing={isInputProcessing}
          handleSubmit={handleSubmit}
          handleToggleStatusAll={handleToggleStatusAll}
          isErrorState={isErrorState}
        />
        {isVisibleTodoList && (
          <TodoList
            todos={todos}
            isLoading={isLoading}
            filterOption={filterOption}
            handleDeleteTodo={handleDeleteTodo}
            handleToggleStatus={handleToggleStatus}
            handleUpdateTodo={handleUpdateTodo}
            isInputProcessing={isInputProcessing}
            processingIds={processingIds}
          />
        )}
        {!!todos.length && (
          <TodoFooter
            todosLeft={todosLeft}
            isThereCoplited={isThereCoplited}
            isInputProcessing={isInputProcessing}
            handleFilterOption={handleFilterOption}
            handleDeleteCopmleted={handleDeleteCopmleted}
            filterOption={filterOption}
          />
        )}
      </div>
      <ErrorNotification
        errorMessage={errorMessage}
        handleHideError={handleHideError}
      />
    </div>
  );
};

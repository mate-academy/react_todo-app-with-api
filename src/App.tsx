import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoList } from './components/TodoList/TodoList';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Footer } from './components/Footer/Footer';
import { FilterType } from './types/FilterType';
import { filterTodos } from './utils/helpers';
import { ErrorNotify } from './components/ErrorNotify/ErrorNotify';
import { Header } from './components/Header/Header';

const USER_ID = 12041;

export const App: React.FC = () => {
  const [error, setError] = useState<Errors | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editableTodo, setEditableTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleError = (err: Errors) => {
    setError(err);

    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleDelete = async (todoId: number) => {
    try {
      if (error) {
        setError(null);
      }

      setSelectedTodos(prev => [...prev, todoId]);

      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      handleError(Errors.UnableToDelete);
    }
  };

  const onErrorNotifyClose = () => {
    setError(null);
  };

  const onFilterSelect = (filterT: FilterType) => {
    setFilterType(filterT);
  };

  useEffect(() => {
    const renderTodos = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (e) {
        handleError(Errors.UnableToLoad);

        throw e;
      }
    };

    renderTodos();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      handleError(Errors.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    const postingTodo = async () => {
      try {
        if (error) {
          setError(null);
        }

        setIsSubmitting(true);

        const response = await postTodo({
          title,
          userId: USER_ID,
          completed: false,
        });

        setTempTodo(null);

        setTodos(prevTodos => [...prevTodos, response]);
        setNewTodoTitle('');
      } catch (err) {
        handleError(Errors.UnableToAdd);

        setTempTodo(null);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    };

    postingTodo();
  };

  const clearCompleted = useCallback(() => {
    const completedTodos = todos
      .filter((todo) => todo.completed);

    setSelectedTodos((currentIds) => [
      ...currentIds,
      ...completedTodos.map((completedTodo) => completedTodo.id),
    ]);

    completedTodos.forEach(async (completedTodo) => {
      try {
        await deleteTodo(completedTodo.id);

        setTimeout(() => {
          setSelectedTodos(currentIds => [
            ...currentIds.filter(todoId => todoId !== completedTodo.id),
          ]);
          setTodos((currentTodos) => currentTodos
            .filter((todo) => !todo.completed));
        }, 500);
      } catch (err) {
        handleError(Errors.UnableToDelete);

        setSelectedTodos(currentIds => [
          ...currentIds.filter(todoId => todoId !== completedTodo.id),
        ]);

        throw err;
      }
    });
  }, [todos]);

  const toggleComplete = async (
    todoId: number,
    { completed }: Pick<Todo, 'completed'>,
  ) => {
    setSelectedTodos(prevIds => [...prevIds, todoId]);

    try {
      await updateTodo(todoId, { completed: !completed });

      setTodos(
        prevTodos => prevTodos.map(prevTodo => {
          return {
            ...prevTodo,
            completed: prevTodo.id === todoId
              ? !prevTodo.completed
              : prevTodo.completed,
          };
        }),
      );
    } catch (err) {
      handleError(Errors.UnableToUpdate);

      throw err;
    } finally {
      setSelectedTodos(
        prevSelectedIds => prevSelectedIds.filter(
          selectedId => selectedId !== todoId,
        ),
      );
    }
  };

  const isEveryTodoCompleted = todos.every(todo => todo.completed);

  const toggleCompleteAll = () => {
    if (isEveryTodoCompleted) {
      todos.forEach(async (todo) => {
        try {
          setSelectedTodos(prevTodos => [...prevTodos, todo.id]);
          await updateTodo(todo.id, { completed: false });
          setSelectedTodos(prevTodos => [
            ...prevTodos.filter(todoId => todo.id !== todoId),
          ]);
          setTodos(prevTodos => prevTodos.map(prevTodo => ({
            ...prevTodo,
            completed: false,
          }
          )));
        } catch (err) {
          setSelectedTodos(todoIds => todoIds
            .filter(selctedId => selctedId === todo.id));
          handleError(Errors.UnableToUpdate);

          throw err;
        }
      });
    } else {
      todos.forEach(async (todo) => {
        try {
          setSelectedTodos(prevTodos => [...prevTodos, todo.id]);
          await updateTodo(todo.id, { completed: true });
          setSelectedTodos(prevTodos => [
            ...prevTodos.filter(todoId => todo.id !== todoId),
          ]);
          setTodos(prevTodos => prevTodos.map(prevTodo => ({
            ...prevTodo,
            completed: true,
          }
          )));
        } catch (err) {
          setSelectedTodos(todoIds => todoIds
            .filter(selctedId => selctedId === todo.id));
          handleError(Errors.UnableToUpdate);

          throw err;
        }
      });
    }
  };

  const editTodoTitle = (editingTodoId: number) => {
    setEditableTodo(todos.find(todo => {
      return todo.id === editingTodoId;
    }) || null);
  };

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, filterType);
  }, [filterType, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          newTodoTitle={newTodoTitle}
          isSubmitting={isSubmitting}
          todos={todos}
          toggleCompleteAll={toggleCompleteAll}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          handleDelete={handleDelete}
          selectedTodos={selectedTodos}
          toggleComplete={toggleComplete}
          editTodoTitle={editTodoTitle}
          editableTodo={editableTodo}
          setEditableTodo={setEditableTodo}
          setSelectedTodos={setSelectedTodos}
          setTodos={setTodos}
          handleError={handleError}
        />

        {!!todos.length && (
          <Footer
            filterType={filterType}
            onFilterSelect={onFilterSelect}
            todos={todos}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotify
        error={error}
        onClose={onErrorNotifyClose}
      />
    </div>
  );
};

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  deleteTodo,
  completeTodo,
  editTodo,
} from './api/todos';
import { Filter } from './types/Filter';
import { ErrorTypes } from './types/ErrorTypes';
import {
  Header, TodosList, Footer, ErrorNotifications,
} from './components';

const USER_ID = 6335;

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [filter, setFilter] = useState(Filter.All);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const pushError = (erroType: ErrorTypes, time = 3000) => {
    setError(erroType);
    setTimeout(() => setError(null), time);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setAllTodos)
      .catch(() => pushError(ErrorTypes.Load));
  }, []);

  const filterHandler = (array: Todo[], filterType: string) => {
    switch (filterType) {
      case Filter.Active:
        return array.filter(item => !item.completed);
      case Filter.Completed:
        return array.filter(item => item.completed);
      default:
        return array;
    }
  };

  const addTodoHandler = useCallback(() => {
    if (!title.trim()) {
      pushError(ErrorTypes.Add);

      return;
    }

    setIsAdding(true);

    const todo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    });

    addTodo(todo)
      .then(result => {
        setAllTodos(
          prevTodos => [...prevTodos, result],
        );
        setTempTodo(null);
      })
      .catch(() => {
        setError(ErrorTypes.Add);
        setTempTodo(null);
      })
      .finally(() => {
        setIsAdding(false);
        setTitle('');
        setTempTodo(null);
      });
  }, [title]);

  const deleteTodoHandler = useCallback((id: number) => {
    deleteTodo(id)
      .then(() => setAllTodos(
        prevAllTodos => prevAllTodos.filter(prevTodo => prevTodo.id !== id),
      ))
      .catch(() => pushError(ErrorTypes.Delete));
  }, []);

  const activeTodos = useMemo(
    () => filterHandler(allTodos, Filter.Active), [allTodos],
  );
  const completedTodos = useMemo(
    () => filterHandler(allTodos, Filter.Completed), [allTodos],
  );
  const visibleTodos = useMemo(
    () => filterHandler(allTodos, filter), [allTodos, filter],
  );

  const deleteAllCompletedHandler = useCallback(() => {
    completedTodos.map(
      completedTodo => deleteTodoHandler(completedTodo.id),
    );
  }, [allTodos]);

  const todoStatusChangeHandler = useCallback(
    (id: number, isCompeled: boolean) => {
      setSelectedTodoIds(prev => [...prev, id]);

      completeTodo(id, isCompeled)
        .then(() => setAllTodos(prevTodos => {
          const todosCopy = JSON.parse(JSON.stringify(prevTodos));

          return todosCopy.map(
            (todo: Todo) => (
              todo.id === id ? { ...todo, completed: isCompeled } : todo
            ),
          );
        }))
        .catch(() => pushError(ErrorTypes.Update))
        .finally(() => setSelectedTodoIds([]));
    }, [],
  );

  const completeAll = useCallback(() => {
    Promise.all(allTodos.map(
      todo => todoStatusChangeHandler(
        todo.id, !allTodos.every(todoItem => todoItem.completed),
      ),
    ));
  }, [allTodos]);

  const doubleClickHandler = useCallback((id: number) => {
    setSelectedTodoIds([id]);
    setIsEditing(true);
  }, []);

  const cancelEditingHandler = useCallback(() => {
    setIsEditing(false);
    setSelectedTodoIds([]);
  }, []);

  const editingHandler = useCallback(
    (id: number, newData: string, oldData: string) => {
      setIsEditing(false);

      if (!newData.trim()) {
        deleteTodoHandler(id);

        return;
      }

      if (oldData === newData) {
        cancelEditingHandler();

        return;
      }

      editTodo(id, newData)
        .then(() => setAllTodos(prevTodos => {
          const todosCopy = JSON.parse(JSON.stringify(prevTodos));

          return todosCopy.map(
            (todo: Todo) => (
              todo.id === id ? { ...todo, title: newData } : todo
            ),
          );
        }))
        .catch(() => setError(ErrorTypes.Update))
        .finally(() => {
          setSelectedTodoIds(prev => prev.filter(todoId => todoId !== id));
        });
    }, [],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          allTodos={allTodos}
          activeTodos={activeTodos}
          addTodoHandler={addTodoHandler}
          isAdding={isAdding}
          completeAll={completeAll}
        />
        {!!allTodos.length && (
          <>
            <TodosList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodoHandler={deleteTodoHandler}
              selectedTodoIds={selectedTodoIds}
              setSelectedTodoIds={setSelectedTodoIds}
              todoStatusChangeHandler={todoStatusChangeHandler}
              onDoubleClick={doubleClickHandler}
              isEditing={isEditing}
              editingHandler={editingHandler}
              cancelEditingHandler={cancelEditingHandler}
            />

            <Footer
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              filter={filter}
              setFilter={setFilter}
              deleteAllCompletedHandler={deleteAllCompletedHandler}
            />
          </>
        )}
      </div>

      <ErrorNotifications
        error={error}
        setIsError={setError}
      />
    </div>
  );
};

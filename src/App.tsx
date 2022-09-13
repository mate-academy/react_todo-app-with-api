import {
  FC, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoErrorPanel } from './components/TodoErrorPanel';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoStatusBar } from './components/TodoStatusBar';
import { FilterType, Todo } from './types/Todo';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [errorMessages, setErrorMessages] = useState<string []>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [newTodoField]);

  const changeFilter = useCallback((selectedFilter: FilterType) => {
    setFilterType(selectedFilter);
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.All:
          return true;
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [filterType, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {user && (
          <>
            <TodoForm
              newTodoField={newTodoField}
              user={user}
              setErrorMessages={setErrorMessages}
              todoTitle={todoTitle}
              setTodoTitle={setTodoTitle}
              todos={todos}
              setTodos={setTodos}
              setSelectedTodoIds={setSelectedTodoIds}
              selectedTodoIds={selectedTodoIds}
            />

            <TodoList
              user={user}
              todos={filteredTodos}
              setTodos={setTodos}
              setErrorMessages={setErrorMessages}
              setSelectedTodoIds={setSelectedTodoIds}
              selectedTodoIds={selectedTodoIds}
            />
          </>
        )}

        {!!todos.length && (
          <TodoStatusBar
            todos={todos}
            changeFilter={changeFilter}
            filterType={filterType}
            setTodos={setTodos}
            setErrorMessages={setErrorMessages}
            setSelectedTodoIds={setSelectedTodoIds}
          />
        )}

      </div>

      {!!errorMessages.length && (
        <TodoErrorPanel
          errorMessages={errorMessages}
          setErrorMessages={setErrorMessages}
        />
      )}

      {!!errorMessages.length && (
        <img src="https://i.gifer.com/40Oj.gif" alt="Travolta" />
      )}
    </div>
  );
};

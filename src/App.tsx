/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC, useContext, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/FilterConditions';
import { USER_ID } from './constants';
import { TodoContext } from './components/TodoProvider';
import { ErrorNotification } from './components/ErrorNotification';

export const App: FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const {
    todos,
    removeTodo,
  } = useContext(TodoContext);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.All:
      default:
        return [...todos];
    }
  }, [todos, filter]);

  const handleClearCompletedClick = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo?.(todo.id);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          onChange={setTempTodo}
        />

        <TodoList
          preparedTodos={filteredTodos}
          tempTodo={tempTodo}
        />

        {!!todos.length && (
          <Footer
            filterCondition={filter}
            onChangeFilter={setFilter}
            onClearCompleted={handleClearCompletedClick}
          />
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};

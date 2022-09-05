/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { ErorsField } from './components/ErorsField';
import { Footer } from './components/Footer';
import { Header } from './components/header';
import { TodosList } from './components/TodosList';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [filterBy, setfilterBy] = useState('');
  const [unableAddTodo, setUnableAddTodo] = useState(false);
  const [unableDeleteTodo, setUnableDeleteTodo] = useState(false);
  const [unableUpdateTodo, setUnableUpdateTodo] = useState(false);
  const [unableEmptyTitle, setUnableEmptyTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number[]>([]);

  const user = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      client.get<Todo[]>(`/todos?userId=${user.id}`)
        .then(setTodos);
    }
  }, []);

  const onCloseError = useCallback(() => {
    setUnableAddTodo(false);
    setUnableEmptyTitle(false);
    setUnableDeleteTodo(false);
    setUnableUpdateTodo(false);
    setIsLoading(false);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setSelectedTodoId={setSelectedTodoId}
          setIsLoading={setIsLoading}
          setTodos={setTodos}
          setUnableAddTodo={setUnableAddTodo}
          setUnableEmptyTitle={setUnableEmptyTitle}
        />

        <TodosList
          selectedTodoId={selectedTodoId}
          setSelectedTodoId={setSelectedTodoId}
          todos={todos}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setTodos={setTodos}
          setUnableUpdateTodo={setUnableUpdateTodo}
          setunableDeleteTodo={setUnableDeleteTodo}
          filterBy={filterBy}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filterBy={filterBy}
            setfilterBy={setfilterBy}
          />
        )}
      </div>
      {(unableAddTodo
        || unableDeleteTodo
        || unableUpdateTodo
        || unableEmptyTitle)
        && (
          <ErorsField
            onCloseError={onCloseError}
            unableAddTodo={unableAddTodo}
            unableEmptyTitle={unableEmptyTitle}
            unableDeleteTodo={unableDeleteTodo}
            unableUpdateTodo={unableUpdateTodo}
          />
        )}
    </div>
  );
};

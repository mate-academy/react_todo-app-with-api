import { useEffect, useState } from 'react';
import { getTodos } from '../../api/todos';
import { Form } from './Form';
import { ToggleTodosButton } from './ToggleTodosButton';
import { TodosFooter } from './TodosFooter';
import { Todos } from './Todos';
import { TodosError } from './TodosError';

import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/Filter';
import { USER_ID } from './consts';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.NONE);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);
  const [tempNewTodo, setTempNewTodo] = useState<Todo | null>(null);

  const addTodoLoadId = (todoId: number) => {
    setLoadingTodosId((prevTodos) => [...prevTodos, todoId]);
  };

  const removeTodoLoadId = (todoId: number) => {
    setLoadingTodosId((prevTodos) => prevTodos.filter((id) => todoId !== id));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => setTodos(res.slice(0)))
      .catch(() => setErrorType(ErrorType.LOAD));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorType(ErrorType.NONE);
    }, 3000);
  }, [errorType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <ToggleTodosButton
            todos={todos}
            setTodos={setTodos}
            onError={setErrorType}
            addTodoLoadId={addTodoLoadId}
            setLoadingTodosId={setLoadingTodosId}
          />

          <Form
            setTodos={setTodos}
            onError={setErrorType}
            addTodoLoadId={addTodoLoadId}
            removeTodoLoadId={removeTodoLoadId}
            tempNewTodo={tempNewTodo}
            setTempNewTodo={setTempNewTodo}
          />
        </header>

        <section className="todoapp__main">
          <Todos
            todos={todos}
            filter={filterType}
            onError={setErrorType}
            setTodos={setTodos}
            loadingTodosId={loadingTodosId}
            addTodoLoadId={addTodoLoadId}
            removeTodoLoadId={removeTodoLoadId}
            tempNewTodo={tempNewTodo}
          />
        </section>

        <TodosFooter
          todos={todos}
          filter={filterType}
          setFilter={setFilterType}
          onError={setErrorType}
          setTodos={setTodos}
          addTodoLoadId={addTodoLoadId}
          setLoadingTodosId={setLoadingTodosId}
        />
      </div>

      <TodosError
        errorType={errorType}
        onError={setErrorType}
      />
    </div>
  );
};

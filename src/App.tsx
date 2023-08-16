import React, {
  useEffect,
  useCallback,
  useState,
  FormEvent,
} from 'react';
import {
  getTodos,
  addTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { Header } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { Footer } from './components/todoFooter';
import { Message } from './components/ErrorMessege';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { TodoStatus } from './types/TodoStatus';
import { FilterTodos } from './utils/todoFilter';

export const USER_ID = 10883;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState<TodoStatus>(TodoStatus.All);
  const [visibleError, setVisibleError] = useState('');
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setVisibleError('Unable to load todos');
      });
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsTodoLoading(true);

    if (!todoTitle.trim()) {
      setVisibleError('Title can`t be empty');
      setIsTodoLoading(false);
      setTempTodo(null);

      return;
    }

    addTodos(USER_ID, {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    })
      .then((result) => {
        setTodos(prevTodos => [...prevTodos, result]);
      })
      .catch(() => {
        setVisibleError('Unable to add a todo');
      })
      .finally(() => {
        setIsTodoLoading(false);
        setTempTodo(null);
        setTodoTitle('');
      });
  }, [todoTitle, todos]);

  const removeTodo = (todoId: number) => {
    setDeletedTodoId(prevState => prevState.filter(id => id !== todoId));

    deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setVisibleError('Unable to delete a todo');
      });
  };

  const handleCheck = async (todoId: number) => {
    try {
      const updatedTodos = todos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      });

      setTodos(updatedTodos);

      await Promise.all(
        updatedTodos.map(todo => updateTodo(todo.id, todo)),
      );
    } catch (error) {
      setVisibleError('Unable to update todo');
    }
  };

  const removeCompletedTodos = useCallback(() => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(
      completedTodoIds.map(id => (
        client.delete(`/todos/${id}`)
          .catch(() => {
            setVisibleError(`Unable to delete todo with ID ${id}`);
          }))),
    )
      .then(() => {
        const filteredTodos = todos.filter(todo => !todo.completed);

        setTodos(filteredTodos);
      })
      .catch(() => {
        setVisibleError('Unable to delete completed todos');
      });
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        todos={todos}
        handleFormSubmit={handleFormSubmit}
        todoTitle={todoTitle}
        setTodoTitle={setTodoTitle}
        isTodoLoading={isTodoLoading}
        setTodos={setTodos}
        setVisibleError={setVisibleError}
      />

      <div className="todoapp__content">

        <TodoList
          tempTodo={tempTodo}
          todos={FilterTodos(todos, todoFilter)}
          removeTodo={removeTodo}
          deletedTodoId={deletedTodoId}
          handleCheck={handleCheck}
          todoTitle={todoTitle}
          setTodos={setTodos}
          setTodoTitle={setTodoTitle}
        />

        {todos.length > 0 && (
          <Footer
            setTodoFilter={setTodoFilter}
            todoFilter={todoFilter}
            todos={todos}
            removeCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>

      <Message
        visibleError={visibleError}
        setVisibleError={setVisibleError}
      />
    </div>
  );
};

import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  deleteTodo, getTodos, postTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { FilterBy, TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { ErrorMessage, ErrorType }
  from './components/ErrorMessage/ErrorMessage';
import { TodoField } from './components/TodoField/TodoField';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterBy.All);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.None);
  const [errorClose, setErrorClosing] = useState(false);
  const [todoName, setNewTodoName] = useState('');
  const [isAdding, setIsAddingFromServer] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  async function updatePost(todoId: number, done: boolean, title: string) {
    const updated = updateTodo(todoId, {
      completed: done,
      title,
    });

    return updated;
  }

  async function createPost(title: string) {
    if (user) {
      return postTodo(user.id, {
        userId: user.id,
        title,
        completed: false,
      });
    }

    return 0;
  }

  async function deletePost(id: number | number[]) {
    const deleted = await deleteTodo(id);

    return deleted;
  }

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(user?.id || 0);

        setTodos(loadedTodos);
        setCompleted(loadedTodos.filter((todo) => todo.completed === true)
          .map((todo) => todo.id));
      } catch (error) {
        setErrorType(ErrorType.LoadingAll);
      }
    };

    loadTodos();
  }, [completed]);

  const handleAdd = async (newTodoName: string) => {
    setIsAddingFromServer(true);

    try {
      const newTodo = await createPost(newTodoName);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTodos((prevTodos: any) => {
        return [
          ...prevTodos,
          newTodo,
        ];
      });

      setNewTodoName('');
    } catch (error) {
      setErrorType(ErrorType.AddingOne);
    }

    setIsAddingFromServer(false);
  };

  const handleDelete = async (id: number | number[]) => {
    try {
      deletePost(id);
    } catch (error) {
      setErrorType(ErrorType.DeletingOne);
    }
  };

  const handleUpdate = async (todoId: number, done: boolean, title: string) => {
    try {
      updatePost(todoId, done, title);
    } catch (error) {
      setErrorType(ErrorType.UpdatingOne);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      {user && (
        <>
          <h2 className="title todoapp__user-title">
            {`Hey, ${user.name}!`}
          </h2>
          <h2 className="subtitle todoapp__user-title">
            What are your plans for today?
          </h2>
        </>
      )}

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoField
            newToField={newTodoField}
            todos={todos}
            todoName={todoName}
            setNewTodoName={setNewTodoName}
            onAdd={handleAdd}
            isAdding={isAdding}
            setErrorType={setErrorType}
            setErrorClosing={setErrorClosing}
            onUpdate={handleUpdate}
          />
        </header>

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={todos}
              filterType={filter}
              isAdding={isAdding}
              todoName={todoName}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
            <footer
              className="todoapp__footer"
              data-cy="Footer"
            >
              <TodoFilter
                completed={completed}
                setCompleted={setCompleted}
                todos={todos}
                filterType={filter}
                setFilterType={setFilter}
                onDelete={handleDelete}
              />
            </footer>
          </>

        )}

      </div>

      {errorType !== ErrorType.None && (
        <ErrorMessage
          setErrorType={setErrorType}
          errorType={errorType}
          error={errorClose}
          closeError={setErrorClosing}
        />
      )}
    </div>
  );
};

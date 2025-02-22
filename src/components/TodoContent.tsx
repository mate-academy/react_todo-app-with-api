import { useEffect, useMemo, useState } from 'react';

import { TodoFooter } from './TodoFooter';
import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';

import { Todo } from '../types/Todo';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../api/todos';

type Props = {
  errorFunction: (message: string) => void;
};

export const TodoContent: React.FC<Props> = ({ errorFunction = () => {} }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoList, setTodoList] = useState<Todo[]>(todos);
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => errorFunction('Unable to load todos'));
  }, []);

  useMemo(() => setTodoList(todos), [todos]);

  const deleteFunction = (todoId: number) => {
    setLoading(true);

    deleteTodo(todoId)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => {
        errorFunction('Unable to delete a todo');
      })
      .finally(() => setLoading(false));
  };

  const addFunction = (
    tempTodoTitle: string,
    { userId, title, completed }: Omit<Todo, 'id'>,
  ) => {
    setLoading(true);

    const tempTodo: Todo = {
      id: 0,
      userId: 0,
      title: tempTodoTitle,
      completed: false,
    };

    setTodoList([...todos, tempTodo]);
    setActiveTodos([tempTodo]);

    return createTodo({ userId, title, completed })
      .then(newTodo => setTodos([...todos, newTodo]))
      .catch(error => {
        throw error;
      })
      .finally(() => setLoading(false));
  };

  const updateFunction = (todoToUpdate: Todo) => {
    setLoading(true);

    const activeTodo = todoList.find(todo => todo.id === todoToUpdate.id);

    if (activeTodo) {
      setActiveTodos([activeTodo]);
    }

    return updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          return currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          );
        });
      })
      .catch(error => {
        throw error;
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          todoList={todoList}
          setTodoList={setTodoList}
          setTodos={setTodos}
          addTodo={addFunction}
          setActiveTodos={setActiveTodos}
          setLoading={setLoading}
          loadingState={loading}
          errorFunction={errorFunction}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              activeTodos={activeTodos}
              setActiveTodos={setActiveTodos}
              todoList={todoList}
              loadingState={loading}
              onDelete={deleteFunction}
              update={updateFunction}
              errorFunction={errorFunction}
            />
            <TodoFooter
              setTodoList={setTodoList}
              onDelete={deleteFunction}
              setLoading={setLoading}
              loadingState={loading}
              setActiveTodos={setActiveTodos}
              setTodos={setTodos}
              todos={todos}
              errorFunction={errorFunction}
            />
          </>
        )}
      </div>
    </>
  );
};

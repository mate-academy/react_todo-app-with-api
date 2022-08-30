/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { AddTodoForm } from './components/AddTodoForm';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';
import { Todo } from './types/Todo';


type FilteredTodos = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilteredTodos>('all');
  const [error, setError] = useState('');
  const [isAllTodoDone, setIsAllTodoDone] = useState(false);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then((res) => {
          setTodos(res);
        });
    }
  }, []);

  const onAddTodo = (todo: Todo) => {
    setTodos((prevTodos) => (
      [...prevTodos, todo]
    ));
  };

  const handlerAddTodo = useCallback((title: string) => {
    if (user && title) {
      const newTodo = {
        userId: user.id,
        title,
        completed: false,
      };

      addTodo(newTodo)
        .then(addedTodo => onAddTodo(addedTodo))
        .catch(() => setError('Unable to add a todo'));
     } 
    else if (!title) {
      setError('Title can\'t be empty');
    }
  }, [user]);

  const getFilteredTodos = useCallback((filter: FilteredTodos) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos]);

  const onDeleteTodo = (deletedTodoId: number) => {
    setTodos((prev) => prev.filter(todo => todo.id !== deletedTodoId));
  };

  const handlerDeleteTodo = useCallback((todoId:number) => {
    deleteTodo(todoId)
      .then(() => {
          onDeleteTodo(todoId);
      })
      .catch(() => setError('Unable to delete a todo'))
  }, []);

  const delAllCompletedTodoHandler = useCallback(() => {

    todos.forEach(todo => {
      if (todo.completed) {
        handlerDeleteTodo(todo.id);
      }
    });
  }, [handlerDeleteTodo, todos]);

  const changeStatusTodos = useCallback(() => {
    const newTodoList = [...todos].map(todo => {
      updateTodo(todo.id, !isAllTodoDone, todo.title )
        .catch(() => setError('Unable to update a todo'))

      return {
        ...todo,
        completed: !isAllTodoDone,
      };
    });

    setTodos(newTodoList);
    setIsAllTodoDone((prev) => !prev);
  }, [isAllTodoDone, todos]);
  
  const filteredTodos = getFilteredTodos(filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  active: todos.length && todos.every(todo => todo.completed),
                },
              )}
              onClick={() => changeStatusTodos()}
            />
          )}

          <AddTodoForm handleCreateTodo={handlerAddTodo} />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              todos={todos}
              setTodos={setTodos}
              key={todo.id}
              setError={setError}
            />
          ))}
        </section>

        <footer className="todoapp__footer" data-cy="Footer">
          <Footer 
            todos={todos} 
            filter={filter} 
            setFilter={setFilter} 
            deleteAllCompleted={delAllCompletedTodoHandler} 
          />
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: error === '',
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
      </div>
    </div>
  );
};

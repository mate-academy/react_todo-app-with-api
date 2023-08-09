/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */ 
import React, { useState, useEffect} from 'react';
import { UserWarning } from './UserWarning';
import classNames from 'classnames';
import { getTodos, addNewTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Error } from './utils/Error';

const USER_ID = 6752;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState('all');
  const [errorMessage, setErrorMessage] = useState<Error>(Error.NoError);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage(Error.Loading);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getFilteringTodos = ():Todo[] => {
    let visibleTodos = [...todos];

    switch (filterValue) {
      case 'active': visibleTodos = visibleTodos.filter(
        (todo) => !todo.completed,
      );
        break;
      case 'completed': visibleTodos = visibleTodos.filter(
        (todo) => todo.completed,
      );
        break;
      default:
        break;
    }

    return visibleTodos;
  };

  const handleInput = (event: any) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setNewTodoTitle('');
    setTempTodo({ ...newTodo, id: 0 });

    if (!newTodoTitle) {
      setErrorMessage(Error.EmptyTitle);
      setShowNotification(true);

      return;
    }

    if (newTodoTitle.trim()) {
      try {
        setLoading(true);
        const newTodoResponse = await addNewTodo(newTodo);

        setTodos((prevTodos) => [...prevTodos, newTodoResponse]);
        setTempTodo(null);
      } catch (error) {
        setErrorMessage(Error.Loading);
        setErrorMessage(Error.Adding);
        setShowNotification(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id:number) => {
    try {
      setLoading(true);
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(Error.Loading);
      setErrorMessage(Error.Deleting);
    } finally {
      setLoading(false);
    }
  };

  const clearCompletedTodos = () => {
    setTodos((prevTodos) => prevTodos.filter(todo => !todo.completed));
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const changeStatus = (todo:Todo) => {
    try {
      setLoading(true);
      setTodos(todos => todos.map(todoItem =>
        todoItem.id === todo.id ? { ...todoItem, completed: !todoItem.completed } : todoItem
      ));
      
    }
     catch (error) {
      setErrorMessage(Error.Loading);
      setErrorMessage(Error.Updating)
     }
     finally {
      setLoading(false);
     }
    }

    
  const changeTitle = (todo:Todo, editedTitle: string) => {
    try {
      setLoading(true);
      setTodos(todos => todos.map(todoItem =>
        todoItem.id === todo.id ? { ...todoItem, title: editedTitle } : todoItem
      ));
      
    }
     catch (error) {
      setErrorMessage(Error.Loading);
      setErrorMessage(Error.Updating)
     }
     finally {
      setLoading(false);
     }
    }


    function isAllTodosChecked(todos: Todo[]) {
      for (const todo of todos) {
        if (!todo.completed) {
          return false;
        }
      }
      return true;
    }
    
    const changeStatusAllTodos = (todos: Todo[]) => {
      try {
        setLoading(true);
  
        setTodos(todos => todos.map((todoItem ) => todoItem.completed === false ? { ...todoItem, completed: true} : todoItem));

        if(isAllTodosChecked(todos)) {
          setTodos((todos) => todos.map(todoItem => ({ ...todoItem, completed: false })))
        }
       
      }
       catch (error) {
        setErrorMessage(Error.Loading);
        setErrorMessage(Error.Updating)
       }
       finally {
        setLoading(false);
       }
    }

  return ( 
  <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <header className="todoapp__header">
            {todos
             && (
               <button
                 type="button"
                 className={classNames('todoapp__toggle-all', {'active': !isAllTodosChecked})}
                 onClick={() => changeStatusAllTodos(todos)}
               />
             )}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={newTodoTitle}
                onChange={handleInput}
                disabled={loading}
              />
            </form>
          </header>

          <section className="todoapp__main">
            {{tempTodo} && (
            <TodoList
            todos={getFilteringTodos()} 
            handleDelete={handleDelete} 
            changeStatus={changeStatus}
            changeTitle={changeTitle}
            />)}
          </section>
          {todos.length !== 0 ? (
            <Footer
              setFilterValue={setFilterValue}
              filterValue={filterValue}
              todos={todos}
              clearCompletedTodos={clearCompletedTodos}
              completedTodos={completedTodos}
            />
          ) : null}
        </div>
        {errorMessage
        && (
          <Notification
            errorMessage={errorMessage}
            showNotification={showNotification}
            setShowNotification={setShowNotification}
          />
        )}
      </div>
  );
 }

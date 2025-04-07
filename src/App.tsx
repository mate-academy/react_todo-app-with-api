/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, deleteTodo, createTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoRow } from './components/toDoRow';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { ErrorBox } from './components/ErrorBox';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const errorTimerId = useRef(0);

  const showErorr = (massage: string) => {
    setErrorMessage(massage);
    window.clearTimeout(errorTimerId.current);
    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(errorTimerId.current);
    };
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showErorr('Unable to load todos'));
  }, []);

  const deleteTodos = (todoId: number) => {
    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        showErorr('Unable to delete a todo');
        throw error;
      });
  };

  const renameTodo = (todoToUpdate: Todo, newTitle: string) => {
    return updateTodo({ ...todoToUpdate, title: newTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        showErorr('Unable to rename a todo');
        throw error;
      });
  };

  const addTodo = (title: string) => {
    if (title === '') {
      showErorr('Title should not be empty');

      return;
    }

    if (tempTodo !== null) {
      return;
    }

    setTempTodo({
      id: 0,
      completed: false,
      title,
      userId: 11,
    });

    createTodo(title)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(error => {
        showErorr('Unable to create a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const toggleTodo = (todoToUpdate: Todo): Promise<void> => {
    return updateTodo({
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(error => {
        showErorr('Unable to toggle a todo');
        throw error;
      });
  };

  const toggleAllTodos = async (newCompleted: boolean) => {
    const todosToToggle = todos.filter(
      (todo: Todo) => todo.completed === newCompleted,
    );
    const todosToToggleIds = todosToToggle.map((todo: Todo) => todo.id);

    setProcessingIds(ids => [...ids, ...todosToToggleIds]);
    try {
      await Promise.all(
        todosToToggle.map((todo: Todo) =>
          updateTodo({
            ...todo,
            completed: !todo.completed,
          }),
        ),
      );
    } catch (error) {
      showErorr('Unable to toggle some todos');
      throw error;
    }

    setTodos(await getTodos());
    setProcessingIds(ids =>
      ids.filter((id: number) => !todosToToggleIds.includes(id)),
    );
  };

  const clearAllCopmletedTodos = async () => {
    const allCompletedTodosIds = todos
      .filter((todo: Todo) => todo.completed)
      .map((todo: Todo) => todo.id);

    setProcessingIds(ids => [...ids, ...allCompletedTodosIds]);
    try {
      await Promise.all(
        allCompletedTodosIds.map((todoId: number) => deleteTodo(todoId)),
      );
    } catch (error) {
      showErorr('Unable to delete some todos');
      throw error;
    }

    setTodos(await getTodos());
    setProcessingIds(ids =>
      ids.filter((id: number) => !allCompletedTodosIds.includes(id)),
    );
  };

  let todoToShow = todos;

  switch (filter) {
    case 'active':
      todoToShow = todoToShow.filter((todo: Todo) => !todo.completed);
      break;
    case 'completed':
      todoToShow = todoToShow.filter((todo: Todo) => todo.completed);
      break;
    case 'all':
    default:
  }

  if (tempTodo != null) {
    todoToShow = [...todos, tempTodo];
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={addTodo} toggleAllTodos={toggleAllTodos} todos={todos} />

        <section className="todoapp__main" data-cy="TodoList">
          {todoToShow.map((todo: Todo) => (
            <TodoRow
              todo={todo}
              onDelete={() => deleteTodos(todo.id)}
              onToggle={() => toggleTodo(todo)}
              onRename={title => renameTodo(todo, title)}
              isProcessing={processingIds.includes(todo.id)}
              key={todo.id}
            />
          ))}
        </section>

        {todos.length > 0 && (
          <Footer
            todoLength={todos.filter(todo => todo.completed).length}
            filter={filter}
            changeFilter={filtered => setFilter(filtered)}
            onClearCompleted={clearAllCopmletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorBox
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage('')}
      />
    </div>
  );
};

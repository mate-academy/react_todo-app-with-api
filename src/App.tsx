/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  deleteTodos,
  createTodos,
  updateTodos,
} from './api/todos';
import { Filter, Todo, NewTodos } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorComponent } from './components/ErrorComponent';
import { TodoItem } from './components/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import cn from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedIdTodos, setSelectedIdTodos] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [todoId, setTodoId] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.ALL);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsSubmitting(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = useMemo(() => {
    switch (selectedFilter) {
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [selectedFilter, todos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    setNewTodo(input);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newTodo.trim() === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);
    } else {
      setIsSubmitting(true);
      setTempTodo({
        id: 0,
        title: newTodo.trim(),
        completed: false,
        userId: USER_ID,
      });
    }
  };

  const addTodo = async ({ title, completed, userId }: NewTodos) => {
    createTodos({ title, completed, userId })
      .then(newTodos => {
        setTodos(currentTodo => [...currentTodo, newTodos]);
        setNewTodo('');
        inputRef.current?.focus();
        setIsSubmitting(true);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        inputRef.current?.focus();
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const handleTodoClick = async (id: number) => {
    const createTodo = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    const originalTodos = [...todos];

    const findTodo = createTodo.find(todo => todo.id === id);

    if (findTodo) {
      setTodos(createTodo);
      setSelectedIdTodos(currentId => [...currentId, id]);

      updateTodos(findTodo)
        .then(() => {
          setTodos(current =>
            current.map(item => (item.id === findTodo.id ? findTodo : item)),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setTimeout(() => setErrorMessage(''), 3000);
          setTodos(originalTodos);
        })
        .finally(() => {
          setSelectedIdTodos([]);
        });
    }
  };

  const toggleAll = () => {
    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => {
        const updatedTodo = { ...todo, completed: false };

        updateTodos(updatedTodo)
          .then(() => {
            setTodos(prevTodos =>
              prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
            );
          })
          .catch(() => {
            setErrorMessage('Unable to toggle all items');
            setTimeout(() => setErrorMessage(''), 3000);
          });
      });

      return;
    }

    todos.forEach(todo => {
      if (!todo.completed) {
        const updatedTodo = { ...todo, completed: true };

        updateTodos(updatedTodo)
          .then(() => {
            setTodos(prevTodos =>
              prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
            );
          })
          .catch(() => {
            setErrorMessage('Unable to toggle all items');
            setTimeout(() => setErrorMessage(''), 3000);
          });
      }
    });
  };

  const handleEdit = async (id: number, newTitle: string): Promise<void> => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    setSelectedIdTodos(currentId => [...currentId, id]);

    if (todoToUpdate) {
      try {
        const updatedTodo = await updateTodos({
          ...todoToUpdate,
          title: newTitle,
        });

        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
      } catch (error) {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      } finally {
        setSelectedIdTodos([]);
      }
    }
  };

  const handleClearCompleted = async () => {
    todos.forEach(todo => {
      if (todo.completed) {
        setSelectedIdTodos(currentId => [...currentId, todo.id]);
        setIsSubmitting(true);
        deleteTodos(todo.id)
          .then(() => {
            setTodos(stateTodo =>
              stateTodo.filter(item => item.id !== todo.id),
            );
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
            setTimeout(() => setErrorMessage(''), 3000);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (id) {
      setTodoId(id);
      setIsSubmitting(true);
    }

    return deleteTodos(id)
      .then(() => {
        setTodos(stateTodo => stateTodo.filter(todo => todo.id !== id));
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const memoryTodo = useMemo(
    () => (tempTodo ? [...filteredTodos, tempTodo] : filteredTodos),
    [filteredTodos, tempTodo],
  );

  const handleCleanButton = () => {
    setErrorMessage('');
  };

  return (
    <div className={cn('todoapp', { 'has-error': errorMessage })}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          newTodo={newTodo}
          addTodo={addTodo}
          isSubmitting={isSubmitting}
          toggleAll={toggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {memoryTodo.map(({ id, title, completed }) => (
              <CSSTransition key={id} timeout={300} classNames="item">
                <TodoItem
                  todoId={id}
                  todoTitle={title}
                  isCompleted={completed}
                  handleTodoClick={handleTodoClick}
                  deleteTodos={handleDelete}
                  isSubmitting={tempTodo}
                  deletingTodo={todoId}
                  currentTodos={selectedIdTodos}
                  handleEdit={handleEdit}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </section>

        {!!todos.length && (
          <Footer
            todos={todos}
            handleClearCompleted={handleClearCompleted}
            setFilter={setSelectedFilter}
            currentFilter={selectedFilter}
          />
        )}
      </div>

      <ErrorComponent
        errorMessage={errorMessage}
        handleCleanButton={handleCleanButton}
      />
    </div>
  );
};

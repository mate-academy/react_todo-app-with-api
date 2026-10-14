/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  getTodos,
  USER_ID,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Filter } from './types/Filter';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    async function searchTodos() {
      try {
        setErrorMessage('');
        const receivedTodos = await getTodos();

        setTodos(receivedTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }

    searchTodos();
  }, []);

  useEffect(() => {
    if (tempTodo === null) {
      newTodoField.current?.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredActiveTodos = todos.filter(todo => todo.completed !== true);
  const filteredCompletedTodos = todos.filter(todo => todo.completed === true);
  let visibleTodos;

  switch (selectedFilter) {
    case 'all':
      visibleTodos = todos;
      break;
    case 'active':
      visibleTodos = filteredActiveTodos;
      break;
    case 'completed':
      visibleTodos = filteredCompletedTodos;
      break;
  }

  const handleSubmit = async () => {
    if (newTodoTitle.trim() === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const newTodoForAPI = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setErrorMessage('');
    const todoPromise = createTodo(newTodoForAPI);
    const temporaryTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(temporaryTodo);
    try {
      const receivedNewTodo = await todoPromise;

      setTodos([...todos, receivedNewTodo]);
      setNewTodoTitle('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    setErrorMessage('');
    setProcessingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch (error) {
      setErrorMessage('Unable to delete a todo');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return false;
    } finally {
      setProcessingTodoIds(currentIds =>
        currentIds.filter(id => id !== todoId),
      );

      newTodoField.current?.focus();
    }
  };

  const handleUpdate = async (todoId: number, completed: boolean) => {
    setErrorMessage('');
    setProcessingTodoIds(currentIds => [...currentIds, todoId]);
    try {
      const updatedTodo = await updateTodo(todoId, {
        completed: !completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setProcessingTodoIds(currentIds =>
        currentIds.filter(id => id !== todoId),
      );
    }
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const targetCompleted = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== targetCompleted,
    );

    todosToUpdate.forEach(todo => {
      handleUpdate(todo.id, todo.completed);
    });
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditedTitle(todo.title);
  };

  const handleSaveEditing = async (todo: Todo) => {
    const newTitle = editedTitle.trim();

    if (newTitle === '') {
      const wasDeleted = await handleDelete(todo.id);

      if (wasDeleted) {
        setEditingTodoId(null);
      }

      return;
    }

    if (newTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    setErrorMessage('');
    setProcessingTodoIds(currentIds => [...currentIds, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: newTitle,
      });

      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
        ),
      );

      setEditingTodoId(null);
    } catch (error) {
      setErrorMessage('Unable to update a todo');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setProcessingTodoIds(currentIds =>
        currentIds.filter(id => id !== todo.id),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <NewTodo
            newTodoTitle={newTodoTitle}
            onTitleChange={setNewTodoTitle}
            onSubmit={handleSubmit}
            newTodoField={newTodoField}
            isAdding={!!tempTodo}
          />
        </header>

        {(todos.length !== 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              editingTodoId={editingTodoId}
              editedTitle={editedTitle}
              processingTodoIds={processingTodoIds}
              onToggle={todo => handleUpdate(todo.id, todo.completed)}
              onDelete={handleDelete}
              onStartEditing={handleStartEditing}
              onTitleChange={setEditedTitle}
              onSaveEditing={handleSaveEditing}
              onCancelEditing={todo => {
                setEditedTitle(todo.title);
                setEditingTodoId(null);
              }}
            />

            {/* Hide the footer if there are no todos */}
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {filteredActiveTodos.length} items left
              </span>

              {/* Active link should have the 'selected' class */}
              <TodoFilter
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />

              {/* this button should be disabled if there are no completed todos */}

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={filteredCompletedTodos.length === 0}
                onClick={() => {
                  filteredCompletedTodos.forEach(todo => {
                    handleDelete(todo.id);
                  });
                }}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === '',
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};

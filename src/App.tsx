import React, { useEffect, useRef, useState } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodoById,
  USER_ID,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { applyFilterToTodos } from './utils/filterHelper';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Toggle } from './types/Toggle';

export const App: React.FC = () => {
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentFilter, setCurrentFilter] = useState(Filter.All);
  const [loadingState, setLoadingState] = useState(false);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const remainingTasks = todoItems.filter(task => !task.completed).length;
  const doneTasks = todoItems.filter(task => task.completed);
  const visibleTodos = applyFilterToTodos(todoItems, currentFilter);
  const completedTodos = todoItems.filter(todo => todo.completed);
  const notCompletedTodos = todoItems.filter(todo => !todo.completed);
  const [hasTextFocus, setHasTextFocus] = useState(false);

  useEffect(() => {
    inputElement.current?.focus();
  }, [hasTextFocus]);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const fetchTaskList = () => {
    getTodos()
      .then(setTodoItems)
      .catch(() => showAlert('Unable to load todos'));
  };

  useEffect(fetchTaskList, []);

  const addNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTaskTitle.trim();

    if (!title) {
      showAlert('Title should not be empty');

      return;
    }

    setLoadingState(true);
    setHasTextFocus(true);
    setTemporaryTodo({ id: 0, title, userId: USER_ID, completed: false });

    addTodo(title)
      .then(newTask => {
        setTodoItems(prev => [...prev, newTask]);
        setNewTaskTitle('');
      })
      .catch(() => showAlert('Unable to add a todo'))
      .finally(() => {
        setTemporaryTodo(null);
        setLoadingState(false);
        setHasTextFocus(false);
      });
  };

  const deleteTask = (taskIds: number[]) => {
    if (!taskIds.length) {
      return;
    }

    setLoadingState(true);
    setDeletingIds(taskIds);

    taskIds.forEach(taskId => {
      deleteTodoById(taskId)
        .then(() => {
          setTodoItems(prev => prev.filter(task => task.id !== taskId));
        })
        .catch(() => showAlert('Unable to delete a todo'))
        .finally(() => {
          setDeletingIds([]);
          setLoadingState(false);
          setHasTextFocus(true);
        });
    });
  };

  const removeCompletedTasks = () => {
    const completedTaskIds = doneTasks.map(task => task.id);

    deleteTask(completedTaskIds);
  };

  const toggleAllTodo = (updatedTodos: Todo[]) => {
    setDeletingIds(updatedTodos.map(todo => todo.id));

    updatedTodos.map(todo => {
      const updatedTodo = {
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        completed: !todo.completed,
      };

      updateTodo(updatedTodo)
        .then(() => {
          setTodoItems(currentTodos => {
            return currentTodos.map(currentTodo =>
              currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
            );
          });
        })
        .catch(() => showAlert('Unable to update a todo'))
        .finally(() => {
          setDeletingIds([]);
        });
    });
  };

  const toggleAllTodos = (toggle: Toggle) => {
    if (toggle === Toggle.AllActive) {
      setDeletingIds(completedTodos.map(todo => todo.id));

      completedTodos.map(todo => {
        const updatedTodo = {
          id: todo.id,
          userId: todo.id,
          title: todo.title,
          completed: false,
        };

        updateTodo(updatedTodo)
          .then(() => {
            setTodoItems(currentTodos => {
              return currentTodos.map(currentTodo =>
                currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
              );
            });
          })
          .catch(() => showAlert('Unable to update a todo'))
          .finally(() => {
            setDeletingIds([]);
          });
      });
    } else if (toggle === Toggle.AllCompleted) {
      setDeletingIds(notCompletedTodos.map(todo => todo.id));

      notCompletedTodos.map(todo => {
        const updatedTodo = {
          id: todo.id,
          userId: todo.id,
          title: todo.title,
          completed: true,
        };

        updateTodo(updatedTodo)
          .then(() => {
            setTodoItems(currentTodos => {
              return currentTodos.map(currentTodo =>
                currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
              );
            });
          })
          .catch(() => showAlert('Unable to update a todo'))
          .finally(() => {
            setDeletingIds([]);
          });
      });
    }
  };

  const updateText = (todosDataUpdate: Todo[]) => {
    const todoIds = todosDataUpdate.map(todo => todo.id);

    setDeletingIds(todoIds);

    return todosDataUpdate.map(todoDataUpdate => {
      return updateTodo(todoDataUpdate)
        .then(updatedTodo => {
          setTodoItems(currentTodos =>
            currentTodos.map(todo =>
              todo.id === todoDataUpdate.id ? updatedTodo : todo,
            ),
          );

          return true;
        })
        .catch(() => {
          showAlert('Unable to update a todo');

          return false;
        })
        .finally(() => {
          setDeletingIds([]);
        });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todoItems}
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          addTask={addNewTask}
          isLoading={loadingState}
          inputRef={inputElement}
          toggleAllTodos={toggleAllTodos}
        />

        <TodoList
          todos={visibleTodos}
          deleteTask={deleteTask}
          temporaryTodo={temporaryTodo}
          isLoading={loadingState}
          pendingIds={deletingIds}
          updateText={updateText}
          toggleTodo={toggleAllTodo}
        />

        {todoItems.length > 0 && (
          <TodoFooter
            currentFilter={currentFilter}
            setFilter={setCurrentFilter}
            remainingTasks={remainingTasks}
            hasCompletedTasks={doneTasks.length > 0}
            clearCompletedTasks={removeCompletedTasks}
          />
        )}
      </div>

      <ErrorNotification message={alertMessage} clearMessage={showAlert} />
    </div>
  );
};

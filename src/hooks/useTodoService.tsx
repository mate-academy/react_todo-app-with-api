import React, { useState, useEffect } from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { Todo } from '../types/Todo';

export const useTodoService = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const todoInputRef = React.useRef<HTMLInputElement>(null);
  const activeTodos = todos.filter(t => !t.completed).length;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [todos]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsAdding(true);

    const newTodoData = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodoData,
    });

    createTodo(newTodoData)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        todoInputRef.current?.focus();
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        setTimeout(() => {
          todoInputRef.current?.focus();
        }, 0);
      });
  };

  const onDelete = (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const onDeleteAll = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedIds]);

    const deletePromises = completedTodos.map(todo => {
      return deleteTodo(todo.id)
        .then(() => todo.id)
        .catch(() => {
          setErrorMessage('Unable to delete a todo');

          return null;
        });
    });

    Promise.all(deletePromises)
      .then(results => {
        const deletedIds = results.filter((id): id is number => id !== null);

        setTodos(currentTodos =>
          currentTodos.filter(todo => !deletedIds.includes(todo.id)),
        );
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => !completedIds.includes(id)));
        todoInputRef.current?.focus();
      });
  };

  const todoStatus = (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);
    setErrorMessage('');
    updateTodo({ ...todo, completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(t => t.completed);
    const targetStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    todosToUpdate.forEach(todo => {
      setLoadingIds(prev => [...prev, todo.id]);

      updateTodo({ ...todo, completed: targetStatus })
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() => {
          setLoadingIds(prev => prev.filter(id => id !== todo.id));
        });
    });
  };

  const renameTodo = (todo: Todo, newTitle: string) => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    setLoadingIds(prev => [...prev, todo.id]);

    updateTodo({ ...todo, title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
        setEditingId(null);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  return {
    todos,
    errorMessage,
    setErrorMessage,
    title,
    setTitle,
    isAdding,
    tempTodo,
    loadingIds,
    editingId,
    setEditingId,
    todoInputRef,
    activeTodos,
    handleSubmit,
    onDelete,
    onDeleteAll,
    todoStatus,
    handleToggleAll,
    renameTodo,
  };
};

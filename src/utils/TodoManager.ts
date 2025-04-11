/* eslint-disable max-len */
import { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from '../api/todos';
import { Errors } from '../types/Errors';
import { FilterBy } from '../types/FilterBy';

export const TodoManager = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState(Errors.DEFAULT);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null); // Track the ID of the todo being deleted
  const [isClearingCompleted, setIsClearingCompleted] = useState(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const onClearError = () => {
    setErrorMessage(Errors.DEFAULT);
  };

  const filter = (todosList: Todo[], activeFilter: FilterBy) => {
    switch (activeFilter) {
      case FilterBy.Active:
        return todosList.filter(todo => !todo.completed);
      case FilterBy.Completed:
        return todosList.filter(todo => todo.completed);
      case FilterBy.All:
      default:
        return todosList;
    }
  };

  useEffect(() => {
    setLoading(true); // Start loading
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage(Errors.LOAD);
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  }, []);

  const handleAddTodo = async (title: string) => {
    setIsAdding(true);

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(Errors.EMPTY);
      setIsAdding(false);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID, // Replace with your userId
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await addTodo(trimmedTitle);

      setTodos(prev => [...prev, newTodo]);
      setNewTodoTitle('');
    } catch (err) {
      setErrorMessage(Errors.ADD);
      setTempTodo(null);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const todosToDisplay = tempTodo ? [tempTodo, ...todos] : todos;

  const handleDeleteTodo = async (todoId: number) => {
    setIsDeleting(todoId);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(Errors.DELETE);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleClearCompleted = async () => {
    setIsClearingCompleted(true); // Set flag when action starts

    try {
      const completedTodos = todos.filter(todo => todo.completed);

      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (error) {
      setErrorMessage(Errors.CLEAR);
    } finally {
      setIsClearingCompleted(false); // Reset flag when action finishes
    }
  };

  const handleToggleAllTodos = async () => {
    setIsToggling(true);
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    setTodos(prev =>
      prev.map(todo =>
        todosToUpdate.includes(todo)
          ? { ...todo, completed: !allCompleted }
          : todo,
      ),
    );

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: !allCompleted }),
        ),
      );
    } catch (error) {
      setErrorMessage(Errors.TOGGLE_ALL);
      // Revert changes if the update fails
      setTodos(prev =>
        prev.map(todo =>
          todosToUpdate.includes(todo)
            ? { ...todo, completed: allCompleted }
            : todo,
        ),
      );
    } finally {
      setIsToggling(false);
    }
  };

  const onToggleTodo = async (todoId: number) => {
    const todoToToggle = todos.find(todo => todo.id === todoId);

    if (!todoToToggle) {
      return;
    }

    setTodos(prev =>
      prev.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    setIsToggling(true);

    try {
      await updateTodo(todoId, {
        completed: !todoToToggle.completed,
      });
    } catch (error) {
      setErrorMessage(Errors.TOGGLE);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, completed: todo.completed } : todo,
        ),
      );
    }
  };

  const filteredTodos = filter(todos, filterBy);

  useEffect(() => {
    if (errorMessage !== Errors.DEFAULT) {
      const timer = setTimeout(() => setErrorMessage(Errors.DEFAULT), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  const handleUpdateTodo = async (id: number, title: string) => {
    try {
      const updatedTodo = await updateTodo(id, { title });

      setTodos(prev =>
        prev.map(todo => (todo.id === id ? { ...todo, ...updatedTodo } : todo)),
      );
    } catch {
      setErrorMessage(Errors.UPDATE);
    }
  };

  return {
    filterBy,
    setFilterBy,
    todos,
    tempTodo,
    setTempTodo,
    loading,
    todosToDisplay,
    filteredTodos,
    setTodos,
    errorMessage,
    setErrorMessage,
    isAdding,
    handleAddTodo,
    isDeleting,
    setIsDeleting,
    handleToggleAllTodos,
    onToggleTodo,
    isToggling,
    setIsToggling,
    handleClearCompleted,
    isClearingCompleted,
    setIsClearingCompleted,
    handleDeleteTodo,
    newTodoTitle,
    setNewTodoTitle,
    onClearError,
    handleUpdateTodo,
  };
};

import { useState, useEffect } from 'react';
import * as todoServices from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../utils/ErrorMessage';

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.DEFAULT_ERROR,
  );
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);

  const handleAddTodoToProcessing = (id: Todo['id']) => {
    setProcessingTodoIds(prevIds => [...prevIds, id]);
  };

  const handleRemoveTodoFromProcessing = (id: Todo['id']) => {
    setProcessingTodoIds(prevIds => prevIds.filter(todoId => todoId !== id));
  };

  useEffect(() => {
    setErrorMessage(ErrorMessage.DEFAULT_ERROR);
    setIsLoading(true);

    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD_TODOS_FAILED);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const isAddingTodo = tempTodo !== null;
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const showFooter = todos.length > 0;
  const isProcessingAnyTodo = processingTodoIds.length > 0;
  const everyTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleAddTodo = async () => {
    const normalizedTitle = newTodoTitle.trim();

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessage.TITLE_EMPTY);

      return;
    }

    setErrorMessage(ErrorMessage.DEFAULT_ERROR);

    const newTempTodo: Todo = {
      id: 0,
      userId: todoServices.USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const addedTodo = await todoServices.addTodo(normalizedTitle);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
      setNewTodoTitle('');
    } catch (error) {
      setErrorMessage(ErrorMessage.ADD_TODO_FAILED);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    handleAddTodoToProcessing(id);
    setErrorMessage(ErrorMessage.DEFAULT_ERROR);

    try {
      await todoServices.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE_TODO_FAILED);
    } finally {
      handleRemoveTodoFromProcessing(id);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setErrorMessage(ErrorMessage.DEFAULT_ERROR);

    completedTodos.forEach(todo => handleAddTodoToProcessing(todo.id));

    const deletePromises = completedTodos.map(todo =>
      todoServices.deleteTodo(todo.id),
    );

    try {
      const result = await Promise.allSettled(deletePromises);
      const deletedTodoIds: number[] = [];
      let hasError = false;

      result.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          deletedTodoIds.push(completedTodos[index].id);
        } else {
          hasError = true;
        }
      });

      setTodos(prevTodos =>
        prevTodos.filter(todo => !deletedTodoIds.includes(todo.id)),
      );

      if (hasError) {
        setErrorMessage(ErrorMessage.DELETE_TODO_FAILED);
      }
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE_TODO_FAILED);
    } finally {
      completedTodos.forEach(todo => handleRemoveTodoFromProcessing(todo.id));
    }
  };

  const handleUpdateTodo = async (id: number, completed: boolean) => {
    handleAddTodoToProcessing(id);
    setErrorMessage(ErrorMessage.DEFAULT_ERROR);

    try {
      const updatedTodo = await todoServices.updateTodo(id, { completed });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE_TODO_FAILED);
    } finally {
      handleRemoveTodoFromProcessing(id);
    }
  };

  const handleToggleAllTodos = async () => {
    setErrorMessage(ErrorMessage.DEFAULT_ERROR);

    const targetStatus = everyTodosCompleted ? false : true;
    const todosToToggle = todos.filter(todo => todo.completed !== targetStatus);

    if (!todosToToggle.length) {
      return;
    }

    todosToToggle.forEach(todo => handleAddTodoToProcessing(todo.id));

    const updatePromises = todosToToggle.map(todo =>
      todoServices.updateTodo(todo.id, { completed: targetStatus }),
    );

    try {
      const result = await Promise.allSettled(updatePromises);
      const updatedTodoIds: number[] = [];
      let hasError = false;

      result.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          updatedTodoIds.push(todosToToggle[index].id);
        } else {
          hasError = true;
        }
      });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          updatedTodoIds.includes(todo.id)
            ? { ...todo, completed: targetStatus }
            : todo,
        ),
      );

      if (hasError) {
        setErrorMessage(ErrorMessage.UPDATE_TODO_FAILED);
      }
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE_TODO_FAILED);
    } finally {
      todosToToggle.forEach(todo => handleRemoveTodoFromProcessing(todo.id));
    }
  };

  const handleStartEditing = (todoId: number, title: string) => {
    setEditingTodoId(todoId);
    setEditingTitle(title);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleSaveEdit = async (todoId: number, newTitle: string) => {
    const normalizedTitle = newTitle.trim();
    const originalTodo = todos.find(todo => todo.id === todoId);

    if (!originalTodo) {
      return;
    }

    if (normalizedTitle === originalTodo.title) {
      handleCancelEdit();

      return;
    }

    if (!normalizedTitle) {
      await handleDeleteTodo(todoId);

      return;
    }

    handleAddTodoToProcessing(todoId);
    setErrorMessage(ErrorMessage.DEFAULT_ERROR);

    try {
      const updatedTodo = await todoServices.updateTodo(todoId, {
        title: normalizedTitle,
      });

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
      handleCancelEdit();
    } catch (error) {
      setErrorMessage(ErrorMessage.UPDATE_TODO_FAILED);
    } finally {
      handleRemoveTodoFromProcessing(todoId);
    }
  };

  return {
    // state
    todos,
    isLoading,
    newTodoTitle,
    setNewTodoTitle,
    tempTodo,
    errorMessage,
    setErrorMessage,
    editingTodoId,
    editingTitle,
    setEditingTitle,
    processingTodoIds,

    // values
    isAddingTodo,
    activeTodosCount,
    showFooter,
    isProcessingAnyTodo,
    everyTodosCompleted,

    //functions
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleUpdateTodo,
    handleToggleAllTodos,
    handleStartEditing,
    handleCancelEdit,
    handleSaveEdit,
  };
};

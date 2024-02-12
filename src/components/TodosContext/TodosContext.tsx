import React, { useState } from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodosContextType } from '../../types/TodosContextType';
import * as clientService from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

const USER_ID = 119;

type Props = {
  children: React.ReactNode;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  tempTodo: null,
  setTodos: () => { },
  addTodo: async () => { },
  toggleTodo: () => { },
  deleteTodo: () => { },
  clearCompletedTodos: () => { },
  filterStatus: Status.All,
  setFilterStatus: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  isSubmitting: false,
  setIsSubmitting: () => { },
  deletedIds: [],
  setDeletedIds: () => { },
  editedIds: [],
  editTodoTitle: () => { },
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [editedIds, setEditedIds] = useState<number[]>([]);

  const addTodo = (newTitle: string) => {
    setIsSubmitting(true);
    setErrorMessage('');

    const createdTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTitle,
      completed: false,
    };

    setTempTodo({
      ...createdTodo,
      id: 0,
    });

    return clientService.createTodo(createdTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.adding);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const toggleTodo = (id: number, toggledTodo: Todo) => {
    setErrorMessage('');
    setEditedIds((ids) => [...ids, id]);

    const editedTodo = {
      ...toggledTodo,
      completed: !toggledTodo.completed,
    };

    return clientService.updateTodo(editedTodo)
      .then(() => {
        setTodos(prev => prev.map(currentTodo => {
          if (currentTodo.id === editedTodo.id) {
            return {
              ...currentTodo,
              completed: !currentTodo.completed,
            };
          }

          return currentTodo;
        }));
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.updating);
        throw error;
      })
      .finally(() => {
        setEditedIds((ids) => ids.filter(item => item !== id));
      });
  };

  const deleteTodo = (id: number) => {
    setIsSubmitting(true);
    setDeletedIds((ids) => [...ids, id]);

    return clientService.deleteTodo(id)
      .then(() => setTodos(prev => prev
        .filter(currentTodo => currentTodo.id !== id)))
      .catch((error) => {
        setErrorMessage(ErrorMessage.deleting);
        throw error;
      })
      .finally(() => setDeletedIds((ids) => ids
        .filter(todoId => todoId !== id)));
  };

  const clearCompletedTodos = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      deleteTodo(todo.id);
    });
  };

  const editTodoTitle = (id: number, editedTodo: Todo) => {
    setErrorMessage('');
    setEditedIds((ids) => [...ids, id]);

    setTodos(todos.map(currentTodo => {
      if (currentTodo.id === editedTodo.id) {
        return {
          ...currentTodo,
          title: editedTodo.title,
        };
      }

      return currentTodo;
    }));

    return clientService.updateTodo(editedTodo)
      .then()
      .catch((error) => {
        setErrorMessage(ErrorMessage.updating);
        throw error;
      })
      .finally(() => {
        setEditedIds((ids) => ids.filter(item => item !== id));
      });
  };

  const value = {
    todos,
    tempTodo,
    setTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompletedTodos,
    filterStatus,
    setFilterStatus,
    errorMessage,
    setErrorMessage,
    isSubmitting,
    setIsSubmitting,
    deletedIds,
    setDeletedIds,
    editedIds,
    editTodoTitle,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

import React, { useContext, useState } from 'react';
import { TodosContext } from '../context/todosContext';
import { createTodo } from '../api/todos';
import { ErrorType } from '../types/Error';

export const NewTodo:React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    onAddTodo,
    setErrorMessage,
    setTempTodo,
    USER_ID,
    setProcessingIds,
  } = useContext(TodosContext);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedQuery = newTodoTitle.trim();

    if (!normalizedQuery) {
      setErrorMessage(ErrorType.emptyValue);
      throw new Error(ErrorType.emptyValue);
    }

    const newTodo = {
      id: 0,
      completed: false,
      title: normalizedQuery,
      userId: USER_ID,
    };

    setLoading(true);
    setProcessingIds(ids => [...ids, newTodo.id]);

    setTempTodo(newTodo);

    createTodo(newTodo)
      .then((createdTodo) => {
        onAddTodo(createdTodo);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorType.addTodo);
        throw new Error(ErrorType.addTodo);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
        setProcessingIds(ids => ids.filter(id => id !== newTodo.id));
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={event => setNewTodoTitle(event.target.value)}
        disabled={loading}
      />
    </form>
  );
};

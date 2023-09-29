import React, { useState } from 'react';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { FilterOption } from './types/filterOption';
import { TodoList } from './components/todoList';
import { InCaseOfError } from './components/inCaseOfError';
import { InputOfTodos } from './components/inputOfTodos';
import { Footer } from './components/footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [filterTodos, setFilterTodos]
  = useState<FilterOption>(FilterOption.ALL);
  const [newTodo, setNewTodo] = useState<string>('');

  const handleSetFilter = (newFilter: FilterOption) => {
    setFilterTodos(newFilter);
  };

  const closeError = () => {
    setError(null);
  };

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodoItem: Todo = {
        id: todos.length + 1,
        title: newTodo,
        completed: false,
        removed: false,
        editing: false,
      };

      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <InputOfTodos
          setNewTodo={setNewTodo}
          newTodo={newTodo}
          addTodo={addTodo}
          todos={todos}
          setTodos={setTodos}
        />

        {todos && (
          <TodoList
            todos={todos}
            filterTodos={filterTodos}
            setTodos={setTodos}
          />
        )}

        {todos.length > 0 && (
          <Footer
            handleSetFilter={handleSetFilter}
            todos={todos}
            setTodos={setTodos}
          />
        )}
      </div>

      {error && (
        <InCaseOfError error={error} closeError={closeError} />
      )}
    </div>
  );
};

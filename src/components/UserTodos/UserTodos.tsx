import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';
import * as todoService from '../../api/todos';
import { TodoList } from '../TodoList/TodoList';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { TodoFilter } from '../../types/TodoFilter';

type Props = {
  userId: number;
  onError: (errorMessage: string) => void;
};

export const UserTodos: React.FC<Props> = ({ userId, onError }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [filterTodos, setFilterTodos] = useState<TodoFilter>(TodoFilter.All);
  const [creating, setCreating] = useState<boolean>(false);
  const [processings, setProcessings] = useState<number[]>([]);
  const resetTitle = () => setTodoTitle('');

  const filteredTodos = todos.filter(todo => {
    switch (filterTodos) {
      case TodoFilter.All:
        return true;
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return false;
    }
  });

  const hasTodos = todos.length !== 0;
  const hasCompletedTodo = todos.some(todo => todo.completed);
  const hasAllTodosCompleted = todos.every(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => onError('Unable to load todos'));
  }, [onError]);

  const handleAddTodo = (newTodo: Todo) => {
    setCreating(true);
    const newTodoTitle = newTodo.title.trim();

    if (newTodoTitle.length === 0) {
      onError('Title should not be empty');
      setCreating(false);
      resetTitle();

      return Promise.resolve();
    }

    return todoService
      .createTodo({
        userId,
        title: newTodoTitle,
        completed: newTodo.completed,
      })
      .then(todo => {
        setTodos([...todos, todo]);
        resetTitle();
      })
      .catch(() => onError('Unable to add a todo'))
      .finally(() => setCreating(false));
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    return todoService
      .updateTodo(updatedTodo)
      .then(() => {
        const updatedTodos = todos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        );

        setTodos(updatedTodos);
      })
      .catch(error => {
        onError('Unable to update a todo');
        throw error;
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    return todoService
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => onError('Unable to delete a todo'));
  };

  const handleClearCompleted = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessings(completedTodoIds);

    Promise.all(
      completedTodoIds.map(todoId => handleDeleteTodo(todoId)),
    ).finally(() => setProcessings([]));
  };

  const handleToggleAllTodos = () => {
    const isAllCompleted = todos.every(todo => todo.completed);
    const processingsTodo = isAllCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    const updatedTodos = processingsTodo.map(todo => ({
      ...todo,
      completed: !todo.completed,
    }));

    const renderedTodos = todos.map(todo => ({
      ...todo,
      completed: !isAllCompleted,
    }));

    setProcessings(updatedTodos.map(todo => todo.id));
    Promise.all(updatedTodos.map(todo => todoService.updateTodo(todo)))
      .then(() => setTodos(renderedTodos))
      .catch(() => onError('Unable to toggle all todos'))
      .finally(() => setProcessings([]));
  };

  return (
    <div className="todoapp__content">
      <TodoForm
        onAdd={handleAddTodo}
        todoTitle={todoTitle}
        setTodoTitle={setTodoTitle}
        onToggleAllTodos={handleToggleAllTodos}
        isToggleAllVisible={hasTodos}
        isAllTodosCompleted={hasAllTodosCompleted}
      />
      <TodoList
        todos={filteredTodos}
        creating={creating}
        processings={processings}
        todoTitle={todoTitle}
        onDelete={handleDeleteTodo}
        onUpdate={handleUpdateTodo}
      />
      {hasTodos && (
        <TodoFooter
          activeTodosCount={activeTodos.length}
          hasCompletedTodo={hasCompletedTodo}
          onClearCompleted={handleClearCompleted}
          selectedFilter={filterTodos}
          onFilterChange={setFilterTodos}
        />
      )}
    </div>
  );
};

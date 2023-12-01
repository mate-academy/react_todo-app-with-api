/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  // useRef,
  useState,
} from 'react';

import { Todo } from './types/Todo';
import { createTodo, deleteTodos, getTodos, updateTodos } from './api/todos';
import { TodoRow } from './components/TodoRow';
import { Filter } from './types/Filter';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState(0);
  const [isDeleting, setIsDeleting] = useState(0);
  const [isChanged, setIsChanged] = useState(0);
  const [isChangingStatus, setIsChangingStatus] = useState(0);


  const USER_ID = 11882;

  const loadTodos = async () => {
    try {
      const todosData = await getTodos();

      setTodos(todosData);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    }
  };

  const handleTodoAdd = async (title: string) => {
    setErrorMessage('');

    setTemporaryTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });

    await createTodo(title)
      .then(createdTodo => setTodos(prevTodos => [...prevTodos, createdTodo]))
      .finally(() => {
        setTemporaryTodo(null);
      });
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    setErrorMessage('');

    try {
      await deleteTodos(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (e) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsDeleting(0);
    }
  };

  const deleteAllCompleted = async () => {
    const allCompleted = todos.filter(t => t.completed);

    await Promise.allSettled(allCompleted.map(todo => (
      handleDelete(todo.id)
    )));
  };

  const handleChangeComplited = (todo: Todo) => {
    setIsChangingStatus(todo.id);

    updateTodos(todo)
      .then(() => setTodos(prev => (
        prev.map(prevTodo => (
          prevTodo.id === todo.id
            ? todo
            : prevTodo
        ))
      )))
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => setIsChangingStatus(0));
  }

  const handleChangeTitle = (todo: Todo, editedTitle: string) => {
    setIsChanged(todo.id)
    const changedTodo = {...todo, title: editedTitle};

      updateTodos(changedTodo)
      .then((updatedTodo) => setTodos((currentTodos) => currentTodos
        .map(todo => {
          if (todo.id === updatedTodo.id) {
            return updatedTodo;
          }

          return todo;
        }))
        )
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setIsEditing(0);
        setIsChanged(0);
      });
  };

  const toggleAll = async () => {
    const isAllCompleted = todos.every(t => t.completed);

    const todosToUpdate = todos.filter(todo => (isAllCompleted
      ? todo.completed
      : !todo.completed));

    await Promise.all(todosToUpdate.map(todo => (
      handleChangeComplited({
        ...todo,
        completed: !isAllCompleted,
      })
    )));
  };

  const filteredTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        case Filter.All:
        default:
          return true;
      }
    })
  ), [filter, todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onError={setErrorMessage}
          onTodoAdd={handleTodoAdd}
          onToggleAll={toggleAll}
        />


        <TodoRow
              todos={filteredTodos}
              tempTodo={temporaryTodo}
              onTodoDelete={handleDelete}
              onChangeComplited={handleChangeComplited}
              onTodoChange={handleChangeTitle}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isDeleting={isDeleting}
              isChanged={isChanged}
              isChangingStatus={isChangingStatus}
            />

        {todos.length > 0
          && (
            <TodoFooter
              todos={todos}
              filter={filter}
              setFilter={setFilter}
              deleteAllCompleted={deleteAllCompleted}
            />
          )}
      </div>

      <TodoError
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

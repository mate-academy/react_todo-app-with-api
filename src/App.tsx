/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import * as todosService from './api/todos';
import { filterFunction } from './utils/filter';
import { Error } from './components/error';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { TodoList } from './components/todoList';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(TodoStatus.all);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filtredTodos, setFiltredTodos] = useState<Todo[]>([]);
  const [loader, setLoader] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [addingTodo, setAddingTodo] = useState<boolean>(false);
  const [errorid, setErrorid] = useState(0);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // const inputRef = useRef<HTMLInputElement>(null);

  const itemsLeft = todosFromServer.filter(todo => !todo.completed);
  const completedItems = todosFromServer.filter(todo => todo.completed);

  useEffect(() => {
    todosService
      .getTodos()
      .then(todos => setTodosFromServer(todos))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setErrorid(errorid + 1);
      });
  }, [errorid]);

  useEffect(
    () => setFiltredTodos(() => filterFunction(todosFromServer, filterType)),
    [todosFromServer, filterType],
  );

  const handleDelete = (todoId: number) => {
    setLoader([todoId]);
    todosService
      .deleteTodo(todoId)
      .then(() =>
        setTodosFromServer(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => {
        setErrorid(errorid + 1);
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setLoader([]));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage(null);
    event.preventDefault();
    const id = Math.floor(Math.random() * 100000);
    const newTodo = {
      title: title.trim(),
      completed: false,
      id: id,
      userId: USER_ID,
    };

    if (!title.trim()) {
      setErrorid(errorid + 1);
      setErrorMessage('Title should not be empty');

      return;
    }

    setAddingTodo(true);

    return todosService
      .addTodo(newTodo)
      .then(createdTodo => {
        setTodosFromServer(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(error => {
        setErrorid(errorid + 1);
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setAddingTodo(false);
      });
  };

  const onUpdateTodoStatus = (updatedTodo: Todo) => {
    setLoader([updatedTodo.id]);

    return todosService
      .patchTodo({ ...updatedTodo, completed: !updatedTodo.completed })
      .then(todo => {
        setTodosFromServer(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            currentTodo => currentTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, { ...todo });

          return newTodos;
        });
      })
      .catch(error => {
        setErrorid(errorid + 1);
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setLoader([]);
      });
  };

  const updateToCompletedTodos = (todos: Todo[]) => {
    setLoader(todos.map(todo => todo.id));

    todos.map(todo => {
      todosService
        .patchTodo({ ...todo, completed: !todo.completed })
        .then(singleTodo => {
          setTodosFromServer(currentTodos => {
            const newTodos = [...currentTodos];
            const index = newTodos.findIndex(
              currentTodo => currentTodo.id === todo.id,
            );

            newTodos.splice(index, 1, { ...singleTodo });

            return newTodos;
          });
        })
        .finally(() => setLoader([]));
    });
  };

  const onDeleteAllCompleted = (todos: Todo[]) => {
    setLoader(todos.map(todo => todo.id));

    todos.map(todo =>
      todosService
        .deleteTodo(todo.id)
        .then(() =>
          setTodosFromServer(currentTodos =>
            currentTodos.filter(singleTodo => todo.id !== singleTodo.id),
          ),
        )
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
          setErrorid(errorid + 1);
        })
        .finally(() => setLoader([])),
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorid]);

  const handleEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingTodoId === null) {
      return;
    }

    const updatedTodo = todosFromServer.find(todo => todo.id === editingTodoId);

    if (!updatedTodo) {
      return;
    }

    if (editingTitle.trim() === updatedTodo.title) {
      setEditingTodoId(null);

      return;
    }

    if (editingTitle.trim() === '') {
      handleDelete(editingTodoId);

      return;
    }

    setLoader([editingTodoId]);
    todosService
      .patchTodo({
        ...updatedTodo,
        title: editingTitle.trim(),
      })
      .then(todo => {
        setTodosFromServer(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === editingTodoId);

          setEditingTodoId(null);

          newTodos[index] = todo;

          return newTodos;
        });
      })
      .catch(error => {
        setErrorid(errorid + 1);
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setLoader([]);
      });
  };

  const handleEditBlur = () => {
    if (editingTodoId !== null) {
      handleEditSubmit({
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>);
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditingTodoId(null);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosFromServer={todosFromServer}
          itemsLeft={itemsLeft}
          completedItems={completedItems}
          onSubmit={onSubmit}
          title={title}
          setTitle={setTitle}
          addingTodo={addingTodo}
          loader={loader}
          editingTodoId={editingTodoId}
          updateToCompletedTodos={updateToCompletedTodos}
        />

        <TodoList
          filtredTodos={filtredTodos}
          editingTodoId={editingTodoId}
          handleEditSubmit={handleEditSubmit}
          editingTitle={editingTitle}
          handleEditBlur={handleEditBlur}
          handleEdit={handleEdit}
          loader={loader}
          handleEditChange={handleEditChange}
          onUpdateTodoStatus={onUpdateTodoStatus}
          handleDelete={handleDelete}
          title={title}
          addingTodo={addingTodo}
        />

        {todosFromServer.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            filterType={filterType}
            setFilterType={setFilterType}
            completedItems={completedItems}
            onDeleteAllCompleted={onDeleteAllCompleted}
          />
        )}
      </div>
      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};

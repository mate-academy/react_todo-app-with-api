/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deletePost, patchPost, setPost } from './api/todos';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Filter } from './types/filter';
import { Errors } from './components/Errors/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [waitSerser, setWaitSerser] = useState(false);
  const [filtered, setFiltered] = useState(Filter.all);
  const [clickTodo, setClickTodo] = useState<number | null>(null);
  const [changeInput, setChangeInput] = useState('');
  const [loadTodos, setLoadTodos] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(todoses => {
        setTodos(todoses);
      })
      .catch(() => setError('Unable to load todos'));
  }, []);

  if (error) {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const setPosts = (newPost: Omit<Todo, 'id'>) => {
    setWaitSerser(true);
    setTempTodo({ ...newPost, id: 0 });

    setPost(newPost)
      .then(Post => {
        setTodos(prevTodos => [...prevTodos, Post]);
        setError('');
        setInput('');
      })

      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setWaitSerser(false);
        setTempTodo(null);
      });
  };

  const deletePosts = (post: Todo) => {
    setWaitSerser(true);
    setLoadTodos(prevLoadTodos => [...prevLoadTodos, post.id]);
    deletePost(`/todos/${post.id}`)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== post.id));
        setLoadTodos([]);
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setWaitSerser(false));
  };

  const clearCompleted = () => {
    setWaitSerser(true);

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadTodos(completedIds);
    const deletePromeses = completedTodos.map(todo =>
      deletePost(`/todos/${todo.id}`)
        .then(() => todo.id)
        .catch(() => setError('Unable to delete a todo')),
    );

    Promise.all(deletePromeses)
      .then(deletedIds => {
        setTodos(prevTodos =>
          prevTodos.filter(todo => !deletedIds.includes(todo.id)),
        );
        setError('');
        setLoadTodos([]);
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setWaitSerser(false));
  };

  const addActivePosts = (item: Todo) => {
    setWaitSerser(true);
    setLoadTodos(prevLoadTodos => [...prevLoadTodos, item.id]);
    patchPost(`/todos/${item.id}`, { ...item, completed: !item.completed })
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.map(todo => {
            if (todo.id === item.id) {
              return { ...todo, completed: !todo.completed };
            }

            return todo;
          });
        });
        setLoadTodos([]);
        setError('');
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setWaitSerser(false));
  };

  const setToggleAll = () => {
    const AllTodosCompleted = todos.every(todo => todo.completed);

    let updateTodos = null || todos;

    if (!AllTodosCompleted) {
      updateTodos = todos.filter(todo => !todo.completed);
    }

    setLoadTodos(updateTodos.map(todo => todo.id));

    setWaitSerser(true);

    const toggleAllPromises = updateTodos.map(todo => {
      const completed = !AllTodosCompleted;

      return patchPost(`/todos/${todo.id}`, { ...todo, completed }).then(
        () => todo.id,
      );
    });

    Promise.all(toggleAllPromises)
      .then(allIds => {
        const updateTodoses = todos
          .filter(todo => allIds.includes(todo.id))
          .map(todo => ({ ...todo, completed: !AllTodosCompleted }));

        setTodos(prevTodos => {
          return prevTodos.map(todo => {
            const updateTodo = updateTodoses.find(
              updatetodo => updatetodo.id === todo.id,
            );

            return updateTodo ? updateTodo : todo;
          });
        });
        setLoadTodos([]);
      })
      .finally(() => setWaitSerser(false));
  };

  const changeInputs = (item: Todo, keyUp: string) => {
    switch (keyUp) {
      case 'Enter':
      case 'Blur': {
        if (changeInput && item.title !== changeInput) {
          setWaitSerser(true);
          setLoadTodos(prevTodos => [...prevTodos, item.id]);
          patchPost(`/todos/${item.id}`, { ...item, title: changeInput })
            .then(() =>
              setTodos(prevTodos => {
                setLoadTodos([]);

                return prevTodos.map(todo =>
                  item.id === todo.id ? { ...todo, title: changeInput } : todo,
                );
              }),
            )
            .catch(() => setError('Unable to update a todo'))
            .finally(() => {
              setWaitSerser(false);
              setClickTodo(null);
              setError('');
            });
        } else if (!changeInput) {
          deletePosts(item);
        } else {
          setChangeInput(item.title);
          setClickTodo(null);
        }

        break;
      }

      case 'Escape': {
        setChangeInput(item.title);
        setClickTodo(null);
        break;
      }

      default:
        break;
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filtered === Filter.active) {
      return !todo.completed;
    } else if (filtered === Filter.completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          input={input}
          setInput={setInput}
          setError={setError}
          setPosts={setPosts}
          todos={todos}
          inputDisabled={waitSerser}
          setToggleAll={setToggleAll}
        />
        <Main
          todos={filteredTodos}
          loader={waitSerser}
          tempTodo={tempTodo}
          deletePosts={deletePosts}
          addActivePosts={addActivePosts}
          loadTodos={loadTodos}
          changeInputs={changeInputs}
          clickTodo={clickTodo}
          setChangeInput={setChangeInput}
          changeInput={changeInput}
          setClickTodo={setClickTodo}
        />
        {!!todos.length && (
          <Footer
            todos={todos}
            filtered={filtered}
            setFiltered={setFiltered}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <Errors error={error} setError={setError} />
    </div>
  );
};

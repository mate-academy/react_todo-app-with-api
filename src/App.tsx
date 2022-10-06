// проблема с установкой всех классов в актив и при инпуте идет перечеркивание а этого быть не должно
// у меня инпут не пропадает и его стили не исчезают то есть инпут вместо спана отображается
// вопрос по тайпскрипту, знаю если поставить 0 то все ок но может там null ставить по логике и тогда ошибки
// также в стилях пришлось important использовать

// моя проблема с получением данных после перезагрузки в том что я в зене переписывал свои туду а не локально поэтому изменения сразу не были видны
// также я передавал в патч значения что не менял

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';

import {
  getTodos,
  postTodo,
  removeTodo,
  changeTodoStatus,
  changeTodoTitle,
} from './api/todos';

import { Todo } from './types/Todo';
import { User } from './types/User';

import { FilterTypes } from './types/FilterTypes';
import { ErrorMessage } from './types/ErrorMessage';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [filterType, setFilterType] = useState<string>(FilterTypes.All);

  const [error, setError] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [title, setTitle] = useState('');

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const [isAdding, setIsAdding] = useState(false);

  const [completedTodos, setCompletedTodos] = useState<number[]>([]);

  // новые изменения ниже
  // попробую вообще через наличие айди открывать форму а не тру фолз
  // const [doubleClick, setDoubleClick] = useState(false);
  // нужен новый стейт для новой формы?

  // этот для инпута что после 2го клика появляется
  const [changeTitle, setChangeTitle] = useState('');

  // этот чтобы выбрать только ту тудушку на которой 2 раза кликнул
  const [doubleClickTodoId, setDoubleClickTodoId]
    = useState<number | null>(null);

  // сохраняет статус выполнения тудушки
  // но оно мне в принципе не нужно и можно цеплятся сразу за completed что в мепе
  // const [todoStatus, setTodoStatus] = useState(false);

  // айди тудушки на которую кликнул в чекбокс где галочка
  // const [todoStatusId, setTodoStatusId] = useState<number | null>(null);

  const user = useContext<User | null>(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  // функция для смены статуса в апи и на экране на галочку
  const changeStatusTodo = (todoId: number, status: boolean) => {
    setSelectedTodoId(todoId);
    // console.log(status, !status);
    changeTodoStatus(todoId, !status)
      .then(() => {
        setSelectedTodoId(null);
        setTodos(prevTodos => (
          // проблема была в том что я обновлял данные на сервере но не обновлял у себя поэтому и кллассы что к выполненым тудушкам были привязаны, не работали
          prevTodos.map(todo => {
            if (todo.id === todoId) {
              // тут обновление статуса
              return { ...todo, completed: !status };
            }

            return todo;
          })
        ));
      })
      .catch(() => {
        setError(true);
        setErrorMessage(ErrorMessage.RewriteFail);
      }).finally(() => {
        setSelectedTodoId(null);
      });
  };

  // функция двойного клика по тудушке
  const isClicked = (todoId: number | null, titleTodo: string) => {
    // setDoubleClick(boolean);
    // тут из замыкания в мепе я получаю тайтл для стейта что контролит инпут тудушки
    setChangeTitle(titleTodo);
    setDoubleClickTodoId(todoId);
    // setSelectedTodoId(todoId);
  };

  // функция для смены тайтла
  const changeTitleTodo = (
    todoId: number,
    todoTitle: string,
    event: React.FocusEvent<HTMLInputElement> | null,
  ) => {
    const todoOnChange = todos.find(todo => todo.id === todoId);

    if (event?.target) {
      setDoubleClickTodoId(null);
    }

    // todoTitle меняется при инпуте
    if (todoOnChange?.title === todoTitle) {
      return;
    }

    // это убирает мой инпут и пользователь видет спан с текстом
    setDoubleClickTodoId(null);

    setSelectedTodoId(todoId);

    changeTodoTitle(todoId, todoTitle)
      .then(() => {
        setTodos(prevTodos => (
          // проблема была в том что я обновлял данные на сервере но не обновлял у себя поэтому и кллассы что к выполненым тудушкам были привязаны, не работали
          prevTodos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, title: todoTitle };
            }

            return todo;
          })
        ));
      })
      .catch(() => {
        setError(true);
        setErrorMessage(ErrorMessage.RewriteFail);
      })
      .finally(() => {
        setSelectedTodoId(null);
        setDoubleClickTodoId(null);
      });
  };

  // сместо нее стоит changeTitleTodo и он же на событии нажатии кнопок
  // const onBlurSetTitleTodo = () => {

  // };

  const onKeyDownTitleTodo = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todoId: number,
    todoTitle: string,
  ) => {
    // console.log(event.key);

    if (event.key === 'Escape') {
      // console.log('exit');

      // мне не нужен 2й параметр но тайпскрипту нужен, если я что то поставлю по умолчанию то могу все сломать
      // или ничего не будет так как ввести я ничего не смогу так как нал все закроет
      // можно тут 0 оставить или null ставить
      isClicked(null, todoTitle);
    }

    if (event.key === 'Enter') {
      // console.log('save data');
      // чтобы фокус инпута убрать
      setDoubleClickTodoId(null);
      changeTitleTodo(todoId, todoTitle, null);
    }
  };

  // ставит на все тру, уже неплохо, но обратно на фолз все не ставит
  // но оно ставит классы по очереди а е сразу на все и одновременно
  const changeStatusAll = async () => {
    // если хоть один элемент есть фолз то some вернет тру
    const allStatus = todos.some(todo => todo.completed === false);
    const todosIds = todos
      .filter(t => t.completed !== allStatus)
      .map(todo => todo.id);
    // .filter(todo => !todo.completed)
    // console.log(todosIds);

    // console.log(allStatus);

    setCompletedTodos(todosIds);

    try {
      await Promise.all(todosIds.map(async (todoId) => {
        // тут я делаю колбек мапа асинхронным async и этот меп ждет пока
        // removeTodo(todoId) не выполнется
        // await setSelectedTodoId(todoId);

        await changeTodoStatus(todoId, allStatus);

        setTodos(prevTodos => (
          prevTodos.map(todo => {
            if (todo.id === todoId) {
              // тут обновление статуса
              return {
                ...todo,
                completed: allStatus,
              };
            }

            return todo;
          })
        ));
        setCompletedTodos([]);
      }));
    } catch {
      setError(true);
      setErrorMessage(ErrorMessage.RewriteFail);
    }
  };

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterTypes.All:
        return todo;

      case FilterTypes.Active:
        return !todo.completed && FilterTypes.Active;

      case FilterTypes.Completed:
        return todo.completed && FilterTypes.Completed;

      default:
        return null;
    }
  });

  useEffect(() => {
    getTodos(user?.id || 0).then(response => {
      setTodos(response);
    }).catch(() => {
      setErrorMessage(ErrorMessage.LoadFail);
      setError(true);
    });
  }, [errorMessage]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleFilterType = (type: string) => {
    setFilterType(type);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.TitleEmpty);
      setTitle('');
      setError(true);

      return;
    }

    setIsAdding(true);

    const copyTodos = [...todos];

    setTodos(prev => {
      return [...prev, {
        id: 0,
        userId: user?.id || 0,
        completed: false,
        title,
      }];
    });

    setSelectedTodoId(0);

    postTodo(user?.id || 0, title)
      .then(newTodo => {
        setIsAdding(false);
        setTodos([...copyTodos, newTodo]);
      })
      .catch(() => {
        setError(true);
        setIsAdding(false);
        setErrorMessage(ErrorMessage.AddFail);

        setTodos((prev) => {
          return prev.filter(oneTodo => {
            return oneTodo.id !== 0;
          });
        });
      });

    setSelectedTodoId(0);

    setTitle('');
  };

  const removeError = (boolean: boolean) => {
    setError(boolean);
  };

  const deleteTodo = (todoId: number) => {
    setSelectedTodoId(todoId);

    removeTodo(todoId)
      .then(() => {
        setSelectedTodoId(todoId);
        // возможно это не нужно если файнели
        setErrorMessage(null);
        setTodos(prevTodos => prevTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(true);
        setErrorMessage(ErrorMessage.DeleteFail);
      })
      .finally(() => {
        setSelectedTodoId(null);
      });
  };

  const clearTable = async () => {
    const filterTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setCompletedTodos(filterTodos);

    try {
      await Promise.all(filterTodos.map(async (todoId) => {
        // тут я делаю колбек мапа асинхронным async и этот меп ждет пока
        // removeTodo(todoId) не выполнется
        await removeTodo(todoId);

        // это же работает мгновенно
        setTodos(prevTodos => prevTodos
          .filter(todo => {
            return todo.id !== todoId;
          }));
      }));
    } catch {
      setError(true);
      setErrorMessage(ErrorMessage.DeleteFail);
      // если есть файнели то это может и не нужно
      setCompletedTodos([]);
    } finally {
      setCompletedTodos([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          handleSubmit={handleSubmit}
          newTodoField={newTodoField}
          setTitle={setTitle}
          isAdding={isAdding}
          title={title}
          changeStatusAll={changeStatusAll}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          deleteTodo={deleteTodo}
          selectedTodoId={selectedTodoId}
          completedTodos={completedTodos}
          isClicked={isClicked}
          doubleClickTodoId={doubleClickTodoId}
          changeTitle={changeTitle}
          setChangeTitle={setChangeTitle}
          changeStatusTodo={changeStatusTodo}
          changeTitleTodo={changeTitleTodo}
          onKeyDownTitleTodo={onKeyDownTitleTodo}
        />
        <Footer
          clearTable={clearTable}
          handleFilterType={handleFilterType}
          filterType={filterType}
          filteredTodos={filteredTodos}
        />

      </div>

      <ErrorNotification
        error={error}
        removeError={removeError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
// // баг с тайтлом, он записывается на сервер но после перезапуска но при этом на экране изменения видны либо то консоль лог меня путает
// // если ничего не ввел в инпут и просто убрал фокус с тудушки в которой что то есть то будет пустота, это баг?
// // и стили обратно на верстку без формы не переключаются

// // для тогла что все ставит в выполненые или нет используй переменные из мепа или массив что стоит на кнопку клеар
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useContext,
// } from 'react';

// import { AuthContext } from './components/Auth/AuthContext';

// import {
//   getTodos,
//   postTodo,
//   removeTodo,
//   changeTodoStatus,
//   changeTodoTitle,
// } from './api/todos';

// import { Todo } from './types/Todo';
// import { User } from './types/User';

// import { FilterTypes } from './types/FilterTypes';
// import { ErrorMessage } from './types/ErrorMessage';

// import { Header } from './components/Header/Header';
// import { TodoList } from './components/TodoList/TodoList';
// import { Footer } from './components/Footer/Footer';
// import { ErrorNotification } from
//   './components/ErrorNotification/ErrorNotification';

// export const App: React.FC = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);

//   const [filterType, setFilterType] = useState<string>(FilterTypes.All);

//   const [error, setError] = useState(false);

//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const [title, setTitle] = useState('');

//   const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

//   const [isAdding, setIsAdding] = useState(false);

//   const [completedTodos, setCompletedTodos] = useState<number[]>([]);

//   // новые изменения ниже
//   // попробую вообще через наличие айди открывать форму а не тру фолз
//   // const [doubleClick, setDoubleClick] = useState(false);
//   // нужен новый стейт для новой формы?

//   // этот для инпута что после 2го клика появляется
//   const [changeTitle, setChangeTitle] = useState('');

//   // этот чтобы выбрать только ту тудушку на которой 2 раза кликнул
//   const [doubleClickTodoId, setDoubleClickTodoId]
//     = useState<number | null>(null);

//   // сохраняет статус выполнения тудушки
//   // но оно мне в принципе не нужно и можно цеплятся сразу за completed что в мепе
//   const [todoStatus, setTodoStatus] = useState(false);

//   // айди тудушки на которую кликнул в чекбокс где галочка
//   const [todoStatusId, setTodoStatusId] = useState<number | null>(null);

//   const user = useContext<User | null>(AuthContext);
//   const newTodoField = useRef<HTMLInputElement>(null);

//   // console.log(changeTitle);
//   // console.log(doubleClickTodoId);
//   // функция для смены статуса в апи и на экране на галочку
//   const changeStatusTodo = (todoId: number, status: boolean) => {
//     setSelectedTodoId(todoId);
//     // console.log(status, !status);
//     changeTodoStatus(todoId, !status)
//       .then(() => {
//         // походу мне не нужно добавлять в стейт ничего оно и так перезаписывает
//         // setTodos(response);
//         // console.log(response);
//         // setTodoStatusId(todoId);
//         setSelectedTodoId(null);
//         setTodos(prevTodos => (
//           // проблема была в том что я обновлял данные на сервере но не обновлял у себя поэтому и кллассы что к выполненым тудушкам были привязаны, не работали
//           prevTodos.map(todo => {
//             if (todo.id === todoId) {
//               // тут обновление статуса
//               return { ...todo, completed: !status };
//             }

//             return todo;
//           })
//         ));
//       })
//       .catch(() => {
//         setError(true);
//         setErrorMessage('как же я устал от этого');
//       }).finally(() => {
//         setSelectedTodoId(null);
//       });
//   };

//   // функция двойного клика по тудушке
//   const isClicked = (todoId: number, titleTodo: string) => {
//     // setDoubleClick(boolean);
//     // тут из замыкания в мепе я получаю тайтл для стейта что контролит инпут тудушки
//     setChangeTitle(titleTodo);
//     setDoubleClickTodoId(todoId);
//     // setSelectedTodoId(todoId);
//   };

//   // функция для смены тайтла
//   // она работает но после перезагрузки а на 1й раз нет записи, записывается пустота которую можно только в консоле отследить
//   const changeTitleTodo = (todoId: number, todoTitle: string) => {
//     // мне нужен стейт чтобы выбирать конкретную тудушку в условии что в тудулист
//     console.log(todoId, todoTitle);
//     setSelectedTodoId(todoId);
//     console.log(doubleClickTodoId);
//     changeTodoTitle(todoId, todoTitle)
//       .then((response) => {
//         setSelectedTodoId(null);
//         console.log(response);
//         setTodos(prevTodos => (
//           // проблема была в том что я обновлял данные на сервере но не обновлял у себя поэтому и кллассы что к выполненым тудушкам были привязаны, не работали
//           prevTodos.map(todo => {
//             if (todo.id === todoId) {
//               // тут обновление статуса
//               return { ...todo, title };
//             }

//             return todo;
//           })
//         ));
//       })
//       .catch(() => {
//         setError(true);
//         setErrorMessage('Когда это уже закончится');
//       })
//       .finally(() => {
//         setSelectedTodoId(null);
//         // без setDoubleClickTodoId(null); работает запись нового тайтла
//         // и сейчас она работает но через перезапись и с багами
//         setDoubleClickTodoId(null);
//       });
//   };

//   // const onBlurSetTitleTodo = () => {

//   // };

//   // const onKeyDownSetTitleTodo = () => {

//   // };

//   console.log(todos);

//   if (error) {
//     setTimeout(() => {
//       setError(false);
//     }, 3000);
//   }

//   const filteredTodos = todos.filter(todo => {
//     switch (filterType) {
//       case FilterTypes.All:
//         return todo;

//       case FilterTypes.Active:
//         return !todo.completed && FilterTypes.Active;

//       case FilterTypes.Completed:
//         return todo.completed && FilterTypes.Completed;

//       default:
//         return null;
//     }
//   });

//   useEffect(() => {
//     getTodos(user?.id || 0).then(response => {
//       setTodos(response);
//     }).catch(() => {
//       setErrorMessage(ErrorMessage.LoadFail);
//       setError(true);
//     });
//   }, [errorMessage]);

//   useEffect(() => {
//     if (newTodoField.current) {
//       newTodoField.current.focus();
//     }
//   }, [isAdding]);

//   const handleFilterType = (type: string) => {
//     setFilterType(type);
//   };

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!title.trim()) {
//       setErrorMessage(ErrorMessage.TitleEmpty);
//       setTitle('');
//       setError(true);

//       return;
//     }

//     setIsAdding(true);

//     const copyTodos = [...todos];

//     setTodos(prev => {
//       return [...prev, {
//         id: 0,
//         userId: user?.id || 0,
//         completed: false,
//         title,
//       }];
//     });

//     setSelectedTodoId(0);

//     postTodo(user?.id || 0, title)
//       .then(newTodo => {
//         setIsAdding(false);
//         setTodos([...copyTodos, newTodo]);
//       })
//       .catch(() => {
//         setError(true);
//         setIsAdding(false);
//         setErrorMessage(ErrorMessage.AddFail);

//         setTodos((prev) => {
//           return prev.filter(oneTodo => {
//             return oneTodo.id !== 0;
//           });
//         });
//       });

//     setSelectedTodoId(0);

//     setTitle('');
//   };

//   const removeError = (boolean: boolean) => {
//     setError(boolean);
//   };

//   const deleteTodo = (todoId: number) => {
//     setSelectedTodoId(todoId);

//     removeTodo(todoId)
//       .then(() => {
//         setSelectedTodoId(todoId);
//         setErrorMessage(null);
//         setTodos(prevTodos => prevTodos
//           .filter(todo => todo.id !== todoId));
//       })
//       .catch(() => {
//         setError(true);
//         setErrorMessage(ErrorMessage.DeleteFail);
//       })
//       .finally(() => {
//         setSelectedTodoId(null);
//       });
//   };

//   const clearTable = async () => {
//     const filterTodos = todos
//       .filter(todo => todo.completed)
//       .map(todo => todo.id);

//     setCompletedTodos(filterTodos);

//     try {
//       await Promise.all(filterTodos.map(async (todoId) => {
//         // тут я делаю колбек мапа асинхронным async и этот меп ждет пока
//         // removeTodo(todoId) не выполнется
//         await removeTodo(todoId);

//         // это же работает мгновенно
//         setTodos(prevTodos => prevTodos
//           .filter(todo => {
//             return todo.id !== todoId;
//           }));
//       }));
//     } catch {
//       setError(true);
//       setErrorMessage(ErrorMessage.DeleteFail);
//       setCompletedTodos([]);
//     }
//   };

//   return (
//     <div className="todoapp">
//       <h1 className="todoapp__title">todos</h1>

//       <div className="todoapp__content">

//         <Header
//           handleSubmit={handleSubmit}
//           newTodoField={newTodoField}
//           setTitle={setTitle}
//           isAdding={isAdding}
//           title={title}
//         />

//         <TodoList
//           filteredTodos={filteredTodos}
//           deleteTodo={deleteTodo}
//           selectedTodoId={selectedTodoId}
//           completedTodos={completedTodos}
//           isClicked={isClicked}
//           // doubleClick={doubleClick}
//           doubleClickTodoId={doubleClickTodoId}
//           changeTitle={changeTitle}
//           setChangeTitle={setChangeTitle}
//           changeStatusTodo={changeStatusTodo}
//           todoStatus={todoStatus}
//           todoStatusId={todoStatusId}
//           changeTitleTodo={changeTitleTodo}
//         />
//         <Footer
//           clearTable={clearTable}
//           handleFilterType={handleFilterType}
//           filterType={filterType}
//           filteredTodos={filteredTodos}
//         />

//       </div>

//       <ErrorNotification
//         error={error}
//         removeError={removeError}
//         errorMessage={errorMessage}
//       />
//     </div>
//   );
// };

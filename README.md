<h1>react todo app with api</h1>

<h2>Demo link:</h2>
<p>https://frontend112.github.io/react_todo-app-with-api/</p>

<h3>Functionality:</h3>
<ul>
  <li>
    create todo
  </li>
  <li>
    modify todo
  </li>
  <li>
    delete todo
  </li>
  <li>
    mark as completed
  </li>
  <li>
    remove only completed with clear completed button
  </li>
  <li>
    toggle all (small button inside input on left side) 
  </li>
  <li>
    filter for all / active / completed
  </li>
</ul>

<h3>Description:</h3>
<ul>
  <li>props destructured</li>
  <li>functions are descriptive and make only what is necessary</li>
  <li>if variables makes expensive calculations are overlapped with useMemo (functions => useCallback)</li>
  <li>when at some point trouble with requesting data (no internet) => show appropriate error</li>
  <li>active links selected with isActive class</li>
  <li>if user try to modify / delete todo - mark this todo and show loading spinner from bulma</li>
  <li>every time when user try to add new todo - save this in temptodo, send post request, if it was successful - remove temptodo and show data without spinner</li>
</ul>


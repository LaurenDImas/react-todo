import { useEffect, useMemo, useState } from 'react';
import './App.css'
import { useTodoStore } from './stores/useTodoStore';

function useDebounce(val, delay = 300) {
  const [deb, setDeb] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setDeb(val), delay)
    return () => clearTimeout(t)
  }, [val, delay])

  return deb;
}

const App = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, filter, setFilter, setSearch, search } = useTodoStore();
  const [text, setText] = useState(search)
  const [q, setQ] = useState("")
  const debouncedQ = useDebounce(q, 300)

  useEffect(() => {
    setSearch(debouncedQ || "");
  }, [debouncedQ, setSearch])

  const filtered = useMemo(() => {
    let list = todos;
    if (filter == "active") list = list.filter(t => !t.completed)
    if (filter == "completed") list = list.filter(t => t.completed)
    if (debouncedQ) list = list.filter(t => t.text.toLowecase().includes(debouncedQ))
    return list
  }, [todos, filter, debouncedQ])

  const handleAdd = (e) => {
    e.preventDefault()
    addTodo(text)
    setText("")
  }

  const activeCount = todos.filter(t => !t.completed).length;
  return (
    <div className='min-h-full bg-gray-50'>
      <div className="max-w-xl mx-auto p-6">
        <h1 className='text-3xl font-bold mb-6'>Tasky ✅</h1>
        <form onSubmit={handleAdd} className='flex gap-3 mb-4'>
          <input
            type="text"
            className='flex-1 rounded-xl border px-4 py-2'
            placeholder='Add a new task...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className='text-white rounded-xl bg-blue-600 text-whitep px-4 py-2 hover:bg-blue-700'
          >Add</button>
        </form>

        <div className='flex flex-wrap items-center gap-2 mb-4'>
          <input
            type="text"
            className='flex-1 rounded-xl border px-4 py-3'
            placeholder='Search tasks…'
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="flex items-center gap-1">
            {["all", "active", "completed"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg border ${filter === f ? "bg-gray-900 text-white" : "bg-white"}`}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={clearCompleted}
            className="px-3 py-2 rounded-lg border">Clear completed</button>
        </div>

        <ul className="space-y-2">
          {
            filtered.map(t => (
              <li
                key={t.id}
                className='flex items-center gap-3 bg-white border rounded-xl p-3'
              >
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTodo(t.id)} />
                <span className={`flex-1 ${t.completed ? "line-through text-gray-400" : ""}`}>{t.text}</span>
                <button
                  onClick={() => deleteTodo(t.id)}
                  className='text-red-600 hover:underline'
                >Delete</button>
              </li>
            ))
          }
          {
            filtered.length === 0 && (
              <li className="text-gray-500 text-sm text-center">No tasks found.</li>
            )
          }
        </ul>

        <div className="mt-4 text-sm text-gray-600">{activeCount} task(s) left</div>
      </div>
    </div>
  );
}

export default App
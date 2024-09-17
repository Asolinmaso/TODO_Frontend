"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTodos(currentPage);
  }, [currentPage]);

  const fetchTodos = async (page) => {
    const response = await axios.get(`http://localhost:5000/api/todos?page=${page}`);
    setTodos(response.data.todos);
    setTotalPages(response.data.totalPages);
  };

  const createTodo = async () => {
    await axios.post("http://localhost:5000/api/todos", newTodo);
    setNewTodo({ title: "", description: "" });
    fetchTodos(currentPage);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    fetchTodos(currentPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Todo List
        </h1>
        {/* Input form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Add New Todo</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              className="p-3 flex-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            />
            <input
              className="p-3 flex-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              type="text"
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
            />
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              onClick={createTodo}
            >
              Add Todo
            </button>
          </div>
        </div>

        {/* Todo list */}
        <ul className="grid gap-6 md:grid-cols-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="p-6 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {todo.title}
              </h2>
              <p className="text-gray-600 mb-4">{todo.description}</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

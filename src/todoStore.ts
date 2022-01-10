import create from "zustand";
import { persist } from 'zustand/middleware'

import { v4 as uuidv4 } from "uuid";

import { Todo } from "./model/Todo";

interface TodoState {
  todos: Todo[];
  addTodo: (title:string, description: string) => void;
  saveChangeTodo : (id: string,title:string, description: string) => void;
  removeTodo: (id: string) => void;
  toggleCompletedState: (id: string) => void;
}
export const useStore = create<TodoState>(
  persist(
    (set) => ({
      todos: [],
      addTodo: (title:string, description: string) => {
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: uuidv4(),
              title:title,
              description:description,
              completed: false,
            } as Todo,
          ],
        }));
      },
      saveChangeTodo : (id: string,title:string, description: string) => {
        set((state) => ({
          todos: [
            ...state.todos.filter((todo) => todo.id !== id),
            {
              id: id,
              title:title,
              description:description,
              completed: false,
            } as Todo,
          ],
        }));
      },
      removeTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      toggleCompletedState: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? ({ ...todo, completed: !todo.completed } as Todo)
              : todo
          ),
        }));
      },
    }),    
    {
      name: 'todos',
      getStorage: () => localStorage
    }
  )
)
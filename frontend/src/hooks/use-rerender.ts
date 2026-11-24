import { useReducer } from 'react'

/** The use rerender return type */
type UseRerenderReturn = () => void

export const useRerender = (): UseRerenderReturn => useReducer(() => ({}), {})[1]

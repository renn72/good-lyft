'use client'

import { Provider } from 'jotai'

// @ts-ignore
export const Providers = ({ children }) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

import '@testing-library/jest-dom'
import { afterEach, afterAll, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './server'
import client from '../api/client'

// در محیط تست، URL مطلق بده تا MSW handler ها match کنن
client.defaults.baseURL = 'http://localhost'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => { cleanup(); server.resetHandlers() })
afterAll(() => server.close())

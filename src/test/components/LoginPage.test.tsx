import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../hooks/useAuth'
import LoginPage from '../../pages/auth/LoginPage'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider><MemoryRouter>{children}</MemoryRouter></AuthProvider>
}

describe('LoginPage', () => {
  it('shows phone input by default', () => {
    render(<LoginPage />, { wrapper: Wrapper })
    expect(screen.getByPlaceholderText('09xxxxxxxxx')).toBeInTheDocument()
  })

  it('send OTP button disabled when phone is empty', () => {
    render(<LoginPage />, { wrapper: Wrapper })
    expect(screen.getByText('دریافت کد')).toBeDisabled()
  })

  it('send OTP button enabled after phone entry', () => {
    render(<LoginPage />, { wrapper: Wrapper })
    fireEvent.change(screen.getByPlaceholderText('09xxxxxxxxx'), { target: { value: '09000000000' } })
    expect(screen.getByText('دریافت کد')).not.toBeDisabled()
  })

  it('moves to OTP step after clicking send', async () => {
    render(<LoginPage />, { wrapper: Wrapper })
    fireEvent.change(screen.getByPlaceholderText('09xxxxxxxxx'), { target: { value: '09000000000' } })
    fireEvent.click(screen.getByText('دریافت کد'))
    await waitFor(() => expect(screen.getByPlaceholderText('000000')).toBeInTheDocument())
  })

  it('shows phone number in OTP step', async () => {
    render(<LoginPage />, { wrapper: Wrapper })
    fireEvent.change(screen.getByPlaceholderText('09xxxxxxxxx'), { target: { value: '09000000000' } })
    fireEvent.click(screen.getByText('دریافت کد'))
    await waitFor(() => expect(screen.getByText(/09000000000/)).toBeInTheDocument())
  })

  it('OTP verify button disabled when code is too short', async () => {
    render(<LoginPage />, { wrapper: Wrapper })
    fireEvent.change(screen.getByPlaceholderText('09xxxxxxxxx'), { target: { value: '09000000000' } })
    fireEvent.click(screen.getByText('دریافت کد'))
    await waitFor(() => screen.getByPlaceholderText('000000'))
    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '12' } })
    expect(screen.getByText('ورود')).toBeDisabled()
  })

  it('back button returns to phone step', async () => {
    render(<LoginPage />, { wrapper: Wrapper })
    fireEvent.change(screen.getByPlaceholderText('09xxxxxxxxx'), { target: { value: '09000000000' } })
    fireEvent.click(screen.getByText('دریافت کد'))
    await waitFor(() => screen.getByText('ویرایش شماره'))
    fireEvent.click(screen.getByText('ویرایش شماره'))
    expect(screen.getByPlaceholderText('09xxxxxxxxx')).toBeInTheDocument()
  })
})

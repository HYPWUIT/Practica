import { afterAll, describe, expect, test } from 'bun:test'
import { prisma } from '../src/lib/prisma'
import { startTestServer } from './server'

const { api, url } = startTestServer()

const email = `auth-test-${Date.now()}@example.com`
const password = 'Robin12345'

afterAll(async () => {
  // Sessions and accounts go with the user (onDelete: Cascade).
  await prisma.user.deleteMany({ where: { email } })
})

/** The `name=value` part of the session cookie, for sending it back. */
function sessionCookie(response: Response): string {
  const cookie = response.headers
    .getSetCookie()
    .find((c) => c.includes('session_token='))
  expect(cookie).toBeDefined()
  return cookie!.split(';')[0]!
}

function signUp(body: object) {
  return api('/auth/sign-up/email', { method: 'POST', body: JSON.stringify(body) })
}

function signIn(body: object) {
  return api('/auth/sign-in/email', { method: 'POST', body: JSON.stringify(body) })
}

describe('email and password auth', () => {
  let cookie = ''

  test('sign-up rejects a password the form would refuse', async () => {
    const response = await signUp({ name: 'Test', email, password: 'alllowercase1' })
    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({
      message: 'Include at least one uppercase letter',
    })
    expect(await prisma.user.count({ where: { email } })).toBe(0)
  })

  test('sign-up creates the user and a session', async () => {
    const response = await signUp({ name: 'Test', email, password })
    expect(response.status).toBe(200)
    cookie = sessionCookie(response)
  })

  test('the password is stored hashed', async () => {
    const account = await prisma.account.findFirst({
      where: { user: { email }, providerId: 'credential' },
    })
    expect(account?.password).toBeTruthy()
    expect(account?.password).not.toContain(password)
  })

  test('a second sign-up with the same email is refused', async () => {
    const response = await signUp({ name: 'Test', email, password })
    expect(response.status).toBe(422)
  })

  test('/api/me returns the user with the cookie, 401 without', async () => {
    const me = await api('/me', { headers: { cookie } })
    expect(me.status).toBe(200)
    expect(await me.json()).toMatchObject({ email, name: 'Test' })

    const anonymous = await api('/me')
    expect(anonymous.status).toBe(401)
    expect(await anonymous.json()).toEqual({ error: 'Sign in required' })
  })

  test('sign-out ends the session', async () => {
    const response = await api('/auth/sign-out', {
      method: 'POST',
      headers: { cookie },
      body: '{}',
    })
    expect(response.status).toBe(200)
    expect((await api('/me', { headers: { cookie } })).status).toBe(401)
  })

  test('sign-in: wrong password 401, right password a new session', async () => {
    expect((await signIn({ email, password: 'Wrong12345' })).status).toBe(401)

    const response = await signIn({ email, password })
    expect(response.status).toBe(200)
    const me = await api('/me', { headers: { cookie: sessionCookie(response) } })
    expect(me.status).toBe(200)
  })

  test('requests from an untrusted origin are refused', async () => {
    const response = await fetch(url('/api/auth/sign-in/email'), {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://evil.example' },
      body: JSON.stringify({ email, password }),
    })
    expect(response.status).toBe(403)
  })
})

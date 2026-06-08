/**
 * Cliente liviano de GitHub para obtener datos públicos del usuario y sus repos.
 * Maneja fallos devolviendo datos mínimos para no romper la UI.
 */

import type { GitHubRepo, GitHubUser } from '../types/github'

/** Obtiene el perfil público de un usuario */
export async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) throw new Error(`GitHub ${res.status}`)
    const data = (await res.json()) as GitHubUser
    return data
  } catch (e) {
    // Fallback no bloqueante
    return {
      login: username,
      name: username,
      avatar_url: undefined,
      html_url: `https://github.com/${username}`,
    }
  }
}

/** Lista repositorios del usuario ordenados por actualización */
export async function fetchUserRepos(username: string, perPage = 6): Promise<GitHubRepo[]> {
  const url = `https://api.github.com/users/${encodeURIComponent(
    username,
  )}/repos?per_page=${perPage}&sort=updated`
  try {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) throw new Error(`GitHub ${res.status}`)
    const data = (await res.json()) as GitHubRepo[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/**
 * Tipos mínimos de GitHub usados por la app.
 */

/** Usuario de GitHub (simplificado) */
export interface GitHubUser {
  login: string
  name?: string
  avatar_url?: string
  html_url: string
  bio?: string
  location?: string
  blog?: string
  public_repos?: number
  followers?: number
  following?: number
}

/** Repositorio de GitHub (simplificado) */
export interface GitHubRepo {
  id: number
  name: string
  html_url: string
  description?: string
  language?: string
  stargazers_count: number
  forks_count: number
  updated_at: string
}

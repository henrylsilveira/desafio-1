import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()
export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query
            const tasks = database.select('tasks', {
                title: search,
                description: search
            })
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const { title, description } = req.body
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            database.insert('tasks', task)
            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const { title, description } = req.body
            const result = database.update('tasks', id, { title, description, updated_at: new Date().toISOString() })
            if (result === 'Id not found') {
                return res.writeHead(400).end(JSON.stringify({ error: 'Id not found' }))
            } else {
                return res.writeHead(204).end()
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const result = database.completedTask('tasks', id)
            if (result === 'Id not found') {
                return res.writeHead(400).end(JSON.stringify({ error: 'Id not found' }))
            } else {
                return res.writeHead(204).end()
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const result = database.delete('tasks', id)
            if (result === 'Id not found') {
                return res.writeHead(400).end(JSON.stringify({ error: 'Id not found' }))
            } else {
                return res.writeHead(204).end()
            }
        }
    }
]
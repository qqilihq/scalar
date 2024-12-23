import { describe, expect, it } from 'vitest'

import { workThroughQueue } from './workThroughQueue'

describe('workThroughQueue', () => {
  it('loads a specification', async () => {
    const result = workThroughQueue({
      input: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      specification: {
        openapi: '3.1.1',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      tasks: [
        {
          name: 'load',
        },
      ],
    })

    expect(await result).toStrictEqual({
      errors: [],
      specification: {
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        openapi: '3.1.0',
        paths: {},
      },
      filesystem: [
        {
          dir: './',
          filename: null,
          isEntrypoint: true,
          references: [],
          specification: {
            info: {
              title: 'Hello World',
              version: '1.0.0',
            },
            openapi: '3.1.0',
            paths: {},
          },
        },
      ],
    })
  })

  it('validates a specification', async () => {
    const result = workThroughQueue({
      input: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      specification: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      tasks: [
        {
          name: 'load',
        },
        {
          name: 'validate',
        },
      ],
    })

    expect(await result).toStrictEqual({
      errors: [],
      valid: true,
      version: '3.1',
      filesystem: [
        {
          dir: './',
          filename: null,
          isEntrypoint: true,
          references: [],
          specification: {
            info: {
              title: 'Hello World',
              version: '1.0.0',
            },
            openapi: '3.1.0',
            paths: {},
          },
        },
      ],
      specification: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      schema: {
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        openapi: '3.1.0',
        paths: {},
      },
    })
  })

  it('dereferences a specification', async () => {
    const result = workThroughQueue({
      input: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      specification: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      tasks: [
        {
          name: 'load',
        },
        {
          name: 'dereference',
        },
      ],
    })

    expect(await result).toStrictEqual({
      errors: [],
      specificationType: 'openapi',
      specificationVersion: '3.1.0',
      version: '3.1',
      filesystem: [
        {
          dir: './',
          filename: null,
          isEntrypoint: true,
          references: [],
          specification: {
            info: {
              title: 'Hello World',
              version: '1.0.0',
            },
            openapi: '3.1.0',
            paths: {},
          },
        },
      ],
      specification: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      schema: {
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        openapi: '3.1.0',
        paths: {},
      },
    })
  })

  it('upgrades a specification', async () => {
    const result = workThroughQueue({
      input: {
        openapi: '3.0.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      specification: {
        openapi: '3.0.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      tasks: [
        {
          name: 'load',
        },
        {
          name: 'upgrade',
        },
      ],
    })

    expect(await result).toStrictEqual({
      errors: [],
      version: '3.1',
      specification: {
        openapi: '3.1.1',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      filesystem: [
        {
          dir: './',
          filename: null,
          isEntrypoint: true,
          references: [],
          specification: {
            info: {
              title: 'Hello World',
              version: '1.0.0',
            },
            openapi: '3.1.1',
            paths: {},
          },
        },
      ],
    })
  })

  it('filters a specification', async () => {
    const result = await workThroughQueue({
      input: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {
          '/public': {
            get: {
              responses: { 200: { description: 'OK' } },
            },
          },
          '/private': {
            get: {
              'responses': { 200: { description: 'OK' } },
              'x-internal': true,
            },
          },
        },
      },
      specification: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      tasks: [
        {
          name: 'load',
        },
        {
          name: 'filter',
          options: (schema) => !schema?.['x-internal'],
        },
      ],
    })

    expect(result.specification).toStrictEqual({
      openapi: '3.1.0',
      info: {
        title: 'Hello World',
        version: '1.0.0',
      },
      paths: {
        '/public': {
          get: {
            responses: {
              '200': {
                description: 'OK',
              },
            },
          },
        },
        '/private': {
          get: undefined,
        },
      },
    })
  })

  it('maps a specification', async () => {
    const result = await workThroughQueue({
      input: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {
          '/public': {
            get: {
              responses: { 200: { description: 'OK' } },
            },
          },
          '/private': {
            get: {
              'responses': { 200: { description: 'OK' } },
              'x-internal': true,
            },
          },
        },
      },
      specification: {
        openapi: '3.1.0',
        info: {
          title: 'Hello World',
          version: '1.0.0',
        },
        paths: {},
      },
      tasks: [
        {
          name: 'load',
        },
        {
          name: 'map',
          options: (schema) => {
            delete schema.paths['/private']
            return schema
          },
        },
      ],
    })

    expect(result.specification).toStrictEqual({
      openapi: '3.1.0',
      info: {
        title: 'Hello World',
        version: '1.0.0',
      },
      paths: {
        '/public': {
          get: {
            responses: {
              '200': {
                description: 'OK',
              },
            },
          },
        },
      },
    })
  })
})

import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import { createCourseRoute } from './src/routes/create-course.ts'
import { getCoursesRoute } from './src/routes/get-courses.ts'
import { getCourseByIdRoute } from './src/routes/get-course-bt-id.ts'
import scalarAPIReference from '@scalar/fastify-api-reference'

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Desafio Node.js',
        version: '1.0.0',
      }
    },
    transform: jsonSchemaTransform,
  })
  
  server.register(scalarAPIReference, {
    routePrefix: '/docs',
  })
}

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(createCourseRoute)
server.register(getCoursesRoute)
server.register(getCourseByIdRoute)

server.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running!')
})
import { OpenAPISerializer } from '../openapi-serializer'
import { serializeHeaders } from './serialize-headers'

it('serializes headers correctly', () => {
  const serializer = new OpenAPISerializer()
  expect(serializeHeaders({}, serializer)).toEqual({})

  expect(serializeHeaders({
    'x-version': 2,
    'x-array': [1, '2', false],
    'x-obj': { a: 1, b: 'test', field: true },
    'x-null': null,
    'x-undefined': undefined,
  }, serializer)).toEqual({
    'x-version': '2',
    'x-array': ['1', '2', 'false'],
    'x-obj': ['a', '1', 'b', 'test', 'field', 'true'],
  })
})

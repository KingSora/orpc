import type { StandardHeaders } from '@standardserver/core'
import type { OpenAPISerializer } from '../openapi-serializer'
import { isTypescriptObject } from '@standardserver/shared'

export function serializeHeaders(data: unknown, serializer: Pick<OpenAPISerializer, keyof OpenAPISerializer>): StandardHeaders {
  const headers: StandardHeaders = {}

  if (!isTypescriptObject(data)) {
    return headers
  }

  const appendHeadersValue = (key: string, value: string | string[] | undefined) => {
    if (headers[key]) {
      headers[key] = [headers[key], value].flat()
    }
    else {
      headers[key] = value
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const serializedArray = value
        .map(val => serializer.serialize(val))
        .filter(val => val !== undefined && val !== null)
        .map(val => String(val))

      appendHeadersValue(key, serializedArray)
    }
    else if (isTypescriptObject(value)) {
      const serializedObject = Object.entries(value)
        .map(([key, val]) => [key, serializer.serialize(val)])
        .filter(([, val]) => val !== undefined && val !== null)
        .map(([key, val]) => [String(key), String(val)])

      serializedObject.forEach(val => appendHeadersValue(key, val))
    }
    else {
      const serialized = serializer.serialize(value)
      if (serialized !== undefined && serialized !== null) {
        appendHeadersValue(key, String(serialized))
      }
    }
  })

  return headers
}

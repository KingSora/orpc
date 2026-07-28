import type { StandardHeaders } from '@standardserver/core'
import type { OpenAPISerializer } from '../openapi-serializer'
import { isTypescriptObject } from '@orpc/shared'

function appendHeadersValue(headers: StandardHeaders, key: string, value: string | string[] | undefined) {
  if (headers[key]) {
    headers[key] = [headers[key], value].flat()
  }
  else {
    headers[key] = value
  }
}

export function serializeHeaders(data: unknown, serializer: Pick<OpenAPISerializer, keyof OpenAPISerializer>): StandardHeaders {
  const headers: StandardHeaders = {}

  if (!isTypescriptObject(data)) {
    return headers
  }

  Object.entries(data).forEach(([dataKey, dataValue]) => {
    if (Array.isArray(dataValue)) {
      const serializedArray = dataValue
        .map(val => serializer.serialize(val))
        .filter(val => val !== undefined && val !== null)
        .map(val => String(val))

      appendHeadersValue(headers, dataKey, serializedArray)
    }
    else if (isTypescriptObject(dataValue)) {
      const serializedObject = Object.entries(dataValue)
        .map(([key, val]) => [key, serializer.serialize(val)])
        .filter(([, val]) => val !== undefined && val !== null)
        .map(([key, val]) => [String(key), String(val)])

      serializedObject.forEach(val => appendHeadersValue(headers, dataKey, val))
    }
    else {
      const serialized = serializer.serialize(dataValue)
      if (serialized !== undefined && serialized !== null) {
        appendHeadersValue(headers, dataKey, String(serialized))
      }
    }
  })

  return headers
}

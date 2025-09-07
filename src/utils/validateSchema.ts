import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

const schemaCache = new Map<string, ReturnType<typeof ajv.compile>>();

/**
 * Validates data against a JSON schema.
 * @param schema - The JSON schema to validate against.
 * @param data - The data to validate.
 * @returns Object with validation result and errors.
 */
export function validateSchema(
  schema: Record<string, unknown>, 
  data: Record<string, unknown>
): { valid: boolean; errors: ErrorObject[] | null | undefined } {
  const schemaKey = JSON.stringify(schema);
  
  if (!schemaCache.has(schemaKey)) {
    schemaCache.set(schemaKey, ajv.compile(schema));
  }
  
  const validate = schemaCache.get(schemaKey)!;
  const valid = validate(data) as boolean;
  
  return { valid, errors: validate.errors };
}

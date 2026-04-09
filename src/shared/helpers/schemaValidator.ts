/**
 * Lightweight schema validator — validates required fields and their types.
 * Will be replaced with AJV in a later refactor commit.
 */

type SchemaDefinition = {
  required: string[];
  types: Record<string, string>;
};

export function validateSchema(
  data: Record<string, unknown>,
  schema: SchemaDefinition
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const field of schema.required) {
    if (!(field in data)) {
      errors.push(`Missing required field: "${field}"`);
      continue;
    }

    const expectedType = schema.types[field];
    const actualValue = data[field];

    if (expectedType === 'array') {
      if (!Array.isArray(actualValue)) {
        errors.push(`Field "${field}" should be an array, got ${typeof actualValue}`);
      }
    } else if (typeof actualValue !== expectedType) {
      errors.push(
        `Field "${field}" should be ${expectedType}, got ${typeof actualValue}`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

import { ZodType, ZodTypeDef } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const printSchema = (schema: ZodType<any, ZodTypeDef, any>) => {
    const asJson = zodToJsonSchema(schema);
    delete (asJson as any).$schema;
    delete (asJson as any).additionalProperties;
    return JSON.stringify(asJson, null, 2);
}

export const printJson = (json: unknown) => JSON.stringify(json, null, 2);
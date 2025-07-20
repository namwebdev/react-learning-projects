import type { Context } from "hono";
import type { HTTPResponseError } from "hono/types";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

interface ErrorResponse {
  error: string;
  success: boolean;
  message: string;
  result: any; // For additional error context, if needed
}

const errorHandler = async (err: Error | HTTPResponseError, c: Context) => {
  let response: ErrorResponse;

  if (err instanceof ValidationError) {
    // Custom validation error response
    response = {
      success: false,
      error: "Validation Error",
      message: err.message,
      result: err.details, // Add field-specific details if available
    };
    return c.json(response, err.status);
  }

  if (err instanceof ZodError) {
    response = {
      success: false,
      error: "Bad Request",
      message: "Validation Error",
      result: err.errors,
    };
    return c.json(response, { status: 400 });
  }

  if (err instanceof SyntaxError) {
    // Handle syntax errors (e.g., invalid JSON payloads)
    response = {
      success: false,
      error: "Bad Request",
      message: "Invalid JSON syntax in the request body.",
      result: null,
    };
    return c.json(response, { status: 400 });
  }



  console.error("---- Caught error in error handler:", err);
  response = {
    success: false,
    error: "Internal Server Error",
    message:
      "Something went wrong on our end. Please check result for more info.",
    result: err,
  };
  return c.json(response, { status: 500 });
};

export default errorHandler;

export class ValidationError extends HTTPException {
  details: Record<string, any>;
  message: string;

  constructor(
    message: string,
    details: Record<string, any> = {},
    statusCode: ContentfulStatusCode = 500
  ) {
    const errorResponse = new Response(
      JSON.stringify({
        error: "Validation Error",
        message,
        details,
      }),
      {
        status: statusCode,
      }
    );
    super(statusCode, { res: errorResponse });
    this.details = details;
    this.message = message;
  }
}

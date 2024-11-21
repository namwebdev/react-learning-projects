import { ZodIssue } from "zod";

type ActionResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };
type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
};

type GetMemberParams = {
  ageRange?: string;
  gender?: string;
  orderBy?: string;
  withPhoto?: string;
  pageNumber?: string;
  pageSize?: string;
};

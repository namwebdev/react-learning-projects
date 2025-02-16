interface GetFilesParams {
  page: string;
  currentPage: number;
}

export async function getFiles({ page, currentPage }: GetFilesParams) {
  const response = await fetch(`/api/v1/files/${page}?page=${currentPage}`);

  if (!response.ok) {
    return { files: [] };
  }

  const { data } = await response.json();
  return data;
}
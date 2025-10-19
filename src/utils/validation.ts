/**
 * Validates the new post form inputs
 * @param title - The post title
 * @param body - The post body content
 * @returns Error message string if validation fails, null if validation passes
 */
export const validateForm = (title: string, body: string): string | null => {
  if (!title.trim()) return 'Title is required.';
  if (!body.trim()) return 'Body text is required.';
  return null;
};

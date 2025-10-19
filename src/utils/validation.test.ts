import { validateForm } from './validation';

describe('validateForm', () => {
  describe('Title validation', () => {
    it('should return error when title is empty string', () => {
      const result = validateForm('', 'Valid body content');
      expect(result).toBe('Title is required.');
    });

    it('should return error when title contains only spaces', () => {
      const result = validateForm('   ', 'Valid body content');
      expect(result).toBe('Title is required.');
    });

    it('should return error when title contains only whitespace characters', () => {
      const result = validateForm('  \t\n  ', 'Valid body content');
      expect(result).toBe('Title is required.');
    });

    it('should pass validation when title has valid text', () => {
      const result = validateForm('Valid Title', 'Valid body content');
      expect(result).toBeNull();
    });

    it('should pass validation when title has leading/trailing spaces but contains text', () => {
      const result = validateForm('  Valid Title  ', 'Valid body content');
      expect(result).toBeNull();
    });

    it('should pass validation with single character title', () => {
      const result = validateForm('A', 'Valid body content');
      expect(result).toBeNull();
    });

    it('should pass validation with very long title', () => {
      const longTitle = 'A'.repeat(1000);
      const result = validateForm(longTitle, 'Valid body content');
      expect(result).toBeNull();
    });
  });

  describe('Body validation', () => {
    it('should return error when body is empty string', () => {
      const result = validateForm('Valid Title', '');
      expect(result).toBe('Body text is required.');
    });

    it('should return error when body contains only spaces', () => {
      const result = validateForm('Valid Title', '     ');
      expect(result).toBe('Body text is required.');
    });

    it('should return error when body contains only whitespace characters', () => {
      const result = validateForm('Valid Title', '\t\n\r  ');
      expect(result).toBe('Body text is required.');
    });

    it('should pass validation when body has valid text', () => {
      const result = validateForm('Valid Title', 'This is valid body content.');
      expect(result).toBeNull();
    });

    it('should pass validation when body has leading/trailing spaces but contains text', () => {
      const result = validateForm('Valid Title', '  Valid body content  ');
      expect(result).toBeNull();
    });

    it('should pass validation with single character body', () => {
      const result = validateForm('Valid Title', 'B');
      expect(result).toBeNull();
    });

    it('should pass validation with very long body', () => {
      const longBody = 'B'.repeat(10000);
      const result = validateForm('Valid Title', longBody);
      expect(result).toBeNull();
    });

    it('should pass validation with body containing special characters', () => {
      const result = validateForm('Valid Title', 'Body with @#$%^&*() special chars!');
      expect(result).toBeNull();
    });

    it('should pass validation with body containing line breaks', () => {
      const result = validateForm('Valid Title', 'Line 1\nLine 2\nLine 3');
      expect(result).toBeNull();
    });
  });

  describe('Combined validation', () => {
    it('should return error when both title and body are empty', () => {
      const result = validateForm('', '');
      expect(result).toBe('Title is required.');
    });

    it('should return error when both title and body contain only whitespace', () => {
      const result = validateForm('   ', '   ');
      expect(result).toBe('Title is required.');
    });

    it('should prioritize title validation over body validation', () => {
      const result = validateForm('', '');
      expect(result).toBe('Title is required.');
    });

    it('should return null when both title and body are valid', () => {
      const result = validateForm('My Post Title', 'My post body content.');
      expect(result).toBeNull();
    });

    it('should handle realistic post data', () => {
      const result = validateForm(
        'How to Learn TypeScript in 2025',
        'TypeScript has become an essential skill for modern web developers. In this post, I will share my journey...'
      );
      expect(result).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle unicode characters in title', () => {
      const result = validateForm('Hello 世界 🌍', 'Valid body');
      expect(result).toBeNull();
    });

    it('should handle unicode characters in body', () => {
      const result = validateForm('Valid Title', 'Content with émojis 😀 and spëcial çhars');
      expect(result).toBeNull();
    });

    it('should handle title with only emoji', () => {
      const result = validateForm('🎉', 'Valid body');
      expect(result).toBeNull();
    });

    it('should handle body with only emoji', () => {
      const result = validateForm('Valid Title', '🎉🎊✨');
      expect(result).toBeNull();
    });

    it('should handle tabs as whitespace in title', () => {
      const result = validateForm('\t\t\t', 'Valid body');
      expect(result).toBe('Title is required.');
    });

    it('should handle tabs as whitespace in body', () => {
      const result = validateForm('Valid Title', '\t\t\t');
      expect(result).toBe('Body text is required.');
    });

    it('should handle mixed whitespace in title', () => {
      const result = validateForm(' \t \n \r ', 'Valid body');
      expect(result).toBe('Title is required.');
    });

    it('should handle mixed whitespace in body', () => {
      const result = validateForm('Valid Title', ' \t \n \r ');
      expect(result).toBe('Body text is required.');
    });
  });

  describe('Return type validation', () => {
    it('should return null (not undefined) on successful validation', () => {
      const result = validateForm('Title', 'Body');
      expect(result).toBe(null);
      expect(result).not.toBe(undefined);
    });

    it('should return a string (not other truthy value) on validation failure', () => {
      const result = validateForm('', 'Body');
      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });

    it('should return exact error message for title validation', () => {
      const result = validateForm('', 'Body');
      expect(result).toBe('Title is required.');
      expect(result).not.toBe('Title is required');
      expect(result).not.toBe('title is required.');
    });

    it('should return exact error message for body validation', () => {
      const result = validateForm('Title', '');
      expect(result).toBe('Body text is required.');
      expect(result).not.toBe('Body text is required');
      expect(result).not.toBe('body text is required.');
    });
  });
});

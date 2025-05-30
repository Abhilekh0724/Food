/**
 * Generates random alphanumeric strings with various options
 * @param options Configuration for random string generation
 * @returns A random alphanumeric string based on the provided options
 */
export function generateRandomString(options: {
  length?: number;
  prefix?: string;
  includeNumbers?: boolean;
  includeLetters?: boolean;
  uppercase?: boolean;
} = {}): string {
  // Default values
  const {
    length = 8,
    prefix = '',
    includeNumbers = true,
    includeLetters = true,
    uppercase = false,
  } = options;

  // Validate inputs
  if (length <= 0) {
    throw new Error("Length must be greater than 0");
  }
  if (!includeNumbers && !includeLetters) {
    throw new Error("Must include at least numbers or letters");
  }

  // Define character sets
  const numbers = '0123456789';
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = letters.toUpperCase();

  // Build available characters pool
  let chars = '';
  if (includeNumbers) chars += numbers;
  if (includeLetters) chars += uppercase ? uppercaseLetters : letters;

  // Generate random string
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  // Add prefix if provided
  return (prefix + result).toUpperCase();
}

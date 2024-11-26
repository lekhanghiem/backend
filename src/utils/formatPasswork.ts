import * as bcrypt from 'bcrypt';
export const hashedPassword = async (
  plainPassword: string
): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};
export const hashedPasswordCompare = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

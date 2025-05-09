export function isEmpty(...values: any[]) {
  const validted = values.every(
    (value) => value === null || value === undefined || value === ""
  );

  return !validted;
}

export function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isPhone(phone: string) {
  return /^[0-9]{10}$/.test(phone);
}

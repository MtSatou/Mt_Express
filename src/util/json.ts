export function stringToJson<T>(str: string): T | null {
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    return null;
  }
}

export function jsonToString(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return '';
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */

export function getDirtyValues(dirtyFields: any, values: any) {
  const result: any = {};

  for (const key in dirtyFields) {
    if (dirtyFields[key]) {
      result[key] = values[key];
    } else if (typeof dirtyFields[key] === "object") {
      getDirtyValues(dirtyFields[key], values[key]);
    }
  }

  return result;
}

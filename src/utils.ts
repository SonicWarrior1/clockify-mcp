import {
  CLOCKIFY_API_KEY,
  CLOCKIFY_WORKSPACE_ID,
  USER_AGENT,
} from "./constants.js";

const headers = {
  "User-Agent": USER_AGENT,
  Accept: "application/json",
  "X-Api-Key": CLOCKIFY_API_KEY,
  "Content-Type": "application/json",
};
const BASE_URL = `https://api.clockify.me/api/v1/workspaces/${CLOCKIFY_WORKSPACE_ID}`;
export const REPORT_BASE_URL = `https://reports.api.clockify.me/v1/workspaces/${CLOCKIFY_WORKSPACE_ID}`;

export async function getRequest<T>(
  endpoint: string,
  params?: { [key: string]: any }
): Promise<T | null> {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const query = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value === undefined) return; // skip undefined
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v));
      } else {
        query.append(key, String(value));
      }
    });
    url.search = query.toString();
    const response = await fetch(url, { headers });
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making GET request:", error);
    return error as T | null;
  }
}

export async function postRequest<T>(
  endpoint: string,
  body: any,
  customBaseUrl?: string 
): Promise<T | null> {
  try {
    const response = await fetch(`${customBaseUrl || BASE_URL}${endpoint}`, {
      headers,
      method: "POST",
      body: JSON.stringify(removeEmptyKeys(body)),
    });
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making POST request:", error);
    return error as T | null;
  }
}

export async function putRequest<T>(
  endpoint: string,
  body: any
): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
      method: "PUT",
      body: JSON.stringify(removeEmptyKeys(body)),
    });
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making PUT request:", error);
    return error as T | null;
  }
}

export async function patchRequest<T>(
  endpoint: string,
  body: any
): Promise<T | null> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
      method: "PATCH",
      body: JSON.stringify(removeEmptyKeys(body)),
    });
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making PATCH request:", error);
    return error as T | null;
  }
}

export async function deleteRequest<T>(
  endpoint: string,
  params?: any
): Promise<T | null> {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const query = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value === undefined) return; // skip undefined
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v));
      } else {
        query.append(key, String(value));
      }
    });
    url.search = query.toString();
    const response = await fetch(url, {
      headers,
      method: "DELETE",
    });
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making DELETE request:", error);
    return error as T | null;
  }
}

function removeEmptyKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj
      .map(removeEmptyKeys) // clean each item
      .filter(
        (v) =>
          !(v == null || (typeof v === "object" && Object.keys(v).length === 0))
      ); // remove empties
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .map(([k, v]) => [k, removeEmptyKeys(v)]) // recurse
        .filter(([_, v]) => {
          if (v == null) return false;
          if (typeof v === "object" && Object.keys(v).length === 0)
            return false;
          if (Array.isArray(v) && v.length === 0) return false;
          return true;
        })
    );
  }
  return obj;
}

export function removeKeys(obj: any, keys: string | string[]) {
  const keysToRemove = Array.isArray(keys) ? keys : [keys]; // allow single or multiple
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keysToRemove.includes(k))
  );
}

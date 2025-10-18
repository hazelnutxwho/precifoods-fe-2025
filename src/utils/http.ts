import { getCookies } from "@/utils/cookie";

const fetchData = async (
  method: string,
  endpoint: string,
  body?: unknown,
  headers: Record<string, string> = {},
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    if (errorData?.errors) {
      throw new Error(errorData.errors);
    } else {
      throw new Error("Network Error");
    }
  }

  return await res.json().then((json) => json.data);
};

const fetchDataAuthenticated = (
  method: string,
  endpoint: string,
  body?: unknown,
) => {
  return fetchData(method, endpoint, body, {
    Authorization: `Bearer ${getCookies("token")}`,
  });
};

export const getData = async (endpoint: string) => {
  return fetchData("GET", endpoint);
};

export const getDataAuthenticated = async (endpoint: string) => {
  return fetchDataAuthenticated("GET", endpoint);
};

export const postData = async (endpoint: string, body?: unknown) => {
  return fetchData("POST", endpoint, body);
};

export const postDataAuthenticated = async (
  endpoint: string,
  body?: unknown,
) => {
  return fetchDataAuthenticated("POST", endpoint, body);
};

export const patchDataAuthenticated = async (
  endpoint: string,
  body?: unknown,
) => {
  return fetchDataAuthenticated("PATCH", endpoint, body);
};


export const putDataAuthenticated = async (
  endpoint: string,
  body?: unknown,
) => {
  return fetchDataAuthenticated("PUT", endpoint, body);
};

export const deleteDataAuthenticated = async (endpoint: string) => {
  return fetchDataAuthenticated("DELETE", endpoint);
};


// //tambahan

// khusus multipart (FormData) dengan autentikasi
export const postFormDataAuthenticated = async (
  endpoint: string,
  formData: FormData,
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookies("token")}`,
      // ⚠️ jangan set "Content-Type", biarkan browser isi boundary otomatis
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.errors || "Network Error");
  }

  return await res.json().then((json) => json.data);
};


// khusus PATCH multipart (FormData) dengan autentikasi
// export const patchFormDataAuthenticated = async (
//   endpoint: string,
//   formData: FormData,
// ) => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${getCookies("token")}`,
//       // jangan set Content-Type biar browser auto set multipart boundary
//     },
//     body: formData,
//   });

//   if (!res.ok) {
//     const errorData = await res.json().catch(() => null);
//     throw new Error(errorData?.errors || "Network Error");
//   }

//   return await res.json().then((json) => json.data);
// };


// khusus PATCH multipart (FormData) dengan autentikasi
export const patchFormDataAuthenticated = async (
  endpoint: string,
  formData: FormData,
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getCookies("token")}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.errors || `HTTP error! status: ${res.status}`);
  }

  // Cek content type dan content length
  const contentType = res.headers.get('content-type');
  const contentLength = res.headers.get('content-length');

  // Jika response kosong (No Content)
  if (res.status === 204 || contentLength === '0') {
    return null; // atau return { success: true }
  }

  // Jika response adalah JSON
  if (contentType && contentType.includes('application/json')) {
    const json = await res.json();
    // Cek berbagai format response yang mungkin
    if (json.data !== undefined) {
      return json.data; // Format: { data: ... }
    } else if (json.success !== undefined) {
      return json; // Format: { success: true, ... }
    } else {
      return json; // Format langsung: { id: 1, name: "...", ... }
    }
  }

  // Jika bukan JSON, return response text atau null
  try {
    return await res.text();
  } catch {
    return null;
  }
};
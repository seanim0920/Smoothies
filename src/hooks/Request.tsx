import { useEffect, useState } from "react"

export type RequestResult<T> = 
| {
  status: "loading"
}
| {
  status: "error",
  error: unknown
}
| {
  status: "success",
  data: T
}

export const useRequest = <T,>(request: () => Promise<T[]>) => {
  const [response, setResponse] = useState<RequestResult<T[]>>({status: "loading"});

  useEffect(() => {
    (async () => {
      try {
        const response = await request();
        setResponse({status: "success", data: response})
      } catch (error) {
        console.error('Error loading smoothies:', error);
        setResponse({status: "error", error})
      }
    })();
  }, [request]);

  return response
}
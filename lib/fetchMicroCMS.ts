export const fetchMicroCMS = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: any
) => {
  if (!process.env.NEXT_PUBLIC_MICROCMS_API_KEY) {
    console.error("❌ APIキーが設定されていません");
    throw new Error("Missing API key");
  }

  const options: RequestInit = {
    method,
    headers: {
      "X-MICROCMS-API-KEY": process.env.NEXT_PUBLIC_MICROCMS_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const requestUrl = `${process.env.NEXT_PUBLIC_MICROCMS_BASE_EP}/${endpoint}`;
  console.log(`Fetching from: ${requestUrl}`); // ✅ 実際のURLを確認

  const res = await fetch(requestUrl, options);

  if (!res.ok) {
    console.error(
      `❌ Failed to fetch from microCMS: ${res.status} ${res.statusText}`
    );
    throw new Error(`Failed to fetch from microCMS: ${res.statusText}`);
  }

  return res.json();
};

"use server"

type ApiResponse = {
    usage: {
      text_units: number;
      text_characters: number;
      features: number;
    };
    sentiment: {
      document: {
        score: number;
        mixed?: string;
        label: string;
      };
    };
    retrieved_url: string;
    language: string;
  };

type RequestPayload = {
  url: string;
  features: {
    sentiment: object;
  };
};

const apikey = process.env.API_KEY
const baseUrl = process.env.BASE_URL
const endpoint = `${baseUrl}/v1/analyze?version=2019-07-12`;

export async function analyze(url: string) {
    const payload: RequestPayload = {
        url: url,
        features: {
            sentiment: {}
        },
    };

    try {
        const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(`apikey:${apikey}`).toString("base64")}`,
        },
        body: JSON.stringify(payload),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Could not analyze the webpage.');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const data: ApiResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
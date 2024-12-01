"use server"

class AnalyzerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AnalyzerError';
    }
}

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
    if (!apikey || !baseUrl) {
        throw new AnalyzerError('Configuration error');
    }

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
            throw new AnalyzerError('Could not analyze the webpage.');
        }

        const data: ApiResponse = await response.json();
        if (!data || !data.sentiment?.document) {
            throw new AnalyzerError('Invalid response format');
        }

        return data;
    } catch (error) {
        console.error("Error:", error);
        if (error instanceof AnalyzerError) {
            throw error;
        }
        throw new AnalyzerError('Could not analyze the webpage.');
    }
}
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export interface ITestState{
    listItems : any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export async function POST(req: NextRequest) {
    try {
        const { ingredients, cuisine } = await req.json();

        if (!ingredients || !cuisine) {
            return NextResponse.json({ error: "Missing ingredients or cuisine" }, { status: 400 });
        }

        const openAiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are the recipe assistant." },
                    {
                        role: "user",
                        content: `Create a ${cuisine} recipe using the following ingredients: ${ingredients.join(
                            ", "
                        )}. Spit out the names of three recipes only.`,
                    },
                ],
                max_tokens: 200,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const recipe = openAiResponse.data.choices[0].message.content;
        return NextResponse.json({ recipe });
    } catch (error: any) {
        console.error("Error with OpenAI API:", error.response?.data || error.message);
        return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
    }
}
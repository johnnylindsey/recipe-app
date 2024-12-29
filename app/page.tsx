"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { AiOutlineRobot } from "react-icons/ai";

type RecipeResponse = {
  recipe: string;
};

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    setLoading(true);
    setRecipe(null);

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredients.split(","), cuisine }),
      });

      const data = await response.json();
      setRecipe(data.recipe || "No recipe found.");
    } catch (error) {
      console.error(error);
      setRecipe("Error generating recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="flex items-center text-4xl font-bold mb-6">
        <AiOutlineRobot className="mr-2 text-blue-500" /> AI Recipe Generator
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Ingredients</span>
          <textarea
            className="w-full mt-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Enter ingredients separated by commas"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Cuisine</span>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., Italian, Mexican"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </label>
        <button
          onClick={generateRecipe}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </div>
      {recipe && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-bold mb-2">Generated Recipe</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{recipe}</p>
        </div>
      )}

      <footer className="mt-12 text-center text-sm text-gray-500">
        Built using Next.js & GPT
      </footer>
    </main>
  );
}

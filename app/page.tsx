"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";

type RecipeResponse = {
  recipe: string;
};

export default function Home() {
  const [ingredients, setIngredients] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("");
  const [recipe, setRecipe] = useState<string>("");

  const handleGenerate = async () => {
      try {
          const response = await axios.post<RecipeResponse>("/api/generate-recipe", {
              ingredients: ingredients.split(","),
              cuisine,
          });
          setRecipe(response.data.recipe);
      } catch (error) {
          console.error("Error generating recipe:", error);
      }
  };

  return (
      <div className="flex flex-col items-center p-4">
          <h1 className="text-2xl font-bold mb-4">AI Recipe Generator</h1>
          <div className="w-full max-w-md">
              <input
                  type="text"
                  placeholder="Enter ingredients (comma-separated)"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
              />
              <input
                  type="text"
                  placeholder="Cuisine (e.g., Italian)"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
              />
              <button
                  onClick={handleGenerate}
                  className="w-full bg-blue-500 text-white py-2 rounded"
              >
                  Generate Recipe
              </button>
          </div>
          {recipe && (
              <div className="mt-4 p-4 border rounded bg-gray-100">
                  <h2 className="text-xl font-semibold">Generated Recipe</h2>
                  <p>{recipe}</p>
              </div>
          )}
      </div>
  );
}

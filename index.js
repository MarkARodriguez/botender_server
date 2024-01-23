require("dotenv").config();
const express = require('express');
const OpenAIApi = require('openai');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAIApi({
  api_key: process.env.OPENAI_API_KEY
});

// Function to generate cocktail recipe
async function generateCocktailRecipe(ingredients, tequila) {
  try {
    const response = await openai.chat.completions.create({
        messages: [{ role: "system", content: "Make a tequila cocktail with the following ingredients " + ingredients + " and the following tequila. YOU MUST USE THE EXACT NAME OF THIS TEQUILA AND NO OTHER " + tequila + "Make sure to organzie it in a way where the ingredients are listed on top and the intructions below. With space in between them"}],
        model: "gpt-3.5-turbo",
      });
      console.log(response.choices[0]);

      return response.choices[0];
  } catch (error) {
    console.error("Error in generating recipe:", error);
    return null;
  }
}

// Express route to handle recipe generation
app.post('/generate-recipe', async (req, res) => {
    console.log("Received ingredients:", req.body.ingredients); 
    console.log("Received Tequila:", req.body.tequila); 


  const ingredients = req.body.ingredients;
  const tequila = req.body.tequila;
  const recipe = await generateCocktailRecipe(ingredients, tequila);
  res.json({recipe});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
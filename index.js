require("dotenv").config();
const https = require('https');
const fs = require('fs'); // Required to read the SSL files
const express = require('express');
const OpenAIApi = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
// const corsOptions = {
//   origin: 'https://rococo-paletas-a9fd6a.netlify.app', // Replace with your Netlify domain
//   optionsSuccessStatus: 200
// };

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

// Read the SSL certificate and private key
const privateKey = fs.readFileSync('/etc/letsencrypt/live/bot.sourcemachines.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/bot.sourcemachines.com/fullchain.pem', 'utf8');



// const credentials = { key: privateKey, cert: certificate, passphrase: passphrase };


// // Create an HTTPS server using the self-signed certificate
// const server = https.createServer(credentials, app);
https.createServer({
  key: privateKey,
  cert: certificate
}, app).listen(3000, () => {
  console.log('Server running at https://localhost:3000/');
});

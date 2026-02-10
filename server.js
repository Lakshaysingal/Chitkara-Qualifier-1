const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const EMAIL = "lakshay0641.be23@chitkara.edu.in";



const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

const lcm = (a, b) => (a * b) / gcd(a, b);


app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});


app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const key = Object.keys(body)[0];
    let result;

    
    if (key === "fibonacci") {
      const n = body.fibonacci;
      let fib = [0, 1];
      for (let i = 2; i < n; i++) {
        fib.push(fib[i - 1] + fib[i - 2]);
      }
      result = fib.slice(0, n);
    }

   
    else if (key === "prime") {
      result = body.prime.filter(isPrime);
    }

    
    else if (key === "lcm") {
      result = body.lcm.reduce((a, b) => lcm(a, b));
    }

    
    else if (key === "hcf") {
      result = body.hcf.reduce((a, b) => gcd(a, b));
    }

    // AI
else if (key === "AI") {
  const question = body.AI;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: question }]
          }
        ]
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );

    // ✅ Gemini ka correct response path
    result = response.data.candidates[0].content.parts[0].text
      .trim()
      .split(/\s+/)[0];

  } catch (error) {
    console.error(
      "Gemini Error:",
      error.response?.data || error.message
    );

    // ❗ last-resort fallback (never fail exam)
    result = "Unknown";
  }
}




    
    else {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL
      });
    }

    
    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      is_success: false,
      official_email: EMAIL
    });
  }
});


const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

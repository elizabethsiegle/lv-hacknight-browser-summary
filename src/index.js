import puppeteer from '@cloudflare/puppeteer';

const HTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Web Page Summarizer</title>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        
        body {
            font-family: 'Comic Neue', 'Comic Sans MS', cursive;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px 100px;
            text-align: center;
            background: linear-gradient(135deg, #f38020 0%, #f68b33 100%);
            min-height: calc(100vh - 140px);
            position: relative;
            color: white;
        }
        h1 {
            color: white;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .input-container {
            margin-bottom: 30px;
            display: flex;
            gap: 10px;
            justify-content: center;
            align-items: center;
        }
        input[type="url"] {
            width: 60%;
            padding: 15px 20px;
            border: 3px solid white;
            border-radius: 25px;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            font-family: 'Comic Neue', 'Comic Sans MS', cursive;
            background: rgba(255, 255, 255, 0.9);
        }
        input[type="url"]:focus {
            border-color: #2980b9;
            box-shadow: 0 2px 10px rgba(255,255,255,0.3);
        }
        button {
            padding: 15px 30px;
            background-color: #2980b9;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            font-family: 'Comic Neue', 'Comic Sans MS', cursive;
        }
        button:hover {
            background-color: #3498db;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .spinner {
            display: none;
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255,255,255,0.3);
            border-top: 5px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #result {
            margin: 20px auto;
            padding: 25px;
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: left;
            display: none;
            max-width: 90%;
            line-height: 1.6;
            color: #333;
        }
        #result h3 {
            color: #f38020;
            margin-top: 0;
            border-bottom: 2px solid #f0f4f8;
            padding-bottom: 10px;
        }
        .footer {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-size: 14px;
            color: #f38020;
            backdrop-filter: blur(5px);
            z-index: 1000;
        }
        .footer .heart {
            color: #e74c3c;
            margin: 0 5px;
            animation: pulse 1s infinite;
        }
        .clouds {
            position: fixed;
            top: 20px;
            right: 20px;
            font-size: 2em;
            animation: float 3s ease-in-out infinite;
        }
        .clouds2 {
            position: fixed;
            bottom: 60px;
            left: 20px;
            font-size: 2em;
            animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        @media (max-width: 600px) {
            .input-container {
                flex-direction: column;
            }
            input[type="url"] {
                width: 90%;
            }
            button {
                width: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="clouds">☁️ ☁️</div>
    <div class="clouds2">☁️</div>
    <h1>⭐ Web Page Summarizer w/ Cloudflare AI ⭐</h1>
    <div class="input-container">
        <input type="url" id="urlInput" placeholder="Enter webpage URL..." required>
        <button onclick="summarize()">Summarize</button>
    </div>
    <div class="spinner" id="spinner"></div>
    <div id="result"></div>
    <div class="footer">
        made with <span class="heart">♥</span> in las vegas -> 👩🏻‍💻code: <a href="https://github.com/elizabethsiegle/lv-hacknight-browser-summary">on github</a>
    </div>

    <script>
        async function summarize() {
            const urlInput = document.getElementById('urlInput');
            const spinner = document.getElementById('spinner');
            const result = document.getElementById('result');
            
            if (!urlInput.value) {
                alert('Please enter a URL');
                return;
            }

            // Show spinner, hide previous result
            spinner.style.display = 'block';
            result.style.display = 'none';

            try {
                const response = await fetch(\`?url=\${encodeURIComponent(urlInput.value)}\`);
                const data = await response.json();
                
                if (data.error) {
                    result.innerHTML = \`<p style="color: red;">Error: \${data.message}</p>\`;
                } else {
                    // Parse the summary if it's a JSON string
                    let summaryText;
                    try {
                        const summaryObj = typeof data.summary === 'string' 
                            ? JSON.parse(data.summary) 
                            : data.summary;
                        summaryText = summaryObj.response;
                    } catch (e) {
                        summaryText = data.summary;
                    }
                        
                    result.innerHTML = \`
                        <h3>Summary:</h3>
                        <p>\${summaryText}</p>
                        <p><small>Generated at: \${data.timestamp}</small></p>
                    \`;
                }
            } catch (error) {
                result.innerHTML = \`<p style="color: red;">Error: \${error.message}</p>\`;
            } finally {
                // Hide spinner, show result
                spinner.style.display = 'none';
                result.style.display = 'block';
            }
        }

        // Allow pressing Enter to submit
        document.getElementById('urlInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                summarize();
            }
        });
    </script>
</body>
</html>
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // If no URL parameter, serve the HTML interface
    if (!url.searchParams.has('url')) {
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Otherwise, process the URL and return summary
    let browser;
    try {
      const targetUrl = url.searchParams.get('url');
      browser = await puppeteer.launch(env.MYBROWSER);
      const page = await browser.newPage();
      await page.goto(targetUrl);

      const content = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script, style');
        scripts.forEach(s => s.remove());
        
        const article = document.querySelector('article, main, #content, .content');
        return article ? article.textContent : document.body.textContent;
      });

      await browser.close();

      const cleanContent = content
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 6000);

      const messages = [
        { 
          role: "system", 
          content: "You are a helpful assistant that provides clear, concise summaries of web content. Focus on the main points and key information."
        },
        {
          role: "user",
          content: `Please summarize this webpage content: ${cleanContent}`
        }
      ];

      const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", { messages });

      return new Response(JSON.stringify({
        url: targetUrl,
        summary: response,
        timestamp: new Date().toISOString()
      }), {
        headers: { 
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      if (browser) await browser.close();
      
      return new Response(JSON.stringify({
        error: "Failed to analyze webpage",
        message: error.message
      }), {
        status: 500,
        headers: { 
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};


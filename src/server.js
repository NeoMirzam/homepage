const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Get the file path from the URL
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

  // Get the file extension
  const extname = path.extname(filePath);

  // Set the default content type
  let contentType = "text/html";

  // Set the content type based on the file extension
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".gif":
      contentType = "image/gif";
      break;
    case ".svg":
      contentType = "image/svg+xml";
      break;
  }

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Page not found
        fs.readFile(path.join(__dirname, "404.html"), (err, content) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(content, "utf8");
        });
      } else {
        // Some server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

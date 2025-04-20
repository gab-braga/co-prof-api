import app from "./app/app";

const port = (process.env.PORT || 8080) as number;

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port", port);
});

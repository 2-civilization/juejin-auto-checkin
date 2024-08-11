import puppeteer, { type CookieParam } from "puppeteer";
import fs from "fs";
import type { UserMonthlyActivity } from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DIR_PATH = "./config";
const COOKIE_PATH = DIR_PATH + "/cookies.json";
const QR_CODE_PATH = DIR_PATH + "/qrcode.png";

let cookies: CookieParam[] = [];
let msg = `今日签到状态：{checkin}, 获得矿石：{point}`;
let errMsg = "";

const PUSH_PLUS_TOKEN = process.env.PUSH_PLUS_TOKEN;

if (!fs.existsSync(DIR_PATH)) {
  fs.mkdirSync(DIR_PATH);
}

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
  );

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  await page.goto("https://juejin.cn/");

  const login = async () => {
    const loginButton = await page.$(".login-button");
    await loginButton?.click();
    await page.waitForSelector(".qrcode-img");
    await sleep(1000);
    const qrCodeImg = await page.$(".qrcode-img");
    if (!qrCodeImg) {
      throw new Error("未找到二维码图片");
    }
    await qrCodeImg.screenshot({
      path: QR_CODE_PATH,
    });

    console.log(`请扫描 ${QR_CODE_PATH} 中的二维码进行登录`);

    page.on("framenavigated", async (frame) => {
      if (frame === page.mainFrame()) {
        console.log("页面已刷新");
        // 在这里添加你需要的操作
        const cookies = await page.cookies();
        fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
      }
    });

    await page.waitForNavigation({ waitUntil: "networkidle0" });
  };

  if (!fs.existsSync(COOKIE_PATH)) {
    await login();
  }

  cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, "utf-8"));

  await page.setCookie(...cookies);

  await page.goto("https://juejin.cn/user/center/signin?from=main_page");

  await page.waitForSelector(".signin");
  const checkinButton = await page.$(".signin");
  await checkinButton?.click();

  await sleep(1000);

  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("get_by_month") && response.request().method() === "GET") {
      const data = (await response.json()) as UserMonthlyActivity;
      const today = data.data.find(
        (item) =>
          item.date ===
          new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000
      );
      if (today) {
        msg = msg
          .replace("{checkin}", today.status === 4 ? "未签到" : "已签到")
          .replace("{point}", today.point.toString());
        console.log(msg);
      }
    }
  });

  await page.reload();
  await sleep(1000);

  if (PUSH_PLUS_TOKEN) {
    const pushPlusUrl = `https://www.pushplus.plus/send?token=${PUSH_PLUS_TOKEN}&title=掘金签到提醒&content=${msg}`;
    const data = await fetch(pushPlusUrl).then((res) => res.json());
    console.log(data);
  } else {
    console.log("未配置 PUSH_PLUS_TOKEN, 跳过推送");
  }

  await browser.close();
};

main().catch((e) => {
  console.error(e);
  errMsg = e.message;
  if (PUSH_PLUS_TOKEN) {
    const pushPlusUrl = `https://www.pushplus.plus/send?token=${PUSH_PLUS_TOKEN}&title=掘金签到提醒&content=${errMsg}`;
    fetch(pushPlusUrl)
      .then((res) => res.json())
      .then(console.log);
  } else {
    console.log("未配置 PUSH_PLUS_TOKEN, 跳过推送");
  }
});

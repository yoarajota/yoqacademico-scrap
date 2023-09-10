import puppeteer, { Browser, Page } from "puppeteer";

export default class ClassQACademico {
  private browser: Browser = new Browser();
  private current: number = 0;
  private pages: Array<Page> = [];

  async initialize() {
    this.browser = await puppeteer.launch();
    this.pages = await this.browser.pages();
  }

  async goto(url: string) {
    return await this.currPage().goto(url);
  }

  promiseField(selector: string) {
    return new Promise(async (resolve) => {
      resolve(
        await (
          await this.browser.pages()
        )[this.current].waitForSelector(selector)
      );
    });
  }

  async type(selector: string, string: string) {
    return await (
      await this.browser.pages()
    )[this.current].type(selector, string);
  }

  async click(selector: string) {
    return await this.currPage().click(selector);
  }

  async close() {
    await this.browser.close();
  }

  async wait(selector: string, timeout: number = 30000) {
    await (
      await this.browser.pages()
    )[this.current].waitForSelector(selector, {
      timeout,
    });
  }

  async getElement(selector: string) {
    return await this.currPage().$(selector);
  }
  
  async getElements(selector: string) {
    return await this.currPage().$$(selector);
  }

  async newPage() {
    this.current = this.pages.length;
    await this.browser.newPage();
    this.pages = await this.browser.pages();
  }

  currPage() {
    return this.pages[this.current];
  }

  async evaluate(callback: any, ...args: Array<string | number>) {
    return this.pages[this.current].evaluate(callback, ...args);
  }
}

import express, { Router, Request, Response } from "express";
import ClassQACademico from "./ClientQAcademico";
import { DiarioDataSelector, HomePageSelector } from "./selectors";
import { Data, PartDiario } from "./types";
import { normalize } from "./helpers";
const app = express();
const route = Router();

app.use(express.json());

route.post("/", async (req: Request, res: Response) => {
  let launch = new ClassQACademico();

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Invalid credentials!");
    }

    await launch.initialize();
    await launch.goto(
      "https://qacademico.bento.ifrs.edu.br/qacademico/index.asp?t=1001"
    );

    await launch.type("#txtLogin", username);
    await launch.type("#txtSenha", password);
    await launch.click("#btnOk");

    try {
      // await launch.wait(HomePageSelector, 1500);
      await launch.wait(HomePageSelector, 15000000);
    } catch (_) {
      throw new Error("Credenciais errados!");
    }

    await launch.newPage();
    await launch.goto(
      "https://qacademico.bento.ifrs.edu.br/qacademico/index.asp?t=2071"
    );

    const tableElements = await launch.getElements(
      DiarioDataSelector + " > tr:not([class]"
    );

    let data: Array<PartDiario> = [];
    for (let key in tableElements) {
      const courseName = normalize(
        (await (
          await (
            await tableElements[key].$(".conteudoTexto")
          )?.getProperty("textContent")
        )?.jsonValue()) ?? ""
      );

      if (!courseName) {
        continue;
      }

      let partData: Array<Data> = [];
      for (let trData of (await (
        await tableElements[key].$("table")
      )?.$$("tr")) ?? []) {
        partData.push({
          data_name: normalize(
            (await (
              await (
                await trData.$("td:nth-child(1)")
              )?.getProperty("textContent")
            )?.jsonValue()) ?? ""
          ),
          data_value: normalize(
            (await (
              await (
                await trData.$("td:nth-child(2)")
              )?.getProperty("textContent")
            )?.jsonValue()) ?? ""
          ),
        });
      }
      data.push({
        course_name: courseName ?? "",
        data: partData,
      });
    }

    await launch.close();
    return res.status(200).json({ message: "sucesos!", data });
  } catch (error) {
    await launch.close();
    return res.status(400).json({ error });
  }
});

app.use(route);

app.listen(3333, () => "server running on port 3333");

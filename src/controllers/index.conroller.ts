import { controller, httpGet, interfaces } from "inversify-express-utils";

@controller("/")
export class AppController implements interfaces.Controller {
  constructor() {}

  @httpGet("/")
  private ping() {
    return {
      author: "Mukhtar Zargar",
      service: "User Service",
      version: "0.0.1"
    };
  }
}

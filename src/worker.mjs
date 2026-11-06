import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";
// Built by scripts/build-views.js (Workers can't compile EJS at runtime)
import views from "./views.generated.js";

// Render views from the precompiled functions instead of reading files from disk
class BundledView {
  constructor(name) {
    this.path = name;
  }

  render(data, callback) {
    const include = (name, includeData) => views[name]({ ...data, ...includeData }, include);
    try {
      callback(null, views[this.path](data, include));
    } catch (err) {
      callback(err);
    }
  }
}

app.set("view", BundledView);

export default httpServerHandler({ port: 3000 });

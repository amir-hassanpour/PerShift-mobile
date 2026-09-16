import Builder from "./Builder";

const builder = new Builder();

export default function index() {
  return builder.makeSignupView();
}

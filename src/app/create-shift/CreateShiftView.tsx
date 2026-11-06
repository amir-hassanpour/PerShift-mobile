// src/app/create-shift/index.tsx

import { useState, type ReactElement } from "react";
import { builder } from "../index";

export default function CreateShiftRoute() {
  const [page] = useState<ReactElement>(() => builder.makeCreateShiftPage());

  return page;
}

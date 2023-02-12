import * as lines from "./lines";

test("getLineByIdメソッド", () => {
  expect(lines.getLineById("N")?.name).toBe("南北線");
  expect(lines.getLineById("T")?.name).toBe("東西線");
  expect(lines.getLineById("H")?.name).toBe("東豊線");
});

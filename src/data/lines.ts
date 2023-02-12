export type Line = {
  id: "N" | "T" | "H";
  name: string;
  themeColor: string;
};

const LINES: Line[] = [
  {
    id: "N",
    name: "南北線",
    themeColor: "#008000",
  },
  {
    id: "T",
    name: "東西線",
    themeColor: "#E46C0A",
  },
  {
    id: "H",
    name: "東豊線",
    themeColor: "#1D1DFF",
  },
];

/**
 * 駅のIDから線の情報を取得します。
 * @param id 駅のID。
 */
export const getLineById = (id: "N" | "T" | "H") => {
  const line = LINES.find((l) => l.id === id);
  if (!line) {
    throw new Error("線情報の取得に失敗しました。");
  }
  return line;
};

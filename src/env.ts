export function requireEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`環境変数 ${name} が設定されていません。.env または実行環境の設定を確認してください。`);
  }
  return value;
}

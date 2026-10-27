/** 起動に必須の環境変数名 */
type RequiredEnvName = 'LINE_CHANNEL_ACCESS_TOKEN' | 'LINE_CHANNEL_SECRET';

export function requireEnv(name: RequiredEnvName): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`環境変数 ${name} が設定されていません。.env または実行環境の設定を確認してください。`);
  }
  return value;
}

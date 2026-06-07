import "dotenv/config"

const port = process.env.PORT || "3006"
const isDev = process.env.AMBIENTE === "DEV"

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "")

export const appConfig = {
   ambiente: process.env.AMBIENTE || "DEV",
   port,
   dominioApi: process.env.DOMINIO_API || `127.0.0.1:${port}`,
   apiPublicUrl: trimTrailingSlash(process.env.API_PUBLIC_URL || (isDev ? `http://127.0.0.1:${port}` : `https://${process.env.DOMINIO_API}`)),
   apiHost: process.env.API_HOST || (isDev ? `127.0.0.1:${port}` : process.env.DOMINIO_API || `127.0.0.1:${port}`),
   resourceHost: process.env.RESOURCE_HOST || (isDev ? `//127.0.0.1:${port}` : process.env.DOMINIO_API || `127.0.0.1:${port}`),
   localCallbackUrl: trimTrailingSlash(process.env.LOCAL_CALLBACK_URL || `http://127.0.0.1:${port}`) + "/",
   defaultProviderCode: process.env.DEFAULT_PROVIDER_CODE || "PGSOFT",
   defaultCurrency: process.env.DEFAULT_CURRENCY || "BRL",
   demoAgentCode: process.env.DEMO_AGENT_CODE || "demo",
   demoAgentPassword: process.env.DEMO_AGENT_PASSWORD || "demo",
   demoAgentToken: process.env.DEMO_AGENT_TOKEN || "demo-token",
   demoSecretKey: process.env.DEMO_SECRET_KEY || "demo-secret",
}

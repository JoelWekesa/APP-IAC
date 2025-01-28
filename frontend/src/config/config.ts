interface Config {
    baseURL: string
    appURL: string
    otelServiceName: string
    otelLogLevel: string
    pinoLokiURL: string

}

export const config: Config = {
    baseURL: "http://34.232.254.118:5001/",
    appURL: "http://34.232.254.118:3001/",
    otelServiceName: "frontend",
    otelLogLevel: "info",
    pinoLokiURL: "http://34.232.254.118:3100",

}

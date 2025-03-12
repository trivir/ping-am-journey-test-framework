import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const resolvePath = (str: string) => resolve(__dirname, str);

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      dts({
        insertTypesEntry: true,
      }),
    ],
    build: {
      lib: {
        entry: {
          "ping-aic-lib-ts": resolvePath("src/index.ts"),
          AM: resolvePath("src/AM/index.ts"),
          IDM: resolvePath("src/IDM/index.ts"),
          Assertions: resolvePath("src/Journey/Assertions/index.ts"),
          Journey: resolvePath("src/Journey/index.ts"),
          Types: resolvePath("src/Types.ts"),
          Utils: resolvePath("src/Utils/index.ts"),
        },
        name: "@trivir/ping-aic-lib-ts",
        formats: ["es"],
        fileName: (format) => `[name].js`,
      },
      rollupOptions: {
        external: [
          "got",
          "hamjest",
          "imapflow",
          "mailparser",
          "node-jose",
          "otpauth",
          "uuid",
          "cosmiconfig",
        ],
        output: {
          globals: {
            got: "got",
            hamjest: "hamjest",
            imapflow: "imapflow",
            mailparser: "mailparser",
            nodejose: "node-jose",
            otpauth: "otpauth",
            uuid: "uuid",
            cosmiconfig: "cosmiconfig",
          },
        },
      },
    },
  };
});

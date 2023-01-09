import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


import { fileURLToPath } from 'url'
import dynamicImportPlugin from 'vite-plugin-dynamic-import'


const { default: dynamicImport } = dynamicImportPlugin

const product =
  process.env.PRODUCT ?? "common"


const { default: blazerConfig } = await import(`./config/${product}/config.js`)
const { default: routingMapping } = await import(`./config/${product}/route.mapping.js`)

// console.log(routingMapping)
// https://vitejs.dev/config/
// export default async ({ command, mode }) => {

//   return defineConfig({
//     plugins: [react(), dynamicImport()],
//     resolve: {
//       alias: {
//         '@': fileURLToPath(new URL('./src', import.meta.url)),
//       }
//     },
//     server: {
//       port: 9999,
//       // cors: true
//     },
//     css: {
//       preprocessorOptions: {
//         less: {
//           javascriptEnabled: true
//         }
//       }
//     },
//     define: {
//       BLAZER: JSON.stringify(blazerConfig),
//       WEBPACK: false,
//       DEBUG_MODE: JSON.stringify(process.env.DEBUG_MODE),
//       MOCK_DATA: JSON.stringify(mockData),
//       ROUTING: JSON.stringify(routingMapping)
//     },
//     // root: "./",
//     // base: "./",
//     // build: {
//     //   // commonjsOptions: {
//     //   //     include: [/node_modules/]
//     //   // }
//     //   // rollupOptions: { plugins: [commonjs({ include: /node_modules|src/, transformMixedEsModules: true, })] },
//     //   // commonjsOptions: {
//     //   //     include: 'src/grpc/base_pb.js',
//     //   //     // dynamicRequireTargets: ['node_modules/google-protobuf/*.js'],
//     //   //     // transformMixedEsModules: true,
//     //   //     // esmExternals: true,
//     //   //     // ignoreDynamicRequires: true
//     //   // },
//     //   rollupOptions: undefined,
//     //   commonjsOptions: undefined
//     // },
//     // // optimizeDeps: {
//     // //     include: ['google-protobuf']
//     // // },

//   })
// }

export default defineConfig({
  plugins: [react(), dynamicImport()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  server: {
    port: 9999,
    // cors: true
  },
  css: {
    modules: { localsConvention: "camelCase" },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,

      }
    }
  },
  define: {
    WEBPACK: false,
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  optimizeDeps: {
    include: ["antd", "react-dom"]
  }
  // root: "./",
  // base: "./",
  // build: {
  //   // commonjsOptions: {
  //   //     include: [/node_modules/]
  //   // }
  //   // rollupOptions: { plugins: [commonjs({ include: /node_modules|src/, transformMixedEsModules: true, })] },
  //   // commonjsOptions: {
  //   //     include: 'src/grpc/base_pb.js',
  //   //     // dynamicRequireTargets: ['node_modules/google-protobuf/*.js'],
  //   //     // transformMixedEsModules: true,
  //   //     // esmExternals: true,
  //   //     // ignoreDynamicRequires: true
  //   // },
  //   rollupOptions: undefined,
  //   commonjsOptions: undefined
  // },
  // // optimizeDeps: {
  // //     include: ['google-protobuf']
  // // },

})

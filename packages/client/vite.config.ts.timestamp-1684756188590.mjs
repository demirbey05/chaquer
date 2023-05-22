// vite.config.ts
import { defineConfig } from "file:///mnt/c/softwareProjects/chaquer-react/node_modules/vite/dist/node/index.js";
import react from "file:///mnt/c/softwareProjects/chaquer-react/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3e3,
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020"
    },
    exclude: ["@latticexyz/network"],
    include: [
      "proxy-deep",
      "ethers/lib/utils",
      "bn.js",
      "js-sha3",
      "hash.js",
      "bech32",
      "long",
      "protobufjs/minimal",
      "debug",
      "is-observable",
      "nice-grpc-web",
      "@improbable-eng/grpc-web"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2Mvc29mdHdhcmVQcm9qZWN0cy9jaGFxdWVyLXJlYWN0L3BhY2thZ2VzL2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL3NvZnR3YXJlUHJvamVjdHMvY2hhcXVlci1yZWFjdC9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL3NvZnR3YXJlUHJvamVjdHMvY2hhcXVlci1yZWFjdC9wYWNrYWdlcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgICBmczoge1xyXG4gICAgICBzdHJpY3Q6IGZhbHNlLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgdGFyZ2V0OiBcImVzMjAyMFwiLFxyXG4gICAgfSxcclxuICAgIGV4Y2x1ZGU6IFtcIkBsYXR0aWNleHl6L25ldHdvcmtcIl0sXHJcbiAgICBpbmNsdWRlOiBbXHJcbiAgICAgIFwicHJveHktZGVlcFwiLFxyXG4gICAgICBcImV0aGVycy9saWIvdXRpbHNcIixcclxuICAgICAgXCJibi5qc1wiLFxyXG4gICAgICBcImpzLXNoYTNcIixcclxuICAgICAgXCJoYXNoLmpzXCIsXHJcbiAgICAgIFwiYmVjaDMyXCIsXHJcbiAgICAgIFwibG9uZ1wiLFxyXG4gICAgICBcInByb3RvYnVmanMvbWluaW1hbFwiLFxyXG4gICAgICBcImRlYnVnXCIsXHJcbiAgICAgIFwiaXMtb2JzZXJ2YWJsZVwiLFxyXG4gICAgICBcIm5pY2UtZ3JwYy13ZWJcIixcclxuICAgICAgXCJAaW1wcm9iYWJsZS1lbmcvZ3JwYy13ZWJcIixcclxuICAgIF0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVYsU0FBUyxvQkFBb0I7QUFDOVcsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyxxQkFBcUI7QUFBQSxJQUMvQixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

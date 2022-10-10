import preprocess from "svelte-preprocess";

const config = {
  preprocess: [
    preprocess({
      postcss: true,

      scss: {
        prependData: '@use "src/variables.scss" as *;',
      },
    }),
  ],
};

export default config;

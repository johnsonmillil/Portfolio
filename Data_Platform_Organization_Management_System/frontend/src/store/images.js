// frontend\src\store\imageStore.js

import { defineStore } from "pinia";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    images: [],
  }),

  actions: {
    addImage(image) {
      this.images.push(image);
    },
  },

  getters: {
    allImages: (state) => state.images,
  },
});

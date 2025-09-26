import { defineStore } from "pinia";
import { defineComponent, ref } from "vue";
import { useClientPicturesStore } from "@/store/clientPictures"; // Import your store

export const useImageStore = defineStore({
  id: "imageStore",
  state: () => ({
    images: [], // You can store image data here
  }),
  actions: {
    addImage(imageData) {
      this.images.push(imageData);
    },
    removeImage(imageId) {
      // Implement image removal logic
    },
  },
});

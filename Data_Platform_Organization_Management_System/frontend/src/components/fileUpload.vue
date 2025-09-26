<script>
import modal from "./modal.vue";
import { useLoggedInUserStore } from "../store/loggedInUser";
export default {
    data() {
        const user = useLoggedInUserStore();
        return {
            showModal: false,
            previewImage: null,
            placeholderImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
            errorImage: "https://developers.google.com/static/maps/documentation/streetview/images/error-image-generic.png",
            user,
        };
    },
    props: {
        file: String,
    },
    components: {
        modal,
    },
    methods: {
        openModal(e) {
            this.showModal = e;
        },
        async onUploadFile(file) {
            this.previewImage = file ? URL.createObjectURL(file) : null;
            this.$emit("updateFile", file);
        },

        handleError(e) {
            this.previewImage = this.errorImage;
        },
    },
};
</script>

<template>
    <div>
        <img
            :src="previewImage ? previewImage : file ? file : placeholderImage"
            alt="Profile Picture"
            class="max-w-[300px] w-full aspect-square object-cover mx-auto clickable-profile rounded-full"
            @click="openModal(true)"
            @error="handleError"
        />

        <modal
            @showModal="openModal"
            @uploadFile="onUploadFile"
            :show="showModal"
            :file="previewImage ? previewImage : file ? file : placeholderImage"
            alt="Profile Picture"
            :user="user"
        />
    </div>
</template>

<style>
.clickable-profile {
    cursor: pointer;
    transition: transform 0.2s ease;
}
.clickable-profile:hover {
    transform: scale(1.1);
}
</style>

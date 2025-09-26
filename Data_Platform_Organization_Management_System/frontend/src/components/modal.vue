<script>
export default {
    props: {
        show: Boolean,
        file: String,
        user: Object,
    },
    methods: {
        onChangeFile(e) {
            this.$emit("uploadFile", e.target.files[0]);
        },
        deleteImage() {
            this.$emit("uploadFile", null);
            this.$refs.inputImage.value = null;
        },
    },
};
</script>
<template>
    <div>
        <div v-if="show" id="popup-modal" tabindex="-1" class="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto backdrop-brightness-50">
            <div class="relative w-full max-w-md max-h-full mx-auto h-full flex items-center">
                <div class="relative bg-[#efecec] rounded-lg shadow w-full">
                    <button
                        type="button"
                        class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-neutral-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                        data-modal-hide="popup-modal"
                        @click="$emit('showModal', false)"
                    >
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                    <div class="p-6 text-center">
                        <img :src="file" alt="Profile Picture" class="max-w-[320px] w-full mx-auto rounded-full aspect-square object-cover" />
                        <br />
                        <label
                            class="cursor-pointer hover:bg-neutral-200 disabled:opacity-50 disabled:default text-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-300 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 mr-2"
                            :style="user.role === 'viewer' ? { opacity: '0.5', cursor: 'default' } : {}"
                            :disabled="user.role === 'viewer'"
                        >
                            <input
                                ref="inputImage"
                                @change="onChangeFile"
                                class="hidden"
                                type="file"
                                accept="image/*"
                                :disabled="user.role === 'viewer'"
                            />
                            Edit
                        </label>

                        <button
                            data-modal-hide="popup-modal"
                            type="button"
                            class="text-white bg-red-600 disabled:opacity-50 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                            @click="deleteImage"
                            :disabled="user.role === 'viewer'"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

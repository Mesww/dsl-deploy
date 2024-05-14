<template>
  <nav id="navbar" class="bg-white border rounded-b-3xl">
    <div class="max-w-6xl mx-auto px-10 mt-12 mb-6">
      <div class="flex justify-between">
        <div class="flex items-center">
          <h1 class="textHeaders">คิวของคุณคือคิวที่ {{ queue }}</h1>
        </div>
        <div class="flex items-center">
          <span class="i-heroicons-clock w-8 h-8 mr-3"></span>
          <h1 class="textHeaders">เหลืออีก {{ leftqueue }} คิว</h1>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";

let queue = ref(0);
let leftqueue = ref(0);

const props = defineProps(["queue", "leftqueue"]);

queue.value = props.queue;
leftqueue.value = props.leftqueue;

</script>

<style scoped></style>

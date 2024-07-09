<template>
  <div>
    <div 
      v-if="hasSourceDir"
      class="relative h-full overflow-y-hidden"
    >
      <div :class="`z-50 h-full overflow-y-scroll hide-scrollbar ${openListMusics ? 'invisible' : ''}`">
        <div v-for="file of files"
          class="text-base-white-700 pl-6 mr-1 rounded-sm z-[999] hover:text-base-white-200 text-x1 py-1 my-0.5 font-medium cursor-pointer hover:bg-base-dark-400">
          {{ file }}
        </div>
      </div>
  
      <div
        :class="`absolute w-0.5 rounded-full left-1.5 top-0 h-full bg-base-dark-400 ${openListMusics ? 'invisible' : ''}`">
      </div>"
  
    </div>

    <div v-else
      class="flex jusce h-full py-16 border-2"
    >
      NO DIRECTORY
    </div>
  </div>
</template>


<script setup lang="ts">

</script>
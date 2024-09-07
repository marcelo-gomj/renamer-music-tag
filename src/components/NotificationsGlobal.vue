<template>
  <aside
    class="absolute flex flex-col gap-2 w-[300px] right-6 top-3 "
  >
    <TransitionGroup name="notifications">
      <div
        v-for="({ title, type, id,  context, actionButton }, index) of allNotifications()"
        :key="id"
        :class="[
          'bg-base-dark-200 border-[1.5px] hover:!opacity-100 border-base-dark-900 hover:border-base-white-700' , 
          (index === 0) ? ' border-white' : '!opacity-45',
          ' rounded-md hover:opacity-100 hover:border-base-dark-900 cursor-pointer ',
        ]"
      >
        <header class="flex items-center">
          <div 
            class="flex w-full items-center gap-4 py-3 px-3 h-full"
            @click="_ => actionButton && actionButton(id)"
          >
            <component 
              :is="ICONS_TYPE[type].icon" 
              :class="`${ICONS_TYPE[type].colorIcon} size-[1.25rem] stroke-[1.5]`" 
            />
            <h3 class="line-clamp-2 text-x1 font-medium">{{ title }}</h3>
          </div>
  
          <span
            @click="() => closeNotification(id)"
            class="p-2 h-full hover:scale-105 hover:opacity-100 opacity-70"
          >
            <X class="size-[1rem]" />
          </span>
        </header>
  
        <div
          class="text-x0.5 pt-4"
          v-if="!!context"
        >{{ context }}</div>
      </div>
    </TransitionGroup>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, AlertTriangle, XCircle, CheckCircle2 } from "lucide-vue-next";
import { useNotification } from '../stores/notifications';

const { allNotifications, removeByNotificationId } = useNotification();

const ICONS_TYPE = {
  'SUCCESS' : { icon: CheckCircle2, colorIcon: 'text-green-600' },
  'ALERT' : { icon: AlertTriangle, colorIcon: 'text-yellow-600' },
  "ERROR" : { icon: XCircle, colorIcon: 'text-red-600' },
}

const closeNotification = (id: number) => {
  removeByNotificationId(id); // remove notifications
}
</script>
import { defineStore } from "pinia";
import * as R from "ramda";
import { GlobalNotificationsProps } from "src/types/vue-types";
import { ref, watch } from "vue";

export const useNotification = defineStore('notifications', () => {
  const notifications = ref<GlobalNotificationsProps[]>([]);
  const timeoutNotification = ref<NodeJS.Timeout>(null);

  function notify(notificationProps : GlobalNotificationsProps){
    const lastNotification = R.head(notifications.value);
      
    // close all notifications
    clearTimeout(timeoutNotification.value);
    timeoutNotification.value = setTimeout(() => {
      notifications.value = R.filter(R.propEq('ERROR', 'type'), notifications.value);
    }, 15000);

    if(!lastNotification){
      notifications.value = [notificationProps];
      return;
    }
  
    notifications.value = [lastNotification];
  
    //animation for previous notifications
    setTimeout(() => {
      notifications.value = [ notificationProps, lastNotification];
      console.log(notifications.value)
    }, 200)
  }

  function removeByNotificationId(id: number){
    notifications.value = R.filter(notification => notification.id !== id, notifications.value);
  }

  function clearAll(){
    notifications.value = [];
  }

  function allNotifications(){
    return notifications.value
  }

  return {
    allNotifications,
    notify,
    clearAll,
    removeByNotificationId
  }
})
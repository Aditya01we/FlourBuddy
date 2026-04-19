import notifee, {AndroidImportance, AndroidVisibility} from '@notifee/react-native'
import { requestPermission } from '@react-native-firebase/messaging'

const NotificationServices = {


    createChannel: async () => {
        return await notifee.createChannel({
            id: 'delivery-updates',

            name: 'Delivery Status',

            importance: AndroidImportance.HIGH,

        visibility: AndroidVisibility.PUBLIC,

          sound: 'default',
        })
    },

    requestPermission: async() => {
        await notifee.requestPermission();
    },

    showNotification: async (title, body, isOngoing = false) => {
        const channelId = await NotificationServices.createChannel();


    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        color: '#BC8A45',
        ongoing: isOngoing, 
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
        },
      },
    });
},
  cancelAll: async () => {
    await notifee.cancelAllNotifications();
  }
};

export default NotificationServices;
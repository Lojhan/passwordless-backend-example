export interface pushNotificationResolver {
  configure(): void;
  sendNotification(
    appId: string,
    userId: string | string[],
    notification: any,
  ): Promise<void>;
}

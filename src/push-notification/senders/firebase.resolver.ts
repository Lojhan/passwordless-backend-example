import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

import { default as messagingConfiguration } from '../../config/firebase-configuration';
import { pushNotificationResolver } from './push-notification-resolver.interface';

@Injectable()
export class FireBase implements pushNotificationResolver {
  private _projectItems = new Map<string, ProjectData>();

  private projects(): Array<ProjectConfiguration> {
    return messagingConfiguration.projects as ProjectConfiguration[];
  }

  configure(): void {
    this.projects().forEach((project) => {
      const ref = admin.initializeApp({
        credential: admin.credential.cert(project.serviceAccount),
        databaseURL: project.databaseURL,
      });
      const appData = {
        id: project.id,
        ref,
        serverKey: project.serverKey,
      } as ProjectData;
      this._projectItems.set(appData.id, appData);
    });
  }

  getProjectData(projectId: string): ProjectData {
    const data = this._projectItems.get(projectId);
    if (!data) {
      throw new Error('project not found');
    }
    return data;
  }

  async sendNotification(
    projectId: string,
    token: string | string[],
    notification: any,
    data?: any,
  ): Promise<any> {
    try {
      const project = this.getProjectData(projectId);
      if (Array.isArray(token))
        token.forEach(async (t) =>
          admin.messaging(project.ref).send({ ...notification, t }),
        );
      else
        await admin.messaging(project.ref).send({ token, notification, data });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
}

export type ProjectConfiguration = {
  id: string;
  serverKey: string;
  databaseURL: string;
  serviceAccount: any;
};

export type ProjectData = {
  id: string;
  ref: any;
  serverKey: string;
};

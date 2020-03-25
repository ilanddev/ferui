export interface IQueueItem {
  main<T>(something?: T);
}

export class DatagridTaskManagerService {
  private queueItems = {};
  private numberOfTasks: number = 0;

  addQueueItemForTopic(queueItem: IQueueItem, topic: string) {
    if (this.queueItems[topic] === undefined) {
      this.queueItems[topic] = [queueItem];
    } else {
      this.queueItems[topic].push(queueItem);
    }
    this.numberOfTasks++;
  }

  processItemsForQueueTopic(topic: string) {
    for (const item of this.queueItems[topic]) {
      item.main();
      this.numberOfTasks--;
    }

    this.queueItems[topic] = [];
  }

  get length(): number {
    return this.numberOfTasks;
  }
}

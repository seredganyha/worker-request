import { WorkerInternalMessage, WorkerRequest, WorkerResponse } from "./types";
import { v4 as uuidv4 } from 'uuid';

export default class WorkerQuery extends Worker {
  private pendingRequests: Map<string, (response: WorkerResponse) => void> = new Map();

  constructor(scriptURL: string | URL, options?: WorkerOptions) {
    super(scriptURL, options);

    this.onmessage = (event: MessageEvent<WorkerInternalMessage>) => {
      const { requestId } = event.data;
      const pendingFn = this.pendingRequests.get(requestId);

      if (pendingFn) {
        pendingFn(event.data);
      }
    };
  }

  query<T extends WorkerResponse>(request: WorkerRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      const waitPendingFn = (response: WorkerResponse) => {
        resolve(response as T);
      };

      const internalRequest = {...request, requestId: uuidv4()}

      this.postMessage(internalRequest);
      this.pendingRequests.set(internalRequest.requestId, waitPendingFn);
    });
  }
}
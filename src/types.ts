export interface WorkerMessage {
  command: string;
}

export interface WorkerInternalMessage<T = unknown> extends WorkerRequest<T> {
  requestId: string;
  source: string
}

export interface WorkerRequest<T = unknown> extends WorkerMessage {
  payload: T;
}

export interface WorkerResponse<T = unknown> extends WorkerMessage {
  payload: T;
}

export type Constructor = new (...args: any[]) => {};
import { Constructor, WorkerInternalMessage, WorkerRequest, WorkerResponse } from "./types";

export default function worker<TBase extends Constructor>(Base: TBase) {

  return class extends Base {
    // the anonymous class property can't be private
    // https://github.com/microsoft/TypeScript/issues/30355
    #controls!: Map<string, (...args: any[]) => any>;

    get controls() {
      return this.#controls;
    }

    constructor(...args: any[]) {
      super(...args);
      this.bindHandlers();

      onmessage = async (event: MessageEvent<WorkerInternalMessage>) => {
        const request = event.data;

        if (request.source === 'easy-worker') {
          this.messageProcessing(request);
        }        
      };
    }

    async messageProcessing(request: WorkerInternalMessage) {
      const { command, payload } = request;

      const handler = this.controls.get(command);

      if (handler) {
        const payloadRes = await handler(payload);
        const response = this.createResponse(payloadRes, request);
        this.sendResponse(response);
      }
    }

    bindHandlers() {
      for(let entry of this.controls) {
        const [command, handler] = entry;
        this.controls.set(command, handler.bind(this));
      }
    }

    createResponse(payload: any, request: WorkerRequest) {
      return {...request, payload};
    }

    sendResponse(response: WorkerResponse) {
      postMessage(response);
    }
  }
}
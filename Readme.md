# Worker-Query

Worker-Query — это библиотека на TypeScript, которая позволяет работать с Web Worker в декларативном стиле и взаимодействовать в формате запрос-ответ.   

### Пример
#### 1. Создай воркер 
test.worker
```ts 
@worker
class CalculatorWorker {}

//test.worker.ts
```
#### 2. Добавь котроллеры.
 ```ts
 @worker
class CalculatorWorker {
    @control('add') 
    add (payload: {a: number, b: number}) {
        return payload.a + payload.b;
    }
    // другие контролы
}

const calculateWorker = new CalculatorWorker();
//test.worker.ts
 ```
#### 3.Создай экземпляр WorkerQuery
 ```ts
const calculateWorker = new WorkerQuery('./test.worker.js');

async function add() {
    const payload = {a: 5, b: 10};
    const res: WorkerResponse<number> = await calculateWorker.query({command: 'add', payload);
    
    console.log(res.payload) // 15
}
//test.worker.ts
 ```
 
## Установка
```sh
npm i web-worker-query
```
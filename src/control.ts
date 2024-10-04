export default function control(control: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.controls) {
      target.controls = new Map();
    }

    target.controls.set(control, descriptor.value);
  };
}
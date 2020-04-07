import ResizeObserver from 'resize-observer-polyfill';

export interface ObserverInstance {
  observer: IntersectionObserver;
  resizeObserver: ResizeObserver;
  targets: Element[];
}

export class DomObserver {
  // This is an util class, we shouldn't be able to instanciate it.
  private constructor() {}

  static observe(
    element: Element,
    intersectCallback: IntersectionObserverCallback,
    resizeCallback?: ResizeObserverCallback
  ): ObserverInstance {
    if (!element) {
      throw new Error('You need at least one target to observe.');
    }
    const observer: IntersectionObserver = intersectCallback ? new IntersectionObserver(intersectCallback) : undefined;
    const resizeObserver: ResizeObserver = resizeCallback ? new ResizeObserver(resizeCallback) : undefined;
    if (observer) {
      observer.observe(element);
    }
    if (resizeObserver) {
      resizeObserver.observe(element);
    }
    return {
      observer: observer,
      resizeObserver: resizeObserver,
      targets: [element]
    };
  }

  static observeMultiple(
    elements: Element[],
    intersectCallback?: IntersectionObserverCallback,
    resizeCallback?: ResizeObserverCallback
  ): ObserverInstance {
    if (!elements || !Array.isArray(elements) || (Array.isArray(elements) && elements.length <= 0)) {
      throw new Error('You need at least one target to observe.');
    }
    const observer: IntersectionObserver = intersectCallback ? new IntersectionObserver(intersectCallback) : undefined;
    const resizeObserver: ResizeObserver = resizeCallback ? new ResizeObserver(resizeCallback) : undefined;
    elements.forEach(element => {
      if (observer) {
        observer.observe(element);
      }
      if (resizeObserver) {
        resizeObserver.observe(element);
      }
    });
    return {
      observer: observer,
      resizeObserver: resizeObserver,
      targets: elements
    };
  }

  static unObserve(observerInstance: ObserverInstance): void {
    if (!observerInstance) {
      return;
    }
    observerInstance.targets.forEach(target => {
      if (observerInstance.observer) {
        observerInstance.observer.unobserve(target);
      }
      if (observerInstance.resizeObserver) {
        observerInstance.resizeObserver.unobserve(target);
      }
    });
  }
}

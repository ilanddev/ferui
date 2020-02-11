import { DebugElement, InjectionToken, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FeruiModule } from '../../ferui-components.module';

export class TestContext<D, C> {
  fixture: ComponentFixture<C>;
  testComponent: C;
  testElement: any;
  feruiDirective: D;
  feruiElement: any;

  private readonly feruiDebugElement: DebugElement;

  constructor(feruiDirectiveType: Type<D>, componentType: Type<C>) {
    this.fixture = TestBed.createComponent(componentType);
    this.fixture.detectChanges();
    this.testComponent = this.fixture.componentInstance;
    this.testElement = this.fixture.nativeElement;
    this.feruiDebugElement = this.fixture.debugElement.query(By.directive(feruiDirectiveType));
    if (!this.feruiDebugElement) {
      const componentName = (<any>componentType).name;
      const feruiDirectiveName = (<any>feruiDirectiveType).name;
      throw new Error(`Test component ${componentName} doesn't contain a ${feruiDirectiveName}`);
    }
    this.feruiDirective = this.feruiDebugElement.injector.get(feruiDirectiveType);
    this.feruiElement = this.feruiDebugElement.nativeElement;
  }

  // The Function type here is just to tell Typescript to be nice with abstract classes. Weird.
  getFeruiProvider<T>(token: Type<T> | InjectionToken<T> | Function): T {
    return this.feruiDebugElement.injector.get(token);
  }

  /**
   * Delegate method to avoid verbosity
   */
  detectChanges() {
    this.fixture.detectChanges();
  }
}

export function addHelpers(): void {
  beforeEach(function() {
    this.create = <D, C>(
      feruiDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = []
    ) => {
      TestBed.configureTestingModule({
        imports: [FeruiModule],
        declarations: [testComponent, ...extraDirectives],
        providers: providers
      });
      return (this._context = new TestContext<D, C>(feruiDirective, testComponent));
    };

    this.createOnly = <D, C>(
      feruiDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = []
    ) => {
      TestBed.configureTestingModule({
        declarations: [feruiDirective, testComponent, ...extraDirectives],
        providers: providers
      });
      return (this._context = new TestContext<D, C>(feruiDirective, testComponent));
    };

    this.createWithOverride = <D, C>(
      feruiDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = [],
      serviceOverrides: any[]
    ) => {
      TestBed.configureTestingModule({
        imports: [FeruiModule],
        declarations: [testComponent, ...extraDirectives],
        providers: providers
      }).overrideComponent(feruiDirective, {
        set: {
          providers: serviceOverrides
        }
      });
      return (this._context = new TestContext<D, C>(feruiDirective, testComponent));
    };
  });
  afterEach(function() {
    if (this._context) {
      this._context.fixture.destroy();
    }
  });
}

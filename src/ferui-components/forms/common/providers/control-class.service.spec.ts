import { ControlClassService } from './control-class.service';

export default function(): void {
  describe('ControlClassService', function() {
    let service;
    beforeEach(() => {
      service = new ControlClassService();
    });

    it('should return no extra classes when not invalid', function() {
      expect(service.controlClass()).toBe('');
    });

    it('should return fui-error when invalid', function() {
      expect(service.controlClass(true)).toBe('fui-error');
    });

    it('should init the control class', function() {
      const renderer = {
        removeClass: jasmine.createSpy()
      };
      const element = document.createElement('input');
      element.className = 'test-class';
      service.initControlClass(renderer, element);
      expect(service.className).toEqual('test-class');
      expect(renderer.removeClass).not.toHaveBeenCalled();
      element.className = 'fui-other test-class';
      service.initControlClass(renderer, element);
      expect(service.className).toEqual('fui-other test-class');
      expect(renderer.removeClass).toHaveBeenCalledWith(element, 'fui-other');
    });

    it('should return any classes provided by default', function() {
      service.className = 'test-class';
      expect(service.controlClass(false, false)).toContain('test-class');
    });

    it('should return any additional classes passed by the control', function() {
      service.className = 'test-class';
      expect(service.controlClass(false, 'extra-class')).toBe('test-class extra-class');
    });
  });
}

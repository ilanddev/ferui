import { Component } from '@angular/core';
import * as jsBeautify from 'js-beautify';

@Component({
  selector: 'tabs-demo-example',
  template: `
    <h1 class="code-line mt-4">Fui Virtual Scroller</h1>
    <hr />
    <h2>Overview</h2>
    <p>
      We've forked <a href="https://github.com/rintoj/ngx-virtual-scroller" target="_blank">ngx-virtual-scoller</a> and adapt it
      for our needs.<br />
      Refer to our docs to understand how it works, but their demo page is still relevant.
    </p>
    <p class="has-line-data">
      Virtual Scroll displays a virtual, “infinite” list. Supports horizontal/vertical, variable heights, &amp; multi-column.
    </p>
    <h2 class="code-line">About</h2>
    <p class="has-line-data">
      This module displays a small subset of records just enough to fill the viewport and uses the same DOM elements as the user
      scrolls.<br />
      This method is effective because the number of DOM elements are always constant and tiny irrespective of the size of the
      list. Thus virtual scroll can display an infinitely growing list of items in an efficient way.
    </p>
    <ul>
      <li class="has-line-data">Supports multi-column</li>
      <li class="has-line-data">Easy to use apis</li>
      <li class="has-line-data">OpenSource and available in GitHub</li>
    </ul>

    <h2 class="code-line"><a id="Demo_42"></a>Demo</h2>
    <p class="has-line-data">
      <a target="_blank" href="https://rintoj.github.io/ngx-virtual-scroller/demo">See Demo Here</a>
    </p>

    <h2 class="code-line"><a id="Usage_46"></a>Usage</h2>
    <p class="has-line-data">Preferred option:</p>

    <pre><code [languages]="['html']" [highlight]="codeExample1"></code></pre>

    <p class="has-line-data">
      option 2:<br />
      note: viewPortItems must be a public field to work with AOT
    </p>

    <pre><code [languages]="['html']" [highlight]="codeExample2"></code></pre>

    <p class="has-line-data">
      option 3:<br />
      note: viewPortItems must be a public field to work with AOT
    </p>
    <pre><code [languages]="['html']" [highlight]="codeExample3"></code></pre>

    <h2 class="code-line"><a id="Get_Started_74"></a>Get Started</h2>
    <p class="has-line-data"><strong>Step 1:</strong> Wrap virtual-scroller tag around elements;</p>

    <pre><code [languages]="['html']" [highlight]="codeExample4"></code></pre>

    <p class="has-line-data">
      You must also define width and height for the container and for its children.
    </p>

    <pre><code [languages]="['css']" [highlight]="codeExample5"></code></pre>

    <p class="has-line-data"><strong>Step 2:</strong> Create ‘my-custom-component’ component.</p>
    <p class="has-line-data">
      ‘my-custom-component’ must be a custom angular2 component, outside of this library.
    </p>
    <p class="has-line-data">
      Child component is not necessary if your item is simple enough. See below.
    </p>

    <pre><code [languages]="['html']" [highlight]="codeExample6"></code></pre>

    <h2 class="code-line"><a id="Interfaces_138"></a>Interfaces</h2>

    <pre><code [languages]="['typescript']" [highlight]="codeExample7"></code></pre>

    <h2><a id="API_151"></a>API</h2>
    <table class="fui-table table-striped">
      <thead>
        <tr>
          <th>Attribute</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>checkResizeInterval</td>
          <td>number</td>
          <td>
            How often in milliseconds to check if virtual-scroller (or parentScroll) has been resized. If resized, it’ll call
            Refresh() method. Defaults to 1000.
          </td>
        </tr>
        <tr>
          <td>resizeBypassRefreshThreshold</td>
          <td>number</td>
          <td>
            How many pixels to ignore during resize check if virtual-scroller (or parentScroll) are only resized by a very small
            amount. Defaults to 5.
          </td>
        </tr>
        <tr>
          <td>enableUnequalChildrenSizes</td>
          <td>boolean</td>
          <td>
            If you want to use the “unequal size” children feature. This is not perfect, but hopefully “close-enough” for most
            situations. Defaults to false.
          </td>
        </tr>
        <tr>
          <td>scrollDebounceTime</td>
          <td>number</td>
          <td>
            Milliseconds to delay refreshing viewport if user is scrolling quickly (for performance reasons). Default is 0.
          </td>
        </tr>
        <tr>
          <td>scrollThrottlingTime</td>
          <td>number</td>
          <td>
            Milliseconds to delay refreshing viewport if user is scrolling quickly (for performance reasons). Default is 0.
          </td>
        </tr>
        <tr>
          <td>useMarginInsteadOfTranslate</td>
          <td>boolean</td>
          <td>
            Defaults to false. Translate is faster in many scenarios because it can use GPU acceleration, but it can be slower if
            your scroll container or child elements don’t use any transitions or opacity. More importantly, translate creates a
            new “containing block” which breaks position:fixed because it’ll be relative to the transform rather than the window.
            If you’re experiencing issues with position:fixed on your child elements, turn this flag on.
          </td>
        </tr>
        <tr>
          <td>modifyOverflowStyleOfParentScroll</td>
          <td>boolean</td>
          <td>
            Defaults to true. Set to false if you want to prevent ngx-virtual-scroller from automatically changing the overflow
            style setting of the parentScroll element to ‘scroll’.
          </td>
        </tr>
        <tr>
          <td>scrollbarWidth</td>
          <td>number</td>
          <td>
            If you want to override the auto-calculated scrollbar width. This is used to determine the dimensions of the viewable
            area when calculating the number of items to render.
          </td>
        </tr>
        <tr>
          <td>scrollbarHeight</td>
          <td>number</td>
          <td>
            If you want to override the auto-calculated scrollbar height. This is used to determine the dimensions of the viewable
            area when calculating the number of items to render.
          </td>
        </tr>
        <tr>
          <td>horizontal</td>
          <td>boolean</td>
          <td>Whether the scrollbars should be vertical or horizontal. Defaults to false.</td>
        </tr>
        <tr>
          <td>items</td>
          <td>any[]</td>
          <td>
            The data that builds the templates within the virtual scroll. This is the same data that you’d pass to ngFor. It’s
            important to note that when this data has changed, then the entire virtual scroll is refreshed.
          </td>
        </tr>
        <tr>
          <td>stripedTable</td>
          <td>boolean</td>
          <td>
            Defaults to false. Set to true if you use a striped table. In this case, the rows will be added/removed two by two to
            keep the strips consistent.
          </td>
        </tr>
        <tr>
          <td>bufferAmount</td>
          <td>number</td>
          <td>
            The number of elements to be rendered above &amp; below the current container’s viewport. Increase this if
            enableUnequalChildrenSizes isn’t working well enough. (defaults to enableUnequalChildrenSizes ? 5 : 0)
          </td>
        </tr>
        <tr>
          <td>scrollAnimationTime</td>
          <td>number</td>
          <td>
            The time in milliseconds for the scroll animation to run for. Default value is 750. 0 will completely disable the
            tween/animation.
          </td>
        </tr>
        <tr>
          <td>parentScroll</td>
          <td>Element / Window</td>
          <td>Element (or window), which will have scrollbar. This element must be one of the parents of virtual-scroller</td>
        </tr>
        <tr>
          <td>compareItems</td>
          <td>Function</td>
          <td>
            Predicate of syntax (item1:any, item2:any)=&gt;boolean which is used when items array is modified to determine which
            items have been changed (determines if cached child size measurements need to be refreshed or not for
            enableUnequalChildrenSizes). Defaults to === comparison.
          </td>
        </tr>
        <tr>
          <td>vsStart</td>
          <td>Event&lt;IPageInfo&gt;</td>
          <td>This event is fired every time <code>start</code> index changes and emits <code>IPageInfo</code>.</td>
        </tr>
        <tr>
          <td>vsEnd</td>
          <td>Event&lt;IPageInfo&gt;</td>
          <td>This event is fired every time <code>end</code> index changes and emits <code>IPageInfo</code>.</td>
        </tr>
        <tr>
          <td>vsChange</td>
          <td>Event&lt;IPageInfo&gt;</td>
          <td>
            This event is fired every time the <code>start</code> or <code>end</code> indexes or scroll position change and emits
            <code>IPageInfo</code>.
          </td>
        </tr>
        <tr>
          <td>vsUpdate</td>
          <td>Event&lt;any[]&gt;</td>
          <td>
            This event is fired every time the <code>start</code> or <code>end</code> indexes change and emits the list of items
            which should be visible based on the current scroll position from <code>start</code> to <code>end</code>. The list
            emitted by this event must be used with <code>*ngFor</code> to render the actual list of items within
            <code>&lt;virtual-scroller&gt;</code>
          </td>
        </tr>
        <tr>
          <td>viewPortInfo</td>
          <td>IPageInfo</td>
          <td>Allows querying the the current viewport info on demand rather than listening for events.</td>
        </tr>
        <tr>
          <td>viewPortItems</td>
          <td>any[]</td>
          <td>The array of items currently being rendered to the viewport.</td>
        </tr>
        <tr>
          <td>refresh</td>
          <td>()=&gt;void</td>
          <td>Function to force re-rendering of current items in viewport.</td>
        </tr>
        <tr>
          <td>invalidateAllCachedMeasurements</td>
          <td>()=&gt;void</td>
          <td>
            Function to force re-measuring <em>all</em> cached item sizes. If enableUnequalChildrenSizes===false, only 1 item will
            be re-measured.
          </td>
        </tr>
        <tr>
          <td>invalidateCachedMeasurementForItem</td>
          <td>(item:any)=&gt;void</td>
          <td>Function to force re-measuring cached item size.</td>
        </tr>
        <tr>
          <td>invalidateCachedMeasurementAtIndex</td>
          <td>(index:number)=&gt;void</td>
          <td>Function to force re-measuring cached item size.</td>
        </tr>
        <tr>
          <td>scrollInto</td>
          <td>
            (item:any, alignToBeginning:boolean = true, additionalOffset:number = 0, animationMilliseconds:number = undefined,
            animationCompletedCallback:()=&gt;void = undefined)=&gt;void
          </td>
          <td>Scrolls to item</td>
        </tr>
        <tr>
          <td>scrollToIndex</td>
          <td>
            (index:number, alignToBeginning:boolean = true, additionalOffset:number = 0, animationMilliseconds:number = undefined,
            animationCompletedCallback:()=&gt;void = undefined)=&gt;void
          </td>
          <td>Scrolls to item at index</td>
        </tr>
        <tr>
          <td>scrollToPosition</td>
          <td>
            (scrollPosition:number, animationMilliseconds:number = undefined, animationCompletedCallback: ()=&gt;void =
            undefined)=&gt;void
          </td>
          <td>Scrolls to px position</td>
        </tr>
        <tr>
          <td>ssrChildWidth</td>
          <td>number</td>
          <td>
            The hard-coded width of the item template’s cell to use if rendering via Angular Universal/Server-Side-Rendering
          </td>
        </tr>
        <tr>
          <td>ssrChildHeight</td>
          <td>number</td>
          <td>
            The hard-coded height of the item template’s cell to use if rendering via Angular Universal/Server-Side-Rendering
          </td>
        </tr>
        <tr>
          <td>ssrViewportWidth</td>
          <td>number</td>
          <td>
            The hard-coded visible width of the virtual-scroller (or [parentScroll]) to use if rendering via Angular
            Universal/Server-Side-Rendering. Defaults to 1920.
          </td>
        </tr>
        <tr>
          <td>ssrViewportHeight</td>
          <td>number</td>
          <td>
            The hard-coded visible height of the virtual-scroller (or [parentScroll]) to use if rendering via Angular
            Universal/Server-Side-Rendering. Defaults to 1080.
          </td>
        </tr>
      </tbody>
    </table>
    <h2 class="code-line"><a id="Use_parent_scrollbar_195"></a>Use parent scrollbar</h2>
    <p class="has-line-data">
      If you want to use the scrollbar of a parent element, set <code>parentScroll</code> to a native DOM element.
    </p>

    <pre><code [languages]="['html']" [highlight]="codeExample8"></code></pre>

    <p class="has-line-data">
      If the parentScroll is a custom angular component (instead of a native HTML element such as DIV), Angular will wrap the
      #scrollingBlock variable in an ElementRef
      <a href="https://angular.io/api/core/ElementRef">https://angular.io/api/core/ElementRef</a> in which case you’ll need to use
      the .nativeElement property to get to the underlying javascript DOM element reference.
    </p>

    <pre><code [languages]="['html']" [highlight]="codeExample9"></code></pre>

    <p class="has-line-data">
      Note: The parent element should have a width and height defined.
    </p>
    <h2 class="code-line"><a id="Use_scrollbar_of_window_227"></a>Use scrollbar of window</h2>
    <p class="has-line-data">If you want to use the window’s scrollbar, set <code>parentScroll</code>.</p>

    <pre><code [languages]="['html']" [highlight]="codeExample10"></code></pre>

    <h2 class="code-line"><a id="Items_with_variable_size_241"></a>Items with variable size</h2>
    <p class="has-line-data">
      Items must have fixed height and width for this module to work perfectly. If not, set [enableUnequalChildrenSizes]=“true”.
    </p>

    <pre><code [languages]="['html']" [highlight]="codeExample11"></code></pre>

    <h2 class="code-line"><a id="Loading_in_chunks_256"></a>Loading in chunks</h2>
    <p class="has-line-data">
      The event <code>vsEnd</code> is fired every time the scrollbar reaches the end of the list. You could use this to
      dynamically load more items at the end of the scroll. See below.
    </p>

    <pre><code [languages]="['typescript']" [highlight]="codeExample12"></code></pre>

    <h2 class="code-line"><a id="With_HTML_Table_299"></a>With HTML Table</h2>
    <p class="has-line-data">
      Note: The #header angular selector will make the &lt;thead&gt; element fixed to top. If you want the header to scroll out of
      view don’t add the #header angular element ref.
    </p>

    <pre><code [languages]="['html']" [highlight]="codeExample13"></code></pre>

    <h2 class="code-line"><a id="If_child_size_changes_326"></a>If child size changes</h2>
    <p class="has-line-data">
      virtual-scroller caches the measurements for the rendered items. If enableUnequalChildrenSizes===true then each item is
      measured and cached separately. Otherwise, the 1st measured item is used for all items.<br />
      If your items can change sizes dynamically, you’ll need to notify virtual-scroller to re-measure them. There are 3 methods
      for doing this:
    </p>

    <pre><code [languages]="['typescript']" [highlight]="codeExample14"></code></pre>

    <h2 class="code-line">
      <a id="If_child_view_state_is_reverted_after_scrolling_away__back_335"></a>If child view state is reverted after scrolling
      away &amp; back
    </h2>
    <p class="has-line-data">
      virtual-scroller essentially uses *ngIf to remove items that are scrolled out of view. This is what gives the performance
      benefits compared to keeping all the off-screen items in the DOM.
    </p>
    <p class="has-line-data">
      Because of the *ngIf, Angular completely forgets any view state. If your component has the ability to change state, it’s
      your app’s responsibility to retain that viewstate in your own object which data-binds to the component.
    </p>
    <p class="has-line-data">
      For example, if your child component can expand/collapse via a button, most likely scrolling away &amp; back will cause the
      expansion state to revert to the default state.
    </p>
    <p class="has-line-data">
      To fix this, you’ll need to store any “view” state properties in a variable &amp; data-bind to it so that it can be restored
      when it gets removed/re-added from the DOM.
    </p>
    <p class="has-line-data">Example:</p>

    <pre><code [languages]="['html']" [highlight]="codeExample15"></code></pre>

    <h2 class="code-line"><a id="If_container_size_changes_352"></a>If container size changes</h2>
    <p class="has-line-data">
      Note: This should now be auto-detected, however the ‘refresh’ method can still force it if neeeded.<br />
      This was implemented using the setInterval method which may cause minor performance issues. It shouldn’t be noticeable, but
      can be disabled via [checkResizeInterval]=“0”<br />
      Performance will be improved once “Resize Observer” (<a href="https://wicg.github.io/ResizeObserver/"
        >https://wicg.github.io/ResizeObserver/</a
      >) is fully implemented.
    </p>

    <h2 class="code-line"><a id="Focus_an_item_387"></a>Focus an item</h2>
    <p class="has-line-data">
      You can use the
      <code>scrollInto(item, alignToBeginning?, additionalOffset?, animationMilliseconds?, animationCompletedCallback?)</code>
      api to scroll into an item in the list.<br />
      You can also use the
      <code>scrollToIndex(index, alignToBeginning?, additionalOffset?, animationMilliseconds?, animationCompletedCallback?)</code>
      api for the same purpose.<br />
      See below:
    </p>

    <pre><code [languages]="['typescript']" [highlight]="codeExample17"></code></pre>

    <h2 class="code-line">
      <a id="Dependency_Injection_of_configuration_settings_420"></a>Dependency Injection of configuration settings
    </h2>
    <p class="has-line-data">
      Some default config settings can be overridden via DI, so you can set them globally instead of on each instance of
      virtual-scroller.
    </p>

    <pre><code [languages]="['typescript']" [highlight]="codeExample18"></code></pre>

    <p class="has-line-data">OR</p>

    <pre><code [languages]="['typescript']" [highlight]="codeExample19"></code></pre>

    <h2 class="code-line"><a id="Sorting_Items_458"></a>Sorting Items</h2>
    <p class="has-line-data">
      Always be sure to send an immutable copy of items to virtual scroll to avoid unintended behavior. You need to be careful
      when doing non-immutable operations such as sorting:
    </p>

    <pre><code [languages]="['typescript']" [highlight]="codeExample20"></code></pre>

    <h2 class="code-line"><a id="Hide_Scrollbar_468"></a>Hide Scrollbar</h2>
    <p class="has-line-data">
      This hacky CSS allows hiding a scrollbar while still enabling scroll through mouseWheel/touch/pageUpDownKeys
    </p>

    <pre><code [languages]="['css']" [highlight]="codeExample21"></code></pre>

    <h2 class="code-line"><a id="Additional_elements_in_scroll_481"></a>Additional elements in scroll</h2>
    <p class="has-line-data">
      If you want to nest additional elements inside virtual scroll besides the list itself (e.g. search field), you need to wrap
      those elements in a tag with an angular selector name of #container.
    </p>

    <pre><code [languages]="['html']" [highlight]="codeExample22"></code></pre>

    <h2 class="code-line"><a id="Performance__TrackBy_495"></a>Performance - TrackBy</h2>
    <p class="has-line-data">
      virtual-scroller uses *ngFor to render the visible items. When an *ngFor array changes, Angular uses a trackBy function to
      determine if it should re-use or re-generate each component in the loop.<br />
      For example, if 5 items are visible and scrolling causes 1 item to swap out but the other 4 remain visible, there’s no
      reason Angular should re-generate those 4 components from scratch, it should reuse them.<br />
      A trackBy function must return either a number or string as a unique identifier for your object.<br />
      If the array used by *ngFor is of type number[] or string[], Angular’s default trackBy function will work automatically, you
      don’t need to do anything extra.<br />
      If the array used by *ngFor is of type any[], you must code your own trackBy function.
    </p>
    <p class="has-line-data">Here’s an example of how to do this:</p>

    <pre><code [languages]="['html']" [highlight]="codeExample23"></code></pre>
    <pre><code [languages]="['typescript']" [highlight]="codeExample24"></code></pre>

    <h2 class="code-line"><a id="Performance__ChangeDetection_523"></a>Performance - ChangeDetection</h2>
    <p class="has-line-data">
      virtual-scroller is coded to be extremely fast. If scrolling is slow in your app, the issue is with your custom component
      code, not with virtual-scroller itself.<br />
      Below is an explanation of how to correct your code. This will make your entire app much faster, including virtual-scroller.
    </p>
    <p class="has-line-data">
      Each component in Angular by default uses the ChangeDetectionStrategy.Default “CheckAlways” strategy. This means that Change
      Detection cycles will be running constantly which will check <em>EVERY</em> data-binding expression on
      <em>EVERY</em> component to see if anything has changed.<br />
      This makes it easier for programmers to code apps, but also makes apps extremely slow.
    </p>
    <p class="has-line-data">
      If virtual-scroller feels slow, a possible quick solution that masks the real problem is to use scrollThrottlingTime or
      scrollDebounceTime APIs.
    </p>
    <p class="has-line-data">
      The correct fix is to make cycles as fast as possible and to avoid unnecessary ChangeDetection cycles. Cycles will be faster
      if you avoid complex logic in data-bindings. You can avoid unnecessary Cycles by converting your components to use
      ChangeDetectionStrategy.OnPush.
    </p>
    <p class="has-line-data">
      ChangeDetectionStrategy.OnPush means the consuming app is taking full responsibility for telling Angular when to run change
      detection rather than allowing Angular to figure it out itself. For example, virtual-scroller has a bound property
      [items]=“myItems”. If you use OnPush, you have to tell Angular when you change the myItems array, because it won’t determine
      this automatically.<br />
      OnPush is much harder for the programmer to code. You have to code things differently: This means 1) avoid mutating state on
      any bound properties where possible &amp; 2) manually running change detection when you do mutate state.<br />
      OnPush can be done on a component-by-component basis, however I recommend doing it for <em>EVERY</em> component in your app.
    </p>
    <p class="has-line-data">
      If your biggest priority is making virtual-scroller faster, the best candidates for OnPush will be all custom components
      being used as children underneath virtual-scroller. If you have a hierarchy of multiple custom components under
      virtual-scroller, ALL of them need to be converted to OnPush.
    </p>

    <p class="has-line-data">
      The ManualChangeDetection/Util classes are helpers that can be copy/pasted directly into your app. The code for
      MyEntryLevelAppComponent &amp; SomeRandomComponentWhichUsesOnPush are examples that you’ll need to modify for your specific
      app. If you follow this pattern, OnPush is much easier to implement. However, the really hard part is analyzing all of your
      code to determine <em>where</em> you’re mutating state. Unfortunately there’s no magic bullet for this, you’ll need to spend
      a lot of time reading/debugging/testing your code.
    </p>
    <h2 class="code-line">
      <a id="Performance__scrollDebounceTime__scrollThrottlingTime_636"></a>Performance - scrollDebounceTime /
      scrollThrottlingTime
    </h2>
    <p class="has-line-data">
      These APIs are meant as a quick band-aid fix for performance issues. Please read the other performance sections above to
      learn the correct way to fix performance issues.
    </p>
    <p class="has-line-data">
      Without these set, virtual-scroller will refresh immediately whenever the user scrolls.<br />
      Throttle will delay refreshing until # milliseconds after scroll started. As the user continues to scroll, it will wait the
      same # milliseconds in between each successive refresh. Even if the user stops scrolling, it will still wait the allocated
      time before the final refresh.<br />
      Debounce won’t refresh until the user has stopped scrolling for # milliseconds.<br />
      If both Debounce &amp; Throttling are set, debounce takes precedence.<br />
      Note: If virtual-scroller hasn’t refreshed &amp; the user has scrolled past bufferAmount, no child items will be rendered
      and virtual-scroller will appear blank. This may feel confusing to the user. You may want to have a spinner or loading
      message display when this occurs.
    </p>
    <h2 class="code-line"><a id="Angular_Universal__ServerSide_Rendering_646"></a>Angular Universal / Server-Side Rendering</h2>
    <p class="has-line-data">
      The initial SSR render isn’t a fully functioning site, it’s essentially an HTML “screenshot” (HTML/CSS, but no JS). However,
      it immediately swaps out your “screenshot” with the real site as soon as the full app has downloaded in the background. The
      intent of SSR is to give a correct visual very quickly, because a full angular app could take a long time to download. This
      makes the user <em>think</em> your site is fast, because hopefully they won’t click on anything that requires JS before the
      fully-functioning site has finished loading in the background. Also, it allows screen scrapers without javascript to work
      correctly (example: Facebook posts/etc).<br />
      virtual-scroller relies on javascript APIs to measure the size of child elements and the scrollable area of their parent.
      These APIs do not work in SSR because the HTML/CSS “screenshot” is generated on the server via Node, it doesn’t
      execute/render the site as a browser would. This means virtual-scroller will see all measurements as undefined and the
      “screenshot” will not be generated correctly. Most likely, only 1 child element will appear in your virtual-scroller. This
      “screenshot” can be fixed with polyfills. However, when the browser renders the “screenshot”, the scrolling behaviour still
      won’t work until the full app has loaded.
    </p>
    <p class="has-line-data">
      SSR is an advanced (and complex) topic that can’t be fully addressed here. Please research this on your own. However, here
      are some suggestions:
    </p>
    <ol>
      <li class="has-line-data">
        Use <a href="https://www.npmjs.com/package/domino">https://www.npmjs.com/package/domino</a> and
        <a href="https://www.npmjs.com/package/raf">https://www.npmjs.com/package/raf</a> polyfills in your main.server.ts file
      </li>
    </ol>

    <pre><code [languages]="['typescript']" [highlight]="codeExample25"></code></pre>

    <ol start="2">
      <li class="has-line-data">
        Determine a default screen size you want to use for the SSR “screenshot” calculations (suggestion: 1920x1080). This won’t
        be accurate for all users, but will hopefully be close enough. Once the full Angular app loads in the background, their
        real device screensize will take over.
      </li>
      <li class="has-line-data">
        Run your app in a real browser without SSR and determine the average width/height of the child elements inside
        virtual-scroller as well as the width/height of the virtual-scroller (or [parentScroll] element). Use these values to set
        the [ssrChildWidth]/[ssrChildHeight]/[ssrViewportWidth]/[ssrViewportHeight] properties.
      </li>
    </ol>

    <pre><code [languages]="['html']" [highlight]="codeExample26"></code></pre>
  `
})
export class VirtualScrollerDemo {
  codeExample1: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="items">
    <my-custom-component *ngFor="let item of scroll.viewPortItems">
    </my-custom-component>
</fui-virtual-scroller>`);
  codeExample2: string = jsBeautify.html(`<fui-virtual-scroller [items]="items" (vsUpdate)="viewPortItems = $event">
    <my-custom-component *ngFor="let item of viewPortItems">
    </my-custom-component>
</fui-virtual-scroller>`);
  codeExample3: string = jsBeautify.html(`<div fuiVirtualScroller [items]="items" (vsUpdate)="viewPortItems = $event">
    <my-custom-component *ngFor="let item of viewPortItems">
    </my-custom-component>
</div>`);
  codeExample4: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="items">
    <my-custom-component *ngFor="let item of scroll.viewPortItems">
    </my-custom-component>
</fui-virtual-scroller>`);
  codeExample5: string = jsBeautify.css(`fui-virtual-scroller {
  width: 350px;
  height: 200px;
}

my-custom-component {
  display: block;
  width: 100%;
  height: 30px;
}`);
  codeExample6: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="items">
    <div *ngFor="let item of scroll.viewPortItems">{{item?.name}}</div>
</fui-virtual-scroller>`);
  codeExample7: string = jsBeautify.js(`interface IPageInfo {
    startIndex: number;
    endIndex: number;
    scrollStartPosition: number;
    scrollEndPosition: number;
    startIndexWithBuffer: number;
    endIndexWithBuffer: number;
    maxScrollPosition: number;
}`);
  codeExample8: string = jsBeautify.html(`<div #scrollingBlock>
    <fui-virtual-scroller #scroll [items]="items" [parentScroll]="scrollingBlock">
        <input type="search">
        <div #container>
            <my-custom-component *ngFor="let item of scroll.viewPortItems">
            </my-custom-component>
        </div>
    </fui-virtual-scroller>
</div>`);
  codeExample9: string = jsBeautify.html(`<custom-angular-component #scrollingBlock>
    <fui-virtual-scroller #scroll [items]="items" [parentScroll]="scrollingBlock.nativeElement">
        <input type="search">
        <div #container>
            <my-custom-component *ngFor="let item of scroll.viewPortItems">
            </my-custom-component>
        </div>
    </fui-virtual-scroller>
</custom-angular-component>`);
  codeExample10: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="items" [parentScroll]="scroll.window">
    <input type="search">
    <div #container>
        <my-custom-component *ngFor="let item of scroll.viewPortItems">
        </my-custom-component>
    </div>
</fui-virtual-scroller>`);
  codeExample11: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="items" [enableUnequalChildrenSizes]="true">
    <my-custom-component *ngFor="let item of scroll.viewPortItems">
    </my-custom-component>
</fui-virtual-scroller>`);
  codeExample12: string = jsBeautify.js(`import { IPageInfo } from '@ferui/components';
...

@Component({
    selector: 'list-with-api',
    template: \`
        <fui-virtual-scroller #scroll [items]="buffer" (vsEnd)="fetchMore($event)">
            <my-custom-component *ngFor="let item of scroll.viewPortItems"> </my-custom-component>
            <div *ngIf="loading" class="loader">Loading...</div>
        </fui-virtual-scroller>
    \`
})
export class ListWithApiComponent implements OnChanges {

    @Input()
    items: ListItem[];

    protected buffer: ListItem[] = [];
    protected loading: boolean;

    protected fetchMore(event: IPageInfo) {
        if (event.endIndex !== this.buffer.length-1) return;
        this.loading = true;
        this.fetchNextChunk(this.buffer.length, 10).then(chunk => {
            this.buffer = this.buffer.concat(chunk);
            this.loading = false;
        }, () => this.loading = false);
    }

    protected fetchNextChunk(skip: number, limit: number): Promise<ListItem[]> {
        return new Promise((resolve, reject) => {
            ....
        });
    }
}`);
  codeExample13: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="myItems">
    <table>
        <thead #header>
            <th>Index</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Address</th>
        </thead>
        <tbody #container>
            <tr *ngFor="let item of scroll.viewPortItems">
                <td>{{item.index}}</td>
                <td>{{item.name}}</td>
                <td>{{item.gender}}</td>
                <td>{{item.age}}</td>
                <td>{{item.address}}</td>
            </tr>
        </tbody>
    </table>
</fui-virtual-scroller>`);
  codeExample14: string = jsBeautify.js(`fuiVirtualScroller.invalidateAllCachedMeasurements();
fuiVirtualScroller.invalidateCachedMeasurementForItem(item: any);
fuiVirtualScroller.invalidateCachedMeasurementAtIndex(index: number);`);
  codeExample15: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="items">
    <my-custom-component [expanded]="item.expanded" *ngFor="let item of scroll.viewPortItems">
    </my-custom-component>
</fui-virtual-scroller>`);
  codeExample17: string = jsBeautify.js(`import { Component, ViewChild } from '@angular/core';
import { FuiVirtualScrollerComponent } from '@ferui/components';

@Component({
    selector: 'rj-list',
    template: \`
        <fui-virtual-scroller #scroll [items]="items">
            <div *ngFor="let item of scroll.viewPortItems; let i = index"> {{i}}: {{item}} </div>
        </fui-virtual-scroller>
    \`
})
export class ListComponent {

    protected items = ['Item1', 'Item2', 'Item3'];

    @ViewChild(FuiVirtualScrollerComponent)
    private fuiVirtualScroller: FuiVirtualScrollerComponent;

    // call this function whenever you have to focus on second item
    focusOnAnItem() {
        this.fuiVirtualScroller.items = this.items;
        this.fuiVirtualScroller.scrollInto(items[1]);
    }
}`);
  codeExample18: string = jsBeautify.js(`providers: [
        provide: 'virtual-scroller-default-options', useValue: {
            scrollThrottlingTime: 0,
            scrollDebounceTime: 0,
            scrollAnimationTime: 750,
            checkResizeInterval: 1000,
            resizeBypassRefreshThreshold: 5,
            modifyOverflowStyleOfParentScroll: true,
            stripedTable: false
        }
  ],`);
  codeExample19: string = jsBeautify.html(`export function vsDefaultOptionsFactory(): VirtualScrollerDefaultOptions {
    return {
        scrollThrottlingTime: 0,
        scrollDebounceTime: 0,
        scrollAnimationTime: 750,
        checkResizeInterval: 1000,
        resizeBypassRefreshThreshold: 5,
        modifyOverflowStyleOfParentScroll: true,
        stripedTable: false
    };
}

 providers: [
        provide: 'virtual-scroller-default-options', useFactory: vsDefaultOptionsFactory
  ],`);
  codeExample20: string = jsBeautify.js(`sort() {
  this.items = [].concat(this.items || []).sort()
}`);
  codeExample21: string = jsBeautify.css(`//hide vertical scrollbar
       margin-right: -25px;
       padding-right: 25px;

    //hide horizontal scrollbar
       margin-bottom: -25px;
       padding-bottom: 25px;`);
  codeExample22: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="items">
    <input type="search">
    <div #container>
        <my-custom-component *ngFor="let item of scroll.viewPortItems">
        </my-custom-component>
    </div>
</fui-virtual-scroller>`);
  codeExample23: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="myComplexItems">
    <my-custom-component [myComplexItem]="complexItem" *ngFor="let complexItem of scroll.viewPortItems; trackBy: myTrackByFunction">
    </my-custom-component>
</fui-virtual-scroller>`);
  codeExample24: string = jsBeautify.js(`public interface IComplexItem {
    uniqueIdentifier: number;
    extraData: any;
}

public myTrackByFunction(index: number, complexItem: IComplexItem): number {
    return complexItem.uniqueIdentifier;
}`);
  codeExample25: string = jsBeautify.js(`const domino = require('domino');
require('raf/polyfill');
const win = domino.createWindow(template);
win['versionNumber'] = 'development';
global['window'] = win;
global['document'] = win.document;
Object.defineProperty(win.document.body.style, 'transform', { value: () => { return { enumerable: true, configurable: true }; } });`);
  codeExample26: string = jsBeautify.html(`<fui-virtual-scroller #scroll [items]="items">
    <my-custom-component *ngFor="let item of scroll.viewPortItems" [ssrChildWidth]="138" [ssrChildHeight]="175" [ssrViewportWidth]="1500" [ssrViewportHeight]="800">
    </my-custom-component>
</fui-virtual-scroller>`);
}

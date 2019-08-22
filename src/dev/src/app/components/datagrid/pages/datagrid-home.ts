import { Component } from '@angular/core';

@Component({
  selector: 'datagrid-demo-home',
  template: `
    <h1 class="mb-4">Datagrid global documentation</h1>

    <h3 class="mb-4">Grid options</h3>
    <p>...</p>

    <h3 class="mb-4">Grid sizing</h3>
    <p>...</p>

    <h3 class="mb-4">Columns sizing</h3>
    <p>...</p>

    <h3 class="mb-4">Sorting</h3>
    <p>
      You can sort the data by one or multiple columns. If you want to sort multiple columns, you need to use the
      <kbd>shift</kbd> key.<br />
      You can allow or disallow a column for sorting by setting the attribute <code>sortable</code> from column definition
      object to either <code>true</code> or <code>false</code>. If you set it to false, it will disable the sort feature
      over the specified column.
    </p>

    <h3 class="mb-4">Filtering</h3>
    <p>...</p>

    <h3 class="mb-4">Pagination</h3>
    <p>...</p>

    <h3 class="mb-4">Scrolling</h3>
    <p>...</p>

    <h3 class="mt-2 mb-2">Columns resizing</h3>
    <p>
      You can resize any columns by clicking to the "dash" <code>|</code> line and drag it wherever you want (horizontally
      only of course).
    </p>

    <h3 class="mb-4">Columns moving</h3>
    <p>...</p>

    <h3 class="mb-4">Header Cells rendering</h3>
    <p>...</p>

    <h3 class="mb-4">Cells rendering</h3>
    <p>...</p>

    <h3 class="mb-4">Grid API</h3>
    <p>...</p>

    <h3 class="mb-4">Column API</h3>
    <p>...</p>
  `,
})
export class DatagridHome {}

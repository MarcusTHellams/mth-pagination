# MTH Pagination

### Overview
mth-pagination is a class written in TypeScript that provides functionality for managing pagination in your applications. The mth-pagination class generates a range of page numbers and provides methods to navigate between pages.

### Features
- Provides a range of page numbers for pagination
- Allows customizing the number of page boundaries and sibling pages
- Handles page changes, with a callback function to manage what happens on each page change
- Includes methods for setting the current page and navigating to the next, previous, first, and last page

### Install

Using npm, yarn, or pnpm

```bash
npm install @mhellams/mth-pagination
yarn add @mhellams/mth-pagination
pnpm add @mhellams/mth-pagination
```
Using CDN

```html
<html>
	<head>
		<script src="https://unpkg.com/@mhellams/mth-pagination"></script>
		<script>
		  const pagination = new mthPagination({
			total: 1000,
			page: 1,
			siblings: 2,
			boundaries: 2,
			onChange(page) {
			  console.log(page);
			},
		  });
    </script>
	</head>
</html>
```
### Importing

#### esm

```javascript
	import (MthPagination} from '@mhellams/mth-pagination';
```
#### cjs
```javascript
const {MthPagination} = require('@mhellams/mth-pagination')
```

### Usage
```javascript
import { MthPagination, type PaginationParams } from 'mth-pagination';

const params: PaginationParams = {
  page: 1,
  total: 10,
  siblings: 1,
  boundaries: 1,
  onChange: (page: number) => console.log(`Current page is ${page}`),
};

const pagination = new MthPagination(params);

pagination.range; // -> [1, 2, 3, 4, 5, 'dots', 10];

pagination.setPage(5);
pagination.range; // -> [1, 'dots', 4, 5, 6, 'dots', 10];

pagination.next();
pagination.range; // -> [1, 'dots', 5, 6, 7, 'dots', 10];

pagination.previous();
pagination.range; // -> [1, 'dots', 4, 5, 6, 'dots', 10];

pagination.last();
pagination.range; // -> [1, 'dots', 6, 7, 8, 9, 10];

pagination.first();
pagination.range; // -> [1, 2, 3, 4, 5, 'dots', 10];
```
#### Siblings
```javascript
	const pagination = new MthPagination({ total: 20, siblings: 3 });
```
#### Boundaries
```javascript
	const pagination = new MthPagination({ total: 20, boundaries: 3 });
```
#### Definition
```javascript
export const DOTS = 'dots';

function range(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
}

export interface PaginationParams {
  /** Controlled active page number */
  page?: number;

  /** Total amount of pages */
  total: number;

  /** Siblings amount on left/right side of selected page, defaults to 1 */
  siblings?: number;

  /** Amount of elements visible on left/right edges, defaults to 1  */
  boundaries?: number;

  /** Callback fired after change of each page */
  onChange?: (page: number) => void;
}

export class MthPagination {
  total: number;
  page: number;
  siblings: number;
  boundaries: number;
  private _total: number;
  activePage: number;
  onChange: ((page: number) => void) | undefined;

  constructor({
    boundaries = 1,
    onChange,
    page = 1,
    siblings = 1,
    total,
  }: PaginationParams) {
    this.boundaries = boundaries;
    this.page = page;
    this.siblings = siblings;
    this.total = total;
    this.onChange = onChange;
    this._total = Math.max(Math.trunc(total), 0);
    this.activePage = this.page;
  }

  get range(): (number | typeof DOTS)[] {
    const totalPageNumbers = this.siblings * 2 + 3 + this.boundaries * 2;
    if (totalPageNumbers >= this._total) {
      return range(1, this._total);
    }
    const leftSiblingIndex = Math.max(
      this.activePage - this.siblings,
      this.boundaries
    );

    const rightSiblingIndex = Math.min(
      this.activePage + this.siblings,
      this._total - this.boundaries
    );

    const shouldShowLeftDots = leftSiblingIndex > this.boundaries + 2;
    const shouldShowRightDots =
      rightSiblingIndex < this._total - (this.boundaries + 1);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = this.siblings * 2 + this.boundaries + 2;
      return [
        ...range(1, leftItemCount),
        DOTS,
        ...range(this._total - (this.boundaries - 1), this._total),
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = this.boundaries + 1 + 2 * this.siblings;
      return [
        ...range(1, this.boundaries),
        DOTS,
        ...range(this._total - rightItemCount, this._total),
      ];
    }

    return [
      ...range(1, this.boundaries),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(this._total - this.boundaries + 1, this._total),
    ];
  }

  private _setActivePage(page: number) {
    this.activePage = page;
    if (this.onChange) {
      this.onChange(page);
    }
  }

  setPage(page: number) {
    if (page < 1) {
      this._setActivePage(1);
      return;
    }
    if (page > this._total) {
      this._setActivePage(this._total);
      return;
    }
    this._setActivePage(page);
  }

  next() {
    this.setPage(this.activePage + 1);
  }

  prev() {
    this.setPage(this.activePage - 1);
  }

  first() {
    this.setPage(1);
  }

  last() {
    this.setPage(this._total);
  }
}

```

### Example
[Example](https://stackblitz.com/edit/web-platform-vzzpf2?devToolsHeight=33&file=index.html "Example")

### License
This project is licensed under the MIT License.
const DOTS = 'dots';

function range(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
}

interface PaginationParams {
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

class MthPagination {
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

export default MthPagination;

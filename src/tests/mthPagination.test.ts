import { type PaginationParams, DOTS, MthPagination } from '../../lib';

describe('Testing MthPaginationSuite', () => {
  const paginationParams: PaginationParams = {
    total: 10,
    page: 1,
    siblings: 1,
    boundaries: 1,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    test('should initialize MthPagination with correct values', () => {
      const pagination = new MthPagination(paginationParams);

      expect(pagination.total).toBe(10);
      expect(pagination.page).toBe(1);
      expect(pagination.siblings).toBe(1);
      expect(pagination.boundaries).toBe(1);
      expect(pagination.onChange).toBe(paginationParams.onChange);
      expect(pagination.activePage).toBe(1);
    });
  });

  describe('get range', () => {
    test('should return range of page numbers and dots when appropriate', () => {
      const pagination = new MthPagination(paginationParams);

      const range = pagination.range;
      expect(range).toEqual([1, 2, 3, 4, 5, 'dots', 10]);
    });

    test('should return range with DOTS when shouldShowLeftDots is true', () => {
      const pagination = new MthPagination({
        ...paginationParams,
        page: 4,
        siblings: 1,
        boundaries: 2,
      });

      const range = pagination.range;

      expect(range).toEqual([1, 2, 3, 4, 5, 6, 'dots', 9, 10]);
    });
    test('totalPageNumbers >= this._total', () => {
      const pagination = new MthPagination({
        ...paginationParams,
        page: 4,
        siblings: 2,
        boundaries: 2,
      });

      const range = pagination.range;

      expect(range).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    test('should return range with DOTS when shouldShowRightDots is true', () => {
      const pagination = new MthPagination({
        ...paginationParams,
        page: 7,
        siblings: 1,
        boundaries: 2,
      });

      const range = pagination.range;

      expect(range).toEqual([1, 2, DOTS, 5, 6, 7, 8, 9, 10]);
    });

    test('should return range with DOTS on right side', () => {
      const pagination = new MthPagination({
        ...paginationParams,
        page: 5,
        siblings: 1,
        boundaries: 2,
      });

      const range = pagination.range;

      expect(range).toEqual([1, 2, 3, 4, 5, 6, DOTS, 9, 10]);
    });
  });

  describe('setPage', () => {
    test('should set the activePage to the provided page', () => {
      const pagination = new MthPagination(paginationParams);

      pagination.setPage(3);

      expect(pagination.activePage).toBe(3);
      expect(paginationParams.onChange).toHaveBeenCalledWith(3);
    });

    test('should set the activePage to 1 when provided page is less than 0', () => {
      const pagination = new MthPagination(paginationParams);
      pagination.setPage(-1);
      expect(pagination.activePage).toBe(1);
      expect(paginationParams.onChange).toHaveBeenCalledWith(1);
    });

    test('should set the activePage to the total when provided page is greater than the total', () => {
      const pagination = new MthPagination(paginationParams);

      pagination.setPage(15);

      expect(pagination.activePage).toBe(10);
      expect(paginationParams.onChange).toHaveBeenCalledWith(10);
    });
  });

  describe('next', () => {
    test('should increase the activePage by 1', () => {
      const pagination = new MthPagination(paginationParams);
      pagination.next();

      expect(pagination.activePage).toBe(2);
      expect(paginationParams.onChange).toHaveBeenCalledWith(2);
    });
  });

  describe('prev', () => {
    test('should decrease the activePage by 1', () => {
      const pagination = new MthPagination({
        ...paginationParams,
        page: 3,
      });
      pagination.prev();

      expect(pagination.activePage).toBe(2);
      expect(paginationParams.onChange).toHaveBeenCalledWith(2);
    });
  });

  describe('first', () => {
    test('should set the activePage to 1', () => {
      const pagination = new MthPagination({
        ...paginationParams,
        page: 3,
      });
      pagination.first();

      expect(pagination.activePage).toBe(1);
      expect(paginationParams.onChange).toHaveBeenCalledWith(1);
    });
  });
  describe('last', () => {
    test('should set the activePage to 10', () => {
      const pagination = new MthPagination({
        ...paginationParams,
        page: 3,
      });
      pagination.last();
      expect(pagination.activePage).toBe(10);
      expect(paginationParams.onChange).toHaveBeenCalledWith(10);
    });
  });

  describe('shouldShowLeftDots && shouldShowRightDots', () => {
    test('no dots to be shown', () => {
      const pagination = new MthPagination({
        total: 1000,
        page: 13,
        boundaries: 3,
        siblings: 3,
      });
      expect(pagination.range).toEqual([
        1,
        2,
        3,
        'dots',
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        'dots',
        998,
        999,
        1000,
      ]);
    });
  });
});

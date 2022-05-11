export class PaginatorDto {
    filter: string;
    limit: number;
    offset: number;
    sort: string;
    order: string;
    pageSizes: number[];
    subFilter: string;

    constructor(filter?: string, limit?: number, offset?: number, sort?: string, order?: string, pageSizes?: number[], subFilter?: string) {
        if (filter !== undefined) {
            this.filter = filter;
        } else {
            this.filter = '';
        }

        if (limit !== undefined) {
            this.limit = limit;
        } else {
            this.limit = 5;
        }

        if (offset !== undefined) {
            this.offset = offset;
        } else {
            this.offset = 0;
        }

        if (sort !== undefined) {
            this.sort = sort;
        } else {
            this.sort = 'createdDate';
        }

        if (order !== undefined) {
            this.order = order;
        } else {
            this.order = 'ASC';
        }

        if (pageSizes !== undefined) {
            this.pageSizes = pageSizes;
        } else {
            this.pageSizes = [5, 10, 15];
        }

        if (subFilter !== undefined) {
            this.subFilter = subFilter;
        } else {
            this.subFilter = '';
        }
    }
}

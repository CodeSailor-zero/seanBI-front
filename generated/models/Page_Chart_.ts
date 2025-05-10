/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Chart } from './Chart';
import type { OrderItem } from './OrderItem';
export type Page_Chart_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: Array<OrderItem>;
    pages?: number;
    records?: Array<Chart>;
    searchCount?: boolean;
    size?: number;
    total?: number;
};


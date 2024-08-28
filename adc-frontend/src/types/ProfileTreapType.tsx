import { Treap } from './TreapType';

export interface ProfileTreapType {
    content: Treap[];
    elements: number;
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
import { PointType } from './PointType';

export interface Treap {
    nickname: string;
    pointList: PointType[];
    leafPoints: number;
    duration: number;
    distance: number;
    carbonFootprint: number;
    lastModifiedDate: string;
    profilePic: string;
}
export interface Community {
    leaderNickname: string;
    name: string;
    description:string;
    communityPic: string;
    minLevelToJoin: number;
    isPublic: boolean;
    communityLevel: number;
    communityExp: number;
    maxMembers: number;
    communityExpToNextLevel: number;
    currentMembers: number;
}
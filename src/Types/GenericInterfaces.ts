

// Lodestone Helpers Interface
export interface ServiceResult {
    success: boolean;
    value: string;
}

export interface LodestoneFCMemberList {
    success: boolean;
    error: string;
    members: LodestoneFCMember[];
}

export interface LodestoneFCMember {
    firstName: string;
    lastName: string;
    characterId: string;
}

// Database Related Types
export interface FCMemberToSave {
    DiscordUid: string;
    DiscordUsername: string;
    LodestoneId: string;
    DateCreated: Date;
    AccountMatched: boolean;
    DiscordGuildUid: string;
}

export interface NameHistoryToSave {
    DiscordUid: string;
    FirstName: string;
    LastName: string;
    DateChanged: Date;
}

export interface FCGuildParameters {
    Id: number;
    DiscordGuildUid: string;
    FreeCompanyId: string;
    DateCreated: Date;
    Roles?: FCGuildRole[];
}

export interface FCGuildRole {
    Id: number;
    RoleId: string;
    DiscordGuildUid: string;
    DateCreated: Date;
    RoleType: string;
}



// Misc Types
export interface VerifiedFCMember {
    DiscordUid: string;
    DiscordUsername: string;
    LodestoneId: string;
    DateCreated: Date;
    FirstName: string;
    LastName: string;
    DiscordGuildUid: string;
}

export interface FCMemberNotVerified {
    LodestoneId: string;
    FirstName: string;
    LastName: string;
}

export interface DiscordMembersNotVerified {
    DiscordUid: string;
    DiscordNickName?: string | null;
    DiscordUsername: string;
}






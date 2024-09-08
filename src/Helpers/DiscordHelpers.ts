
import {Collection, GuildMember} from "discord.js";
import {DiscordMembersNotVerified, FCMemberNotVerified, FCMemberToSave, LodestoneFCMember, NameHistoryToSave, VerifiedFCMember
} from "../Types/GenericInterfaces.ts";

export function MatchDiscordMemberToFCMember(FCMember: LodestoneFCMember, roleMembers: Collection<string, GuildMember>): GuildMember | undefined {

    // Search through Discord Names in order of NickName, Global Name and Username to try and find a match
    // Kind of Overkill and can remove each layer depending on your requirements

    // Initially attempts by searching through User Nickname
    let foundDiscordMember = roleMembers.find(member => member.nickname?.toLowerCase().includes(FCMember.firstName.toLowerCase()) && member.nickname?.toLowerCase().includes(FCMember.lastName.toLowerCase()));

    if (!foundDiscordMember) {
        // If Unable to Match through User NickName or NickName doesn't exist, attempt to match through User GlobalName
        foundDiscordMember = roleMembers.find(member => member.user.username.toLowerCase().includes(FCMember.firstName.toLowerCase()) && member.user.username.toLowerCase().includes(FCMember.lastName.toLowerCase()));
    }

    if (!foundDiscordMember) {
        // Lastly if unable to match through Nickname or Global Name, attempt to match through UserName
        foundDiscordMember = roleMembers.find(member => member.user.username.toLowerCase().includes(FCMember.firstName.toLowerCase()) && member.user.username.toLowerCase().includes(FCMember.lastName.toLowerCase()));
    }
    return foundDiscordMember;
}

export function CreateVerifiedFCMember(foundDiscordMember: GuildMember, FCMember: LodestoneFCMember, DiscordGuildUid: string): VerifiedFCMember {
    return {
        DiscordUid: foundDiscordMember.id,
        DiscordUsername: foundDiscordMember.user.username,
        LodestoneId: FCMember.characterId,
        DateCreated: new Date(),
        FirstName: FCMember.firstName,
        LastName: FCMember.lastName,
        DiscordGuildUid: DiscordGuildUid
    }
}

export function CreateUnverifiedFCMember(FCMember: LodestoneFCMember): FCMemberNotVerified {
    return {
        LodestoneId: FCMember.characterId,
        FirstName: FCMember.firstName,
        LastName: FCMember.lastName
    }
}

export function CreateUnverifiedDiscordMember(member: GuildMember): DiscordMembersNotVerified {
    return {
        DiscordUid: member.id,
        DiscordUsername: member.user.username,
        DiscordNickName: member.nickname ? member.nickname : null,
    }
}

export function CalculateUnverifiedDiscordMembers(roleMembers: Collection<string, GuildMember>, verifiedFCMembers: VerifiedFCMember[]): DiscordMembersNotVerified[] {
    let unverifiedDiscordMembers: DiscordMembersNotVerified[] = [];
    roleMembers.forEach(member => {
        let foundVerifiedMember = verifiedFCMembers.find(verifiedMember => verifiedMember.DiscordUid === member.id);
        if (!foundVerifiedMember) {
            let unverifiedMember: DiscordMembersNotVerified = {
                DiscordUid: member.id,
                DiscordUsername: member.user.username,
                DiscordNickName: member.nickname ? member.nickname : null,
            }
            unverifiedDiscordMembers.push(unverifiedMember);
        }
    });
    return unverifiedDiscordMembers;
}

export function PrepareMembersToStore(verifiedFCMembers: VerifiedFCMember[]): FCMemberToSave[] {
    let membersToStore: FCMemberToSave[] = [];
    verifiedFCMembers.forEach(verifiedFCMember => {
        let member: FCMemberToSave = {
            DiscordUid: verifiedFCMember.DiscordUid,
            DiscordUsername: verifiedFCMember.DiscordUsername,
            LodestoneId: verifiedFCMember.LodestoneId,
            DateCreated: verifiedFCMember.DateCreated,
            AccountMatched: true,
            DiscordGuildUid: verifiedFCMember.DiscordGuildUid
        }
        membersToStore.push(member);
    })
    return membersToStore;
}

export function PrepareNameHistoryToStore(verifiedFCMembers: VerifiedFCMember[]): NameHistoryToSave[] {
    let nameHistoryToStore: NameHistoryToSave[] = [];
    verifiedFCMembers.forEach(verifiedFCMember => {
        let nameHistory: NameHistoryToSave = {
            DiscordUid: verifiedFCMember.DiscordUid,
            FirstName: verifiedFCMember.FirstName,
            LastName: verifiedFCMember.LastName,
            DateChanged: verifiedFCMember.DateCreated
        }
        nameHistoryToStore.push(nameHistory);
    })
    return nameHistoryToStore;
}
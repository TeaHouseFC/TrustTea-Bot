import {expect, test} from "bun:test"
import * as LodestoneHelpers from "../Helpers/LodestoneHelpers"
import {FCMemberList} from "../Helpers/LodestoneHelpers";
// Test Parameters To Expect Returned FC/Character Id
const ReturnedFirstName = "Art"
const ReturnedLastName = "Bayard"
const server = "Carbuncle"
const fcID = "9229705223830889096"

console.log("Starting Tests for LodestoneHelpers.....")


test('Call LodestoneHelpers GetLodestoneCharacterId', async() => {
    let characterId = await LodestoneHelpers.GetLodestoneCharacterId(ReturnedFirstName, ReturnedLastName, server)
    expect(characterId.value).toBe("36234146");
});

test('Call LodestoneHelpers GetLodestoneFreeCompany', async() => {
    let freeCompany = await LodestoneHelpers.GetLodestoneFreeCompany(ReturnedFirstName, ReturnedLastName, server)
    expect(freeCompany.value).toBe("The Tea House");
});

test('Call LodestoneHelpers GetFreeCompamnyMembers', async() => {
    let members = await LodestoneHelpers.GetLodestoneFreeCompanyMembers(fcID)
    console.log("Members found in FC Test: " + members.members.length);
    let success = false;
    if (members.members.length > 0) {
        success = true;
    }
    expect(success).toBe(true);
});

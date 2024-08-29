import {expect, test} from "bun:test"
import * as LodestoneHelpers from "../Helpers/LodestoneHelpers"
// Test Parameters To Expect Returned FC/Character Id
const ReturnedFirstName = "Art"
const ReturnedLastName = "Bayard"
const server = "Carbuncle"

console.log("Starting Tests for LodestoneHelpers.....")


test('Call LodestoneHelpers GetLodestoneCharacterId', async() => {
    let characterId = await LodestoneHelpers.GetLodestoneCharacterId(ReturnedFirstName, ReturnedLastName)
    expect(characterId.value).toBe("36234146");
});

test('Call LodestoneHelpers GetLodestoneFreeCompany', async() => {
    let freeCompany = await LodestoneHelpers.GetLodestoneFreeCompany(ReturnedFirstName, ReturnedLastName)
    expect(freeCompany.value).toBe("The Tea House");
});

test('Call LodestoneHelpers RobustlyCheckLodestoneFreeCompany', async() => {
    let freeCompany = await LodestoneHelpers.RobustlyCheckLodestoneFreeCompany(ReturnedFirstName, ReturnedLastName)
    expect(freeCompany.value).toBe("The Tea House");
});




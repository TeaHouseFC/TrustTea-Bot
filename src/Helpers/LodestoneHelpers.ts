import axios from "axios";
import * as cheerio from "cheerio";
import {CheerioAPI} from "cheerio";
import {LodestoneFCMember, LodestoneFCMemberList, ServiceResult} from "../Types/GenericInterfaces.ts";

// Responsible for interactions directly with the lodestone

const GenerateCharacterSearchQueryURL = (firstName: string, lastName: string, world: string): string => {
    // Example Query In Browser
    // https://na.finalfantasyxiv.com/lodestone/character/?q=Art+Bayard&worldname=Carbuncle&classjob=&race_tribe=&blog_lang=ja&blog_lang=en&blog_lang=de&blog_lang=fr&order=
    const baseCharacterSearchURL = "https://na.finalfantasyxiv.com/lodestone/character/?q=";
    const endQueryURL = `&worldname=${world}&classjob=&race_tribe=&blog_lang=ja&blog_lang=en&blog_lang=de&blog_lang=fr&order=`;
    return `${baseCharacterSearchURL}${firstName}+${lastName}${endQueryURL}`;
}

const GenerateFreeCompanySearchQueryURL = (freeCompanyId: string): string => {
    // Example Query In Browser
    // https://na.finalfantasyxiv.com/lodestone/freecompany/9229705223830889096/member/?page=1
    return `https://na.finalfantasyxiv.com/lodestone/freecompany/${freeCompanyId}/member/?page=`;
}


// Checks the Lodestone for character Free Company using the character search page
export const GetLodestoneFreeCompany = async (firstName: string, lastName: string, world: string): Promise<ServiceResult> => {
    if (await isNullOrEmpty(firstName) || await isNullOrEmpty(lastName)) {
        return { success: false, value: "First Name or Last Name is null or empty" };
    }

    try {
        let queryURL = GenerateCharacterSearchQueryURL(firstName, lastName, world);

        const content = await GetLodestoneWebPageContent(queryURL);
        if (!content) {
            return { success: false, value: "Error Getting Initial Web Content" };
        }

        const webContent = cheerio.load(content);
        const href = webContent('a.entry__link').first().attr('href');
        if (!href) {
            return { success: false, value: "No Character found with this name on the specified world" };
        }

        const characterURL = href.match(/\/lodestone\/character\/(\d+)\//);
        if (!characterURL) {
            return { success: false, value: "Error Getting Character URL - CSS Selectors For Character URL May Have Changed" };
        }

        const characterId = characterURL[1];
        if (!characterId) {
            return { success: false, value: "Error Parsing Character ID - Character URL May Have Changed" };
        }

        const freeCompany = webContent('a.entry__freecompany__link').first().find('span').text();
        if (!freeCompany) {
            return { success: false, value: "Character not in a free company or CSS Selector may have updated" };
        }

        return { success: true, value: freeCompany };
    } catch (err) {
        console.error("Error getting Free Company:", err);
        return { success: false, value: `Error: ${err}` };
    }
}

// Checks the Lodestone for character Id using the character search page
// Useful for checking basic CSS Selectors
export const GetLodestoneCharacterId = async (firstName: string, lastName: string, world: string): Promise<ServiceResult> => {
    if (await isNullOrEmpty(firstName) || await isNullOrEmpty(lastName)) {
        return { success: false, value: "First Name or Last Name is null or empty" };
    }

    try {
        let queryURL = GenerateCharacterSearchQueryURL(firstName, lastName, world);

        const content = await GetLodestoneWebPageContent(queryURL);

        if (!content) {
            return { success: false, value: "Unable to get web content" };
        }

        const webContent = cheerio.load(content);
        const href = webContent('a.entry__link').first().attr('href');
        if (!href) {
            return { success: false, value: "No Character found with this name on the specified world" };
        }

        const characterId = href.match(/\/lodestone\/character\/(\d+)\//);
        if (!characterId) {
            return { success: false, value: "Error Getting Character ID" };
        }

        return { success: true, value: characterId[1] };
    } catch (err) {
        console.error("Error getting Free Company:", err);
        return { success: false, value: `Error: ${err}` };
    }
}

// Gets List of Members within the Free Company
export const GetLodestoneFreeCompanyMembers = async (fcid: string): Promise<LodestoneFCMemberList> => {
    let memberList : LodestoneFCMember[] = [];

    let initialURL = GenerateFreeCompanySearchQueryURL(fcid);
    // Get Initial Page 1 Content
    const content = await GetLodestoneWebPageContent(initialURL);
    const webContent = cheerio.load(content);

    const totalPageCount = await CalculateTotalMemberPageCount(webContent);
    if (totalPageCount === 0) {
       return { success: false, error: "Error getting FC Members page count", members: [] };
    }

    // Get Members from Page 1
    let currentPage = 1;

    while (currentPage <= totalPageCount) {
        let urlQuery = `${initialURL}${currentPage}`;
        let members = await GetMembersFromFreeCompanyProfile(urlQuery);
        memberList.push(...members);
        currentPage++;
    }

    return { success: true, error: "", members: memberList };
}


// Responsible for grabbing members from a specific Page on the Members Tab of the Free Company
const GetMembersFromFreeCompanyProfile = async (url: string): Promise<LodestoneFCMember[]> => {
    if (!url) {
        return [];
    }

    try {
        const content = await GetLodestoneWebPageContent(url);
        const webContent = cheerio.load(content);

        let members: LodestoneFCMember[] = [];
        webContent('a.entry__bg').each((index, element) => {
            let idHref = webContent(element).attr('href');

            if (!idHref) {
                console.error("Error getting ID Href");
                return;
            } else {
            }

            let fullName = webContent(element).find('.entry__name').text();
            let firstName = fullName.split(' ')[0];
            let lastName = fullName.split(' ')[1];
            let characterIdMatch = idHref.match(/\/lodestone\/character\/(\d+)\//);
            let characterId = characterIdMatch ? characterIdMatch[1] : null;

            if (characterId) {
                let member: LodestoneFCMember = {
                    firstName: firstName,
                    lastName: lastName,
                    characterId: characterId
                }
                members.push(member);
            }
        });

        return members;
    } catch (err) {
        return [];
    }
}

// Gets the total count of pages of members in Free Company Members Page
const CalculateTotalMemberPageCount = async (webContent: CheerioAPI): Promise<number> => {
    if (!webContent) {
        return 0;
    }

    try {
        let pageCountContent = webContent('li.btn__pager__current').text();

        // Use a regular expression to find the last number in the text
        const pageCount = pageCountContent.match(/Page \d+ of (\d+)/);
        if (pageCount && pageCount[1]) {
            return parseInt(pageCount[1], 10);
        } else {
            return 0;
        }
    } catch (err) {
        return 0;
    }
}

// Get Web Content From Lodestone Site
const GetLodestoneWebPageContent = async (url: string) => {

    if (!url) {
        return null;
    }

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error("Error fetching web content:", err);
        return null;
    }
}

const isNullOrEmpty = (value: string): Promise<boolean>  => {
    return Promise.resolve(value === null || value === undefined || value === '');
}



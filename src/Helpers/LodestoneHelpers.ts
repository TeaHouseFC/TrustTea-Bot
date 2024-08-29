import axios from "axios";
import * as cheerio from "cheerio";

// Example Query In Browser
// https://na.finalfantasyxiv.com/lodestone/character/?q=Art+Bayard&worldname=Carbuncle&classjob=&race_tribe=&blog_lang=ja&blog_lang=en&blog_lang=de&blog_lang=fr&order=
const baseURL = "https://na.finalfantasyxiv.com/lodestone/character/?q=";
// World Parameter is currently hardcoded to Carbuncle as we only need to query the FCs server location
let world = "Carbuncle"
const endQueryURL = `&worldname=${world}&classjob=&race_tribe=&blog_lang=ja&blog_lang=en&blog_lang=de&blog_lang=fr&order=`;
let nameParameter = "";


export interface SingleValueQuery {
    success: boolean;
    value: string;
}



// Robustly Checks the Lodestone for character Free Company
// Returns Message to cover every scenario
export const RobustlyCheckLodestoneFreeCompany = async (firstName: string, lastName: string): Promise<SingleValueQuery> => {
    if (await isNullOrEmpty(firstName) || await isNullOrEmpty(lastName)) {
        return { success: false, value: "First Name or Last Name is null or empty" };
    }

    try {
        const content = await GetWebContent(firstName, lastName);
        if (!content) {
            return { success: false, value: "Error Getting Initial Web Content" };
        }

        const webContent = cheerio.load(content);
        const href = webContent('a.entry__link').first().attr('href');
        if (!href) {
            return { success: false, value: "Error Getting Character ID - No Characters were found" };
        }

        const url = href.match(/\/lodestone\/character\/(\d+)\//);
        if (!url) {
            return { success: false, value: "Error Getting Character URL - CSS Selectors For Character URL May Have Changed" };
        }

        const characterId = url[1];
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

// Primitively returns the Character Id
// Useful for checking basic CSS Selectors
export const GetLodestoneCharacterId = async (firstName: string, lastName: string): Promise<SingleValueQuery> => {
    if (await isNullOrEmpty(firstName) || await isNullOrEmpty(lastName)) {
        return { success: false, value: "First Name or Last Name is null or empty" };
    }

    try {
        const content = await GetWebContent(firstName, lastName);
        if (!content) {
            return { success: false, value: "Unable to get web content" };
        }

        const webContent = cheerio.load(content);
        const href = webContent('a.entry__link').first().attr('href');
        if (!href) {
            return { success: false, value: "No Character found with this name" };
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

// Primitively returns the Free Company Name
// Useful for checking basic CSS Selectors
export const GetLodestoneFreeCompany = async (firstName: string, lastName: string): Promise<SingleValueQuery> => {
    if (await isNullOrEmpty(firstName) || await isNullOrEmpty(lastName)) {
        return { success: false, value: "First Name or Last Name is null or empty" };
    }

    try {
        const content = await GetWebContent(firstName, lastName);
        if (!content) {
            return { success: false, value: "Error getting web content - Lodestone Community Finder CSS may have updated" };
        }

        const webContent = cheerio.load(content);
        const spanText = webContent('a.entry__freecompany__link').first().find('span').text();
        if (!spanText) {
            return { success: false, value: "Character not found or not in a Free Company" };
        }

        return { success: true, value: spanText };
    } catch (err) {
        console.error("Error getting Free Company:", err);
        return { success: false, value: `Error: ${err}` };
    }
}

// Used for Getting Based Web Content From Lodestone for Parsing
const GetWebContent = async (firstName: string, lastName: string) => {
        nameParameter = `${firstName}+${lastName}`;
        const fullURL = `${baseURL}${nameParameter}${endQueryURL}`;
            try {
                const response = await axios.get(fullURL);
                return response.data;
            } catch (error) {
                console.error("Error fetching web content:", error);
                return null;
            }
}

const isNullOrEmpty = (value: string): Promise<boolean>  => {
    return Promise.resolve(value === null || value === undefined || value === '');
}